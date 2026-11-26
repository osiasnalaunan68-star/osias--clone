import logoImg from "../assets/logo.png";
import { useState, useEffect, useRef, lazy, Suspense } from "react";
import { useAuth } from "../authContext";
import { TRIAL_DAYS, DAY_MS, formatTimeLeft, formatDateShort, toMs } from "../access";
import { PLANS, FROM_PRICE } from "../payments";
import { useUpdateAvailable, getRemoteId, applyUpdate } from "../updateCheck";
import { LegalGate, LegalLinkButton } from "./LegalNotice";

const ChapterBrowser = lazy(() => import("../pages/ChapterBrowser"));
const QuizHub = lazy(() => import("../pages/QuizHub"));

const STEP_ICONS = {
  scale: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="2" fill="currentColor" /></>,
  book: <><path d="M3 5c3-1.4 6-1.4 9 0M12 5c3-1.4 6-1.4 9 0M3 5v13c3-1.4 6-1.4 9 0M12 5v13c3-1.4 6-1.4 9 0" /></>,
  highlighter: <><path d="M3 21v-3.5L14.5 6a2.1 2.1 0 0 1 3 3L6 21H3Z" /><path d="M13 7l4 4" /></>,
  note: <><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M8 8h8M8 12h8M8 16h5" /></>,
  spark: <path d="M12 3c.8 4 2.2 5.4 6.2 6.2-4 .8-5.4 2.2-6.2 6.2-.8-4-2.2-5.4-6.2-6.2 4-.8 5.4-2.2 6.2-6.2Z" />,
  search: <><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></>,
  edit: <><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" /></>,
  tag: <><path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z" /><circle cx="7.5" cy="7.5" r="1" fill="currentColor" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.5 2" /></>,
  info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8v.01" /></>,
  signal: <><path d="M4 20h2v-6H4v6Zm6.5 0h2V9h-2v11Zm6.5 0h2V4h-2v16Z" /></>,
  new: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" /></>,
};
function StepIcon({ name, className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      {STEP_ICONS[name] || null}
    </svg>
  );
}

function Splash({ text }) {
  return (
    <div className="safe-top flex min-h-[100dvh] flex-col items-center justify-center gap-4 bg-parchment px-6 text-center dark:bg-navy-950">
      <img src={logoImg} alt="Customs Tech" draggable={false} className="h-20 w-20 rounded-full object-contain" />
      <div
        className="h-9 w-9 animate-spin rounded-full border-4 border-parchment-200 border-t-navy-900 dark:border-navy-700 dark:border-t-gold-400"
        role="status"
        aria-label="Loading"
      />
      <p className="text-sm font-medium text-slate-600 dark:text-slate-300">{text}</p>
      <p className="flex items-start gap-1.5 max-w-xs rounded-xl bg-parchment-50/80 px-4 py-3 text-left text-xs leading-relaxed text-slate-500 shadow-sm dark:bg-navy-900/70 dark:text-slate-400">
        <StepIcon name="info" className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-seal dark:text-gold-400" />
        <span>
          <span className="font-semibold">Tip:</span> If loading is slow, turn Airplane Mode on and then off again, without leaving the app. This refreshes your connection so the app loads faster.
        </span>
      </p>
    </div>
  );
}

// ── Guest: pasok agad sa BUONG app (walang login, walang tutorial) ───
// Countdown: ilang segundo ang libreng preview ng guest kada araw.
// Gawing 0 kung ayaw mo ng countdown (libre ang guest, walang lock).
const GUEST_PREVIEW_SECONDS = 300;
const GUEST_CLOCK_KEY = "cuble_guest_clock";

function readGuestUsed() {
  try {
    const d = JSON.parse(localStorage.getItem(GUEST_CLOCK_KEY) || "null");
    if (d && d.day === new Date().toDateString()) return Number(d.used) || 0;
  } catch (_) {}
  return 0;
}

// Tapos na ang preview: login na lang ang pwede.
function GuestLock() {
  const { signInWithGoogle, signingIn, authError } = useAuth();
  return (
    <div className="safe-top safe-bottom flex min-h-[100dvh] flex-col items-center justify-center bg-parchment px-5 py-6 dark:bg-navy-950">
      <div className="w-full max-w-md rounded-xl border border-parchment-200 bg-parchment-50 p-6 text-center dark:border-navy-700 dark:bg-navy-900">
        <img src={logoImg} alt="Customs Tech" draggable={false} className="mx-auto mb-3 h-16 w-16 rounded-full object-contain" />
        <h1 className="text-xl font-bold text-navy-900 dark:text-parchment-50">Enjoying the app?</h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          Your free preview for today is over. Log in with Google to keep going and start your {TRIAL_DAYS}-day free trial of the whole app.
        </p>
        {authError && <p className="mt-3 text-xs text-red-600 dark:text-red-400">{authError}</p>}
        <p className="mx-auto mt-4 mb-2 max-w-xs text-[11px] leading-snug text-slate-500 dark:text-slate-400">
          After you log in you will be asked to accept the{" "}
          <LegalLinkButton className="font-semibold text-navy-900 dark:text-gold-400">Privacy Notice &amp; Terms</LegalLinkButton>.
        </p>
        <button onClick={signInWithGoogle} disabled={signingIn} className="flex h-12 w-full items-center justify-center gap-1.5 rounded-xl bg-gold-500 text-sm font-bold text-navy-900 shadow-sm active:bg-gold-600 disabled:opacity-50">
          {signingIn ? "Waiting for Google..." : <><StepIcon name="tag" className="h-4 w-4" /> Login with Google</>}
        </button>
      </div>
    </div>
  );
}

function GuestApp() {
  const { overlayOpen, setOverlayOpen } = useAuth();
  const [used, setUsed] = useState(readGuestUsed);
  const overlayRef = useRef(overlayOpen);
  overlayRef.current = overlayOpen;
  const limited = GUEST_PREVIEW_SECONDS > 0;
  const left = limited ? Math.max(0, GUEST_PREVIEW_SECONDS - used) : null;

  // Tumatakbo lang ang oras kapag nakikita ang app at hindi nagla-login.
  useEffect(() => {
    if (!limited) return undefined;
    const id = setInterval(() => {
      if (document.visibilityState === "hidden" || overlayRef.current) return;
      setUsed((u) => u + 1);
    }, 1000);
    return () => clearInterval(id);
  }, [limited]);

  // Naka-save para hindi ma-reset ng refresh.
  useEffect(() => {
    if (!limited) return;
    try { localStorage.setItem(GUEST_CLOCK_KEY, JSON.stringify({ day: new Date().toDateString(), used })); } catch (_) {}
  }, [used, limited]);

  if (limited && left <= 0) return <GuestLock />;

  const mm = limited ? Math.floor(left / 60) : 0;
  const ss = limited ? String(left % 60).padStart(2, "0") : "00";
  return (
    <>
      <ChapterBrowser guest />
      {limited && !overlayOpen && (
        <div
          className={"fixed left-1/2 z-[45] flex -translate-x-1/2 items-center gap-2 rounded-full bg-navy-900/95 px-3 py-1.5 text-xs font-semibold text-white shadow-lg backdrop-blur dark:bg-parchment-50/95 dark:text-navy-900" + (left <= 30 ? " animate-pulse" : "")}
          style={{ bottom: "calc(env(safe-area-inset-bottom) + 76px)" }}
        >
          <StepIcon name="clock" className="h-3.5 w-3.5" />
          <span>Free preview {mm}:{ss}</span>
          <button onClick={() => setOverlayOpen(true)} className="rounded-full bg-gold-500 px-2.5 py-1 text-[11px] text-navy-900 active:bg-gold-600">Sign in</button>
        </div>
      )}
    </>
  );
}

// ── Paywall: tapos na ang trial, plans lang ang makikita ─────────────
function Paywall({ onFree }) {
  const { user, profile, signOutUser, setOverlayOpen, setIntentPlanId } = useAuth();
  // Promo purchases are saved in pendingPurchases, so read both lists.
  const pending = [...(profile?.pendingPurchases || []), ...(profile?.pendingAccess || [])]
    .sort((a, b) => (a.requestedAt || 0) - (b.requestedAt || 0));

  const choose = (plan) => {
    setIntentPlanId(plan.id);
    setOverlayOpen(true);
  };

  return (
    <div className="safe-top safe-bottom flex min-h-[100dvh] flex-col items-center bg-parchment px-5 py-6 dark:bg-navy-950">
      <div className="w-full max-w-md space-y-4">
        <div className="text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-seal text-seal dark:border-gold-400 dark:text-gold-400" aria-hidden><StepIcon name="clock" className="h-6 w-6" /></span>
          <h1 className="mt-2 text-xl font-bold text-navy-900 dark:text-parchment-50">Your free trial has ended</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Choose a plan to continue. {user?.email}</p>
        </div>

        {pending.length > 0 && (
          <div className="flex items-center justify-center gap-1.5 rounded-xl border border-amber-300 bg-amber-50 p-3 text-center text-sm text-amber-800 dark:border-amber-700 dark:bg-amber-950/30 dark:text-amber-300">
            <StepIcon name="clock" className="h-4 w-4 flex-shrink-0" /> You have a pending payment ({pending[pending.length - 1].referenceCode}). Please wait for confirmation.
          </div>
        )}

        <div className="space-y-2">
          {PLANS.map((plan) => (
            <button key={plan.id} onClick={() => choose(plan)} className="w-full rounded-xl border-2 border-gold-500 bg-gold-50 px-4 py-4 text-left active:opacity-80 dark:border-gold-400 dark:bg-navy-900">
              <span className="flex items-center justify-between gap-3">
                <span>
                  <span className="block text-base font-extrabold text-navy-900 dark:text-parchment-50">{plan.label}</span>
                  <span className="mt-1 block text-xs text-slate-600 dark:text-slate-300">{plan.tagline}</span>
                  <span className="mt-1 block text-xs text-slate-600 dark:text-slate-300">Unlocks everything: RA 10863 (all levels) · CDP · TL · PC · TCP + full App Access</span>
                  <span className="mt-1 flex items-center gap-1 text-xs font-semibold text-gold-600 dark:text-gold-400"><StepIcon name="clock" className="h-3.5 w-3.5" /> Valid for {plan.days} days only</span>
                </span>
                <span className="text-3xl font-extrabold text-navy-900 dark:text-parchment-50">₱{plan.price}</span>
              </span>
            </button>
          ))}
        </div>

        {onFree && (
          <button onClick={onFree} className="flex w-full items-center justify-between gap-2 rounded-xl border-2 border-parchment-200 bg-parchment-50 px-4 py-3 text-left text-sm font-semibold text-navy-900 active:bg-parchment dark:border-navy-700 dark:bg-navy-900 dark:text-parchment-50">
            <StepIcon name="edit" className="h-4 w-4 flex-shrink-0" />
            <span className="flex-1">
              Try the free practice questions
              <span className="mt-0.5 block text-[11px] font-normal text-slate-500 dark:text-slate-400">RA 10863 Level 1 + the first 10 items of each subject</span>
            </span>
          </button>
        )}

        <p className="text-center text-xs text-slate-400">Pay via GCash · Maya · MariBank. Payments are confirmed manually by the admin.</p>
        <button onClick={signOutUser} className="w-full rounded-xl border border-parchment-200 px-4 py-2.5 text-sm font-medium text-slate-500 dark:border-navy-700 dark:text-slate-300">Sign out</button>
      </div>
    </div>
  );
}

// ── Tapos na ang trial: paywall + libreng practice questions ─────────
function ExpiredGate() {
  const [free, setFree] = useState(false);
  if (free) return <QuizHub limited onExit={() => setFree(false)} />;
  return <Paywall onFree={() => setFree(true)} />;
}

// ── "Updated!" kapag nadagdagan ang access (hal. na-approve ni admin ang bayad) ──
function UnlockToast() {
  const { user, profile } = useAuth();
  const exp = profile && profile.appAccess ? toMs(profile.appAccess.expiresAt) || 0 : 0;
  const seen = useRef(null);
  const [msg, setMsg] = useState(null);

  useEffect(() => { seen.current = null; }, [user ? user.uid : null]);

  useEffect(() => {
    if (!profile) return;
    if (seen.current === null) { seen.current = exp; return; }
    if (exp > seen.current && exp > Date.now()) setMsg("Your access was updated! Valid until " + formatDateShort(exp));
    seen.current = exp;
  }, [exp, profile]);

  useEffect(() => {
    if (!msg) return;
    const id = setTimeout(() => setMsg(null), 9000);
    return () => clearTimeout(id);
  }, [msg]);

  if (!msg) return null;
  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[70] flex justify-center px-4" style={{ paddingTop: "calc(env(safe-area-inset-top) + 12px)" }}>
      <button onClick={() => setMsg(null)} className="pointer-events-auto flex items-center gap-1.5 rounded-2xl bg-verdigris px-4 py-3 text-sm font-semibold text-white shadow-xl"><StepIcon name="tag" className="h-4 w-4" />{msg}</button>
    </div>
  );
}

// ── Paalala sa renewal: access <7 araw o trial <1 araw ang natitira ──
function RenewBanner() {
  const { user, access, overlayOpen, setOverlayOpen, setIntentPlanId } = useAuth();
  const [, setTick] = useState(0);
  const uid = user ? user.uid : null;
  const kind = !access ? null
    : access.state === "paid" && access.msLeft < 7 * DAY_MS ? "paid"
    : access.state === "trial" && access.msLeft < DAY_MS ? "trial" : null;
  if (!uid || !kind || overlayOpen) return null;
  const KEY = "cuble_renew_dismiss_" + uid;
  let last = 0;
  try { last = Number(localStorage.getItem(KEY)) || 0; } catch (_) {}
  if (Date.now() - last < 12 * 60 * 60 * 1000) return null;
  const open = () => { setIntentPlanId(null); setOverlayOpen(true); };
  const later = () => { try { localStorage.setItem(KEY, String(Date.now())); } catch (_) {} setTick((n) => n + 1); };
  return (
    <div className="fixed inset-x-3 z-[45] mx-auto max-w-md rounded-xl border border-gold-500 bg-parchment-50 p-3 dark:bg-navy-800" style={{ bottom: "calc(env(safe-area-inset-bottom) + 76px)" }}>
      <p className="flex items-center gap-1.5 text-sm font-semibold text-navy-900 dark:text-parchment-50">
        <StepIcon name={kind === "paid" ? "clock" : "tag"} className="h-4 w-4 flex-shrink-0 text-seal dark:text-gold-400" />
        {kind === "paid" ? "Your access ends in " : "Your free trial ends in "}{formatTimeLeft(access.msLeft)}
      </p>
      <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
        {kind === "paid" ? "Renew early and your remaining days are kept." : "Get All Access and keep studying without interruption."}
      </p>
      <div className="mt-2 flex gap-2">
        <button onClick={open} className="flex-1 rounded-xl bg-navy-900 py-2 text-sm font-semibold text-white active:bg-navy-800 dark:bg-navy-700">
          {kind === "paid" ? "Renew" : "Get All Access"} · from ₱{FROM_PRICE}
        </button>
        <button onClick={later} className="rounded-xl border border-parchment-200 px-4 py-2 text-sm font-medium text-slate-500 dark:border-navy-700 dark:text-slate-300">Later</button>
      </div>
    </div>
  );
}

// ── Hindi pa kumpleto ang offline data (db + wasm) sa device na ito ───
function OfflineReadyBadge() {
  const [ready, setReady] = useState(null);
  const [retrying, setRetrying] = useState(false);
  const check = () => {
    import("../offlineData").then((m) => m.isOfflineDataReady()).then(setReady).catch(() => setReady(false));
  };
  useEffect(() => {
    check();
    const id = setInterval(check, 15000);
    const onOnline = () => setTimeout(check, 2000);
    window.addEventListener("online", onOnline);
    return () => { clearInterval(id); window.removeEventListener("online", onOnline); };
  }, []);
  if (ready !== false) return null;
  const retry = async () => {
    setRetrying(true);
    try { const m = await import("../db"); await m.warmOfflineData(); } catch (_) {}
    check();
    setRetrying(false);
  };
  return (
    <div className="pointer-events-none fixed inset-x-3 z-[55] mx-auto max-w-md" style={{ bottom: "calc(env(safe-area-inset-bottom) + 76px)" }}>
      <div className="pointer-events-auto rounded-xl border border-oxblood bg-parchment-50 p-3 text-center shadow-lg dark:bg-navy-800">
        <p className="text-xs font-semibold text-oxblood dark:text-oxblood-300">Hindi pa buo ang offline data sa device na ito.</p>
        <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">Manatiling naka-connect hanggang mawala ang mensaheng ito — saka lang talaga gagana nang walang internet.</p>
        <button onClick={retry} disabled={retrying} className="mt-2 rounded-full bg-oxblood px-3 py-1.5 text-xs font-bold text-white active:opacity-80 disabled:opacity-60">{retrying ? "Dina-download…" : "Subukan ulit i-download"}</button>
      </div>
    </div>
  );
}

// ── "Offline" pill ───────────────────────────────────────────────────
function OfflinePill() {
  const [online, setOnline] = useState(() => typeof navigator === "undefined" || navigator.onLine !== false);
  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => { window.removeEventListener("online", on); window.removeEventListener("offline", off); };
  }, []);
  if (online) return null;
  return (
    <div className="pointer-events-none fixed inset-x-0 z-[60] flex justify-center" style={{ top: "calc(env(safe-area-inset-top) + 4px)" }}>
      <span className="flex items-center gap-1.5 rounded-full bg-navy-900/90 px-3 py-1 text-[11px] font-semibold text-white shadow dark:bg-parchment-50/90 dark:text-navy-900"><StepIcon name="signal" className="h-3 w-3" /> Offline · saved content still works</span>
    </div>
  );
}

// ── Maliit na pill: natitirang oras ──────────────────────────────────
function AccessPill({ access }) {
  const { user, overlayOpen, setOverlayOpen } = useAuth();
  const [, setTick] = useState(0);
  if (overlayOpen) return null;
  let label = null;
  if (access.state === "trial") label = "Free trial · " + formatTimeLeft(access.msLeft) + " left";
  else if (access.state === "paid" && access.msLeft < 7 * DAY_MS) label = "Access · " + formatTimeLeft(access.msLeft) + " left";
  if (!label) return null;

  // Puwedeng itago (✕) para hindi matakpan ang bottom navigation. Naaalala per account at per state.
  const KEY = "cuble_pill_hidden_" + (user ? user.uid : "x") + "_" + access.state;
  let hidden = false;
  try { hidden = localStorage.getItem(KEY) === "1"; } catch (_) {}
  if (hidden) return null;
  const hide = () => { try { localStorage.setItem(KEY, "1"); } catch (_) {} setTick((n) => n + 1); };

  return (
    <div className="safe-bottom fixed bottom-3 left-3 z-40 flex items-center rounded-full bg-navy-900/90 text-[11px] font-semibold text-white shadow-lg backdrop-blur dark:bg-parchment-50/90 dark:text-navy-900">
      <button onClick={() => setOverlayOpen(true)} className="rounded-l-full py-1.5 pl-3 pr-1 active:opacity-70">{label}</button>
      <button onClick={hide} aria-label="Hide time left" className="flex h-8 w-8 items-center justify-center rounded-r-full text-sm opacity-70 active:opacity-100">✕</button>
    </div>
  );
}

// ── "New version available" banner (dismissible, comes back next app open) ──
function UpdateBanner() {
  const available = useUpdateAvailable();
  const [busy, setBusy] = useState(false);
  const [, setTick] = useState(0);
  if (!available) return null;
  const KEY = "cuble_update_dismiss";
  let dismissed = false;
  try { dismissed = sessionStorage.getItem(KEY) === getRemoteId(); } catch (_) {}
  if (dismissed) return null;
  const hide = () => { try { sessionStorage.setItem(KEY, String(getRemoteId())); } catch (_) {} setTick((n) => n + 1); };
  const go = async () => { setBusy(true); const ok = await applyUpdate(); if (!ok) setBusy(false); };
  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[65] flex justify-center px-3" style={{ paddingTop: "calc(env(safe-area-inset-top) + 8px)" }}>
      <div className="pointer-events-auto flex w-full max-w-md items-center gap-2 rounded-xl border border-gold-500 bg-navy-900 py-2 pl-4 pr-2 text-white shadow-xl dark:bg-navy-800">
        <StepIcon name="new" className="h-4 w-4 flex-shrink-0" />
        <span className="min-w-0 flex-1 text-xs font-semibold leading-snug">New version available. Update to get the latest fixes.</span>
        <button onClick={go} disabled={busy} className="flex-shrink-0 rounded-full bg-gold-500 px-3 py-1.5 text-xs font-bold text-navy-900 active:bg-gold-600 disabled:opacity-60">{busy ? "Updating…" : "Update now"}</button>
        <button onClick={hide} aria-label="Dismiss" className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm opacity-70 active:opacity-100">✕</button>
      </div>
    </div>
  );
}

export default function AccessGate() {
  return (
    <>
      <Suspense fallback={<Splash text="Loading…" />}>
        <AccessGateInner />
      </Suspense>
      <UnlockToast />
      <RenewBanner />
      <OfflinePill />
      <OfflineReadyBadge />
      <UpdateBanner />
    </>
  );
}

function AccessGateInner() {
  const { user, profile, loading, signingIn, needsFullName, deviceLimitReached, needsLegal, access, overlayOpen, setOverlayOpen } = useAuth();

  // Kapag kulang ang setup (pangalan / device limit), buksan ang account overlay.
  useEffect(() => {
    if (user && (needsFullName || deviceLimitReached) && !overlayOpen) setOverlayOpen(true);
  }, [user, needsFullName, deviceLimitReached, overlayOpen, setOverlayOpen]);

  if (loading || signingIn) return <Splash text="Loading…" />;

  if (!user) return <GuestApp />;

  if (!profile || needsFullName || deviceLimitReached) return <Splash text="Finishing your account setup…" />;
  // After a successful login: Privacy Notice / Terms / AI disclaimer must be accepted first.
  if (needsLegal) return <LegalGate />;
  if (access.state === "loading") return <Splash text="Checking your trial…" />;
  if (access.state === "expired") return <ExpiredGate />;

  return (
    <>
      <ChapterBrowser />
      <AccessPill access={access} />
    </>
  );
}
