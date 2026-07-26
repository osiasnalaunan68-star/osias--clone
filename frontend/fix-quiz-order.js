const fs = require("fs");
const file = "src/pages/QuizPage.jsx";
let content = fs.readFileSync(file, "utf8");

// Helper functions to extract and compare Roman numerals
const extractTitleNumber = (title) => {
  const match = title.match(/^Title\s+([IVXLCDM]+)/i);
  return match ? match[1] : "";
};
const romanToInt = (s) => {
  if (!s) return 0;
  const map = { I:1, V:5, X:10, L:50, C:100, D:500, M:1000 };
  let total = 0, prev = 0;
  for (let i = s.length - 1; i >= 0; i--) {
    const cur = map[s[i]] || 0;
    total += cur < prev ? -cur : cur;
    prev = cur;
  }
  return total;
};

// Insert helper functions after the last import if not already present
const helperCode = `
// Helper to extract Roman numeral from title string like "Title I – ..."
function extractTitleNumber(title) {
  const match = title.match(/^Title\\s+([IVXLCDM]+)/i);
  return match ? match[1] : "";
}
function romanToInt(s) {
  if (!s) return 0;
  const map = { I:1, V:5, X:10, L:50, C:100, D:500, M:1000 };
  let total = 0, prev = 0;
  for (let i = s.length - 1; i >= 0; i--) {
    const cur = map[s[i]] || 0;
    total += cur < prev ? -cur : cur;
    prev = cur;
  }
  return total;
}
`;

// Only insert if not already present
if (!content.includes("extractTitleNumber")) {
  const importRegex = /^import .+;$/gm;
  const imports = content.match(importRegex);
  if (imports && imports.length > 0) {
    const lastImport = imports[imports.length - 1];
    const lastImportIndex = content.lastIndexOf(lastImport) + lastImport.length;
    content = content.slice(0, lastImportIndex) + "\n" + helperCode + content.slice(lastImportIndex);
  }
}

// Replace the setTitles(loadQuizData()) line with sorted version
const setTitlesRegex = /setTitles\(loadQuizData\(\)\);/g;
if (setTitlesRegex.test(content)) {
  content = content.replace(
    setTitlesRegex,
    `const loaded = loadQuizData(); loaded.sort((a,b) => romanToInt(extractTitleNumber(a.title)) - romanToInt(extractTitleNumber(b.title))); setTitles(loaded);`
  );
} else {
  // Fallback: find the useEffect that loads data and modify
  const effectRegex = /useEffect\(\(\)\s*=>\s*\{\s*setTitles\(loadQuizData\(\)\);/;
  if (effectRegex.test(content)) {
    content = content.replace(
      effectRegex,
      `useEffect(() => { const loaded = loadQuizData(); loaded.sort((a,b) => romanToInt(extractTitleNumber(a.title)) - romanToInt(extractTitleNumber(b.title))); setTitles(loaded);`
    );
  }
}

fs.writeFileSync(file, content);
console.log("✅ QuizPage.jsx updated");
