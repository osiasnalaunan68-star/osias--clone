const fs = require('fs');
const path = require('path');

function patchFile(relPath, edits) {
  const filePath = path.join(__dirname, relPath);
  let content = fs.readFileSync(filePath, 'utf8');
  fs.writeFileSync(filePath + '.bak', content);
  for (const [anchor, replacement] of edits) {
    const count = content.split(anchor).length - 1;
    if (count !== 1) {
      throw new Error('Expected 1 match, found ' + count + ' for anchor: ' + anchor.slice(0, 70));
    }
    content = content.split(anchor).join(replacement);
  }
  fs.writeFileSync(filePath, content);
  console.log('Patched ' + relPath + ' (backup: ' + relPath + '.bak)');
}

try {
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
      '              <span className="flex-1" />\n              <AccountButton />',
      '              {profile?.isAdmin && (\n                <button onClick={() => setView("admin")} aria-label="Admin Panel" className={`min-h-[34px] rounded-full px-2.5 py-1 font-medium transition-colors ${view === "admin" ? "bg-white text-navy-900 shadow-sm dark:bg-slate-700 dark:text-slate-50" : "text-slate-500 dark:text-slate-400"}`}>\n                  👑\n                </button>\n              )}\n              <span className="flex-1" />\n              <AccountButton />',
    ],
    [
      'IS_DEV ? <DevPanel /> : view === "quiz"',
      'IS_DEV ? <DevPanel /> : view === "admin" && profile?.isAdmin ? <AdminPanel /> : view === "quiz"',
    ],
  ]);

  console.log('Done. Run npm run build next.');
} catch (err) {
  console.error('Patch failed: ' + err.message);
  console.error('Wala pang na-touch, i-paste mo lang ulit sa akin ang error message.');
  process.exit(1);
}
