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
  patchFile('src/components/AccountOverlay.jsx', [
    [
      'fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm sm:items-center',
      'fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm',
    ],
    [
      'max-h-[85vh] w-full overflow-y-auto rounded-t-2xl bg-white p-5 dark:bg-slate-800 sm:max-w-sm sm:rounded-2xl',
      'max-h-[85vh] w-full overflow-y-auto rounded-t-2xl bg-white p-5 dark:bg-slate-800',
    ],
  ]);

  patchFile('src/pages/ChapterBrowser.jsx', [
    [
      'fixed inset-0 z-[70] flex items-end justify-center bg-slate-900/60 backdrop-blur-sm sm:items-center',
      'fixed inset-0 z-[70] flex items-end justify-center bg-slate-900/60 backdrop-blur-sm',
    ],
    [
      'max-h-[88vh] w-full overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl dark:bg-slate-900 sm:max-w-lg sm:rounded-3xl',
      'max-h-[88vh] w-full overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl dark:bg-slate-900',
    ],
    [
      '  chapter: "text-xl sm:text-2xl font-bold text-navy-900 dark:text-slate-50",\n  section: "text-lg sm:text-xl font-semibold text-slate-800 dark:text-slate-200",\n  paragraph: "text-base sm:text-lg text-slate-700 dark:text-slate-300",',
      '  chapter: "text-xl font-bold text-navy-900 dark:text-slate-50",\n  section: "text-lg font-semibold text-slate-800 dark:text-slate-200",\n  paragraph: "text-base text-slate-700 dark:text-slate-300",',
    ],
    [
      '<span aria-hidden>📘</span><span className="hidden sm:inline ml-1">Study</span>',
      '<span aria-hidden>📘</span><span className="hidden ml-1">Study</span>',
    ],
    [
      '<span aria-hidden>📖</span><span className="hidden sm:inline ml-1">Reading</span>',
      '<span aria-hidden>📖</span><span className="hidden ml-1">Reading</span>',
    ],
    [
      'fixed inset-0 z-[60] flex flex-col justify-end bg-slate-900/70 backdrop-blur-sm sm:items-center sm:justify-center',
      'fixed inset-0 z-[60] flex flex-col justify-end bg-slate-900/70 backdrop-blur-sm',
    ],
    [
      'w-full rounded-t-3xl bg-white p-6 shadow-2xl dark:bg-slate-900 sm:max-w-md sm:rounded-3xl',
      'w-full rounded-t-3xl bg-white p-6 shadow-2xl dark:bg-slate-900',
    ],
    [
      'const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth >= 768);',
      'const [sidebarOpen, setSidebarOpen] = useState(false);',
    ],
    [
      'setSidebarOpen(window.innerWidth >= 768);',
      'setSidebarOpen(false);',
    ],
    [
      '<div className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-[1px] md:hidden" onClick={() => setSidebarOpen(false)} />',
      '<div className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-[1px]" onClick={() => setSidebarOpen(false)} />',
    ],
    [
      '<aside className={`safe-top fixed inset-y-0 left-0 z-40 w-[85vw] max-w-[320px] overflow-y-auto overscroll-contain border-r border-slate-200 bg-white transition-transform duration-200 dark:border-slate-800 dark:bg-slate-900 md:static md:w-80 md:max-w-none md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>',
      '<aside className={`safe-top fixed inset-y-0 left-0 z-40 w-[85vw] max-w-[320px] overflow-y-auto overscroll-contain border-r border-slate-200 bg-white transition-transform duration-200 dark:border-slate-800 dark:bg-slate-900 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>',
    ],
    [
      '<span aria-hidden>📚</span><span className="hidden sm:inline ml-1">Browse</span>',
      '<span aria-hidden>📚</span><span className="hidden ml-1">Browse</span>',
    ],
    [
      '<span aria-hidden>🔍</span><span className="hidden sm:inline ml-1">Search</span>',
      '<span aria-hidden>🔍</span><span className="hidden ml-1">Search</span>',
    ],
    [
      '<span aria-hidden>📝</span><span className="hidden sm:inline ml-1">Quiz/Exam</span>',
      '<span aria-hidden>📝</span><span className="hidden ml-1">Quiz/Exam</span>',
    ],
    [
      '🎯 <span className="hidden sm:inline">Focus</span>',
      '🎯 <span className="hidden">Focus</span>',
    ],
    [
      '<main ref={mainRef} className="safe-bottom flex-1 overflow-y-auto overscroll-contain bg-slate-50 p-4 dark:bg-slate-950 md:p-6">',
      '<main ref={mainRef} className="safe-bottom flex-1 overflow-y-auto overscroll-contain bg-slate-50 p-4 dark:bg-slate-950">',
    ],
  ]);

  console.log('✅ Tapos na — wala nang sm:/md: breakpoint na nag-aauto-adjust base sa device width.');
} catch (err) {
  console.error('Patch failed: ' + err.message);
  console.error('Walang na-touch na file — i-paste mo ulit sa akin ang error, aayusin ko ang anchor.');
  process.exit(1);
}
