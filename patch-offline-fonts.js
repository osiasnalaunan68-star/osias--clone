// patch-offline-fonts.js — self-host fonts para 100% offline
const fs = require("fs");

const FE = "frontend";
const HTML = FE + "/index.html";
const MAIN = FE + "/src/main.jsx";
const FONTS_JS = FE + "/src/fonts.js";
const SW = FE + "/public/sw.js";

function must(cond, msg) {
  if (!cond) { console.error("\n❌ PATCH FAILED: " + msg + "\n   (walang binago)"); process.exit(1); }
}
must(fs.existsSync(HTML) && fs.existsSync(MAIN), "Hindi makita ang frontend/. I-run sa project root.");

const FONTS = {
  "inter": [400, 500, 600, 700, 800],
  "source-serif-4": [400, 500, 600, 700],
  "public-sans": [400, 500, 600, 700],
  "newsreader": [500, 600, 700],
};

const imports = [];
for (const [pkg, weights] of Object.entries(FONTS)) {
  const dir = FE + "/node_modules/@fontsource/" + pkg;
  must(fs.existsSync(dir), "Wala pa ang @fontsource/" + pkg + " — i-run muna ang Step 1.");
  for (const w of weights) {
    const pick = ["latin-" + w + ".css", w + ".css"].find((f) => fs.existsSync(dir + "/" + f));
    must(pick, "Walang CSS file para sa " + pkg + " " + w);
    imports.push('import "@fontsource/' + pkg + "/" + pick + '";');
  }
}

let main = fs.readFileSync(MAIN, "utf8");
let html = fs.readFileSync(HTML, "utf8");
let sw = fs.readFileSync(SW, "utf8");

const needMain = !main.includes('"./fonts"');
if (needMain) must(main.includes('import "./index.css";'), 'Walang import "./index.css" sa main.jsx');

const newHtml = html.replace(/^[ \t]*<link[^>]*fonts\.(?:googleapis|gstatic)\.com[^>]*>[ \t]*\r?\n/gm, "");
must(!/fonts\.(googleapis|gstatic)\.com/.test(newHtml), "May natira pang Google Fonts sa index.html");
const htmlChanged = newHtml !== html;

fs.writeFileSync(FONTS_JS, "// Self-hosted fonts (offline). Bundled sa APK.\n" + imports.join("\n") + "\n");
if (needMain) fs.writeFileSync(MAIN, main.replace('import "./index.css";', 'import "./index.css";\nimport "./fonts";'));
if (htmlChanged) {
  fs.writeFileSync(HTML, newHtml);
  fs.writeFileSync(SW, sw.replace(/cmta-app-cache-v(\d+)/, (_, n) => "cmta-app-cache-v" + (Number(n) + 1)));
}

console.log("✅ src/fonts.js — " + imports.length + " font files");
console.log(needMain ? '✅ main.jsx — import "./fonts"' : "• main.jsx — ok na dati");
console.log(htmlChanged ? "✅ index.html — tinanggal ang Google Fonts" : "• index.html — ok na dati");
console.log(htmlChanged ? "✅ sw.js — cache version bumped" : "• sw.js — walang binago");
