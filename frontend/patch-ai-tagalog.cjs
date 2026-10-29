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
  patchFile('src/issuancesStore.js', [
    [
      `- Paragraph / section "ai": add it to every paragraph with substantive rules, requirements, procedures, deadlines, penalties or definitions. Skip pure headings and boilerplate (effectivity, repealing clause, dissemination). Use the short format: 📖 Kahulugan · 💡 Simpleng Paliwanag · ⚠️ Dapat Tandaan (add 📦 Halimbawa only when it really helps).`,
      `- Paragraph / section "ai": every paragraph gets an "ai" object -- wala nang pure skip, maliban na lang kung puro bare heading label with zero text. Pumili ng tamang tier:
  - Substantive (rules, requirements, procedures, deadlines, penalties, definitions) -> short format: 📖 Kahulugan · 💡 Simpleng Paliwanag · ⚠️ Dapat Tandaan (📦 Halimbawa kung kailangan talaga).
  - Boilerplate / scope items / intro clauses / procedural connectors (effectivity, repealing clause, dissemination, "This Order covers:", atbp.) -> huwag nang iwanan sa English lang. Gumamit ng mini Tanong-Sagot breakdown (1-2 exchanges lang), hindi flat paraphrase:

    Tanong: [simpleng tanong na natural itatanong ng estudyante tungkol dito]
    Sagot: [1-2 pangungusap, plain Tagalog, parang kaklase mong nagpapaliwanag]

  Dapat conversational at madaling basahin ang Q&A na ito -- huwag word-for-word na salin lang ng English.`,
    ],
  ]);

  console.log('Tapos na -- lahat ng paragraph may Tagalog breakdown na, pati yung mga minsan skinip dati.');
} catch (err) {
  console.error('Patch failed: ' + err.message);
  console.error('Walang na-touch na file -- i-paste mo ulit sa akin yung exact current block ng issuancesStore.js, aayusin ko ang anchor.');
  process.exit(1);
}
