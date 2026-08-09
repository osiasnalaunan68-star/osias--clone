const fs = require('fs');
const path = require('path');

function patchFile(relPath, edits) {
  const filePath = path.join(__dirname, relPath);
  let content = fs.readFileSync(filePath, 'utf8');
  fs.writeFileSync(filePath + '.bak', content);
  for (const [anchor, replacement] of edits) {
    const count = content.split(anchor).length - 1;
    if (count !== 1) {
      throw new Error('[' + relPath + '] Expected 1 match, found ' + count + ' for anchor: ' + anchor.slice(0, 60));
    }
    content = content.split(anchor).join(replacement);
  }
  fs.writeFileSync(filePath, content);
  console.log('Patched ' + relPath + ' (backup: ' + relPath + '.bak)');
}

try {
  patchFile('src/authContext.jsx', [
    [
      '        subscriptions: { CL: false, TL: false, CDP: false, PC: false },\n      };',
      '        subscriptions: { CL: false, TL: false, CDP: false, PC: false },\n        isAdmin: false,\n      };',
    ],
  ]);

  patchFile('src/payments.js', [
    [
      '{ id: "PC", label: "Practical Customs", price: 29, subjects: ["PC"] },',
      '{ id: "PC", label: "Practice Computation", price: 29, subjects: ["PC"] },',
    ],
  ]);

  patchFile('src/components/AccountOverlay.jsx', [
    [
      'const SUBJECT_LABELS = { CL: "Customs Law", TL: "Tariff Law", CDP: "Customs Declarant Practice", PC: "Practical Customs" };',
      'const SUBJECT_LABELS = { CL: "Customs Law", TL: "Tariff Law", CDP: "Customs Declarant Practice", PC: "Practice Computation" };',
    ],
  ]);

  patchFile('src/pages/ChapterBrowser.jsx', [
    [
      'import AccountButton from "../components/AccountButton";',
      'import AccountButton from "../components/AccountButton";\nimport AdminPanel from "./AdminPanel";\nimport { useAuth } from "../authContext";',
    ],
    [
      'export default function ChapterBrowser() {\n  const [view, setView] = useState("browse");',
      'export default function ChapterBrowser() {\n  const { profile } = useAuth();\n  const [view, setView] = useState("browse");',
    ],
    [
      '              <span className="flex-1" />',
      '              {profile?.isAdmin && (\n                <button onClick={() => setView("admin")} aria-label="Admin Panel" className={`min-h-[34px] rounded-full px-2.5 py-1 font-medium transition-colors ${view === "admin" ? "bg-white text-navy-900 shadow-sm dark:bg-slate-700 dark:text-slate-50" : "text-slate-500 dark:text-slate-400"}`}>\n                  👑\n                </button>\n              )}\n              <span className="flex-1" />',
    ],
    [
      'IS_DEV ? <DevPanel /> : view === "quiz"',
      'IS_DEV ? <DevPanel /> : view === "admin" && profile?.isAdmin ? <AdminPanel /> : view === "quiz"',
    ],
  ]);

  console.log('All patches applied. Run npm run build next.');
} catch (err) {
  console.error('Patch failed: ' + err.message);
  console.error('Walang na-touch na file sa step na 'yon — i-paste mo lang ulit sa akin ang exact section, aayusin ko ang anchor.');
  process.exit(1);
}
