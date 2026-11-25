import { useEffect, useRef } from "react";

// Iisang "back stack" para gumana ang back button/swipe-back ng phone kapwa
// sa PWA (browser) at sa APK (Capacitor) — pareho lang silang window.history.
//
// Gamit: tawagin ang useBackClose(active, onBack) sa loob ng isang component.
// Habang active === true, may naka-push na history entry. Pag pinindot ang
// back, tatawagin ang onBack mo (isara/bumalik) sa halip na umalis sa app.
// Isang pindot = isang antas lang ang nagsasara (LIFO), tulad ng normal na app.
const stack = [];
let nextDepth = 1;

if (typeof window !== "undefined") {
  window.addEventListener("popstate", () => {
    const top = stack.pop();
    if (top) top.onBack();
  });
}

export function pushBackLevel(onBack) {
  const depth = nextDepth++;
  try { window.history.pushState({ __backLevel: depth }, ""); } catch (_) {}
  stack.push({ depth, onBack });
  // Tawagin ito kung isinara MO mismo (hal. pag-tap ng "X"), hindi sa back button.
  return function closeBackLevel() {
    const i = stack.findIndex((e) => e.depth === depth);
    if (i === -1) return;
    const wasTop = i === stack.length - 1;
    stack.splice(i, 1);
    if (wasTop) { try { window.history.back(); } catch (_) {} }
  };
}

export function useBackClose(active, onBack) {
  const cb = useRef(onBack);
  cb.current = onBack;
  useEffect(() => {
    if (!active) return undefined;
    return pushBackLevel(() => cb.current());
  }, [active]);
}
