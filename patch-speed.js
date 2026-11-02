const fs = require("fs");

function rep(s, from, to) {
  if (!s.includes(from)) throw new Error("Text not found: " + from.slice(0, 70));
  return s.replace(from, () => to);
}

function patch(file, fn) {
  try {
    const s = fs.readFileSync(file, "utf8");
    const out = fn(s);
    if (out === s) { console.log("skipped (already patched):", file); return; }
    fs.copyFileSync(file, file + ".bak");
    fs.writeFileSync(file, out);
    console.log("patched:", file);
  } catch (e) {
    console.log("FAILED:", file, "-", e.message);
  }
}

// 1) AccessGate: lazy-load ChapterBrowser + QuizHub
patch("frontend/src/components/AccessGate.jsx", (s) => {
  if (s.includes("lazy(() => import(")) return s;
  s = rep(s, 'import { useState, useEffect, useRef } from "react";',
             'import { useState, useEffect, useRef, lazy, Suspense } from "react";');
  s = rep(s, 'import ChapterBrowser from "../pages/ChapterBrowser";\n', "");
  s = rep(s, 'import QuizHub from "../pages/QuizHub";\n', "");
  s = rep(s, 'import { PROMO_PLAN } from "../payments";\n',
    'import { PROMO_PLAN } from "../payments";\n\n' +
    'const ChapterBrowser = lazy(() => import("../pages/ChapterBrowser"));\n' +
    'const QuizHub = lazy(() => import("../pages/QuizHub"));\n');
  s = rep(s, "      <AccessGateInner />\n",
    '      <Suspense fallback={<Splash text="Loading…" />}>\n' +
    "        <AccessGateInner />\n" +
    "      </Suspense>\n");
  return s;
});

// 2) authContext: write device lastActive at most once every 6 hours
patch("frontend/src/authContext.jsx", (s) => {
  if (s.includes("!already.lastActive")) return s;
  const start = s.indexOf("if (already) {");
  if (start < 0) throw new Error("if (already) { not found");
  const target = 'updateDoc(ref, { devices: updated }).catch((e) => console.warn("device update failed:", e));';
  const i = s.indexOf(target, start);
  if (i < 0) throw new Error("device updateDoc line not found");
  const repl =
    "if (!already.lastActive || Date.now() - already.lastActive > 6 * 60 * 60 * 1000) {\n        " +
    target + "\n      }";
  return s.slice(0, i) + repl + s.slice(i + target.length);
});
