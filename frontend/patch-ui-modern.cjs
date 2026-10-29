// patch-ui-modern.cjs  — run from the /frontend folder:  node patch-ui-modern.cjs
// 1) tailwind.config.js : defines the missing "shadow-card" (used everywhere but never defined) + soft shadows
// 2) src/index.css       : modern base polish (smooth fonts, thin scrollbar, gold focus ring, touch feedback, fade-in)
// 3) ChapterBrowser.jsx  : slim top bar + native-style bottom navigation with SVG icons
// Backups are saved as <file>.bak. Safe to re-run (it skips if already applied).

const fs = require('fs');
const path = require('path');

const read = (rel) => fs.readFileSync(path.join(__dirname, rel), 'utf8');
const write = (rel, text) => {
  const p = path.join(__dirname, rel);
  fs.writeFileSync(p + '.bak', fs.readFileSync(p, 'utf8'));
  fs.writeFileSync(p, text);
  console.log('Patched ' + rel + ' (backup: ' + rel + '.bak)');
};
const once = (content, anchor, rel) => {
  const count = content.split(anchor).length - 1;
  if (count !== 1) throw new Error('[' + rel + '] Expected 1 match, found ' + count + ' for: ' + anchor.slice(0, 70));
};

// ───────────────────────── 1) tailwind.config.js ─────────────────────────
function patchTailwind() {
  const rel = 'tailwind.config.js';
  let c = read(rel);
  if (c.includes("'card':") || c.includes('card:')) { console.log('Skip ' + rel + ' (already has card shadow)'); return; }
  const anchor = 'extend: {';
  once(c, anchor, rel);
  c = c.replace(
    anchor,
    anchor + `
      boxShadow: {
        card: '0 1px 2px rgba(15,23,42,0.04), 0 4px 14px -4px rgba(15,23,42,0.10)',
        soft: '0 8px 30px -12px rgba(15,23,42,0.25)',
        nav: '0 -6px 24px -10px rgba(15,23,42,0.18)',
      },`
  );
  write(rel, c);
}

// ───────────────────────── 2) index.css ─────────────────────────
function patchCss() {
  const rel = 'src/index.css';
  let c = read(rel);
  if (c.includes('ui-modern')) { console.log('Skip ' + rel + ' (already applied)'); return; }
  c += `

/* ui-modern ------------------------------------------------------------ */
@layer base {
  html { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; text-rendering: optimizeLegibility; }
  ::selection { background: rgba(201, 162, 39, 0.28); }
  :focus-visible { outline: 2px solid #c9a227; outline-offset: 2px; border-radius: 8px; }
  button, [role="button"], a { -webkit-tap-highlight-color: transparent; touch-action: manipulation; }
  button { transition: transform 120ms ease, background-color 150ms ease, color 150ms ease, border-color 150ms ease; }
  button:not(:disabled):active { transform: scale(0.975); }
  * { scrollbar-width: thin; scrollbar-color: rgba(100, 116, 139, 0.35) transparent; }
  *::-webkit-scrollbar { width: 6px; height: 6px; }
  *::-webkit-scrollbar-thumb { background: rgba(100, 116, 139, 0.35); border-radius: 999px; }
}

/* room for the bottom navigation bar */
.has-bottom-nav { padding-bottom: calc(5.5rem + env(safe-area-inset-bottom)) !important; }

/* soft page-enter animation for whatever is inside <main> */
@keyframes ui-fade-up { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
main > * { animation: ui-fade-up 260ms ease-out both; }
@media (prefers-reduced-motion: reduce) {
  main > * { animation: none; }
  button { transition: none; }
  button:not(:disabled):active { transform: none; }
}
`;
  write(rel, c);
}

// ───────────────────────── 3) ChapterBrowser.jsx ─────────────────────────
const NAV_COMPONENTS = `// ── ui-modern: icons + bottom navigation ─────────────────────────────
const NAV_ICONS = {
  book: <><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></>,
  search: <><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></>,
  quiz: <><rect width="8" height="4" x="8" y="2" rx="1" ry="1" /><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><path d="m9 14 2 2 4-4" /></>,
  settings: <><line x1="21" x2="14" y1="4" y2="4" /><line x1="10" x2="3" y1="4" y2="4" /><line x1="21" x2="12" y1="12" y2="12" /><line x1="8" x2="3" y1="12" y2="12" /><line x1="21" x2="16" y1="20" y2="20" /><line x1="12" x2="3" y1="20" y2="20" /><line x1="14" x2="14" y1="2" y2="6" /><line x1="8" x2="8" y1="10" y2="14" /><line x1="16" x2="16" y1="18" y2="22" /></>,
  crown: <><path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7z" /><path d="M5 20h14" /></>,
  wrench: <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />,
  menu: <><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" /></>,
  x: <><path d="M18 6 6 18" /><path d="m6 6 12 12" /></>,
};

function NavIcon({ name, className = "h-[22px] w-[22px]" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {NAV_ICONS[name]}
    </svg>
  );
}

const VIEW_TITLES = { browse: "RA 10863", search: "Search", quiz: "Quiz", settings: "Settings", admin: "Admin", dev: "Dev Panel" };

function BottomNav({ view, setView, showAdmin, showDev }) {
  const items = [
    { id: "browse", label: "Library", icon: "book" },
    { id: "search", label: "Search", icon: "search" },
    { id: "quiz", label: "Quiz", icon: "quiz" },
    { id: "settings", label: "Settings", icon: "settings" },
  ];
  if (showAdmin) items.push({ id: "admin", label: "Admin", icon: "crown" });
  if (showDev) items.push({ id: "dev", label: "Dev", icon: "wrench" });
  return (
    <nav
      aria-label="Main navigation"
      className="fixed inset-x-0 bottom-0 z-[35] border-t border-slate-200/80 bg-white/85 shadow-nav backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/85"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="mx-auto flex max-w-xl items-stretch justify-around px-2 py-1.5">
        {items.map((it) => {
          const active = view === it.id;
          return (
            <button
              key={it.id}
              onClick={() => setView(it.id)}
              aria-label={it.label}
              aria-current={active ? "page" : undefined}
              className="flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-xl py-1"
            >
              <span className={"flex h-8 w-14 items-center justify-center rounded-full transition-colors duration-200 " + (active ? "bg-navy-900/10 text-navy-900 dark:bg-gold-500/20 dark:text-gold-400" : "text-slate-500 dark:text-slate-400")}>
                <NavIcon name={it.icon} />
              </span>
              <span className={"max-w-full truncate text-[11px] leading-tight " + (active ? "font-semibold text-navy-900 dark:text-gold-400" : "font-medium text-slate-500 dark:text-slate-400")}>{it.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

`;

const NEW_TOP_BAR = `<div className="flex min-w-0 items-center gap-2 pl-1">
                <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-navy-900 text-base text-white shadow-sm dark:bg-gold-500 dark:text-navy-950" aria-hidden>⚖️</span>
                <span className="truncate text-[15px] font-bold tracking-tight text-navy-900 dark:text-slate-50">{VIEW_TITLES[view] || "RA 10863"}</span>
              </div>
              `;

function patchChapterBrowser() {
  const rel = 'src/pages/ChapterBrowser.jsx';
  let c = read(rel);
  if (c.includes('BottomNav')) { console.log('Skip ' + rel + ' (already applied)'); return; }

  // (a) icons + BottomNav component, placed right before the main component
  const compAnchor = 'export default function ChapterBrowser(';
  once(c, compAnchor, rel);
  c = c.replace(compAnchor, NAV_COMPONENTS + compAnchor);

  // (b) replace the emoji pill-tabs (+ admin button) with a slim brand/title.
  //     Works whether or not patch-mobile-width.js was already applied.
  const startMarker = '<div className="flex flex-shrink-0 rounded-full bg-slate-100 p-1 text-sm dark:bg-slate-800">';
  once(c, startMarker, rel);
  const start = c.indexOf(startMarker);
  const endMarker = '<span className="flex-1" />';
  const end = c.indexOf(endMarker, start);
  if (end === -1) throw new Error('[' + rel + '] could not find the spacer after the tab pill');
  c = c.slice(0, start) + NEW_TOP_BAR + c.slice(end);

  // (c) hamburger / close icons instead of text glyphs
  const burger = '{sidebarOpen ? "✕" : "☰"}';
  once(c, burger, rel);
  c = c.replace(burger, '<NavIcon name={sidebarOpen ? "x" : "menu"} className="h-5 w-5" />');

  // (d) mount the bottom nav (hidden in reading focus mode; quiz overlay already covers it)
  const quizAnchor = '{view === "quiz" && <QuizHub onExit={() => setView("browse")} />}';
  once(c, quizAnchor, rel);
  c = c.replace(
    quizAnchor,
    '{!(focusMode && mode === "reading") && <BottomNav view={view} setView={setView} showAdmin={!!profile?.isAdmin} showDev={IS_DEV} />}\n        ' + quizAnchor
  );

  // (e) leave room under the content for the nav
  const mainAnchor = 'className="safe-bottom flex-1 overflow-y-auto overscroll-contain';
  once(c, mainAnchor, rel);
  c = c.replace(mainAnchor, 'className="has-bottom-nav safe-bottom flex-1 overflow-y-auto overscroll-contain');

  write(rel, c);
}

try {
  patchTailwind();
  patchCss();
  patchChapterBrowser();
  console.log('\nDone. Test:  npm run dev   |  Ship:  git add -A && git commit -m "Modern UI" && git push');
} catch (err) {
  console.error('Patch failed: ' + err.message);
  console.error('Walang na-touch na file sa step na yon — i-paste mo lang ulit sa akin ang error, aayusin ko ang anchor.');
  process.exit(1);
}
