import aiContextData from '../data/aiContext.json';

export const AI_APPS = [
  { id: "chatgpt", label: "ChatGPT", icon: "🟢", url: "https://chatgpt.com/" },
  { id: "gemini", label: "Gemini", icon: "✨", url: "https://gemini.google.com/" },
  { id: "meta", label: "Meta AI", icon: "🔵", url: "https://www.meta.ai/" }
];

export function getAiContext(node) {
  if (!node || !node.id) return null;

  // 1. Try to load the pre-written explanation from your JSON file
  const preWrittenData = aiContextData[node.id.toString()];

  if (preWrittenData) {
    return {
      title: preWrittenData.title,
      prompt: preWrittenData.prompt,
      content: preWrittenData.content
    };
  }

  // 2. FALLBACK: If the ID is missing (e.g., 141), generate it dynamically
  const title = node.title ? `About ${node.title}` : `About ${node.node_type} ${node.node_number || ""}`;
  
  const prompt = `Explain "${node.title || node.node_number}" (${node.node_type} ${node.node_number || ""}) from RA 10863, the Philippine Customs Modernization and Tariff Act, in simple terms with an example.`;

  const content = `An offline explanation for this specific section is currently being processed by Osias 6.7.\n\nHowever, you can instantly get a detailed explanation by tapping any of the AI buttons below. The prompt has already been copied to your clipboard!`;

  return {
    title,
    prompt,
    content
  };
}

export async function copyPromptAndOpen(prompt, url) {
  try {
    // Bulletproof Clipboard Fallback for Android WebView (Codemagic APK)
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
      console.warn("execCommand failed, trying navigator API", err);
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(prompt);
      }
    }
    textArea.remove();
    
  } catch (e) {
    console.error("Copy failed", e);
  }

  // Reliable way to open external apps/links in both Web & APK
  const newWindow = window.open(url, "_blank");
  if (!newWindow) {
    window.location.href = url;
  }
}
