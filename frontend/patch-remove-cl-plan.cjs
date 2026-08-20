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
  patchFile('src/payments.js', [
    [
      '  { id: "CL", label: "Customs Law", price: 39, subjects: ["CL"] },\n',
      '',
    ],
  ]);

  patchFile('src/components/AccountOverlay.jsx', [
    [
      'const SUBJECT_LABELS = { CL: "Customs Law", TL: "Tariff Law", CDP: "Customs Documentation & Procedures", PC: "Practical Computations" };',
      'const SUBJECT_LABELS = { TL: "Tariff Law", CDP: "Customs Documentation & Procedures", PC: "Practical Computations" };',
    ],
  ]);

  console.log('Tapos na. Naalis na ang standalone CL plan (₱39) sa Subscribe screen.');
} catch (err) {
  console.error('Patch failed: ' + err.message);
  console.error('Walang na-touch na file — i-paste mo lang ulit sa akin ang exact section.');
  process.exit(1);
}
