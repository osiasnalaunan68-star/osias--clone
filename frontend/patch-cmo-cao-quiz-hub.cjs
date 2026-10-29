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
  if (!fs.existsSync(path.join(__dirname, 'src/pages/IssuanceQuizHub.jsx'))) {
    throw new Error('src/pages/IssuanceQuizHub.jsx is missing — gawin muna ang step 1.');
  }

  patchFile('src/issuanceQuizStore.js', [
    [
      '// QuizPlayView wants { questionId: { [levelId]: question } }',
      `// All CMO / CAO that have a quiz (bundled + dev preview) for the Quiz/Exam list.
// type = "CMO" | "CAO". Title/subject come from the CMO/CAO text when it is imported.
export function listIssuanceQuizzes(type) {
  const t = String(type).toUpperCase();
  return Object.values(getAll())
    .filter((q) => q.type === t && (q.level1.length || q.level2.length))
    .map((q) => {
      const iss = getIssuance(q.id);
      return {
        id: q.id, type: q.type, number: q.number, label: q.label,
        year: yearOf(q.number),
        title: (iss && iss.title) || "",
        subject: (iss && iss.subject) || "",
        l1: q.level1.length, l2: q.level2.length,
      };
    })
    .sort(compare);
}

// QuizPlayView wants { questionId: { [levelId]: question } }`,
    ],
  ]);

  patchFile('src/pages/QuizHub.jsx', [
    [
      'import CustomQuizHub from "./CustomQuizHub";',
      'import CustomQuizHub from "./CustomQuizHub";\nimport IssuanceQuizHub from "./IssuanceQuizHub";',
    ],
    [
      'function RA10863Card({ expanded, onToggle, onContinue, onSelectTitle }) {',
      `function IssuanceQuizCard({ onOpen }) {
  return (
    <button
      onClick={onOpen}
      className="col-span-2 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-card transition-all active:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:active:bg-slate-700/50"
    >
      <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-navy-700 text-lg" aria-hidden>📜</span>
      <div className="min-w-0 flex-1">
        <p className="truncate font-bold text-navy-900 dark:text-slate-100">CMO / CAO</p>
        <p className="truncate text-xs text-slate-400 dark:text-slate-500">Pick a CMO or CAO by number or title</p>
      </div>
      <span className="flex-shrink-0 text-slate-300 dark:text-slate-600" aria-hidden>→</span>
    </button>
  );
}

function RA10863Card({ expanded, onToggle, onContinue, onSelectTitle }) {`,
    ],
    [
      '            {["tl", "cdp", "pc", "tcp"].map((id) => (',
      '            <IssuanceQuizCard onOpen={() => setActiveView({ type: "issuance-quiz" })} />\n            {["tl", "cdp", "pc", "tcp"].map((id) => (',
    ],
    [
      '        {activeView?.type === "ra10863-titles" && <QuizPage />}',
      '        {activeView?.type === "ra10863-titles" && <QuizPage />}\n        {activeView?.type === "issuance-quiz" && <IssuanceQuizHub onBack={backToHub} />}',
    ],
  ]);

  patchFile('src/pages/IssuanceQuizPanel.jsx', [
    [
      '" Open ☰ → CMO / CAO and tap 📝 Quiz."',
      '" Test it in 📝 Quiz/Exam → CMO / CAO (or ☰ → CMO / CAO → 📝 Quiz)."',
    ],
    [
      '<li>Check it in ☰ → CMO / CAO → 📝 Quiz.</li>',
      '<li>Check it in 📝 Quiz/Exam → CMO / CAO list (or ☰ → CMO / CAO → 📝 Quiz).</li>',
    ],
  ]);

  console.log('Done. Run npm run dev, import sa Dev Panel -> CMO/CAO Quiz, then open 📝 Quiz/Exam -> CMO / CAO.');
} catch (err) {
  console.error('Patch failed: ' + err.message);
  console.error('Walang na-touch na file sa step na yon — i-paste mo ulit sa akin ang exact section, aayusin ko ang anchor.');
  process.exit(1);
}
