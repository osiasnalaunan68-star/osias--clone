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
 * 2. Composite key with section + paragraph (for sub-paragraphs)
 * 3. Paragraph ID if it's just a paragraph
 */
function findAiContextEntry(node, sectionNumber, paragraphNumber, subparagraphNumber) {
  const nodeNum = String(node.node_number || node.id || "");
  
  // Priority 1: Direct lookup by node_number (main sections)
  if (aiContextData && aiContextData[nodeNum]) {
    return aiContextData[nodeNum];
  }
  
  // Priority 2: For paragraphs/subparagraphs - try to find by composite key
  // The JSON file has entries like "194", "195", etc. for Section 101's paragraphs
  // These are sequential IDs assigned to sub-paragraphs in the JSON
  if (node.node_type === "paragraph" || node.node_type === "subparagraph") {
    // Try direct ID first
    if (nodeNum && aiContextData[nodeNum]) {
      return aiContextData[nodeNum];
    }
  }
  
  // Priority 3: Try searching by label match in data
  if (node._label) {
    // Search through all entries for a matching label
    for (const [key, entry] of Object.entries(aiContextData)) {
      if (entry._label === node._label) {
        return entry;
      }
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
  
  const prompt = `Explain "${node.title || node.node_number}" (${node.node_type || "Item"} ${node.node_number || ""}) from RA 10863, the Philippine Customs Modernization and Tariff Act, in simple terms with an example.`;

  const content = `An offline explanation for this specific section is currently being processed by Osias 6.7.\n\nHowever, you can instantly get a detailed explanation by tapping any of the AI buttons above.`;

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
