import aiContextData from './data/aiContext.json';

export const AI_APPS = [
  { id: "chatgpt", label: "ChatGPT", icon: "🟢", url: "https://chatgpt.com/" },
  { id: "gemini", label: "Gemini", icon: "✨", url: "https://gemini.google.com/" },
  { id: "meta", label: "Meta AI", icon: "🔵", url: "https://www.meta.ai/" }
];

export function getAiContext(node) {
  if (!node) return null;

  // 1. Subukan kunin ang data mula sa JSON file gamit ang ID
  const idString = node.id ? node.id.toString() : "";
  let preWrittenData = null;
  
  if (aiContextData && idString && aiContextData[idString]) {
    preWrittenData = aiContextData[idString];
  }

  // Kung may laman sa JSON, yun ang ipapakita
  if (preWrittenData) {
    return {
      title: preWrittenData.title,
      prompt: preWrittenData.prompt,
      content: preWrittenData.content
    };
  }

  // 2. FALLBACK: Kung WALA sa JSON (tulad ng id 141), gagawa siya ng dynamic content 
  // Wala nang console.log na mag-e-error!
  const title = node.title ? `About ${node.title}` : `About ${node.node_type || "Item"} ${node.node_number || ""}`;
  
  const prompt = `Explain "${node.title || node.node_number}" (${node.node_type || "Item"} ${node.node_number || ""}) from RA 10863, the Philippine Customs Modernization and Tariff Act, in simple terms with an example.`;

  const content = `An offline explanation for this specific section is currently being processed by Osias 6.7.\n\nHowever, you can instantly get a detailed explanation by tapping any of the AI buttons below. The prompt has already been copied to your clipboard!`;

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
