#!/usr/bin/env python3
"""
Fix AI-explanation lookups by re-keying aiContext.json to the CURRENT
database's node ids.

Root cause: aiContext.json was generated against an older node-id numbering
(from an earlier build of customs_law.db). The db has since been rebuilt and
row ids shifted (Title I/II order changed, etc.), so getAiContext(node.id)
in aiContext.js was matching the wrong entry (or nothing) for ~82% of nodes.

This script does NOT call any AI / API. It re-derives each entry's true
identity (section number, paragraph letter, subparagraph numeral, item
numeral) from the OLD data's own "_label"/"title" text, and re-keys it to
match the node id that same provision has in the CURRENT tree
(./node_id_map.json, which mirrors the current customs_law.db).

Run this from the repo root:
    python3 remap_ai_context.py
"""
import json
import re
import shutil
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parent
NODE_MAP_PATH = ROOT / "node_id_map.json"
AI_CONTEXT_PATH = ROOT / "frontend" / "src" / "data" / "aiContext.json"
BACKUP_PATH = AI_CONTEXT_PATH.with_suffix(".before-remap.json")

EMDASH = chr(8212)  # the "-" character used as a separator in labels

# ---------------------------------------------------------------------------
# Load inputs
# ---------------------------------------------------------------------------
if not NODE_MAP_PATH.exists():
    raise SystemExit(f"Missing {NODE_MAP_PATH} - run this from the repo root.")
if not AI_CONTEXT_PATH.exists():
    raise SystemExit(f"Missing {AI_CONTEXT_PATH} - run this from the repo root.")

with open(NODE_MAP_PATH, encoding="utf-8") as f:
    current = json.load(f)
with open(AI_CONTEXT_PATH, encoding="utf-8") as f:
    old = json.load(f)

current.sort(key=lambda n: n["id"])


def norm_num(node_type, raw):
    """Some 'definition' paragraphs store node_number as '(a) Abatement'.
    Strip anything after the leading parenthetical so keys line up with the
    plain '(a)' style used everywhere else."""
    if raw is None:
        return raw
    raw = raw.strip()
    if node_type in ("paragraph", "subparagraph", "item"):
        m = re.match(r"^\(([^)]*)\)", raw)
        if m:
            return f"({m.group(1)})"
    return raw


# ---------------------------------------------------------------------------
# Build a composite-key index of the CURRENT tree:
#   section::<num>
#   paragraph::<section>::<num>
#   subparagraph::<section>::<paragraph>::<num>
#   item::<section>::<paragraph>::<subparagraph>::<num>
# Section numbers are globally unique in this Act, so this is enough to
# uniquely identify every provision regardless of row-id numbering.
# ---------------------------------------------------------------------------
cur_section = cur_paragraph = cur_subparagraph = None
current_key_to_id = {}
current_node_by_id = {}

for n in current:
    current_node_by_id[n["id"]] = n
    t = n["node_type"]
    num = norm_num(t, n["node_number"])
    if t == "section":
        cur_section, cur_paragraph, cur_subparagraph = num, None, None
        key = f"section::{num}"
    elif t == "paragraph":
        cur_paragraph, cur_subparagraph = num, None
        key = f"paragraph::{cur_section}::{num}"
    elif t == "subparagraph":
        cur_subparagraph = num
        key = f"subparagraph::{cur_section}::{cur_paragraph}::{num}"
    elif t == "item":
        key = f"item::{cur_section}::{cur_paragraph}::{cur_subparagraph}::{num}"
    else:
        key = f"{t}::{num}"
    current_key_to_id[key] = n["id"]

# ---------------------------------------------------------------------------
# A handful of OLD entries use phrasing that can't be parsed generically
# (named paragraphs like "Importer Definition" mixed with bare numeric
# sub-items, with no parentheses to signal nesting depth). Verified by hand
# against the current tree structure for Sections 1003 and 1228.
# ---------------------------------------------------------------------------
HARDCODED = {
    "832": "paragraph::1003::Importer Definition",
    "833": "subparagraph::1003::Importer Definition::(1)",
    "834": "item::1003::Importer Definition::(1)::(i)",
    "835": "item::1003::Importer Definition::(1)::(ii)",
    "836": "subparagraph::1003::Importer Definition::(2)",
    "837": "subparagraph::1003::Importer Definition::(3)",
    "838": "paragraph::1003::Exemption",
    "839": "subparagraph::1003::Exemption::(1)",
    "840": "subparagraph::1003::Exemption::(2)",
    "841": "subparagraph::1003::Exemption::(3)",
    "1093": "paragraph::1228::Concluding Provision",
}

label_re = re.compile(r"^(\w+)\s+(.*?)\s+" + EMDASH + r"\s*.*$")
title_fallback_re = re.compile(
    r"(?:Section|Sec\.?)\s*([0-9][0-9A-Za-z\-\.]*)((?:\s*\([^)]+\))*)",
    re.IGNORECASE,
)
paren_re = re.compile(r"\(([^)]+)\)")
# Start-anchored so it only fires for the "Sec. NNNN ..." title convention
# and never misfires on the other convention used elsewhere in the data
# ("... (Section 101a)"), which already resolves correctly via _label.
section_resync_re = re.compile(r"^\s*(?:Section|Sec\.?)\s*([0-9][0-9A-Za-z\-\.]*)", re.IGNORECASE)

old_items = sorted(old.items(), key=lambda kv: int(kv[0]))

old_section = old_paragraph = old_subparagraph = None
matched = {}
unmatched = []

for old_id, entry in old_items:
    if old_id in HARDCODED:
        key = HARDCODED[old_id]
        parts = key.split("::")
        if parts[0] == "paragraph":
            old_section, old_paragraph, old_subparagraph = parts[1], parts[2], None
        elif parts[0] in ("subparagraph", "item"):
            old_section, old_paragraph, old_subparagraph = parts[1], parts[2], parts[3]
    else:
        label = entry.get("_label", "") or ""
        title = entry.get("title", "") or ""

        # If the title explicitly cites a different "Sec./Section NNNN" than
        # what we're currently tracking, trust the title and resync.
        rm = section_resync_re.match(title)
        if rm and rm.group(1) != old_section:
            old_section, old_paragraph, old_subparagraph = rm.group(1), None, None

        m = label_re.match(label)
        old_type = old_num = None
        forced_paragraph_ctx = None

        if m:
            old_type, old_num = m.group(1), norm_num(m.group(1), m.group(2))
        else:
            fm = title_fallback_re.search(title)
            if fm:
                sec_num = fm.group(1)
                parens = paren_re.findall(fm.group(2) or "")
                old_section = sec_num
                if len(parens) == 0:
                    old_type, old_num = "section", sec_num
                elif len(parens) == 1:
                    old_type, old_num = "paragraph", f"({parens[0]})"
                else:
                    old_type = "subparagraph"
                    old_num = f"({parens[1]})"
                    forced_paragraph_ctx = f"({parens[0]})"

        if old_type is None:
            unmatched.append((old_id, "unparseable", label or title))
            continue

        if old_type == "section":
            old_section, old_paragraph, old_subparagraph = old_num, None, None
            key = f"section::{old_num}"
        elif old_type == "paragraph":
            old_paragraph, old_subparagraph = old_num, None
            key = f"paragraph::{old_section}::{old_num}"
        elif old_type == "subparagraph":
            para_ctx = forced_paragraph_ctx if forced_paragraph_ctx else old_paragraph
            old_subparagraph = old_num
            key = f"subparagraph::{old_section}::{para_ctx}::{old_num}"
        elif old_type == "item":
            key = f"item::{old_section}::{old_paragraph}::{old_subparagraph}::{old_num}"
        else:
            key = f"{old_type}::{old_num}"

    new_id = current_key_to_id.get(key)
    if new_id is None:
        unmatched.append((old_id, "no-current-match", key))
        continue

    node = current_node_by_id[new_id]
    fresh_label = f"{node['node_type']} {node['node_number']}" + (
        f" {EMDASH} {node['title']}" if node.get("title") else ""
    )
    matched[str(new_id)] = {
        "_label": fresh_label,
        "title": entry.get("title", ""),
        "content": entry.get("content", ""),
        "prompt": entry.get("prompt", ""),
    }

# ---------------------------------------------------------------------------
# Report + write output
# ---------------------------------------------------------------------------
print(f"Old entries total:      {len(old_items)}")
print(f"Matched to current id:  {len(matched)}")
print(f"Unmatched:               {len(unmatched)}")
if unmatched:
    print("Unmatched reasons:", dict(Counter(r for _, r, _ in unmatched)))
    for u in unmatched:
        print("  ", u)

content_bearing = {"section", "paragraph", "subparagraph", "item"}
total_leaf = sum(1 for n in current if n["node_type"] in content_bearing)
print(f"\nCoverage of current tree's content-bearing nodes: {len(matched)}/{total_leaf} "
      f"({len(matched) / total_leaf * 100:.1f}%)")

shutil.copy(AI_CONTEXT_PATH, BACKUP_PATH)
print(f"\nBacked up original to: {BACKUP_PATH}")

with open(AI_CONTEXT_PATH, "w", encoding="utf-8") as f:
    json.dump(matched, f, ensure_ascii=False, indent=2)
print(f"Wrote corrected file to: {AI_CONTEXT_PATH}")
print("\nDone. No AI/API calls were made - this was a pure data remap.")
