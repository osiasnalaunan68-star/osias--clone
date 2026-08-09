// Payment plans, method list, reference-code generator, at ang Firestore
// write para sa manual GCash/Maya/MariBank subscription flow (Phase 3).
// Walang automated payment gateway — dev mismo ang nagko-confirm ng bayad
// sa Firebase Console base sa reference code na tugma sa app amount niya.

import gcashQr from "./assets/payment/gcash-qr.png";
import mayaQr from "./assets/payment/maya-qr.png";
import maribankQr from "./assets/payment/maribank-qr.png";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "./firebase";

export const PLANS = [
  { id: "CL", label: "Customs Law", price: 39, subjects: ["CL"] },
  { id: "TL", label: "Tariff Law", price: 39, subjects: ["TL"] },
  { id: "CDP", label: "Customs Declarant Practice", price: 39, subjects: ["CDP"] },
  { id: "PC", label: "Practical Customs", price: 29, subjects: ["PC"] },
  { id: "BUNDLE", label: "Bundle — Lahat ng 4 Subjects", price: 99, subjects: ["CL", "TL", "CDP", "PC"] },
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

// Note: Firestore's serverTimestamp() is NOT allowed inside array elements
// (arrayUnion), kaya client Date.now() na lang ang ginamit dito.
export async function submitPendingPurchase(uid, { planId, subjects, price, method, referenceCode }) {
  const ref = doc(db, "users", uid);
  await updateDoc(ref, {
    pendingPurchases: arrayUnion({
      plan: planId,
      subjects,
      price,
      method,
      referenceCode,
      requestedAt: Date.now(),
    }),
  });
}
