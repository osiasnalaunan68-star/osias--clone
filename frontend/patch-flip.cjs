// patch-flip.cjs — i-off ang lifetime para sa practice buyers (gawin PAGKATAPOS ng migration).
const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/access.js');
const a = 'export const PRACTICE_BUYERS_KEEP_APP_ACCESS = true;';
const c = fs.readFileSync(file, 'utf8');
const n = c.split(a).length - 1;
if (n !== 1) { console.error('ABORT: anchor matched ' + n + 'x. Walang binago.'); process.exit(1); }
fs.writeFileSync(file + '.bak', c);
fs.writeFileSync(file, c.replace(a, () => 'export const PRACTICE_BUYERS_KEEP_APP_ACCESS = false;'));
console.log('OK: PRACTICE_BUYERS_KEEP_APP_ACCESS = false');
