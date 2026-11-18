// patch-logo.cjs — gamitin ang frontend/src/assets/logo.png sa loading page, top bar, sidebar
const fs = require("fs");

const AG = "frontend/src/components/AccessGate.jsx";
const CB = "frontend/src/pages/ChapterBrowser.jsx";
const LOGO = "frontend/src/assets/logo.png";

function must(cond, msg) {
  if (!cond) { console.error("\n❌ PATCH FAILED: " + msg + "\n   (walang binago)"); process.exit(1); }
}
function once(src, from, to, label) {
  const parts = src.split(from);
  must(parts.length === 2, label + " — anchor found " + (parts.length - 1) + "x (dapat 1x)");
  return parts.join(to);
}

must(fs.existsSync(LOGO), "Wala ang frontend/src/assets/logo.png");
must(fs.existsSync(AG) && fs.existsSync(CB), "Hindi makita ang frontend/src. I-run sa project root.");
let ag = fs.readFileSync(AG, "utf8");
let cb = fs.readFileSync(CB, "utf8");
must(!ag.includes("logoImg") && !cb.includes("logoImg"), "Na-patch na yata ito.");

const IMPORT = 'import logoImg from "../assets/logo.png";\n';

// 1) Loading page (Splash): logo + bagong note
ag = once(ag,
  '<span className="flex h-12 w-12 items-center justify-center rounded-full border border-seal text-seal dark:border-gold-400 dark:text-gold-400" aria-hidden><StepIcon name="scale" className="h-6 w-6" /></span>',
  '<img src={logoImg} alt="Customs Tech" draggable={false} className="h-20 w-20 rounded-full object-contain" />',
  "splash logo");
ag = once(ag,
  "Tip: If loading takes too long, turn Airplane Mode on, then off, and reopen the app for a faster reload.",
  "without leaving the apps",
  "splash note");

// 2) Top bar (katabi ng "RA 10863") at 3) sidebar header
cb = once(cb,
  '<span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-navy-900 text-white dark:bg-gold-500 dark:text-navy-950" aria-hidden><NavIcon name="scale" className="h-4 w-4" /></span>',
  '<img src={logoImg} alt="" aria-hidden="true" draggable={false} className="h-8 w-8 flex-shrink-0 rounded-full object-contain" />',
  "top bar logo");
cb = once(cb,
  '<span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-seal text-seal dark:border-gold-400 dark:text-gold-400" aria-hidden><NavIcon name="scale" className="h-4 w-4" /></span><div><h2',
  '<img src={logoImg} alt="" aria-hidden="true" draggable={false} className="h-9 w-9 flex-shrink-0 rounded-full object-contain" /><div><h2',
  "sidebar logo");

fs.writeFileSync(AG, IMPORT + ag);
fs.writeFileSync(CB, IMPORT + cb);

console.log("✅ AccessGate.jsx — logo sa loading page + note: \"without leaving the apps\"");
console.log("✅ ChapterBrowser.jsx — logo sa top bar at sa sidebar header");
