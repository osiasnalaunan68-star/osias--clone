import aiContextData from "./data/aiContext.json";

// AI explanations stored by composite key:
// - section-101
// - paragraph-101(a)
// - subparagraph-101(a)(i)
// - item-101(a)(i)(a)

function getCompositeKey(node) {
  if (!node) return null;

  const type = node.node_type;
  const number = node.node_number;

  if (type === "section") {
    return `section-${number}`;
  }

  if (type === "chapter") {
    return `chapter-${number}`;
  }

  if (type === "paragraph") {
    const section = node.section_number || node.parent_section_number;
    if (section) {
      return `paragraph-${section}(${number})`;
    }
    return null;
  }

  if (type === "subparagraph") {
    const section = node.section_number || node.parent_section_number;
    const paragraph = node.paragraph_number || node.parent_paragraph_number;
    if (section && paragraph) {
      return `subparagraph-${section}(${paragraph})(${number})`;
    }
    return null;
  }

  if (type === "item") {
    const section = node.section_number || node.parent_section_number;
    const paragraph = node.paragraph_number || node.parent_paragraph_number;
    const subparagraph = node.subparagraph_number || node.parent_subparagraph_number;
    if (section && paragraph && subparagraph) {
      return `item-${section}(${paragraph})(${subparagraph})(${number})`;
    }
    if (section && paragraph) {
      return `item-${section}(${paragraph})(${number})`;
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
