// Payment method list, reference-code generator, and the Firestore
// write for the manual GCash / Maya / MariBank purchase flow.
// Two All Access plans can be purchased: 1 month and 3 months.

import gcashQr from "./assets/payment/gcash-qr.png";
import mayaQr from "./assets/payment/maya-qr.png";
import maribankQr from "./assets/payment/maribank-qr.png";
import { doc, setDoc, arrayUnion } from "firebase/firestore";
import { db, auth } from "./firebase";

export const SUBJECT_LABELS = {
  CL: "RA 10863 (CMTA)",
  TL: "Tariff Law",
  CDP: "Customs Documentation & Procedures",
  PC: "Practical Computations",
  TCP: "Tariff Commission Primer",
};

// ── ALL ACCESS PLANS ─────────────────────────────────────────────────
// Both plans unlock everything; only the length and price differ.
// Existing subscribers are not affected (their data is untouched).
const ALL_SUBJECTS = ["CL", "TL", "CDP", "PC", "TCP"];

export const PLAN_1M = {
  id: "ALL1M",
  kind: "promo",
  label: "All Access · 1 Month",
  tagline: "Everything unlocked for 30 days.",
  price: 50,
  days: 30,
  months: 0,
  subjects: ALL_SUBJECTS,
};

export const PLAN_3M = {
  id: "ALL3M",
  kind: "promo",
  label: "All Access · 3 Months",
  tagline: "Everything unlocked for 90 days.",
  price: 150,
  days: 90,
  months: 0,
  subjects: ALL_SUBJECTS,
};

export const PLANS = [PLAN_1M, PLAN_3M];

// Older app builds saved purchases under the id "PROMO". Those pending
// requests can still be approved: they are treated as the 3-month plan
// (the Admin Panel shows a price warning if the amount paid is different).
export const LEGACY_PROMO_ID = "PROMO";

export function getPlanById(id) {
  if (id === LEGACY_PROMO_ID) return PLAN_3M;
  return PLANS.find((p) => p.id === id) || null;
}

// Default plan for the admin Restart buttons = the 3-month plan.
export const PROMO_PLAN = PLAN_3M;

// Lowest price, for short "from ₱X" button labels.
export const FROM_PRICE = Math.min(...PLANS.map((p) => p.price));

export const PAYMENT_METHODS = [
  { id: "gcash", label: "GCash", qr: gcashQr },
  { id: "maya", label: "Maya", qr: mayaQr },
  { id: "maribank", label: "MariBank", qr: maribankQr },
];

// No 0/O/1/I so codes are not confused when written in the payment note.
const REF_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function generateReferenceCode(planId) {
  let suffix = "";
  for (let i = 0; i < 4; i++) {
    suffix += REF_CHARS[Math.floor(Math.random() * REF_CHARS.length)];
  }
  return `${planId}-${suffix}`;
}

// setDoc + merge: if the user doc does not exist yet this creates it (with
// email/name) so the purchase still shows up in the Admin Panel.
// serverTimestamp() is not allowed inside arrayUnion, so Date.now() is used.
export async function submitPendingPurchase(uid, { planId, subjects, price, method, referenceCode }) {
  const ref = doc(db, "users", uid);
  const u = auth.currentUser;

  await setDoc(
    ref,
    {
      email: (u && u.email) || "",
      displayName: (u && u.displayName) || "",
      photoURL: (u && u.photoURL) || "",
      pendingPurchases: arrayUnion({
        plan: planId,
        subjects,
        price,
        method,
        referenceCode,
        requestedAt: Date.now(),
      }),
    },
    { merge: true }
  );
}
