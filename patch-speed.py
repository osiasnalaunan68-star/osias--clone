import shutil

def rep(s, a, b):
    if a not in s:
        raise Exception("Text not found: " + a[:70])
    return s.replace(a, b, 1)

def patch(path, fn):
    try:
        s = open(path, encoding="utf-8", newline="").read()
        out = fn(s)
        if out == s:
            print("skipped (already patched):", path)
            return
        shutil.copyfile(path, path + ".bak")
        open(path, "w", encoding="utf-8", newline="").write(out)
        print("patched:", path)
    except Exception as e:
        print("FAILED:", path, "-", e)

def gate(s):
    if "lazy(() => import(" in s:
        return s
    s = rep(s, 'import { useState, useEffect, useRef } from "react";',
               'import { useState, useEffect, useRef, lazy, Suspense } from "react";')
    s = rep(s, 'import ChapterBrowser from "../pages/ChapterBrowser";\n', "")
    s = rep(s, 'import QuizHub from "../pages/QuizHub";\n', "")
    s = rep(s, 'import { PROMO_PLAN } from "../payments";\n',
        'import { PROMO_PLAN } from "../payments";\n\n'
        'const ChapterBrowser = lazy(() => import("../pages/ChapterBrowser"));\n'
        'const QuizHub = lazy(() => import("../pages/QuizHub"));\n')
    s = rep(s, "      <AccessGateInner />\n",
        '      <Suspense fallback={<Splash text="Loading…" />}>\n'
        "        <AccessGateInner />\n"
        "      </Suspense>\n")
    return s

def auth(s):
    if "!already.lastActive" in s:
        return s
    start = s.find("if (already) {")
    if start < 0:
        raise Exception("if (already) { not found")
    target = 'updateDoc(ref, { devices: updated }).catch((e) => console.warn("device update failed:", e));'
    i = s.find(target, start)
    if i < 0:
        raise Exception("device updateDoc line not found")
    repl = ("if (!already.lastActive || Date.now() - already.lastActive > 6 * 60 * 60 * 1000) {\n        "
            + target + "\n      }")
    return s[:i] + repl + s[i + len(target):]

patch("frontend/src/components/AccessGate.jsx", gate)
patch("frontend/src/authContext.jsx", auth)
