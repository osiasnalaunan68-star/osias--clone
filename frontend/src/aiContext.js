import aiContextData from "./data/aiContext.json";

// AI explanations stored by composite key:
// - section-101
// - paragraph-101(a)
// - subparagraph-101(a)(i)
// - item-101(a)(i)(a)


function getCompositeKey(node) {
  if (!node) return null;

  const type = node.node_type;

  if (type === "section") {
    return `section-${node.node_number}`;
  }

  if (type === "chapter") {
    return `chapter-${node.node_number}`;
  }

  if (type === "paragraph") {
    const section = node.section_number || node.parent_section_number;
    const para = node.paragraph_number || node.node_number;
    if (section && para) {
      // Remove parentheses if present
      const cleanPara = para.replace(/[()]/g, '');
      return `paragraph-${section}(${cleanPara})`;
    }
    return null;
  }

  if (type === "subparagraph") {
    const section = node.section_number || node.parent_section_number;
    const paragraph = node.paragraph_number || node.parent_paragraph_number;
    const sub = node.subparagraph_number || node.node_number;
    if (section && paragraph && sub) {
      const cleanPara = paragraph.replace(/[()]/g, '');
      const cleanSub = sub.replace(/[()]/g, '');
      return `subparagraph-${section}(${cleanPara})(${cleanSub})`;
    }
    return null;
  }

  if (type === "item") {
    const section = node.section_number || node.parent_section_number;
    const paragraph = node.paragraph_number || node.parent_paragraph_number;
    const subparagraph = node.subparagraph_number || node.parent_subparagraph_number;
    const item = node.item_number || node.node_number;
    if (section && paragraph && item) {
      const cleanPara = paragraph.replace(/[()]/g, '');
      const cleanSub = subparagraph ? subparagraph.replace(/[()]/g, '') : '';
      const cleanItem = item.replace(/[()]/g, '');
      if (subparagraph) {
        return `item-${section}(${cleanPara})(${cleanSub})(${cleanItem})`;
      } else {
        return `item-${section}(${cleanPara})(${cleanItem})`;
      }
    }
    return null;
  }

  return null;
}


export function getAiContext(node) {
  if (!node) return null;
  const key = getCompositeKey(node);
  if (!key) return null;
  return aiContextData[key] || null;
}

// For backward compatibility: kung ang nodeId lang ang ibinigay
export function getAiContextById(nodeId) {
  const result = aiContextData[String(nodeId)];
  if (result) return result;
  for (const [key, value] of Object.entries(aiContextData)) {
    if (key.includes(String(nodeId))) {
      return value;
    }
  }
  return null;
}

export const AI_APPS = [
  { id: "meta", label: "Meta AI", icon: "💬", url: "https://m.me/MetaAI" },
  { id: "chatgpt", label: "ChatGPT", icon: "🟢", url: "https://chatgpt.com/" },
  { id: "gemini", label: "Gemini", icon: "✨", url: "https://gemini.google.com/app" },
];

export async function copyPromptAndOpen(prompt, appUrl) {
  try {
    await navigator.clipboard.writeText(prompt);
  } catch {}
  window.open(appUrl, "_blank", "noopener,noreferrer");
}
