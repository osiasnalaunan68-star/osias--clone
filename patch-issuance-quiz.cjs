const fs = require("fs");
const path = require("path");

const SRC = fs.existsSync("frontend/src/pages") ? "frontend/src" : fs.existsSync("src/pages") ? "src" : null;
if (!SRC) { console.error("Run this from the folder that contains frontend/ (or from frontend/)."); process.exit(1); }

function patch(file, steps) {
  const p = path.join(SRC, file);
  let t = fs.readFileSync(p, "utf8");
  const crlf = t.includes("\r\n");
  if (crlf) t = t.replace(/\r\n/g, "\n");
  for (const s of steps) {
    if (s.skipIf && t.includes(s.skipIf)) { console.log("  skip (already done):", s.name); continue; }
    const out = s.apply(t);
    if (out == null) { console.error("  ✗ FAILED:", s.name, "— anchor not found or not unique in", file); process.exit(1); }
    t = out;
    console.log("  ✓", s.name);
  }
  fs.writeFileSync(p, crlf ? t.replace(/\n/g, "\r\n") : t);
}

// replace `find` (must occur exactly once) with `rep`
const once = (find, rep) => (t) => (t.split(find).length === 2 ? t.replace(find, () => rep) : null);

console.log("IssuanceBrowser.jsx");
patch("pages/IssuanceBrowser.jsx", [
  {
    name: "imports",
    skipIf: "IssuanceQuizModal",
    apply: (t) => {
      const m = t.match(/import \{[^}]*\} from "\.\.\/issuancesStore";\n/);
      if (!m) return null;
      return t.replace(m[0], () => m[0] +
        'import { getIssuanceQuiz } from "../issuanceQuizStore";\n' +
        'import IssuanceQuizModal from "../components/IssuanceQuiz";\n');
    },
  },
  {
    name: "quizOpen state",
    skipIf: "setQuizOpen",
    apply: once(
      "  const [collapsed, setCollapsed] = useState({});\n",
      "  const [collapsed, setCollapsed] = useState({});\n  const [quizOpen, setQuizOpen] = useState(false);\n"
    ),
  },
  {
    name: "close quiz when issuance changes",
    skipIf: "setQuizOpen(false)",
    apply: once(
      "    setCollapsed({});\n  }, [issuanceId, kind]);",
      "    setCollapsed({});\n    setQuizOpen(false);\n  }, [issuanceId, kind]);"
    ),
  },
  {
    name: "Quiz button",
    skipIf: "📝 Quiz",
    apply: (t) => {
      const a = t.indexOf("🤖 Ask AI — overview");
      if (a < 0 || t.indexOf("🤖 Ask AI — overview", a + 1) >= 0) return null;
      const e = t.indexOf("</button>", a);
      if (e < 0) return null;
      const at = e + "</button>".length;
      const btn =
        "\n          {getIssuanceQuiz(issuance.id) && (\n" +
        "            <button\n" +
        "              onClick={() => setQuizOpen(true)}\n" +
        '              className="min-h-[38px] rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 active:bg-blue-100 dark:border-blue-700 dark:bg-blue-950/30 dark:text-blue-400"\n' +
        "            >\n" +
        "              📝 Quiz\n" +
        "            </button>\n" +
        "          )}";
      return t.slice(0, at) + btn + t.slice(at);
    },
  },
  {
    name: "Quiz modal",
    skipIf: "<IssuanceQuizModal",
    apply: once(
      "      {aiTarget && <IssuanceAiModal target={aiTarget} onClose={() => setAiTarget(null)} />}\n",
      "      {aiTarget && <IssuanceAiModal target={aiTarget} onClose={() => setAiTarget(null)} />}\n" +
      "      {quizOpen && <IssuanceQuizModal issuance={issuance} onClose={() => setQuizOpen(false)} />}\n"
    ),
  },
]);

console.log("QuizShared.jsx");
patch("components/QuizShared.jsx", [
  {
    name: "don't let CMO/CAO quizzes hijack the RA10863 'Continue' shortcut",
    skipIf: 'startsWith("issuance-")',
    apply: once(
      "if (progressKey) saveLastQuizPosition(progressKey, level);",
      'if (progressKey && !String(progressKey).startsWith("issuance-")) saveLastQuizPosition(progressKey, level);'
    ),
  },
]);

fs.mkdirSync(path.join(SRC, "data", "issuance-quizzes"), { recursive: true });
const keep = path.join(SRC, "data", "issuance-quizzes", ".gitkeep");
if (!fs.existsSync(keep)) fs.writeFileSync(keep, "");
console.log("data/issuance-quizzes/ ready\nDone ✅");
