import { useState, useEffect } from "react";
import { useAuth } from "../authContext";
import { PAYMENT_METHODS, PROMO_PLAN, generateReferenceCode, submitPendingPurchase } from "../payments";
import { TRIAL_DAYS, getSubjectInfo, getClTrialInfo, formatTimeLeft, formatDateShort } from "../access";

const SUBJECT_LABELS = { CL: "RA 10863 (CMTA)", TL: "Tariff Law", CDP: "Customs Documentation & Procedures", PC: "Practical Computations", TCP: "Tariff Commission Primer" };

const ICONS = {
  warning: <><path d="M12 9v4" /><circle cx="12" cy="16.2" r="0.3" fill="currentColor" /><path d="M10.3 3.9 2.5 18a1.8 1.8 0 0 0 1.6 2.7h15.8a1.8 1.8 0 0 0 1.6-2.7L13.7 3.9a1.8 1.8 0 0 0-3.4 0Z" /></>,
  infinity: <path d="M6.5 15.5a3.5 3.5 0 1 1 0-7c2.5 0 3.5 2.5 5.5 5s3 2 4 2a3.5 3.5 0 1 0 0-7c-1 0-2 0-4 2.5s-3 5-5.5 5Z" />,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.5 2" /></>,
  tag: <><path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z" /><circle cx="7.5" cy="7.5" r="1" fill="currentColor" /></>,
  lock: <><rect x="4.5" y="10.5" width="15" height="9" rx="2" /><path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" /></>,
  crown: <path d="M4 18h16M4 18l-1.3-9 5 3.5L12 6l4.3 6.5 5-3.5L20 18" />,
  check: <path d="M20 6 9 17l-5-5" />,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></>,
  download: <><path d="M12 4v11" /><path d="M7 11l5 5 5-5" /><path d="M5 20h14" /></>,
  back: <path d="M15 6l-6 6 6 6" />,
};
function Icon({ name, className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      {ICONS[name] || null}
    </svg>
  );
}

function formatDate(ts) {
  try {
    const d = new Date(ts);
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return "";
  }
}

export default function AccountOverlay() {
  const {
    user, profile, loading, needsFullName, deviceLimitReached, currentDeviceId,
    overlayOpen, setOverlayOpen, authError, signingIn,
    signInWithGoogle, signOutUser, completeFullName, removeDevice,
    profileError, access, intentPlanId, setIntentPlanId,
  } = useAuth();
  const [nameInput, setNameInput] = useState("");

  // Phase 3 — plan-selection + payment flow state.
  // step: "profile" | "payment-method" | "qr"
  const [step, setStep] = useState("profile");
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [referenceCode, setReferenceCode] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState("");

  // Reset ang payment flow tuwing magsasara ang overlay, para hindi
  // ma-stuck ang susunod na pagbukas sa gitna ng isang lumang flow.
  useEffect(() => {
    if (!overlayOpen) {
      setStep("profile");
      setSelectedPlan(null);
      setSelectedMethod(null);
      setReferenceCode(null);
      setSubmitted(false);
      setSubmitting(false);
    }
  }, [overlayOpen]);

  // Galing sa Paywall: diretso sa payment method ng napiling plan.
  useEffect(() => {
    if (!overlayOpen || !intentPlanId || !user || !profile) return;
    const plan = intentPlanId === PROMO_PLAN.id ? PROMO_PLAN : null;
    setIntentPlanId(null);
    if (!plan) return;
    setSelectedPlan(plan);
    setSelectedMethod(null);
    setSubmitted(false);
    setReferenceCode(generateReferenceCode(plan.id));
    setStep("payment-method");
  }, [overlayOpen, intentPlanId, user, profile]);

  if (!overlayOpen) return null;

  const startPurchase = (plan) => {
    setSelectedPlan(plan);
    setSelectedMethod(null);
    setSubmitted(false);
    setReferenceCode(generateReferenceCode(plan.id));
    setStep("payment-method");
  };

  const copyText = async (key, text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(""), 1500);
    } catch (_) {
      window.prompt("Copy this:", text);
    }
  };

  const selectMethod = (methodId) => {
    setSelectedMethod(methodId);
    setStep("qr");
  };

  const backToProfile = () => {
    setStep("profile");
    setSelectedPlan(null);
    setSelectedMethod(null);
    setSubmitted(false);
  };

  const backToMethods = () => {
    setStep("payment-method");
    setSelectedMethod(null);
    setSubmitted(false);
  };

  const confirmPaid = async () => {
    if (!user || !selectedPlan || !selectedMethod || !referenceCode) return;
    setSubmitting(true);
    try {
      await submitPendingPurchase(user.uid, {
        planId: selectedPlan.id,
        subjects: selectedPlan.subjects,
        price: selectedPlan.price,
        method: selectedMethod,
        referenceCode,
      });
      setSubmitted(true);
    } catch (err) {
      console.warn("submitPendingPurchase failed:", err);
      alert("Could not submit. Please try again:\n" + (err?.message || err));
    } finally {
      setSubmitting(false);
    }
  };

  const clTrial = getClTrialInfo(profile);
  const activeMethod = PAYMENT_METHODS.find((m) => m.id === selectedMethod) || null;
  const planNote = selectedPlan
    ? "All Access · everything unlocked · valid for " + selectedPlan.days + " days"
    : "";

  let appAccessStatus = null;
  if (access?.state === "admin") appAccessStatus = { icon: "crown", text: "Admin" };
  else if (access?.state === "member") appAccessStatus = { icon: "check", text: "Access active (practice subscriber)" };
  else if (access?.state === "paid") appAccessStatus = { icon: "check", text: `Active until ${formatDateShort(access.app.expiresAt)} (${formatTimeLeft(access.msLeft)} left)` };
  else if (access?.state === "trial") appAccessStatus = { icon: "tag", text: `Free trial: ${formatTimeLeft(access.msLeft)} left` };
  else if (access?.state === "expired" || access?.state === "loading") appAccessStatus = { icon: "clock", text: "Your trial has ended. Get the Promo bundle above." };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm sm:items-center"
      onClick={() => setOverlayOpen(false)}
    >
      <div
        className="max-h-[85vh] w-full overflow-y-auto rounded-t-xl bg-parchment-50 p-5 dark:bg-slate-800 sm:max-w-sm sm:rounded-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {loading && <p className="py-8 text-center text-slate-400">Loading...</p>}

        {!loading && !user && (
          <div className="space-y-4 py-4 text-center">
            <p className="text-lg font-semibold text-navy-900 dark:text-parchment-50">
              Sign in with Google to start your {TRIAL_DAYS}-day free trial
            </p>
            <button
              onClick={signInWithGoogle}
              disabled={signingIn}
              className="w-full rounded-xl bg-navy-900 px-4 py-3 font-medium text-white disabled:opacity-50 dark:bg-navy-700"
            >
              {signingIn ? "Waiting for Google..." : "Sign in with Google"}
            </button>
            {authError && <p className="text-sm text-red-600 dark:text-red-400">{authError}</p>}
            <button onClick={() => setOverlayOpen(false)} className="text-sm text-slate-400">Cancel</button>
          </div>
        )}

        {!loading && user && deviceLimitReached && (
          <div className="space-y-3 py-2">
            <p className="text-lg font-semibold text-navy-900 dark:text-parchment-50">
              This Google account is already signed in on 2 devices
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Remove one device below to use it here.
            </p>
            <div className="space-y-2">
              {(profile?.devices || []).map((d) => (
                <div key={d.id} className="flex items-center justify-between rounded-lg bg-parchment p-3 dark:bg-navy-900/40">
                  <div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{d.label}</p>
                    <p className="text-xs text-slate-400">Last active: {formatDate(d.lastActive)}</p>
                  </div>
                  <button
                    onClick={() => removeDevice(d.id)}
                    className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 dark:border-red-800 dark:text-red-400"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <button onClick={signOutUser} className="w-full text-sm text-slate-400">Sign out</button>
          </div>
        )}

        {!loading && user && !deviceLimitReached && needsFullName && (
          <div className="space-y-3 py-2">
            <p className="text-lg font-semibold text-navy-900 dark:text-parchment-50">What is your full name?</p>
            <input
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Full name"
              className="w-full rounded-xl border border-parchment-200 px-4 py-3 dark:border-navy-700 dark:bg-navy-900 dark:text-slate-100"
            />
            <button
              disabled={!nameInput.trim()}
              onClick={() => completeFullName(nameInput.trim())}
              className="w-full rounded-xl bg-navy-900 px-4 py-3 font-medium text-white disabled:opacity-40 dark:bg-navy-700"
            >
              Done
            </button>
          </div>
        )}

        {!loading && user && !deviceLimitReached && !needsFullName && step === "profile" && (
          <div className="space-y-4 py-2">
            {profileError && (
              <div className="flex items-start gap-1.5 rounded-lg border border-red-200 bg-red-50 p-2.5 text-xs text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-300">
                <Icon name="warning" className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" /> Your account could not be saved to the server. Error: {profileError}
              </div>
            )}
            <div className="flex items-center gap-3">
              {profile?.photoURL && (
                <img src={profile.photoURL} alt="" className="h-14 w-14 rounded-full object-cover" />
              )}
              <div>
                <p className="font-semibold text-navy-900 dark:text-parchment-50">{profile?.fullName}</p>
                <p className="text-xs text-slate-400">{profile?.email}</p>
              </div>
            </div>

            <div>
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">Practice Questions</p>
              <div className="space-y-1.5">
                {Object.keys(SUBJECT_LABELS).map((code) => {
                  const info = getSubjectInfo(profile, code);
                  let status;
                  if (info.active) status = info.lifetime ? "♾️ Lifetime access" : "Active until " + formatDateShort(info.expiresAt) + " · " + formatTimeLeft(info.msLeft) + " left";
                  else if (info.owned) status = "⏳ Expired on " + formatDateShort(info.expiresAt);
                  else if (code === "CL") status = clTrial.active ? "🎁 Trial: " + formatTimeLeft(clTrial.msLeft) + " left" : "Level 1 free · Levels 2–5 locked";
                  else status = "First 10 items free";
                  return (
                    <div key={code} className="flex items-center justify-between rounded-lg bg-parchment px-3 py-2 text-sm dark:bg-navy-900/40">
                      <span className="min-w-0 pr-2">
                        <span className="block text-slate-600 dark:text-slate-300">{SUBJECT_LABELS[code]}</span>
                        <span className={"flex items-center gap-1 text-[11px] " + (info.active ? "text-verdigris dark:text-verdigris-300" : "text-slate-400")}>{status.icon && <Icon name={status.icon} className="h-3 w-3 flex-shrink-0" />}{status.text}</span>
                      </span>
                      {info.active ? (
                        <span className="flex-shrink-0 font-medium text-verdigris dark:text-verdigris-300">Unlocked</span>
                      ) : (
                        <span className="flex flex-shrink-0 items-center gap-1 text-xs font-medium text-slate-400"><Icon name="lock" className="h-3 w-3" /> Locked</span>
                      )}
                    </div>
                  );
                })}
              </div>
              <button
                onClick={() => startPurchase(PROMO_PLAN)}
                className="mt-2 w-full rounded-xl border-2 border-gold-500 bg-navy-900 px-3 py-3 text-center text-white active:bg-navy-800 dark:bg-navy-700"
              >
                <span className="block text-sm font-extrabold">🔥 {PROMO_PLAN.label} — ₱{PROMO_PLAN.price}</span>
                <span className="mt-1 block text-[11px] font-normal opacity-90">{PROMO_PLAN.tagline}</span>
                <span className="mt-1 block text-[11px] font-normal opacity-90">Unlocks EVERYTHING: RA 10863 (all 5 levels) · CDP · TL · PC · TCP + full App Access</span>
                <span className="mt-1 flex items-center justify-center gap-1 text-[11px] font-semibold text-gold-400"><Icon name="clock" className="h-3 w-3" /> Valid for {PROMO_PLAN.days} days only</span>
              </button>
            </div>

            <div>
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">App Access</p>
              <div className="mb-2 rounded-lg bg-parchment px-3 py-2 text-sm text-slate-600 dark:bg-navy-900/40 dark:text-slate-300">
                {access?.state === "admin" && <span>👑 Admin</span>}
                {access?.state === "member" && <span>✅ Access active (practice subscriber)</span>}
                {access?.state === "paid" && <span>✅ Active until {formatDateShort(access.app.expiresAt)} ({formatTimeLeft(access.msLeft)} left)</span>}
                {access?.state === "trial" && <span>🎁 Free trial: {formatTimeLeft(access.msLeft)} left</span>}
                {(access?.state === "expired" || access?.state === "loading") && <span>⏳ Your trial has ended. Get the Promo bundle above.</span>}
              </div>
              {(profile?.pendingAccess || []).length > 0 && (
                <p className="mb-2 flex items-center gap-1.5 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:bg-amber-950/20 dark:text-amber-300">
                  <Icon name="clock" className="h-3.5 w-3.5 flex-shrink-0" /> App Access payment pending ({profile.pendingAccess[profile.pendingAccess.length - 1].referenceCode}) — waiting for confirmation.
                </p>
              )}
              {(profile?.pendingPurchases || []).length > 0 && (
                <p className="mb-2 flex items-center gap-1.5 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:bg-amber-950/20 dark:text-amber-300">
                  <Icon name="clock" className="h-3.5 w-3.5 flex-shrink-0" /> Practice payment pending ({profile.pendingPurchases[profile.pendingPurchases.length - 1].referenceCode}) — waiting for confirmation.
                </p>
              )}

            </div>

            <div>
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Devices ({(profile?.devices || []).length}/2)
              </p>
              <div className="space-y-1.5">
                {(profile?.devices || []).map((d) => (
                  <div key={d.id} className="flex items-center justify-between rounded-lg bg-parchment px-3 py-2 dark:bg-navy-900/40">
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        {d.label} {d.id === currentDeviceId && <span className="text-verdigris dark:text-verdigris-300">(this device)</span>}
                      </p>
                      <p className="text-xs text-slate-400">{formatDate(d.lastActive)}</p>
                    </div>
                    <button
                      onClick={() => removeDevice(d.id)}
                      className="rounded-lg border border-red-200 px-2.5 py-1 text-xs text-red-600 dark:border-red-800 dark:text-red-400"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={signOutUser}
              className="w-full rounded-xl border border-parchment-200 px-4 py-2.5 text-sm font-medium text-slate-500 dark:border-navy-700 dark:text-slate-300"
            >
              Sign out
            </button>
            <button onClick={() => setOverlayOpen(false)} className="w-full text-sm text-slate-400">Close</button>
          </div>
        )}

        {!loading && user && !deviceLimitReached && !needsFullName && step === "payment-method" && selectedPlan && (
          <div className="space-y-4 py-2">
            <button onClick={backToProfile} className="flex items-center gap-1 text-sm text-slate-400"><Icon name="back" className="h-3.5 w-3.5" /> Back</button>
            <div className="rounded-xl bg-parchment p-4 text-center dark:bg-navy-900/40">
              <p className="text-sm text-slate-500 dark:text-slate-400">{selectedPlan.label}</p>
              <p className="text-2xl font-bold text-navy-900 dark:text-parchment-50">₱{selectedPlan.price}</p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{planNote}</p>
            </div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Choose a payment method:</p>
            <div className="space-y-2">
              {PAYMENT_METHODS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => selectMethod(m.id)}
                  className="w-full rounded-xl border border-parchment-200 px-4 py-3 text-left text-sm font-semibold text-slate-700 active:bg-parchment dark:border-navy-700 dark:text-slate-200 dark:active:bg-slate-900/40"
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {!loading && user && !deviceLimitReached && !needsFullName && step === "qr" && selectedPlan && activeMethod && (
          <div className="space-y-4 py-2">
            {!submitted ? (
              <>
                <button onClick={backToMethods} className="flex items-center gap-1 text-sm text-slate-400"><Icon name="back" className="h-3.5 w-3.5" /> Back</button>
                <div className="rounded-xl border-2 border-red-500 bg-red-50 p-3 text-center dark:border-red-400 dark:bg-red-950/30">
                  <p className="flex items-start gap-1.5 text-left text-sm font-bold leading-snug text-red-700 dark:text-red-300">
                    <Icon name="warning" className="mt-0.5 h-4 w-4 flex-shrink-0" />
                    Ilagay sa note ang iyong email address para makita namin na ikaw talaga ang nag-avail, and wait for our confirmation.
                  </p>
                  {profile?.email && (
                    <div className="mt-1 flex items-center justify-center gap-2">
                      <p className="flex items-center gap-1 break-all text-xs font-semibold text-slate-700 dark:text-slate-200"><Icon name="mail" className="h-3.5 w-3.5 flex-shrink-0" /> {profile.email}</p>
                      <button onClick={() => copyText("email", profile.email)} className="flex-shrink-0 rounded-full border border-slate-300 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600 active:bg-slate-100 dark:border-navy-700 dark:text-slate-300">{copied === "email" ? "Copied ✓" : "Copy"}</button>
                    </div>
                  )}
                </div>
                <img
                  src={activeMethod.qr}
                  alt={`${activeMethod.label} QR code`}
                  className="mx-auto w-full max-w-[280px] rounded-xl border border-parchment-200 dark:border-navy-700"
                />
                <a href={activeMethod.qr} download={activeMethod.id + "-qr.png"} className="mx-auto flex w-fit items-center gap-1.5 rounded-full border border-parchment-200 px-4 py-1.5 text-xs font-semibold text-slate-600 active:bg-parchment dark:border-navy-700 dark:text-slate-300"><Icon name="download" className="h-3.5 w-3.5" /> Save QR (or take a screenshot)</a>
                <div className="rounded-xl bg-amber-50 p-3 text-center dark:bg-amber-950/30">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Reference Code — write it in the payment note</p>
                  <div className="flex items-center justify-center gap-2">
                    <p className="text-xl font-bold tracking-widest text-navy-900 dark:text-amber-400">{referenceCode}</p>
                    <button onClick={() => copyText("ref", referenceCode)} className="flex-shrink-0 rounded-full border border-slate-300 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600 active:bg-slate-100 dark:border-navy-700 dark:text-slate-300">{copied === "ref" ? "Copied ✓" : "Copy"}</button>
                  </div>
                </div>
                <p className="text-center text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                  1. Scan the QR code with your {activeMethod.label} app.<br />
                  2. Pay ₱{selectedPlan.price} and write your email address + the reference code in the note/message.<br />
                  3. Tap "I've paid" below.
                </p>
                {/* Naka-pin sa baba ng popup: laging kita, hindi na kailangang mag-scroll */}
                <div
                  className="sticky -bottom-5 -mx-5 -mb-7 border-t border-parchment-200 bg-parchment-50 px-5 pt-3 dark:border-navy-700 dark:bg-navy-800"
                  style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 12px)" }}
                >
                  <p className="mb-2 text-center text-[11px] text-slate-500 dark:text-slate-400">Tap only after you have sent the payment.</p>
                  <button
                    onClick={confirmPaid}
                    disabled={submitting}
                    className="w-full rounded-xl bg-navy-900 px-4 py-3 text-sm font-semibold text-white disabled:opacity-50 dark:bg-navy-700"
                  >
                    {submitting ? "Submitting..." : "✅ I've paid"}
                  </button>
                </div>
              </>
            ) : (
              <div className="space-y-3 py-4 text-center">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-seal text-seal dark:border-gold-400 dark:text-gold-400" aria-hidden><Icon name="clock" className="h-6 w-6" /></span>
                <p className="font-semibold text-navy-900 dark:text-parchment-50">Your purchase is pending</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  It will be confirmed manually within a few hours. Reference code: <span className="font-semibold">{referenceCode}</span>
                </p>
                <button
                  onClick={backToProfile}
                  className="w-full rounded-xl border border-parchment-200 px-4 py-2.5 text-sm font-medium text-slate-500 dark:border-navy-700 dark:text-slate-300"
                >
                  Back to Profile
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
