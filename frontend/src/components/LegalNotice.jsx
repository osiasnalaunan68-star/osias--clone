// LegalNotice.jsx — Privacy Notice / Terms / About + the "I agree" screen shown
// once after login, and a read-only copy that lives in Settings.
//
// Exports:
//   LegalGate             full-screen acceptance screen (used by AccessGate)
//   LegalModal            read-only full-screen reader (opened from Settings / guest screen)
//   LegalSettingsSection  the "Privacy & Terms" card for SettingsView
//   LegalLinkButton       small text link that opens LegalModal (guest screen)

import { useEffect, useState } from "react";
import { useAuth } from "../authContext";
import { formatDateShort, toMs } from "../access";
import {
  LEGAL_VERSION, LEGAL_UPDATED, LEGAL_SECTIONS, KEY_POINTS, CONSENT_ITEMS,
  CONTACT_EMAIL, DEVELOPER_PORTFOLIO,
} from "../legalContent";

// ── Rendering of the legal text ──────────────────────────────────────
function Block({ block }) {
  if (block.type === "ul") {
    return (
      <ul className="ml-4 list-disc space-y-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
        {block.items.map((t, i) => <li key={i}>{t}</li>)}
      </ul>
    );
  }
  return <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{block.text}</p>;
}

function Section({ section, open, onToggle }) {
  const warn = section.tone === "warn";
  return (
    <section
      className={
        "overflow-hidden rounded-2xl border shadow-card " +
        (warn
          ? "border-amber-300 bg-amber-50 dark:border-amber-700 dark:bg-amber-950/30"
          : "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800")
      }
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex min-h-[48px] w-full items-center gap-3 px-4 py-3 text-left"
      >
        <span className="text-xl" aria-hidden>{section.icon}</span>
        <span className={"flex-1 text-sm font-bold " + (warn ? "text-amber-900 dark:text-amber-200" : "text-slate-800 dark:text-slate-100")}>
          {section.title}
        </span>
        <span aria-hidden className={"text-slate-400 transition-transform " + (open ? "rotate-180" : "")}>▾</span>
      </button>
      {open && (
        <div className="space-y-3 px-4 pb-4">
          {section.blocks.map((b, i) => <Block key={i} block={b} />)}
        </div>
      )}
    </section>
  );
}

export function LegalContent({ defaultOpen = ["ai"] }) {
  const [openIds, setOpenIds] = useState(() => new Set(defaultOpen));
  const toggle = (id) =>
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  const allOpen = openIds.size === LEGAL_SECTIONS.length;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-400 dark:text-slate-500">Version {LEGAL_VERSION} · Updated {LEGAL_UPDATED}</p>
        <button
          type="button"
          onClick={() => setOpenIds(allOpen ? new Set() : new Set(LEGAL_SECTIONS.map((s) => s.id)))}
          className="text-xs font-semibold text-navy-900 underline dark:text-gold-400"
        >
          {allOpen ? "Collapse all" : "Expand all"}
        </button>
      </div>

      {LEGAL_SECTIONS.map((s) => (
        <Section key={s.id} section={s} open={openIds.has(s.id)} onToggle={() => toggle(s.id)} />
      ))}

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card dark:border-slate-700 dark:bg-slate-800">
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">Contact the developer</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300">For privacy requests, corrections, deletion of your data, or any question about this notice:</p>
        {CONTACT_EMAIL && (
          <a href={"mailto:" + CONTACT_EMAIL} className="mt-2 block text-sm font-semibold text-navy-900 underline dark:text-gold-400">{CONTACT_EMAIL}</a>
        )}
        <a href={DEVELOPER_PORTFOLIO} target="_blank" rel="noopener noreferrer" className="mt-2 block text-sm font-semibold text-navy-900 underline dark:text-gold-400">
          Developer portfolio
        </a>
      </section>
    </div>
  );
}

// ── Read-only full-screen reader ─────────────────────────────────────
export function LegalModal({ onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-slate-50 dark:bg-slate-950" role="dialog" aria-modal="true" aria-label="Privacy Notice and Terms">
      <header className="safe-top flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
        <h1 className="flex-1 text-base font-bold text-navy-900 dark:text-slate-50">Privacy Notice, Terms &amp; About</h1>
        <button onClick={onClose} aria-label="Close" className="flex h-10 w-10 items-center justify-center rounded-full text-lg text-slate-500 active:bg-slate-100 dark:text-slate-300 dark:active:bg-slate-800">✕</button>
      </header>
      <main className="flex-1 overflow-y-auto px-4 py-4">
        <div className="mx-auto max-w-2xl pb-6">
          <LegalContent />
        </div>
      </main>
      <div className="safe-bottom border-t border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
        <button onClick={onClose} className="mx-auto flex h-11 w-full max-w-2xl items-center justify-center rounded-xl bg-navy-900 text-sm font-semibold text-white active:bg-navy-800 dark:bg-navy-700">Close</button>
      </div>
    </div>
  );
}

// ── Small link (guest screen) ────────────────────────────────────────
export function LegalLinkButton({ className = "", children = "Privacy Notice & Terms" }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={"underline " + className}>{children}</button>
      {open && <LegalModal onClose={() => setOpen(false)} />}
    </>
  );
}

// ── Settings card ────────────────────────────────────────────────────
export function LegalSettingsSection() {
  const { legalAccepted } = useAuth();
  const [open, setOpen] = useState(false);
  const at = legalAccepted ? toMs(legalAccepted.at) : null;

  return (
    <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-card dark:border-slate-700 dark:bg-slate-800">
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">Privacy &amp; Terms</h2>
      <p className="mb-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
        About this project, the AI-generated content disclaimer, the Privacy Notice and the Terms of Use.
      </p>
      <button
        onClick={() => setOpen(true)}
        className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 active:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:active:bg-slate-700"
      >
        📄 Read Privacy Notice &amp; Terms
      </button>
      {legalAccepted && (
        <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
          ✅ You accepted version {legalAccepted.version}{at ? " on " + formatDateShort(at) : ""}.
        </p>
      )}
      {open && <LegalModal onClose={() => setOpen(false)} />}
    </section>
  );
}

// ── Acceptance screen (right after login) ────────────────────────────
export function LegalGate() {
  const { user, acceptLegal, signOutUser, setOverlayOpen } = useAuth();
  const [checked, setChecked] = useState({});
  const [showFull, setShowFull] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Make sure the account overlay is not sitting on top of this screen.
  useEffect(() => { setOverlayOpen(false); }, [setOverlayOpen]);

  const allChecked = CONSENT_ITEMS.every((c) => checked[c.id]);

  const onContinue = async () => {
    if (!allChecked || saving) return;
    setSaving(true);
    setError(null);
    try {
      await acceptLegal();
    } catch (e) {
      setError("Could not save your choice. Please try again.");
      setSaving(false);
    }
  };

  return (
    <div className="safe-top flex h-[100dvh] flex-col bg-slate-50 dark:bg-slate-950">
      <header className="px-5 pb-2 pt-4 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-gold-600 dark:text-gold-400">Before you continue</p>
        <h1 className="text-xl font-bold text-navy-900 dark:text-slate-50">Privacy Notice &amp; Terms</h1>
        {user && user.email && <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">Signed in as {user.email}</p>}
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-3">
        <div className="mx-auto max-w-md space-y-3">
          {KEY_POINTS.map((k, i) => (
            <div
              key={i}
              className={
                "rounded-2xl border p-4 shadow-card " +
                (i === 0
                  ? "border-amber-300 bg-amber-50 dark:border-amber-700 dark:bg-amber-950/30"
                  : "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900")
              }
            >
              <p className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-100">
                <span className="text-xl" aria-hidden>{k.icon}</span>{k.title}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{k.body}</p>
            </div>
          ))}

          <button
            type="button"
            onClick={() => setShowFull((v) => !v)}
            className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl border-2 border-gold-500 bg-gold-50 px-4 py-2.5 text-sm font-semibold text-navy-900 active:bg-gold-100 dark:border-gold-400 dark:bg-slate-800 dark:text-gold-400"
          >
            {showFull ? "▲ Hide the full text" : "📄 Read the full Privacy Notice, Terms & About"}
          </button>

          {showFull && <LegalContent />}
        </div>
      </main>

      <footer className="safe-bottom border-t border-slate-200 bg-white/95 p-4 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95">
        <div className="mx-auto max-w-md space-y-3">
          {CONSENT_ITEMS.map((c) => (
            <label key={c.id} className="flex cursor-pointer items-start gap-3 text-sm leading-snug text-slate-700 dark:text-slate-200">
              <input
                type="checkbox"
                checked={!!checked[c.id]}
                onChange={(e) => setChecked((p) => ({ ...p, [c.id]: e.target.checked }))}
                className="mt-0.5 h-5 w-5 flex-shrink-0 accent-navy-900"
              />
              <span>{c.text}</span>
            </label>
          ))}

          {error && <p className="text-center text-xs text-red-600 dark:text-red-400">{error}</p>}

          <button
            onClick={onContinue}
            disabled={!allChecked || saving}
            className="flex h-12 w-full items-center justify-center rounded-xl bg-gold-500 text-sm font-bold text-navy-900 shadow-sm active:bg-gold-600 disabled:opacity-40"
          >
            {saving ? "Saving…" : "I agree · Continue"}
          </button>
          <button
            onClick={signOutUser}
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-500 dark:border-slate-600 dark:text-slate-300"
          >
            I do not agree · Sign out
          </button>
        </div>
      </footer>
    </div>
  );
}

export default LegalGate;
