// Central list of exam subjects shown sa Quiz/Exam (📝) hub.
// "ra10863" ay gumagamit pa rin ng existing per-title quiz system
// (frontend/src/pages/QuizPage.jsx) — HINDI ito ginalaw.
// Ang CL / CDP / TL / PC ay flat (walang title, walang level) na quiz,
// backed by frontend/src/subjectQuizStore.js.

export const SUBJECTS = [
  { id: "ra10863", label: "RA10863", kind: "titled" },
  { id: "cl", label: "CL", kind: "flat" },
  { id: "cdp", label: "CDP", kind: "flat" },
  { id: "tl", label: "TL", kind: "flat" },
  { id: "pc", label: "PC", kind: "flat" },
];

export const FLAT_SUBJECTS = SUBJECTS.filter((s) => s.kind === "flat");

export function getSubjectById(id) {
  return SUBJECTS.find((s) => s.id === id) || null;
}
