// Payment method list, reference-code generator, and the Firestore
// write for the manual GCash / Maya / MariBank purchase flow.
// The All Access promo is the only plan new buyers can purchase.

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

// ── ALL ACCESS PROMO (the only plan) ─────────────────────────────────
// Existing subscribers are not affected (their data is untouched).
export const PROMO_PRICE = 89;
export const PROMO_DAYS = 30;
export const PROMO_PLAN = {
  id: "PROMO",
  kind: "promo",
  label: "All Access Promo",
  tagline: "One promo, everything unlocked. This is the only plan available right now.",
  price: PROMO_PRICE,
  days: PROMO_DAYS,
  months: 0,
  subjects: ["CL", "TL", "CDP", "PC", "TCP"],
};



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
