const fs = require('fs');
const path = require('path');

function patchFile(relPath, edits) {
  const filePath = path.join(__dirname, relPath);
  let content = fs.readFileSync(filePath, 'utf8');
  fs.writeFileSync(filePath + '.bak-push', content);
  for (const [anchor, replacement] of edits) {
    const count = content.split(anchor).length - 1;
    if (count !== 1) {
      throw new Error('[' + relPath + '] Expected 1 match, found ' + count + ' for: ' + anchor.slice(0, 70));
    }
    content = content.split(anchor).join(replacement);
  }
  fs.writeFileSync(filePath, content);
  console.log('OK  ' + relPath + '  (backup: ' + relPath + '.bak-push)');
}

try {
  patchFile('vite.config.js', [
    [
      "import react from '@vitejs/plugin-react';",
      "import react from '@vitejs/plugin-react';\nimport saveIssuance from './vite-plugin-save-issuance.js';",
    ],
    ['plugins: [react()],', 'plugins: [react(), saveIssuance()],'],
  ]);

  patchFile('src/pages/IssuancePanel.jsx', [
    [
      'export default function IssuancePanel() {',
      'async function pushIssuance(text, overwrite) {\n' +
      '  const r = await fetch("/__dev/save-issuance", {\n' +
      '    method: "POST",\n' +
      '    headers: { "Content-Type": "application/json" },\n' +
      '    body: JSON.stringify({ content: text, overwrite }),\n' +
      '  });\n' +
      '  let data = {};\n' +
      '  try { data = await r.json(); } catch { /* not JSON = plugin not running */ }\n' +
      '  return { status: r.status, ...data };\n' +
      '}\n' +
      'const NO_SERVER = "Dev server did not answer. Stop and re-run npm run dev, then try again.";\n\n' +
      'export default function IssuancePanel() {',
    ],
    [
      '  const [copied, setCopied] = useState(false);\n',
      '  const [copied, setCopied] = useState(false);\n  const [pushMsg, setPushMsg] = useState(null);\n',
    ],
    [
      '  const btn = "min-h-[40px] rounded-lg border px-3 py-1.5 text-sm font-medium";',
      '  const handlePush = async (it) => {\n' +
      '    setPushMsg(null);\n' +
      '    try {\n' +
      '      const text = exportIssuanceJson(it.id);\n' +
      '      let res = await pushIssuance(text, false);\n' +
      '      if (res.status === 409 && res.error === "exists") {\n' +
      '        if (!confirm(`${it.label} already exists in ${res.file}.\\nReplace it with the imported version?`)) return;\n' +
      '        res = await pushIssuance(text, true);\n' +
      '      }\n' +
      '      if (!res.ok) throw new Error(res.message || NO_SERVER);\n' +
      '      setPushMsg({ ok: true, text: `✓ ${it.label} ${res.action} → ${res.file}` });\n' +
      '    } catch (e) {\n' +
      '      setPushMsg({ ok: false, text: e.message });\n' +
      '    }\n' +
      '  };\n\n' +
      '  const handlePushAll = async () => {\n' +
      '    setPushMsg(null);\n' +
      '    const done = [];\n' +
      '    const conflicts = [];\n' +
      '    try {\n' +
      '      for (const it of list) {\n' +
      '        const text = exportIssuanceJson(it.id);\n' +
      '        const res = await pushIssuance(text, false);\n' +
      '        if (res.status === 409 && res.error === "exists") conflicts.push({ it, text });\n' +
      '        else if (res.ok) done.push(`${it.label} ${res.action}`);\n' +
      '        else throw new Error(res.message || NO_SERVER);\n' +
      '      }\n' +
      '      if (conflicts.length && confirm(`${conflicts.length} already exist (${conflicts.map((c) => c.it.label).join(", ")}).\\nReplace them with the imported versions?`)) {\n' +
      '        for (const c of conflicts) {\n' +
      '          const res = await pushIssuance(c.text, true);\n' +
      '          if (!res.ok) throw new Error(res.message || NO_SERVER);\n' +
      '          done.push(`${c.it.label} updated`);\n' +
      '        }\n' +
      '      }\n' +
      '      setPushMsg({ ok: true, text: `✓ ${done.length} saved in src/data/issuances/ — ${done.join(", ")}` });\n' +
      '    } catch (e) {\n' +
      '      setPushMsg({ ok: false, text: e.message });\n' +
      '    }\n' +
      '  };\n\n' +
      '  const btn = "min-h-[40px] rounded-lg border px-3 py-1.5 text-sm font-medium";',
    ],
    [
      '<li>Download the file and put it in <code className="rounded bg-slate-100 px-1 dark:bg-slate-700">frontend/src/data/issuances/</code> so it ships to users.</li>',
      '<li>Tap <b>📁 Push to file</b> on the item below. It is saved straight into <code className="rounded bg-slate-100 px-1 dark:bg-slate-700">frontend/src/data/issuances/</code> so it ships to users. (⬇ JSON is only a manual download.)</li>',
    ],
    [
      '              <button onClick={handleClear}',
      '              <button onClick={handlePushAll} className={`${btn} border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400`}>\n' +
      '                📁 Push all\n' +
      '              </button>\n' +
      '              <button onClick={handleClear}',
    ],
    [
      '        {list.length === 0 && <p className="text-sm text-slate-400">Nothing imported yet.</p>}',
      '        {pushMsg && (\n' +
      '          <p className={`mb-2 break-words rounded-lg p-2.5 text-sm ${pushMsg.ok ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300" : "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-300"}`}>\n' +
      '            {pushMsg.ok ? "" : "⚠️ "}{pushMsg.text}\n' +
      '          </p>\n' +
      '        )}\n' +
      '        {list.length === 0 && <p className="text-sm text-slate-400">Nothing imported yet.</p>}',
    ],
    [
      '<div className="flex flex-shrink-0 gap-2">\n                  <button onClick={() => download(issuanceFileName(it.id)',
      '<div className="flex flex-shrink-0 gap-2">\n                  <button onClick={() => handlePush(it)} className="rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 dark:border-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400">📁 Push to file</button>\n                  <button onClick={() => download(issuanceFileName(it.id)',
    ],
  ]);

  console.log('\nDone. Stop npm run dev (Ctrl+C) and run it again.');
} catch (err) {
  console.error('FAILED:', err.message);
  console.error('Restore with the .bak-push files if needed.');
  process.exit(1);
}
