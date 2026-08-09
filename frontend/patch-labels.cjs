const fs = require('fs');
const path = require('path');

function patchFile(relPath, edits) {
  const filePath = path.join(__dirname, relPath);
  let content = fs.readFileSync(filePath, 'utf8');
  fs.writeFileSync(filePath + '.bak', content);
  for (const [anchor, replacement] of edits) {
    const count = content.split(anchor).length - 1;
    if (count !== 1) {
      throw new Error('[' + relPath + '] Expected 1 match, found ' + count + ' for anchor: ' + anchor.slice(0, 70));
    }
    content = content.split(anchor).join(replacement);
  }
  fs.writeFileSync(filePath, content);
  console.log('Patched ' + relPath + ' (backup: ' + relPath + '.bak)');
}

try {
  patchFile('src/payments.js', [
    [
      '{ id: "CDP", label: "Customs Declarant Practice", price: 39, subjects: ["CDP"] },',
      '{ id: "CDP", label: "Customs Documentation & Procedures", price: 39, subjects: ["CDP"] },',
    ],
    [
      '{ id: "PC", label: "Practical Customs", price: 29, subjects: ["PC"] },',
      '{ id: "PC", label: "Practical Computations", price: 29, subjects: ["PC"] },',
    ],
  ]);

  patchFile('src/components/AccountOverlay.jsx', [
    [
      'const SUBJECT_LABELS = { CL: "Customs Law", TL: "Tariff Law", CDP: "Customs Declarant Practice", PC: "Practical Customs" };',
      'const SUBJECT_LABELS = { CL: "Customs Law", TL: "Tariff Law", CDP: "Customs Documentation & Procedures", PC: "Practical Computations" };',
    ],
  ]);

  console.log('Done. Run npm run build, then firebase deploy --only hosting.');
} catch (err) {
  console.error('Patch failed: ' + err.message);
  process.exit(1);
}
