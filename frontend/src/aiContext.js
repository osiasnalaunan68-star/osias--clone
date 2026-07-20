import aiContextData from "./data/aiContext.json";
import { getImportedEntry } from "./devImportStore";

// Osias 6.7 — bundled AI explanations, shipped fully offline with the app.
// Lookup order: (1) npm-run-dev preview [dev only], (2) permanently imported
// via the Dev Panel [localStorage, works even after Dev Panel is deleted],
// (3) the committed aiContext.json bundled at build time.

const DEV_PREVIEW_KEY = "customsLaw_aiContextDevPreview";
export const IS_DEV = import.meta.env.DEV;

function readDevPreview() {
  if (!IS_DEV) return {};
  try {
    return JSON.parse(localStorage.getItem(DEV_PREVIEW_KEY) || "{}");
  } catch {
    return {};
  }
}

export function getAiContext(nodeId) {
  const key = String(nodeId);
  if (IS_DEV) {
    const preview = readDevPreview();
    if (preview[key]) return preview[key];
  }
  const imported = getImportedEntry(key);
  if (imported) return imported;
  return aiContextData[key] || null;
}

export function saveDevPreviewBatch(jsonText) {
  if (!IS_DEV) throw new Error("Preview is only available in npm run dev");
  const parsed = JSON.parse(jsonText);
  const merged = { ...readDevPreview(), ...parsed };
  localStorage.setItem(DEV_PREVIEW_KEY, JSON.stringify(merged));
  return merged;
}

export function clearDevPreview() {
  if (!IS_DEV) return;
  localStorage.removeItem(DEV_PREVIEW_KEY);
}

export function getDevPreviewRaw() {
  if (!IS_DEV) return "{}";
  return JSON.stringify(readDevPreview(), null, 2);
}

export const MASTER_PROMPT = `🧠 MASTER CONTENT GENERATION PROMPT
You are an expert Customs Broker, CMTA legal educator, instructional designer, and content writer for AHTN Navigator.
Your task is to generate a pre-written Study Guide for each Definition, Section, Chapter, or Provision of Republic Act No. 10863 (CMTA).
The Study Guide will be stored permanently in the application's database. It is NOT AI-generated at runtime. Every response must be written as if it were created by an experienced Customs law professor.

SOURCE OF TRUTH
The official text from the provided JSON file is the only legal source.
Never modify the official law. Never rewrite the official law. Never omit important legal meaning.
Never invent legal requirements. Never fabricate court cases or legal interpretations.
If additional information is unavailable, clearly state that instead of guessing.

TARGET AUDIENCE
Write for: First-year BSCA students, Customs Broker reviewees, and professionals who want a simple explanation.
The reader should feel like a professor is explaining the topic in plain language.

LANGUAGE
Primary language: Tagalog. Keep important legal terms in English when appropriate.
Use simple, conversational Tagalog. Avoid deep legal jargon unless you immediately explain it.

WRITING STYLE
The explanation should feel like a mentor talking to a student.
Do NOT sound like ChatGPT. Do NOT sound robotic. Do NOT simply repeat the law.
Instead: Explain. Teach. Simplify. Give context. Build understanding.

REQUIRED FORMAT
Generate the following sections in this exact order.

📖 Kahulugan
Start with a one-paragraph explanation in very simple Tagalog. The reader should immediately understand what the topic means.

🔍 Breakdown
Break the provision into its important parts. Explain each keyword separately (e.g. Imported Goods, Free Zone, Directly or Through Transit). Explain why each one matters.

💡 Simpleng Paliwanag
Pretend you're explaining the topic to your classmate one day before the exam. Avoid legal wording. Make it easy to remember.

📦 Halimbawa
Create one realistic Customs scenario. Use situations involving imports, exports, airport, seaport, customs officers, customs brokers, warehouses, PEZA, Clark, Subic, Free Zones. The example must directly relate to the law.

⭐ Bakit Mahalaga Ito?
Explain why the provision exists. Why should Customs students understand it? How is it applied in real life?

⚠️ Dapat Tandaan
List the most important reminders. Mention common misunderstandings if applicable.

🎯 Board Exam Tip
Give review advice. Help students remember the concept. Mention common board exam traps if appropriate. Never invent actual board exam questions.

❓ Madalas Malito ang Students
Write one realistic question students usually ask. Then answer it clearly.

🔗 Related Topics
List related Sections, Definitions, Chapters, Customs concepts, and Related laws (only if officially relevant).

🤖 Need More Explanation?
Generate a high-quality prompt that users can send to external AI. The prompt must ask the AI to: explain the topic simply, give practical Customs examples, explain why the law exists, mention related provisions, mention relevant CAOs/CMOs if applicable, provide board exam insights, and clarify common misconceptions. This prompt will be automatically copied to the user's clipboard before opening Meta AI, ChatGPT, or Gemini.

IMPORTANT RULES
Every explanation must: preserve the legal meaning, never contradict CMTA, never hallucinate, never make assumptions, never create fake cases, never use unnecessary filler words, be educational, be easy to understand, and be consistent across the entire app.
The user should feel that every Study Guide was written by the same experienced Customs law professor.

For each id below, output valid JSON matching the ID TEMPLATE structure, filling in "title", "content", and "prompt" using the OFFICIAL CMTA SOURCE TEXT provided for that same id as your only source of truth.`;

function nodeLabel(node) {
  const type = node.node_type;
  const num = node.node_number || "";
  if (type === "chapter") return `Chapter ${num}`.trim();
  if (type === "section") return `Sec. ${num}`.trim();
  if (type === "title") return `Title ${num}`.trim();
  return `${type} ${num}`.trim();
}

export function buildTemplateForChapter(chapterTree) {
  const out = {};
  function walk(node) {
    if (node.content) {
      out[node.id] = {
        _label: `${node.node_type} ${node.node_number || ""} — ${(node.title || "").slice(0, 60)}`,
        title: "",
        content: "",
        prompt: "",
      };
    }
    (node.children || []).forEach(walk);
  }
  walk(chapterTree);
  return JSON.stringify(out, null, 2);
}

export function buildTopicTextForChapter(chapterTree) {
  const blocks = [];
  function walk(node) {
    if (node.content) {
      const lines = [`topic: [${node.id}]`, nodeLabel(node)];
      if (node.title) lines.push(node.title);
      lines.push(node.content);
      if (node.cross_references && node.cross_references.length) {
        lines.push("See Also");
        node.cross_references.forEach((ref) => {
          lines.push(ref.url ? `${ref.text} (${ref.url})` : ref.text);
        });
      }
      blocks.push(lines.join("\n"));
    }
    (node.children || []).forEach(walk);
  }
  walk(chapterTree);
  return blocks.join("\n\n");
}

export function buildFullCopyPayload(chapterTree) {
  const idTemplate = buildTemplateForChapter(chapterTree);
  const topics = buildTopicTextForChapter(chapterTree);
  return [
    MASTER_PROMPT,
    "",
    "🧩 ID TEMPLATE — fill title/content/prompt for each id below:",
    idTemplate,
    "",
    "📚 OFFICIAL CMTA SOURCE TEXT (per id, your only source of truth):",
    topics,
  ].join("\n");
}

export const AI_APPS = [
  { id: "meta", label: "Meta AI", icon: "💬", url: "https://m.me/MetaAI" },
  { id: "chatgpt", label: "ChatGPT", icon: "🟢", url: "https://chatgpt.com/" },
  { id: "gemini", label: "Gemini", icon: "✨", url: "https://gemini.google.com/app" },
];

export async function copyPromptAndOpen(prompt, appUrl) {
  try {
    await navigator.clipboard.writeText(prompt);
  } catch {
    // Clipboard can silently fail on some Android WebViews.
  }
  window.open(appUrl, "_blank", "noopener,noreferrer");
}
