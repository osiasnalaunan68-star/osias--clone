import { useState, useEffect } from "react";
import { useAuth } from "../authContext";
import { PLANS, PAYMENT_METHODS, PROMO_MODE, PROMO_PLAN, generateReferenceCode, submitPendingPurchase } from "../payments";
import { ACCESS_PLANS, TRIAL_DAYS, DAY_MS, THREE_SUBJECT_BONUS, countActiveSubjects, getSubjectInfo, getClTrialInfo, formatTimeLeft, formatDateShort } from "../access";

const SUBJECT_LABELS = { CL: "RA 10863 (CMTA)", TL: "Tariff Law", CDP: "Customs Documentation & Procedures", PC: "Practical Computations", TCP: "Tariff Commission Primer" };

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
    const plan = [...PLANS, ...ACCESS_PLANS, PROMO_PLAN].find((p) => p.id === intentPlanId);
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

  const ownedCount = countActiveSubjects(profile);
  const bonusDone = !!profile?.bonuses?.threeSubjects;
  const clTrial = getClTrialInfo(profile);
  const bundlePlan = PLANS.find((p) => p.id === "BUNDLE");
  const allInPlan = PLANS.find((p) => p.id === "ALL");
  const bundleOwned = !!bundlePlan && bundlePlan.subjects.every((c) => getSubjectInfo(profile, c).active);
  // The all-in bundle only makes sense if TCP is not active and the 4-subject bundle is not fully owned.
  const showAllIn = !!allInPlan && !getSubjectInfo(profile, "TCP").active && !bundleOwned;
  const activeMethod = PAYMENT_METHODS.find((m) => m.id === selectedMethod) || null;
  const planNote = selectedPlan
    ? selectedPlan.kind === "promo"
      ? "All Access · unlock lahat ng may bayad · " + selectedPlan.days + " days lang"
      : selectedPlan.kind === "access"
      ? selectedPlan.months + (selectedPlan.months === 1 ? " month" : " months") + " of App Access"
      : "Valid for " + selectedPlan.months + " months · includes " + selectedPlan.months + " months of App Access"
    : "";

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm sm:items-center"
      onClick={() => setOverlayOpen(false)}
    >
      <div
        className="max-h-[85vh] w-full overflow-y-auto rounded-t-2xl bg-white p-5 dark:bg-slate-800 sm:max-w-sm sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {loading && <p className="py-8 text-center text-slate-400">Loading...</p>}

        {!loading && !user && (
          <div className="space-y-4 py-4 text-center">
            <p className="text-lg font-semibold text-navy-900 dark:text-slate-100">
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
            <p className="text-lg font-semibold text-navy-900 dark:text-slate-100">
              This Google account is already signed in on 2 devices
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Remove one device below to use it here.
            </p>
            <div className="space-y-2">
              {(profile?.devices || []).map((d) => (
                <div key={d.id} className="flex items-center justify-between rounded-lg bg-slate-50 p-3 dark:bg-slate-900/40">
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
            <p className="text-lg font-semibold text-navy-900 dark:text-slate-100">What is your full name?</p>
            <input
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Full name"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
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
              <div className="rounded-lg border border-red-200 bg-red-50 p-2.5 text-xs text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-300">
                ⚠️ Your account could not be saved to the server. Error: {profileError}
              </div>
            )}
            <div className="flex items-center gap-3">
              {profile?.photoURL && (
                <img src={profile.photoURL} alt="" className="h-14 w-14 rounded-full object-cover" />
              )}
              <div>
                <p className="font-semibold text-navy-900 dark:text-slate-100">{profile?.fullName}</p>
                <p className="text-xs text-slate-400">{profile?.email}</p>
              </div>
            </div>

            <div>
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">Practice Questions</p>
              <div className="space-y-1.5">
                {Object.keys(SUBJECT_LABELS).map((code) => {
                  const plan = PLANS.find((p) => p.id === code);
                  const info = getSubjectInfo(profile, code);
                  let status;
                  if (info.active) status = info.lifetime ? "♾️ Lifetime access" : "Active until " + formatDateShort(info.expiresAt) + " · " + formatTimeLeft(info.msLeft) + " left";
                  else if (info.owned) status = "⏳ Expired on " + formatDateShort(info.expiresAt);
                  else if (code === "CL") status = clTrial.active ? "🎁 Trial: " + formatTimeLeft(clTrial.msLeft) + " left" : "Level 1 free · Levels 2–5 locked";
                  else status = "First 10 items free";
                  const canRenew = !PROMO_MODE && (!info.active || (!info.lifetime && info.msLeft < 14 * DAY_MS));
                  return (
                    <div key={code} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm dark:bg-slate-900/40">
                      <span className="min-w-0 pr-2">
                        <span className="block text-slate-600 dark:text-slate-300">{SUBJECT_LABELS[code]}</span>
                        <span className={"block text-[11px] " + (info.active ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400")}>{status}</span>
                      </span>
                      {canRenew ? (
                        <button
                          onClick={() => startPurchase(plan)}
                          className="flex-shrink-0 rounded-lg bg-navy-900 px-3 py-1.5 text-xs font-semibold text-white active:bg-navy-800 dark:bg-navy-700"
                        >
                          {info.owned ? "Renew" : "Subscribe"} ₱{plan.price}
                          <span className="block text-[10px] font-normal opacity-80">{plan.months} months</span>
                        </button>
                      ) : (
                        info.active ? (
                          <span className="flex-shrink-0 font-medium text-emerald-600 dark:text-emerald-400">Unlocked</span>
                        ) : (
                          <span className="flex-shrink-0 text-xs font-medium text-slate-400">🔒 Locked</span>
                        )
                      )}
                    </div>
                  );
                })}
              </div>
              <p className={(PROMO_MODE ? "hidden " : "") + "mt-2 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500 dark:bg-slate-900/40 dark:text-slate-400"}>
                🎯 Own {THREE_SUBJECT_BONUS.count} active subjects = +{THREE_SUBJECT_BONUS.months} months App Access ({Math.min(ownedCount, THREE_SUBJECT_BONUS.count)}/{THREE_SUBJECT_BONUS.count}){bonusDone ? " · ✅ claimed" : ""}
                <br />
                Each subject lasts 3 months (RA 10863: 4 months) with the same length of App Access. Renew early and your remaining days are kept.
              </p>
              {PROMO_MODE && (
                <button
                  onClick={() => startPurchase(PROMO_PLAN)}
                  className="mt-2 w-full rounded-xl border-2 border-gold-500 bg-navy-900 px-3 py-3 text-center text-white active:bg-navy-800 dark:bg-navy-700"
                >
                  <span className="block text-sm font-extrabold">🔥 {PROMO_PLAN.label} — ₱{PROMO_PLAN.price}</span>
                  <span className="mt-1 block text-[11px] font-normal opacity-90">{PROMO_PLAN.tagline}</span>
                  <span className="mt-1 block text-[11px] font-normal opacity-90">All Access: unlock lahat ng may bayad (RA 10863 · CDP · TL · PC · TCP) + App Access</span>
                  <span className="mt-1 block text-[11px] font-semibold text-gold-400">⏳ {PROMO_PLAN.days} days lang</span>
                </button>
              )}
              {!PROMO_MODE && !bundleOwned && bundlePlan && (
                <button
                  onClick={() => startPurchase(bundlePlan)}
                  className="mt-2 w-full rounded-lg border-2 border-gold-500 bg-gold-50 px-3 py-2 text-xs font-semibold text-navy-900 active:bg-gold-100 dark:border-gold-400 dark:bg-slate-900/40 dark:text-gold-400"
                >
                  🎁 {bundlePlan.label} ₱{bundlePlan.price} · {bundlePlan.months} months
                  <span className="mt-0.5 block text-[11px] font-normal opacity-80">RA 10863 · CDP · TL · PC · includes {bundlePlan.bonusMonths} months App Access</span>
                </button>
              )}
              {!PROMO_MODE && showAllIn && (
                <button
                  onClick={() => startPurchase(allInPlan)}
                  className="mt-2 w-full rounded-lg border-2 border-gold-500 bg-navy-900 px-3 py-2 text-xs font-semibold text-white active:bg-navy-800 dark:bg-navy-700"
                >
                  👑 {allInPlan.label} ₱{allInPlan.price} · {allInPlan.months} months
                  <span className="mt-0.5 block text-[11px] font-normal opacity-80">RA 10863 · CDP · TL · PC · TCP · includes {allInPlan.bonusMonths} months App Access</span>
                </button>
              )}
            </div>

            <div>
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">App Access</p>
              <div className="mb-2 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600 dark:bg-slate-900/40 dark:text-slate-300">
                {access?.state === "admin" && <span>👑 Admin</span>}
                {access?.state === "member" && <span>✅ Access active (practice subscriber)</span>}
                {access?.state === "paid" && <span>✅ Active until {formatDateShort(access.app.expiresAt)} ({formatTimeLeft(access.msLeft)} left)</span>}
                {access?.state === "trial" && <span>🎁 Free trial: {formatTimeLeft(access.msLeft)} left</span>}
                {(access?.state === "expired" || access?.state === "loading") && <span>⏳ Your trial has ended. {PROMO_MODE ? "Get the Promo bundle above." : "Choose a plan below."}</span>}
              </div>
              {(profile?.pendingAccess || []).length > 0 && (
                <p className="mb-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:bg-amber-950/20 dark:text-amber-300">
                  ⏳ App Access payment pending ({profile.pendingAccess[profile.pendingAccess.length - 1].referenceCode}) — waiting for confirmation.
                </p>
              )}
              {(profile?.pendingPurchases || []).length > 0 && (
                <p className="mb-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:bg-amber-950/20 dark:text-amber-300">
                  ⏳ Practice payment pending ({profile.pendingPurchases[profile.pendingPurchases.length - 1].referenceCode}) — waiting for confirmation.
                </p>
              )}
              {!PROMO_MODE && access && access.state !== "admin" && access.state !== "member" && (
                <div className="grid grid-cols-3 gap-1.5">
                  {ACCESS_PLANS.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => startPurchase(p)}
                      className="rounded-lg border border-slate-200 px-2 py-2 text-center text-xs font-semibold text-navy-900 active:bg-slate-100 dark:border-slate-600 dark:text-slate-100 dark:active:bg-slate-700"
                    >
                      {p.months} {p.months === 1 ? "month" : "months"}
                      <span className="block text-sm font-bold">₱{p.price}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Devices ({(profile?.devices || []).length}/2)
              </p>
              <div className="space-y-1.5">
                {(profile?.devices || []).map((d) => (
                  <div key={d.id} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-900/40">
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        {d.label} {d.id === currentDeviceId && <span className="text-emerald-600 dark:text-emerald-400">(this device)</span>}
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
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-500 dark:border-slate-600 dark:text-slate-300"
            >
              Sign out
            </button>
            <button onClick={() => setOverlayOpen(false)} className="w-full text-sm text-slate-400">Close</button>
          </div>
        )}

        {!loading && user && !deviceLimitReached && !needsFullName && step === "payment-method" && selectedPlan && (
          <div className="space-y-4 py-2">
            <button onClick={backToProfile} className="text-sm text-slate-400">← Back</button>
            <div className="rounded-xl bg-slate-50 p-4 text-center dark:bg-slate-900/40">
              <p className="text-sm text-slate-500 dark:text-slate-400">{selectedPlan.label}</p>
              <p className="text-2xl font-bold text-navy-900 dark:text-slate-100">₱{selectedPlan.price}</p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{planNote}</p>
            </div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Choose a payment method:</p>
            <div className="space-y-2">
              {PAYMENT_METHODS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => selectMethod(m.id)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-left text-sm font-semibold text-slate-700 active:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:active:bg-slate-900/40"
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
                <button onClick={backToMethods} className="text-sm text-slate-400">← Back</button>
                <div className="rounded-xl border-2 border-red-500 bg-red-50 p-3 text-center dark:border-red-400 dark:bg-red-950/30">
                  <p className="text-sm font-bold leading-snug text-red-700 dark:text-red-300">
                    ⚠️ Ilagay sa note ang iyong email address para makita namin na ikaw talaga ang nag-avail, and wait for our confirmation.
                  </p>
                  {profile?.email && (
                    <p className="mt-1 break-all text-xs font-semibold text-slate-700 dark:text-slate-200">📧 {profile.email}</p>
                  )}
                </div>
                <img
                  src={activeMethod.qr}
                  alt={`${activeMethod.label} QR code`}
                  className="mx-auto w-full max-w-[280px] rounded-xl border border-slate-100 dark:border-slate-700"
                />
                <div className="rounded-xl bg-amber-50 p-3 text-center dark:bg-amber-950/30">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Reference Code — write it in the payment note</p>
                  <p className="text-xl font-bold tracking-widest text-navy-900 dark:text-amber-400">{referenceCode}</p>
                </div>
                <p className="text-center text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                  1. Scan the QR code with your {activeMethod.label} app.<br />
                  2. Pay ₱{selectedPlan.price} and write your email address + the reference code in the note/message.<br />
                  3. Tap "I've paid" below.
                </p>
                <button
                  onClick={confirmPaid}
                  disabled={submitting}
                  className="w-full rounded-xl bg-navy-900 px-4 py-3 text-sm font-semibold text-white disabled:opacity-50 dark:bg-navy-700"
                >
                  {submitting ? "Submitting..." : "✅ I've paid"}
                </button>
              </>
            ) : (
              <div className="space-y-3 py-4 text-center">
                <span className="text-4xl" aria-hidden>⏳</span>
                <p className="font-semibold text-navy-900 dark:text-slate-100">Your purchase is pending</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  It will be confirmed manually within a few hours. Reference code: <span className="font-semibold">{referenceCode}</span>
                </p>
                <button
                  onClick={backToProfile}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-500 dark:border-slate-600 dark:text-slate-300"
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
