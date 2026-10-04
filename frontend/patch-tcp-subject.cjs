const fs = require("fs");
const path = require("path");

function edit(rel, steps) {
  const file = path.join(__dirname, rel);
  if (!fs.existsSync(file)) { console.log("❌ missing file: " + rel); return; }
  const orig = fs.readFileSync(file, "utf8");
  let c = orig;
  for (const s of steps) {
    if (s.done.test(c)) { console.log("⏭  " + rel + " - " + s.name + " (already done)"); continue; }
    if (!s.find.test(c)) { console.log("⚠️  " + rel + " - " + s.name + " (anchor NOT found, edit manually)"); continue; }
    c = c.replace(s.find, s.rep);
    console.log("✅ " + rel + " - " + s.name);
  }
  if (c !== orig) { fs.writeFileSync(file + ".bak", orig); fs.writeFileSync(file, c); }
}

edit("src/data/subjects.js", [
  { name: "add tcp subject", done: /id: "tcp"/,
    find: /\{ id: "pc", label: "PC", kind: "flat" \},/,
    rep: (m) => m + '\n  { id: "tcp", label: "TCP", kind: "flat" },' },
]);

edit("src/subjectQuizStore.js", [
  { name: "import tcp.json", done: /import defaultTCP/,
    find: /import defaultPC from '\.\/data\/defaultQuizzes\/pc\.json';/,
    rep: (m) => m + "\nimport defaultTCP from './data/defaultQuizzes/tcp.json';" },
  { name: "register in defaultDataMap", done: /tcp: defaultTCP/,
    find: /pc: defaultPC,/,
    rep: (m) => m + "\n  tcp: defaultTCP," },
]);

edit("src/pages/SubjectDashboard.jsx", [
  { name: "free limit 10", done: /tcp:\s*10/,
    find: /pc: 10(\s*\})/,
    rep: (m, g) => "pc: 10, tcp: 10" + g },
]);

edit("src/pages/QuizHub.jsx", [
  { name: "label", done: /tcp: "/,
    find: /(\n\s*pc: "[^"]*",)/,
    rep: (m) => m + '\n  tcp: "Tariff Commission Primer",' },
  { name: "show card", done: /\["tl", "cdp", "pc", "tcp"\]/,
    find: /\["tl", "cdp", "pc"\]/,
    rep: '["tl", "cdp", "pc", "tcp"]' },
]);

edit("src/payments.js", [
  { name: "TCP plan P399 (not in bundle)", done: /id: "TCP"/,
    find: /(\{ id: "PC",[^\n]*\},)/,
    rep: (m) => m + '\n  { id: "TCP", label: "Tariff Commission Primer", price: 399, subjects: ["TCP"] },' },
]);

edit("src/components/AccountOverlay.jsx", [
  { name: "SUBJECT_LABELS", done: /TCP: "/,
    find: /(const SUBJECT_LABELS = \{[^}]*?)(\s*\};)/,
    rep: (m, a, b) => a.replace(/,\s*$/, "") + ', TCP: "Tariff Commission Primer"' + b },
  { name: "allSubscribed ignores TCP (bundle excludes it)", done: /filter\(\(c\) => c !== "TCP"\)/,
    find: /Object\.keys\(SUBJECT_LABELS\)\.every\(/,
    rep: 'Object.keys(SUBJECT_LABELS).filter((c) => c !== "TCP").every(' },
]);

edit("src/pages/AdminPanel.jsx", [
  { name: "SUBJECT_CODES", done: /"PC", "TCP"/,
    find: /const SUBJECT_CODES = \["CL", "CDP", "TL", "PC"\];/,
    rep: 'const SUBJECT_CODES = ["CL", "CDP", "TL", "PC", "TCP"];' },
]);

edit("src/authContext.jsx", [
  { name: "default subscriptions", done: /TCP:\s*false/,
    find: /PC: false(\s*\})/,
    rep: (m, g) => "PC: false, TCP: false" + g },
]);

const dir = path.join(__dirname, "src/data/defaultQuizzes");
const jf = path.join(dir, "tcp.json");
fs.mkdirSync(dir, { recursive: true });
if (!fs.existsSync(jf)) { fs.writeFileSync(jf, "{}\n"); console.log("✅ created src/data/defaultQuizzes/tcp.json (empty)"); }
else console.log("⏭  tcp.json already exists");

console.log("\nDone. Next: npm run dev -> Dev Panel -> TCP tab.");
