const fs = require('fs');
const path = require('path');

function patchFile(relPath, edits) {
  const filePath = path.join(__dirname, relPath);
  let content = fs.readFileSync(filePath, 'utf8');
  fs.writeFileSync(filePath + '.bak-askai', content);
  for (const [anchor, replacement] of edits) {
    const count = content.split(anchor).length - 1;
    if (count !== 1) {
      throw new Error('[' + relPath + '] Expected 1 match, found ' + count + ' for: ' + anchor.slice(0, 70));
    }
    content = content.split(anchor).join(replacement);
  }
  fs.writeFileSync(filePath, content);
  console.log('OK  ' + relPath + '  (backup: ' + relPath + '.bak-askai)');
}

const OLD_WRAP =
  '  return (\n    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-slate-900/60 backdrop-blur-sm sm:items-center" onClick={onClose}>';
const NEW_WRAP =
  '  return createPortal(\n    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 p-3 backdrop-blur-sm" onClick={(e) => { e.stopPropagation(); onClose(); }}>';

const OLD_BOX =
  'className="max-h-[88vh] w-full overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl dark:bg-slate-900 sm:max-w-lg sm:rounded-3xl"';
const NEW_BOX =
  'className="max-h-full w-full max-w-lg overflow-y-auto overscroll-contain rounded-3xl bg-white p-5 shadow-2xl dark:bg-slate-900"';

const OLD_STATE = '  const [copiedApp, setCopiedApp] = useState(null);\n';
const NEW_STATE =
  OLD_STATE +
  '  // lock the page behind the modal so only the modal itself scrolls\n' +
  '  useEffect(() => {\n' +
  '    const prev = document.body.style.overflow;\n' +
  '    document.body.style.overflow = "hidden";\n' +
  '    return () => { document.body.style.overflow = prev; };\n' +
  '  }, []);\n';

try {
  patchFile('src/pages/ChapterBrowser.jsx', [
    [
      'import { useState, useEffect, useCallback, useRef, useMemo, useContext, createContext } from "react";',
      'import { useState, useEffect, useCallback, useRef, useMemo, useContext, createContext } from "react";\nimport { createPortal } from "react-dom";',
    ],
    [OLD_WRAP, NEW_WRAP],
    [OLD_BOX, NEW_BOX],
    [OLD_STATE, NEW_STATE],
    [
      '    </div>\n  );\n}\nconst STUDY_TYPE_STYLES = {',
      '    </div>,\n    document.body\n  );\n}\nconst STUDY_TYPE_STYLES = {',
    ],
  ]);

  patchFile('src/pages/IssuanceBrowser.jsx', [
    [
      'import { useState, useEffect, useMemo } from "react";',
      'import { useState, useEffect, useMemo } from "react";\nimport { createPortal } from "react-dom";',
    ],
    [OLD_WRAP, NEW_WRAP],
    [OLD_BOX, NEW_BOX],
    [OLD_STATE, NEW_STATE],
    [
      '    </div>\n  );\n}\n\n// ── One paragraph',
      '    </div>,\n    document.body\n  );\n}\n\n// ── One paragraph',
    ],
  ]);

  console.log('\nDone. Run: npm run build');
} catch (err) {
  console.error('FAILED:', err.message);
  console.error('Restore with the .bak-askai files if needed.');
  process.exit(1);
}
