// Payment plans, payment method list, reference-code generator, and the Firestore
// write for the manual GCash / Maya / MariBank subscription flow.
//
// `months`      = how long the subject(s) stay unlocked after approval.
// `bonusMonths` = bundles only (shown in the UI as "+ N months App Access").
//                 App Access for every plan is granted by computeGrant() in access.js.

import gcashQr from "./assets/payment/gcash-qr.png";
import mayaQr from "./assets/payment/maya-qr.png";
import maribankQr from "./assets/payment/maribank-qr.png";
import { doc, setDoc, arrayUnion } from "firebase/firestore";
import { db, auth } from "./firebase";
import { ACCESS_PLANS } from "./access";

export const PLANS = [
  { id: "CL", label: "RA 10863 (CMTA)", price: 199, months: 4, subjects: ["CL"] },
  { id: "TL", label: "Tariff Law", price: 120, months: 3, subjects: ["TL"] },
  { id: "CDP", label: "Customs Documentation & Procedures", price: 120, months: 3, subjects: ["CDP"] },
  { id: "PC", label: "Practical Computations", price: 120, months: 3, subjects: ["PC"] },
  { id: "TCP", label: "Tariff Commission Primer", price: 229, months: 3, subjects: ["TCP"] },
  { id: "BUNDLE", label: "Normal Bundle", price: 380, months: 6, subjects: ["CL", "TL", "CDP", "PC"], bonusMonths: 6 },
  { id: "ALL", label: "Sulit Bundle", price: 450, months: 6, subjects: ["CL", "TL", "CDP", "PC", "TCP"], bonusMonths: 6 },
];

// ── PROMO MODE ───────────────────────────────────────────────────────
// true  = ang makikita lang ng user ay ang PROMO bundle (lahat ng lumang plan = "ghost":
//         buo pa ang logic, pero hindi na ma-avail ng bagong bibili).
// false = bumalik sa dating subscription plans.
// Hindi naaapektuhan ang kasalukuyang subscribers (walang binabago sa data nila).
export const PROMO_MODE = true;
export const PROMO_PRICE = 120;
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

// Price of RA 10863 (CL). The name is kept so existing imports keep working,
// but CL is no longer lifetime — it now expires after 4 months.
export const CL_LIFETIME_PRICE = PLANS.find((p) => p.id === "CL").price;
export const CL_PRICE = CL_LIFETIME_PRICE;

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
  // App Access plans (M1/M3/M8) have their own pending list.
  const field = ACCESS_PLANS.some((p) => p.id === planId) ? "pendingAccess" : "pendingPurchases";
  await setDoc(
    ref,
    {
      email: (u && u.email) || "",
      displayName: (u && u.displayName) || "",
      photoURL: (u && u.photoURL) || "",
      [field]: arrayUnion({
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
