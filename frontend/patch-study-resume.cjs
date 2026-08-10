const fs = require('fs');
const path = require('path');

function patchFile(relPath, edits) {
  const filePath = path.join(process.cwd(), relPath);
  let content = fs.readFileSync(filePath, 'utf8');
  fs.writeFileSync(filePath + '.bak4', content);
  for (const [anchor, replacement] of edits) {
    const count = content.split(anchor).length - 1;
    if (count !== 1) {
      throw new Error('Expected 1 match, found ' + count + ' for anchor: ' + anchor.slice(0, 80));
    }
    content = content.split(anchor).join(replacement);
  }
  fs.writeFileSync(filePath, content);
  console.log('Patched ' + relPath + ' (backup: ' + relPath + '.bak4)');
}

try {
  patchFile('src/pages/ChapterBrowser.jsx', [
    [
      'const { activeHighlightNodeId, setActiveHighlightNodeId } = useHighlightUI();',
      'const { activeHighlightNodeId, setActiveHighlightNodeId, setLastViewedNodeId } = useHighlightUI();',
    ],
    [
      'const toggle = (e) => { e.stopPropagation(); if (isExpandable) setExpanded((v) => !v); };',
      'const toggle = (e) => {\n    e.stopPropagation();\n    if (!isExpandable) return;\n    setExpanded((v) => {\n      const next = !v;\n      if (next && node.content && setLastViewedNodeId) setLastViewedNodeId(node.id);\n      return next;\n    });\n  };',
    ],
    [
      '  const [activeHighlightNodeId, setActiveHighlightNodeId] = useState(null);',
      '  const [activeHighlightNodeId, setActiveHighlightNodeId] = useState(null);\n  const [lastViewedNodeId, setLastViewedNodeId] = useState(null);',
    ],
    [
      '  const resumeReading = useCallback(() => {\n    if (!resumeAvailable) return;\n    if (resumeAvailable.mode) setMode(resumeAvailable.mode);\n    pendingScrollRestore.current = resumeAvailable.scrollTop || 0;\n    loadChapter(resumeAvailable.chapter_number, resumeAvailable.title_number || null);\n  }, [resumeAvailable, loadChapter]);',
      '  const resumeReading = useCallback(() => {\n    if (!resumeAvailable) return;\n    if (resumeAvailable.mode) setMode(resumeAvailable.mode);\n    if (resumeAvailable.mode === "study" && resumeAvailable.studyNodeId) {\n      loadChapter(resumeAvailable.chapter_number, resumeAvailable.title_number || null, resumeAvailable.studyNodeId);\n    } else {\n      pendingScrollRestore.current = resumeAvailable.scrollTop || 0;\n      loadChapter(resumeAvailable.chapter_number, resumeAvailable.title_number || null);\n    }\n  }, [resumeAvailable, loadChapter]);',
    ],
    [
      '    const persist = () => {\n      saveProgress({\n        title_number: selectedTitleNumber,\n        chapter_number: selectedChapter,\n        mode,\n        scrollTop: el.scrollTop,\n      });\n    };',
      '    const persist = () => {\n      saveProgress({\n        title_number: selectedTitleNumber,\n        chapter_number: selectedChapter,\n        mode,\n        scrollTop: el.scrollTop,\n        studyNodeId: mode === "study" ? lastViewedNodeId : null,\n      });\n    };',
    ],
    [
      '  }, [chapterTree, selectedChapter, selectedTitleNumber, mode, view]);',
      '  }, [chapterTree, selectedChapter, selectedTitleNumber, mode, view, lastViewedNodeId]);',
    ],
    [
      'const highlightUIValue = useMemo(() => ({ activeHighlightNodeId, setActiveHighlightNodeId }), [activeHighlightNodeId]);',
      'const highlightUIValue = useMemo(() => ({ activeHighlightNodeId, setActiveHighlightNodeId, setLastViewedNodeId }), [activeHighlightNodeId, setLastViewedNodeId]);',
    ],
  ]);

  console.log('Study Mode resume patch applied successfully.');
} catch (err) {
  console.error('Patch failed: ' + err.message);
  process.exit(1);
}
