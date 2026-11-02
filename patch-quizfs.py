import shutil

def rep(s, a, b):
    if a not in s:
        raise Exception("Text not found: " + a[:70])
    return s.replace(a, b, 1)

path = "frontend/src/components/IssuanceQuiz.jsx"
try:
    s = open(path, encoding="utf-8", newline="").read()
    if "createPortal" in s:
        print("skipped (already patched):", path)
    else:
        s = rep(s, 'import { useState, useMemo } from "react";\n',
                   'import { useState, useMemo } from "react";\nimport { createPortal } from "react-dom";\n')
        s = rep(s, '  return (\n    <div className="fixed inset-0 z-[45] flex flex-col',
                   '  return createPortal(\n    <div className="fixed inset-0 z-[48] flex flex-col')
        s = rep(s, '        <div className="mx-auto max-w-2xl p-4">{content}</div>\n      </div>\n    </div>\n  );\n}',
                   '        <div className="mx-auto max-w-2xl p-4" style={{ paddingBottom: "calc(2rem + env(safe-area-inset-bottom))" }}>{content}</div>\n      </div>\n    </div>,\n    document.body\n  );\n}')
        shutil.copyfile(path, path + ".bak")
        open(path, "w", encoding="utf-8", newline="").write(s)
        print("patched:", path)
except Exception as e:
    print("FAILED:", path, "-", e)
