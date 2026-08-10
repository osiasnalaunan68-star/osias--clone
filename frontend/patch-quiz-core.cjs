const fs = require('fs');
const path = require('path');

function patchFile(relPath, edits) {
  const filePath = path.join(process.cwd(), relPath);
  let content = fs.readFileSync(filePath, 'utf8');
  fs.writeFileSync(filePath + '.bak3', content);
  for (const [anchor, replacement] of edits) {
    const count = content.split(anchor).length - 1;
    if (count !== 1) {
      throw new Error('[' + relPath + '] Expected 1 match, found ' + count + ' for anchor: ' + anchor.slice(0, 80));
    }
    content = content.split(anchor).join(replacement);
  }
  fs.writeFileSync(filePath, content);
  console.log('Patched ' + relPath + ' (backup: ' + relPath + '.bak3)');
}

try {
  patchFile('src/quizStore.js', [
    [
      'export function getQuizImportedCount() {\n  return Object.keys(loadStore().entries).length;\n}',
      'export function getQuizImportedCount() {\n  return Object.keys(loadStore().entries).length;\n}\n\nconst LAST_POSITION_KEY = "customsLaw_quizLastPosition";\n\nexport function saveLastQuizPosition(title, level) {\n  try {\n    localStorage.setItem(LAST_POSITION_KEY, JSON.stringify({ title, level, updatedAt: new Date().toISOString() }));\n  } catch {}\n}\n\nexport function getLastQuizPosition() {\n  try {\n    return JSON.parse(localStorage.getItem(LAST_POSITION_KEY) || "null");\n  } catch {\n    return null;\n  }\n}',
    ],
  ]);

  patchFile('src/pages/QuizPage.jsx', [
    [
      'function loadQuizData() {',
      'export function loadQuizData() {',
    ],
  ]);

  patchFile('src/pages/SubjectDashboard.jsx', [
    [
      'function SubjectQuizPlay({ subjectId, subjectLabel, onBack }) {',
      'export function SubjectQuizPlay({ subjectId, subjectLabel, onBack }) {',
    ],
  ]);

  patchFile('src/components/QuizShared.jsx', [
    [
      'import { useState, useEffect } from "react";',
      'import { useState, useEffect } from "react";\nimport { saveLastQuizPosition } from "../quizStore";\n\nexport function answersMatch(a, b) {\n  return String(a ?? "").trim().toLowerCase() === String(b ?? "").trim().toLowerCase();\n}',
    ],
    [
      'export function QuizPlayView({ title, entries, level, onBack, progressKey, backLabel = "← Back" }) {\n  const [currentIndex, setCurrentIndex] = useState(0);\n  const [answers, setAnswers] = useState({});\n  const [progress, setProgress] = useState(0);\n  const [score, setScore] = useState(0);\n\n  const nodeIds = Object.keys(entries);\n  const totalQuestions = nodeIds.length;\n  const currentId = nodeIds[currentIndex] || null;\n  const currentEntry = currentId ? entries[currentId] : null;\n  const currentQuestion = currentEntry?.[level] || null;\n  const currentAnswer = currentId ? answers[currentId] : null;\n  const isAnswered = currentAnswer !== undefined && currentAnswer !== null;\n\n  useEffect(() => {\n    if (totalQuestions === 0) return;\n    const answeredIds = Object.keys(answers).filter((id) => answers[id] !== undefined && answers[id] !== null);\n    const progressPct = (answeredIds.length / totalQuestions) * 100;\n    setProgress(progressPct);\n    const correctCount = answeredIds.filter((id) => entries[id]?.[level]?.correct === answers[id]).length;\n    setScore(totalQuestions ? (correctCount / totalQuestions) * 100 : 0);\n    if (progressKey) {\n      try {\n        const key = `quiz_progress_${progressKey}`;\n        const saved = JSON.parse(localStorage.getItem(key) || "{}");\n        saved[level] = progressPct;\n        localStorage.setItem(key, JSON.stringify(saved));\n      } catch {}\n    }\n  }, [answers, totalQuestions, entries, level, progressKey]);',
      'export function QuizPlayView({ title, entries, level, onBack, progressKey, backLabel = "← Back" }) {\n  const answerStorageKey = progressKey ? `quiz_answers_${progressKey}_${level}` : null;\n  const [currentIndex, setCurrentIndex] = useState(() => {\n    if (!answerStorageKey) return 0;\n    try {\n      const saved = JSON.parse(localStorage.getItem(answerStorageKey) || "null");\n      return saved?.currentIndex || 0;\n    } catch { return 0; }\n  });\n  const [answers, setAnswers] = useState(() => {\n    if (!answerStorageKey) return {};\n    try {\n      const saved = JSON.parse(localStorage.getItem(answerStorageKey) || "null");\n      return saved?.answers || {};\n    } catch { return {}; }\n  });\n  const [progress, setProgress] = useState(0);\n  const [score, setScore] = useState(0);\n\n  const nodeIds = Object.keys(entries);\n  const totalQuestions = nodeIds.length;\n  const currentId = nodeIds[Math.min(currentIndex, Math.max(0, totalQuestions - 1))] || null;\n  const currentEntry = currentId ? entries[currentId] : null;\n  const currentQuestion = currentEntry?.[level] || null;\n  const currentAnswer = currentId ? answers[currentId] : null;\n  const isAnswered = currentAnswer !== undefined && currentAnswer !== null;\n\n  useEffect(() => {\n    if (progressKey) saveLastQuizPosition(progressKey, level);\n  }, [progressKey, level]);\n\n  useEffect(() => {\n    if (!answerStorageKey) return;\n    try {\n      localStorage.setItem(answerStorageKey, JSON.stringify({ currentIndex, answers }));\n    } catch {}\n  }, [answerStorageKey, currentIndex, answers]);\n\n  useEffect(() => {\n    if (totalQuestions === 0) return;\n    const answeredIds = Object.keys(answers).filter((id) => answers[id] !== undefined && answers[id] !== null);\n    const progressPct = (answeredIds.length / totalQuestions) * 100;\n    setProgress(progressPct);\n    const correctCount = answeredIds.filter((id) => answersMatch(entries[id]?.[level]?.correct, answers[id])).length;\n    setScore(totalQuestions ? (correctCount / totalQuestions) * 100 : 0);\n    if (progressKey) {\n      try {\n        const key = `quiz_progress_${progressKey}`;\n        const saved = JSON.parse(localStorage.getItem(key) || "{}");\n        saved[level] = progressPct;\n        localStorage.setItem(key, JSON.stringify(saved));\n      } catch {}\n    }\n  }, [answers, totalQuestions, entries, level, progressKey]);',
    ],
    [
      'const isCorrect = answers[id] === q?.correct;',
      'const isCorrect = answersMatch(answers[id], q?.correct);',
    ],
  ]);

  console.log('All quiz-core patches applied successfully.');
} catch (err) {
  console.error('Patch failed: ' + err.message);
  process.exit(1);
}
