// Payment plans, method list, reference-code generator, at ang Firestore
// write para sa manual GCash/Maya/MariBank subscription flow.

import gcashQr from "./assets/payment/gcash-qr.png";
import mayaQr from "./assets/payment/maya-qr.png";
import maribankQr from "./assets/payment/maribank-qr.png";
import { doc, setDoc, arrayUnion } from "firebase/firestore";
import { db, auth } from "./firebase";
import { ACCESS_PLANS } from "./access";

export const PLANS = [
  { id: "TL", label: "Tariff Law", price: 168, subjects: ["TL"] },
  { id: "CDP", label: "Customs Documentation & Procedures", price: 168, subjects: ["CDP"] },
  { id: "PC", label: "Practical Computations", price: 168, subjects: ["PC"] },
  { id: "TCP", label: "Tariff Commission Primer", price: 199, subjects: ["TCP"] },
  { id: "BUNDLE", label: "Bundle — RA10863 (CL), CDP, TL, PC", price: 259, subjects: ["CL", "TL", "CDP", "PC"] },
  { id: "ALL", label: "All-in Bundle — Lahat ng 5 Subjects (kasama TCP)", price: 400, subjects: ["CL", "TL", "CDP", "PC", "TCP"] },
];

export const PAYMENT_METHODS = [
  { id: "gcash", label: "GCash", qr: gcashQr },
  { id: "maya", label: "Maya", qr: mayaQr },
  { id: "maribank", label: "MariBank", qr: maribankQr },
];

// Walang 0/O/1/I para di malito kapag isinusulat sa payment note.
const REF_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function generateReferenceCode(planId) {
  let suffix = "";
  for (let i = 0; i < 4; i++) {
    suffix += REF_CHARS[Math.floor(Math.random() * REF_CHARS.length)];
  }
  return `${planId}-${suffix}`;
}

// setDoc + merge: kung wala pang user doc, gagawa ito (kasama ang email/pangalan)
// para lalabas pa rin sa Admin Panel. serverTimestamp() ay bawal sa arrayUnion,
// kaya Date.now() ang gamit.
export async function submitPendingPurchase(uid, { planId, subjects, price, method, referenceCode }) {
  const ref = doc(db, "users", uid);
  const u = auth.currentUser;
  // App Access plans (M1/M3/M8) ay may sariling pending list.
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
