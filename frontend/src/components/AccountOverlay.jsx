import { useState, useEffect } from "react";
import { useAuth } from "../authContext";
import { PLANS, PAYMENT_METHODS, generateReferenceCode, submitPendingPurchase } from "../payments";
import { ACCESS_PLANS, TRIAL_DAYS, THREE_SUBJECT_BONUS, countSubjects, getClTrialInfo, formatTimeLeft, formatDateShort } from "../access";

const SUBJECT_LABELS = { CL: "RA 10863 (Customs Law)", TL: "Tariff Law", CDP: "Customs Documentation & Procedures", PC: "Practical Computations", TCP: "Tariff Commission Primer" };

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
    const plan = [...PLANS, ...ACCESS_PLANS].find((p) => p.id === intentPlanId);
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
      alert("May error sa pag-submit. Subukan ulit:\n" + (err?.message || err));
    } finally {
      setSubmitting(false);
    }
  };

  const ownedCount = countSubjects(profile?.subscriptions);
  const bonusDone = !!profile?.bonuses?.threeSubjects;
  const clTrial = getClTrialInfo(profile);
  const ownedSubs = profile?.subscriptions || {};
  const bundlePlan = PLANS.find((p) => p.id === "BUNDLE");
  const allInPlan = PLANS.find((p) => p.id === "ALL");
  const bundleOwned = !!bundlePlan && bundlePlan.subjects.every((c) => ownedSubs[c]);
  // All-in ay makatuwiran lang kung wala pang TCP at kulang pa ang 4-subject bundle.
  const showAllIn = !!allInPlan && !ownedSubs.TCP && !bundleOwned;
  const activeMethod = PAYMENT_METHODS.find((m) => m.id === selectedMethod) || null;

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
              Mag-sign in gamit ang Google para masimulan ang {TRIAL_DAYS}-day free trial
            </p>
            <button
              onClick={signInWithGoogle}
              disabled={signingIn}
              className="w-full rounded-xl bg-navy-900 px-4 py-3 font-medium text-white disabled:opacity-50 dark:bg-navy-700"
            >
              {signingIn ? "Naghihintay sa Google..." : "Sign in with Google"}
            </button>
            {authError && <p className="text-sm text-red-600 dark:text-red-400">{authError}</p>}
            <button onClick={() => setOverlayOpen(false)} className="text-sm text-slate-400">Cancel</button>
          </div>
        )}

        {!loading && user && deviceLimitReached && (
          <div className="space-y-3 py-2">
            <p className="text-lg font-semibold text-navy-900 dark:text-slate-100">
              Naka-login na ang Google account mong ito sa 2 device
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Mag-remove muna ng isang device sa baba para magamit dito.
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
            <p className="text-lg font-semibold text-navy-900 dark:text-slate-100">Ano ang buong pangalan mo?</p>
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
                ⚠️ Hindi ma-save ang account mo sa server. Error: {profileError}
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
                  const unlocked = !!profile?.subscriptions?.[code];
                  const plan = PLANS.find((p) => p.id === code);
                  return (
                    <div key={code} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm dark:bg-slate-900/40">
                      <span className="min-w-0 pr-2">
                        <span className="block text-slate-600 dark:text-slate-300">{SUBJECT_LABELS[code]}</span>
                        {!unlocked && <span className="block text-[11px] text-slate-400">{code === "CL" ? (clTrial.active ? "🎁 Trial: " + formatTimeLeft(clTrial.msLeft) + " left" : "🔒 Naka-lock") : "10 items libre"}</span>}
                      </span>
                      {unlocked ? (
                        <span className="font-medium text-emerald-600 dark:text-emerald-400">Unlocked</span>
                      ) : (
                        <button
                          onClick={() => startPurchase(plan)}
                          className="rounded-lg bg-navy-900 px-3 py-1.5 text-xs font-semibold text-white active:bg-navy-800 dark:bg-navy-700"
                        >
                          Mag-subscribe ₱{plan.price}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
              <p className="mt-2 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500 dark:bg-slate-900/40 dark:text-slate-400">
                🎯 {THREE_SUBJECT_BONUS.count} subjects = +{THREE_SUBJECT_BONUS.months} months App Access ({Math.min(ownedCount, THREE_SUBJECT_BONUS.count)}/{THREE_SUBJECT_BONUS.count}){bonusDone ? " · ✅ na-claim na" : ""}
              </p>
              {!bundleOwned && bundlePlan && (
                <button
                  onClick={() => startPurchase(bundlePlan)}
                  className="mt-2 w-full rounded-lg border-2 border-gold-500 bg-gold-50 px-3 py-2 text-xs font-semibold text-navy-900 active:bg-gold-100 dark:border-gold-400 dark:bg-slate-900/40 dark:text-gold-400"
                >
                  🎁 {bundlePlan.label} ₱{bundlePlan.price} + {bundlePlan.bonusMonths} months App Access
                  <span className="mt-0.5 block text-[11px] font-normal opacity-80">RA10863 (CL) · CDP · TL · PC</span>
                </button>
              )}
              {showAllIn && (
                <button
                  onClick={() => startPurchase(allInPlan)}
                  className="mt-2 w-full rounded-lg border-2 border-gold-500 bg-navy-900 px-3 py-2 text-xs font-semibold text-white active:bg-navy-800 dark:bg-navy-700"
                >
                  👑 {allInPlan.label} ₱{allInPlan.price} + {allInPlan.bonusMonths} months App Access
                  <span className="mt-0.5 block text-[11px] font-normal opacity-80">RA10863 (CL) · CDP · TL · PC · TCP</span>
                </button>
              )}
            </div>

            <div>
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">App Access</p>
              <div className="mb-2 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600 dark:bg-slate-900/40 dark:text-slate-300">
                {access?.state === "admin" && <span>👑 Admin</span>}
                {access?.state === "member" && <span>✅ Access active (practice subscriber)</span>}
                {access?.state === "paid" && <span>✅ Active hanggang {formatDateShort(access.app.expiresAt)} ({formatTimeLeft(access.msLeft)} left)</span>}
                {access?.state === "trial" && <span>🎁 Free trial: {formatTimeLeft(access.msLeft)} left</span>}
                {(access?.state === "expired" || access?.state === "loading") && <span>⏳ Tapos na ang trial. Pumili ng plan sa baba.</span>}
              </div>
              {(profile?.pendingAccess || []).length > 0 && (
                <p className="mb-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:bg-amber-950/20 dark:text-amber-300">
                  ⏳ May pending App Access payment ({profile.pendingAccess[profile.pendingAccess.length - 1].referenceCode}) — hinihintay ang confirmation.
                </p>
              )}
              {access && access.state !== "admin" && access.state !== "member" && (
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
                        {d.label} {d.id === currentDeviceId && <span className="text-emerald-600 dark:text-emerald-400">(ito)</span>}
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
            <button onClick={backToProfile} className="text-sm text-slate-400">← Bumalik</button>
            <div className="rounded-xl bg-slate-50 p-4 text-center dark:bg-slate-900/40">
              <p className="text-sm text-slate-500 dark:text-slate-400">{selectedPlan.label}</p>
              <p className="text-2xl font-bold text-navy-900 dark:text-slate-100">₱{selectedPlan.price}</p>
            </div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Piliin ang paraan ng pagbabayad:</p>
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
                <button onClick={backToMethods} className="text-sm text-slate-400">← Bumalik</button>
                <img
                  src={activeMethod.qr}
                  alt={`${activeMethod.label} QR code`}
                  className="mx-auto w-full max-w-[280px] rounded-xl border border-slate-100 dark:border-slate-700"
                />
                <div className="rounded-xl bg-amber-50 p-3 text-center dark:bg-amber-950/30">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Reference Code — isulat sa payment note</p>
                  <p className="text-xl font-bold tracking-widest text-navy-900 dark:text-amber-400">{referenceCode}</p>
                </div>
                <p className="text-center text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                  1. I-scan ang QR gamit ang {activeMethod.label} app mo.<br />
                  2. Bayaran ang ₱{selectedPlan.price}, ilagay ang reference code sa note/message.<br />
                  3. Pindutin ang "Nabayaran ko na" sa baba.
                </p>
                <button
                  onClick={confirmPaid}
                  disabled={submitting}
                  className="w-full rounded-xl bg-navy-900 px-4 py-3 text-sm font-semibold text-white disabled:opacity-50 dark:bg-navy-700"
                >
                  {submitting ? "Sinusubmit..." : "✅ Nabayaran ko na"}
                </button>
              </>
            ) : (
              <div className="space-y-3 py-4 text-center">
                <span className="text-4xl" aria-hidden>⏳</span>
                <p className="font-semibold text-navy-900 dark:text-slate-100">Naka-pending na ang purchase mo</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Ico-confirm ito manually sa loob ng ilang oras. Reference code: <span className="font-semibold">{referenceCode}</span>
                </p>
                <button
                  onClick={backToProfile}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-500 dark:border-slate-600 dark:text-slate-300"
                >
                  Bumalik sa Profile
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
