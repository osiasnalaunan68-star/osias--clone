import aiContextData from './data/aiContext.json';

export const AI_APPS = [
  { id: "chatgpt", label: "ChatGPT", icon: "🟢", url: "https://chatgpt.com/" },
  { id: "gemini", label: "Gemini", icon: "✨", url: "https://gemini.google.com/" },
  { id: "meta", label: "Meta AI", icon: "🔵", url: "https://www.meta.ai/" }
];

/**
 * Build a composite lookup key for nested sections/paragraphs
 * Looks for entries in this priority:
 * 1. Direct node_number match (for main sections)
 * 2. Composite key with section + paragraph + subparagraph (various formats)
 * 3. Match by explicit entry metadata (section_number, paragraph_number, subparagraph_number, id)
 * 4. Label/title matching (exact and case-insensitive contains)
 */
function findAiContextEntry(node) {
  if (!aiContextData || !node) return null;

  const nodeNum = String(node.node_number ?? node.id ?? "");
  // Fast path: direct key lookup (most common)
  if (nodeNum && aiContextData[nodeNum]) {
    return aiContextData[nodeNum];
  }

  // Extract possible hierarchy numbers from node (strings)
  const section = node.section_number ?? node.section ?? "";
  const paragraph = node.paragraph_number ?? node.paragraph ?? "";
  const subparagraph = node.subparagraph_number ?? node.subparagraph ?? node.subparagraph_index ?? "";

  const s = section !== undefined && section !== null ? String(section) : "";
  const p = paragraph !== undefined && paragraph !== null ? String(paragraph) : "";
  const sp = subparagraph !== undefined && subparagraph !== null ? String(subparagraph) : "";

  // Try likely composite key formats used in JSON keys
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

  // If the node has an explicit id field (not used as top-level key), try matching entry fields
  for (const [, entry] of Object.entries(aiContextData)) {
    // If entry itself stores numeric metadata, compare those
    try {
      const eSection = entry.section_number ?? entry.section ?? entry.parent_section ?? "";
      const eParagraph = entry.paragraph_number ?? entry.paragraph ?? "";
      const eSubparagraph = entry.subparagraph_number ?? entry.subparagraph ?? "";

      if (eSection !== undefined && eSection !== "" && s && String(eSection) === s) {
        if (p && eParagraph !== undefined && eParagraph !== "" && String(eParagraph) === p) {
          if (sp && eSubparagraph !== undefined && eSubparagraph !== "" && String(eSubparagraph) === sp) {
            return entry;
          } else if (!sp) {
            return entry;
          }
        } else if (!p) {
          // matched section only
          return entry;
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
      // ignore per-entry errors and continue searching
    }
  }

  // Last-resort fuzzy/case-insensitive contains matching on label/title
  if (node._label || node.title) {
    const needleLabel = (node._label || "").toString().toLowerCase();
    const needleTitle = (node.title || "").toString().toLowerCase();
    for (const [, entry] of Object.entries(aiContextData)) {
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

  // Fallback: Generate generic explanation
  const title = node.title ? `About ${node.title}` : `About ${node.node_type || "Item"} ${node.node_number || ""}`;
  
  const prompt = `Explain "${node.title || node.node_number}" (${node.node_type || "Item"} ${node.node_number || ""}) from RA 10863, the Philippine Customs Modernization and Tariff Act, in simple terms.`;

  const content = `An offline explanation for this specific section is currently being processed.

However, you can instantly get a detailed explanation by tapping any of the AI buttons.`;

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
