import aiContextData from './data/aiContext.json';

export const AI_APPS = [
  { id: "chatgpt", label: "ChatGPT", icon: "🟢", url: "https://chatgpt.com/" },
  { id: "gemini", label: "Gemini", icon: "✨", url: "https://gemini.google.com/" },
  { id: "meta", label: "Meta AI", icon: "🔵", url: "https://www.meta.ai/" }
];

export function getAiContext(node) {
  if (!node) return null;

  const idString = (node.node_number || node.id) ? String(node.node_number || node.id) : "";
  let preWrittenData = null;
  
  if (aiContextData && idString && aiContextData[idString]) {
    preWrittenData = aiContextData[idString];
  }

  if (preWrittenData) {
    return {
      title: preWrittenData.title,
      prompt: preWrittenData.prompt,
      content: preWrittenData.content
    };
  }

  const title = node.title ? `About ${node.title}` : `About ${node.node_type || "Item"} ${node.node_number || ""}`;
  
  const prompt = `Explain "${node.title || node.node_number}" (${node.node_type || "Item"} ${node.node_number || ""}) from RA 10863, the Philippine Customs Modernization and Tariff Act, in simple and easy-to-understand terms. Focus on practical applications and key points.`;

  const content = `An offline explanation for this specific section is currently being processed by Osias 6.7.\n\nHowever, you can instantly get a detailed explanation by tapping any of the AI buttons below. Your prompt is ready to copy and use!`;

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
