// Adds the CMO / CAO source switcher to the app. Run from the frontend/ folder:
//   node patch-issuances.cjs
// Safe: checks every anchor first, writes nothing if one is missing, keeps .bak backups.
const fs = require('fs');
const path = require('path');

const read = (rel) => fs.readFileSync(path.join(__dirname, rel), 'utf8');
const write = (rel, text) => fs.writeFileSync(path.join(__dirname, rel), text);

function applyEdits(rel, content, edits) {
  const crlf = content.includes('\r\n');
  const fix = (s) => (crlf ? s.replace(/\r?\n/g, '\r\n') : s);
  for (const [anchor, replacement] of edits) {
    const a = fix(anchor);
    const count = content.split(a).length - 1;
    if (count !== 1) {
      throw new Error('[' + rel + '] Expected 1 match, found ' + count + ' for anchor: ' + anchor.slice(0, 70).replace(/\n/g, '\\n'));
    }
    content = content.split(a).join(fix(replacement));
  }
  return content;
}

const CB = 'src/pages/ChapterBrowser.jsx';
const DP = 'src/pages/DevPanel.jsx';

try {
  const cbOrig = read(CB);
  const dpOrig = read(DP);
  if (cbOrig.includes('IssuanceBrowser')) {
    console.log('ChapterBrowser.jsx is already patched. Nothing to do.');
    process.exit(0);
  }

  // 1) ReaderParts.jsx = the highlight / notes pieces, copied verbatim from ChapterBrowser
  const startIdx = cbOrig.indexOf('function useNodeHighlights(');
  const endIdx = cbOrig.indexOf('function AiContextModal(');
  if (startIdx < 0 || endIdx < 0 || endIdx < startIdx) {
    throw new Error('Could not find the highlight/notes block in ChapterBrowser.jsx');
  }
  let parts = cbOrig.slice(startIdx, endIdx).replace(/\s+$/, '') + '\n';
  for (const name of ['useNodeHighlights', 'useNodeNotes', 'formatNoteDate', 'applyHighlights', 'SelectionToolbar', 'HighlightableContent', 'NotePanel']) {
    if (parts.split('function ' + name + '(').length !== 2) throw new Error('Missing function ' + name);
    parts = parts.replace('function ' + name + '(', 'export function ' + name + '(');
  }
  const readerParts =
    '// Shared reader pieces (highlight, notes). Copied from ChapterBrowser.jsx so the CMTA screen stays untouched.\n' +
    'import { useState, useEffect, useCallback, useRef } from "react";\n' +
    'import {\n  addHighlight, removeHighlight, getHighlightsForNode,\n  getNotesForNode, addNote, updateNote, deleteNote,\n} from "../db";\n\n' +
    parts;

  // 2) ChapterBrowser.jsx edits
  const cbNew = applyEdits(CB, cbOrig, [
    [
      'import { useAuth } from "../authContext";',
      'import { useAuth } from "../authContext";\nimport { IssuanceSidebar, IssuanceReader } from "./IssuanceBrowser";\nimport { ISSUANCE_KINDS, getIssuance } from "../issuancesStore";',
    ],
    [
      'const MODE_KEY = "customsLaw_mode";',
      'const MODE_KEY = "customsLaw_mode";\nconst SOURCE_KEY = "customsLaw_source";\nconst ISSUANCE_KEY = "customsLaw_issuanceId";',
    ],
    [
      '  const [showTutorial, setShowTutorial] = useState(false);',
      '  const [showTutorial, setShowTutorial] = useState(false);\n' +
        '  // Source = which library is open: "cmta" (existing), "cmo" or "cao"\n' +
        '  const [source, setSource] = useState(() => (demo ? "cmta" : localStorage.getItem(SOURCE_KEY) || "cmta"));\n' +
        '  const [issuanceId, setIssuanceId] = useState(() => localStorage.getItem(ISSUANCE_KEY) || null);',
    ],
    [
      '  const scrollSaveTimeout = useRef(null);',
      '  const scrollSaveTimeout = useRef(null);\n\n' +
        '  useEffect(() => { if (!demo) localStorage.setItem(SOURCE_KEY, source); }, [source, demo]);\n' +
        '  useEffect(() => { if (issuanceId) localStorage.setItem(ISSUANCE_KEY, issuanceId); }, [issuanceId]);\n' +
        '  const isIssuance = source !== "cmta";\n' +
        '  const currentIssuance = isIssuance && issuanceId ? getIssuance(issuanceId) : null;\n' +
        '  const issuanceTitle = currentIssuance && currentIssuance.type.toLowerCase() === source\n' +
        '    ? `${currentIssuance.label}${currentIssuance.title ? " — " + currentIssuance.title : ""}`\n' +
        '    : (ISSUANCE_KINDS.find((k) => k.id === source)?.full || "");\n' +
        '  const openIssuance = useCallback((kind, id) => {\n' +
        '    setSource(kind);\n' +
        '    setIssuanceId(id);\n' +
        '    setView("browse");\n' +
        '    setSidebarOpen(window.innerWidth >= 768);\n' +
        '    if (mainRef.current) mainRef.current.scrollTop = 0;\n' +
        '  }, []);',
    ],
    [
      '      setSelectedTitleNumber(titleNumber);\n      setView("browse");',
      '      setSelectedTitleNumber(titleNumber);\n      setSource("cmta");\n      setView("browse");',
    ],
    // sidebar: 3-way switcher under the header
    [
      'Customs Modernization &amp; Tariff Act</p></div></div>\n            </div>\n            <div className="p-3">',
      'Customs Modernization &amp; Tariff Act</p></div></div>\n' +
        '              <div className="mt-3 flex rounded-xl bg-slate-100 p-1 text-sm dark:bg-slate-800" role="tablist" aria-label="Library">\n' +
        '                {ISSUANCE_KINDS.map((k) => (\n' +
        '                  <button key={k.id} role="tab" aria-selected={source === k.id} onClick={() => setSource(k.id)} className={`min-h-[36px] flex-1 rounded-lg px-2 py-1 font-semibold transition-colors ${source === k.id ? "bg-navy-900 text-white shadow-sm dark:bg-navy-700" : "text-slate-500 dark:text-slate-400"}`}>\n' +
        '                    <span aria-hidden>{k.icon}</span> {k.label}\n' +
        '                  </button>\n' +
        '                ))}\n' +
        '              </div>\n' +
        '            </div>\n' +
        '            {source === "cmta" ? (\n' +
        '            <div className="p-3">',
    ],
    [
      '            </div>\n          </aside>',
      '            </div>\n' +
        '            ) : (\n' +
        '              <IssuanceSidebar kind={source} selectedId={issuanceId} onSelect={(id) => openIssuance(source, id)} />\n' +
        '            )}\n' +
        '          </aside>',
    ],
    // top bar title
    [
      '{chapterTree ? chapterTree.title ||',
      '{isIssuance ? issuanceTitle : chapterTree ? chapterTree.title ||',
    ],
    // reading progress bar
    [
      'mode === "reading" && chapterTree && <ReadingProgressBar',
      'mode === "reading" && (chapterTree || (isIssuance && issuanceId)) && <ReadingProgressBar',
    ],
    // main area
    [
      'onReplayTutorial={replayTutorial} /> : (\n              <>\n                {loading && (',
      'onReplayTutorial={replayTutorial} /> : isIssuance ? (\n' +
        '              <IssuanceReader kind={source} issuanceId={issuanceId} mode={mode} fontScale={fontScale} focusMode={focusMode} onOpenIssuance={(hit) => openIssuance(hit.type.toLowerCase(), hit.id)} />\n' +
        '            ) : (\n              <>\n                {loading && (',
    ],
    // exit-focus button must also appear for CMO / CAO
    [
      '{focusMode && mode === "reading" && chapterTree && (',
      '{focusMode && mode === "reading" && (chapterTree || (isIssuance && issuanceId)) && (',
    ],
  ]);

  // 3) DevPanel.jsx edits
  const dpNew = applyEdits(DP, dpOrig, [
    ['import QuizPanel from "./QuizPanel";', 'import QuizPanel from "./QuizPanel";\nimport IssuancePanel from "./IssuancePanel";'],
    [
      'const TABS = [{ id: "ra10863", label: "RA10863" }];',
      'const TABS = [{ id: "ra10863", label: "RA10863" }, { id: "issuances", label: "CMO / CAO" }];',
    ],
    ['{tab === "ra10863" && <QuizPanel />}', '{tab === "ra10863" && <QuizPanel />}\n      {tab === "issuances" && <IssuancePanel />}'],
  ]);

  // everything matched -> now write
  fs.writeFileSync(path.join(__dirname, CB + '.bak'), cbOrig);
  fs.writeFileSync(path.join(__dirname, DP + '.bak'), dpOrig);
  write(CB, cbNew);
  write(DP, dpNew);
  write('src/components/ReaderParts.jsx', readerParts);
  fs.mkdirSync(path.join(__dirname, 'src/data/issuances'), { recursive: true });
  console.log('Done:');
  console.log(' - created src/components/ReaderParts.jsx');
  console.log(' - patched ' + CB + ' (backup: .bak)');
  console.log(' - patched ' + DP + ' (backup: .bak)');
  console.log('Next: npm run dev');
} catch (err) {
  console.error('Patch failed: ' + err.message);
  console.error('Walang na-touch na file. I-send mo sa akin ang error na ito at aayusin ko ang anchor.');
  process.exit(1);
}
