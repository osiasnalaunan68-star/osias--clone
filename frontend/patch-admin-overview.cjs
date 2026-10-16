const fs = require('fs');
const path = require('path');

function patchFile(relPath, edits) {
  const filePath = path.join(__dirname, relPath);
  let content = fs.readFileSync(filePath, 'utf8');
  for (const [anchor, replacement] of edits) {
    const count = content.split(anchor).length - 1;
    if (count !== 1) {
      throw new Error('[' + relPath + '] Expected 1 match, found ' + count + ' for anchor: ' + anchor.slice(0, 60));
    }
    content = content.split(anchor).join(replacement);
  }
  fs.writeFileSync(filePath + '.bak', fs.readFileSync(filePath, 'utf8'));
  fs.writeFileSync(filePath, content);
  console.log('Patched ' + relPath + ' (backup: ' + relPath + '.bak)');
}

try {
  if (!fs.existsSync(path.join(__dirname, 'src/pages/AdminOverview.jsx'))) {
    throw new Error('Wala pa ang src/pages/AdminOverview.jsx — i-run muna ang step 1.');
  }

  patchFile('src/pages/AdminPanel.jsx', [
    [
      'import { db } from "../firebase";',
      'import { db } from "../firebase";\nimport AdminOverview from "./AdminOverview";',
    ],
    [
      'const [tab, setTab] = useState("users");',
      'const [tab, setTab] = useState("overview");',
    ],
    [
      '    { id: "users", label: "👥 Users" },',
      '    { id: "overview", label: "📊 Overview" },\n    { id: "users", label: "👥 Users" },',
    ],
    [
      '{users === null && <p className="py-8 text-center text-slate-400">Loading users...</p>}',
      '{users === null && <p className="py-8 text-center text-slate-400">Loading users...</p>}\n\n      {tab === "overview" && users !== null && !error && <AdminOverview users={users} />}',
    ],
  ]);

  console.log('✅ Tapos na. Run: npm run build');
} catch (err) {
  console.error('Patch failed: ' + err.message);
  console.error('Walang na-touch na file — i-paste mo ulit sa akin ang error, aayusin ko ang anchor.');
  process.exit(1);
}
