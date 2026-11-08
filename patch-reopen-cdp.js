const fs = require("fs");
const path = require("path");

const base = fs.existsSync("frontend/src/pages/QuizHub.jsx")
  ? "frontend/src"
  : fs.existsSync("src/pages/QuizHub.jsx")
  ? "src"
  : null;
if (!base) {
  console.error("❌ Hindi makita ang QuizHub.jsx. I-run sa project root.");
  process.exit(1);
}

const file = path.join(base, "pages", "QuizHub.jsx");
let s = fs.readFileSync(file, "utf8");

const OLD = `const DISABLED_SUBJECTS = {
  cdp: {
    title: "Under maintenance",
    message:
      "This subject is temporarily unavailable. We are fixing some questions and a data (JSON) bug, so the quiz is closed for now. Thank you for your patience — it will be back soon.",
  },
};`;
const NEW = `const DISABLED_SUBJECTS = {};`;

if (s.includes(NEW) && !s.includes(OLD)) {
  console.log("ℹ️ Bukas na ang CDP (wala nang maintenance block). Walang binago.");
  process.exit(0);
}

const i = s.indexOf(OLD);
if (i === -1) {
  console.error("❌ Hindi makita ang DISABLED_SUBJECTS block (baka iba na ang laman). Walang binago.");
  process.exit(1);
}
if (s.indexOf(OLD, i + 1) !== -1) {
  console.error("❌ Higit sa 1 match. Walang binago.");
  process.exit(1);
}

s = s.slice(0, i) + NEW + s.slice(i + OLD.length);

if (!fs.existsSync(file + ".bak")) fs.copyFileSync(file, file + ".bak");
fs.writeFileSync(file, s);

console.log("✅ Tapos na! Bukas na ulit ang CDP quiz (tinanggal ang maintenance block).");
console.log("   • " + file + "  (backup: .bak)");
console.log("Susunod: cd frontend && npm run build   (o i-push na sa Codemagic)");
