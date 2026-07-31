import aiContextData from './data/aiContext.json';

export const AI_APPS = [
  { id: "chatgpt", label: "ChatGPT", icon: "🟢", url: "https://chatgpt.com/" },
  { id: "gemini", label: "Gemini", icon: "✨", url: "https://gemini.google.com/" },
  { id: "meta", label: "Meta AI", icon: "🔵", url: "https://www.meta.ai/" }
];

/**
 * Build a composite lookup key for nested sections/paragraphs
 * Looks for entries in this priority:
 * 1. Direct node_number/id match (fast path)
 * 2. Composite key with section + paragraph + subparagraph (various formats)
 * 3. Match by explicit entry metadata (section_number, paragraph_number, subparagraph_number, id)
 * 4. Label/title matching (exact and case-insensitive contains)
 */
function findAiContextEntry(node, sectionNumber, paragraphNumber, subparagraphNumber) {
  if (!aiContextData || !node) return null;

  // allow callers to pass extracted numbers, otherwise read from node
  const nodeNum = String(node.node_number ?? node.id ?? "");
  const section = (sectionNumber ?? node.section_number ?? node.section ?? "").toString();
  const paragraph = (paragraphNumber ?? node.paragraph_number ?? node.paragraph ?? "").toString();
  const subparagraph = (subparagraphNumber ?? node.subparagraph_number ?? node.subparagraph ?? node.subparagraph_index ?? "").toString();

  // Fast path: direct key lookup (most common)
  if (nodeNum && aiContextData[nodeNum]) return aiContextData[nodeNum];

  const s = section || "";
  const p = paragraph || "";
  const sp = subparagraph || "";

  // Try common composite key formats used in aiContext.json
  const candidates = new Set();
  if (s) {
    candidates.add(s);
    if (p) {
      candidates.add(`${s}.${p}`);
      candidates.add(`${s}-${p}`);
      candidates.add(`${s}${p}`);
      if (sp) {
        candidates.add(`${s}.${p}.${sp}`);
        candidates.add(`${s}-${p}-${sp}`);
        candidates.add(`${s}${p}${sp}`);
      }
    }
  }

  for (const c of candidates) {
    if (aiContextData[c]) return aiContextData[c];
  }

  // Search entries for metadata matches (useful when JSON keys are sequential IDs)
  for (const entry of Object.values(aiContextData)) {
    try {
      const eSection = entry.section_number ?? entry.section ?? entry.parent_section ?? "";
      const eParagraph = entry.paragraph_number ?? entry.paragraph ?? "";
      const eSubparagraph = entry.subparagraph_number ?? entry.subparagraph ?? "";

      if (s && eSection && String(eSection) === s) {
        if (p && eParagraph && String(eParagraph) === p) {
          if (sp && eSubparagraph && String(eSubparagraph) === sp) {
            return entry;
          } else if (!sp) {
            return entry;
          }
        } else if (!p) {
          return entry; // matched section only
        }
      }

      // match by entry id/node_number fields
      if ((entry.id || entry.node_number) && nodeNum) {
        if (String(entry.id ?? entry.node_number) === nodeNum) return entry;
      }

      // exact label/title match
      if (node._label && entry._label && entry._label === node._label) return entry;
      if (node.title && entry.title && entry.title === node.title) return entry;
    } catch (e) {
      // ignore and continue
    }
  }

  // Last-resort fuzzy/case-insensitive contains matching on label/title
  if (node._label || node.title) {
    const needleLabel = (node._label || "").toString().toLowerCase();
    const needleTitle = (node.title || "").toString().toLowerCase();
    for (const entry of Object.values(aiContextData)) {
      if (entry._label && needleLabel && entry._label.toString().toLowerCase().includes(needleLabel)) return entry;
      if (entry.title && needleTitle && entry.title.toString().toLowerCase().includes(needleTitle)) return entry;
    }
  }

  return null;
}

export function getAiContext(node) {
  if (!node) return null;

  // Extract hierarchy info from node
  const sectionNumber = node.section_number || node.node_number;
  const paragraphNumber = node.paragraph_number;
  const subparagraphNumber = node.subparagraph_number;

  // Try to find pre-written data
  const preWrittenData = findAiContextEntry(
    node,
    sectionNumber,
    paragraphNumber,
    subparagraphNumber
  );

  if (preWrittenData) {
    return {
      title: preWrittenData.title,
      prompt: preWrittenData.prompt,
      content: preWrittenData.content
    };
  }

  // Fallback: Generate a helpful generic explanation
  const title = node.title ? `About ${node.title}` : `About ${node.node_type || "Item"} ${node.node_number || ""}`;

  const prompt = `Explain "${node.title || node.node_number}" (${node.node_type || "Item"} ${node.node_number || ""}) from RA 10863, the Philippine Customs Modernization and Tariff Act, in simple terms for a general reader. Include a short summary, key points, and an example if applicable.`;

  const content = `An offline, pre-written explanation for this item is not available right now. You can use the AI buttons to get an instant, detailed explanation (the prompt has already been copied to your clipboard).`;

  return {
    title,
    prompt,
    content
  };
}

export async function copyPromptAndOpen(prompt, url) {
  try {
    const textArea = document.createElement("textarea");
    textArea.value = prompt;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      document.execCommand("copy");
    } catch (err) {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(prompt);
      }
    }
    textArea.remove();
  } catch (e) {
    console.error("Copy failed", e);
  }

  const newWindow = window.open(url, "_blank");
  if (!newWindow) {
    window.location.href = url;
  }
}
