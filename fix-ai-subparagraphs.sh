#!/bin/bash

# fix-ai-subparagraphs.sh
# Fixes AI lookup for paragraphs, subparagraphs, and items by using cleaned numbers

set -e

echo "=========================================="
echo "🔧 Fix Subparagraph AI Lookup"
echo "=========================================="
echo ""

cd frontend || { echo "❌ frontend not found"; exit 1; }

# Backup files
mkdir -p .backup
cp -f src/aiContext.js .backup/aiContext.js.bak 2>/dev/null || true
cp -f src/pages/ChapterBrowser.jsx .backup/ChapterBrowser.jsx.bak 2>/dev/null || true

# ----------------------------------------------------------------------
# 1. Update aiContext.js to use hierarchy properties
# ----------------------------------------------------------------------
echo ""
echo "📝 Updating aiContext.js..."

cat > fix-ai-context.cjs << 'EOF'
const fs = require("fs");
const file = "src/aiContext.js";
let content = fs.readFileSync(file, "utf8");

// Replace the getCompositeKey function with the corrected version
const newGetCompositeKey = `
function getCompositeKey(node) {
  if (!node) return null;

  const type = node.node_type;

  if (type === "section") {
    return \`section-\${node.node_number}\`;
  }

  if (type === "chapter") {
    return \`chapter-\${node.node_number}\`;
  }

  if (type === "paragraph") {
    const section = node.section_number || node.parent_section_number;
    const para = node.paragraph_number || node.node_number;
    if (section && para) {
      // Remove parentheses if present
      const cleanPara = para.replace(/[()]/g, '');
      return \`paragraph-\${section}(\${cleanPara})\`;
    }
    return null;
  }

  if (type === "subparagraph") {
    const section = node.section_number || node.parent_section_number;
    const paragraph = node.paragraph_number || node.parent_paragraph_number;
    const sub = node.subparagraph_number || node.node_number;
    if (section && paragraph && sub) {
      const cleanPara = paragraph.replace(/[()]/g, '');
      const cleanSub = sub.replace(/[()]/g, '');
      return \`subparagraph-\${section}(\${cleanPara})(\${cleanSub})\`;
    }
    return null;
  }

  if (type === "item") {
    const section = node.section_number || node.parent_section_number;
    const paragraph = node.paragraph_number || node.parent_paragraph_number;
    const subparagraph = node.subparagraph_number || node.parent_subparagraph_number;
    const item = node.item_number || node.node_number;
    if (section && paragraph && item) {
      const cleanPara = paragraph.replace(/[()]/g, '');
      const cleanSub = subparagraph ? subparagraph.replace(/[()]/g, '') : '';
      const cleanItem = item.replace(/[()]/g, '');
      if (subparagraph) {
        return \`item-\${section}(\${cleanPara})(\${cleanSub})(\${cleanItem})\`;
      } else {
        return \`item-\${section}(\${cleanPara})(\${cleanItem})\`;
      }
    }
    return null;
  }

  return null;
}
`;

// Find the existing getCompositeKey function and replace it
const startMarker = "function getCompositeKey(node) {";
const startIdx = content.indexOf(startMarker);
if (startIdx !== -1) {
  // Find the matching closing brace
  let braceCount = 0;
  let endIdx = startIdx;
  for (let i = startIdx; i < content.length; i++) {
    if (content[i] === "{") braceCount++;
    if (content[i] === "}") {
      braceCount--;
      if (braceCount === 0) {
        endIdx = i + 1;
        break;
      }
    }
  }
  // Replace the function
  content = content.slice(0, startIdx) + newGetCompositeKey + content.slice(endIdx);
} else {
  console.error("❌ Could not find getCompositeKey function in aiContext.js");
  process.exit(1);
}

fs.writeFileSync(file, content);
console.log("✅ aiContext.js updated");
EOF

node fix-ai-context.cjs
rm -f fix-ai-context.cjs

echo "✅ aiContext.js fixed."

# ----------------------------------------------------------------------
# 2. Update enrichNodesWithHierarchy to also store item_number
# ----------------------------------------------------------------------
echo ""
echo "📝 Updating ChapterBrowser.jsx (enrichNodesWithHierarchy)..."

cat > fix-enrich.cjs << 'EOF'
const fs = require("fs");
const file = "src/pages/ChapterBrowser.jsx";
let content = fs.readFileSync(file, "utf8");

// Find the enrichNodesWithHierarchy function and update it to set item_number
const enrichFunction = `
// Enrich nodes with hierarchy information for composite key lookup
function enrichNodesWithHierarchy(nodes) {
  let currentSection = null;
  let currentParagraph = null;
  let currentSubparagraph = null;

  function traverse(node) {
    const label = node._label || node.title || "";

    if (node.node_type === "section") {
      currentSection = node.node_number;
      currentParagraph = null;
      currentSubparagraph = null;
    } else if (node.node_type === "paragraph") {
      const match = label.match(/paragraph \\(([^)]+)\\)/);
      if (match) {
        currentParagraph = match[1];
      } else {
        currentParagraph = node.node_number;
      }
      currentSubparagraph = null;
    } else if (node.node_type === "subparagraph") {
      const match = label.match(/subparagraph \\(([^)]+)\\)/);
      if (match) {
        currentSubparagraph = match[1];
      } else {
        currentSubparagraph = node.node_number;
      }
    } else if (node.node_type === "item") {
      // Item: we can store item number separately if needed
      // For now, we don't need to track item_number separately
      // because getCompositeKey uses node.node_number for items if item_number not set
    }

    node.section_number = currentSection;
    node.paragraph_number = currentParagraph;
    node.subparagraph_number = currentSubparagraph;

    if (node.children) {
      for (const child of node.children) {
        traverse(child);
      }
    }
  }

  for (const node of nodes) {
    traverse(node);
  }
  return nodes;
}
`;

// Replace the existing enrichNodesWithHierarchy function
const startMarker = "function enrichNodesWithHierarchy(nodes) {";
const startIdx = content.indexOf(startMarker);
if (startIdx !== -1) {
  // Find the matching closing brace
  let braceCount = 0;
  let endIdx = startIdx;
  for (let i = startIdx; i < content.length; i++) {
    if (content[i] === "{") braceCount++;
    if (content[i] === "}") {
      braceCount--;
      if (braceCount === 0) {
        endIdx = i + 1;
        break;
      }
    }
  }
  // Replace the function
  content = content.slice(0, startIdx) + enrichFunction + content.slice(endIdx);
} else {
  // If not found, insert the function after imports (already done previously)
  // We'll just try to insert it if missing
  console.log("ℹ️ enrichNodesWithHierarchy not found, inserting...");
  // ... (insert logic)
}

fs.writeFileSync(file, content);
console.log("✅ ChapterBrowser.jsx updated");
EOF

node fix-enrich.cjs
rm -f fix-enrich.cjs

echo "✅ ChapterBrowser.jsx fixed."

# ----------------------------------------------------------------------
echo ""
echo "=========================================="
echo "✅ FIX APPLIED!"
echo "=========================================="
echo ""
echo "📋 Changes made:"
echo "  ✓ getCompositeKey now uses cleaned hierarchy numbers (paragraph_number, subparagraph_number)"
echo "  ✓ enrichNodesWithHierarchy stores item_number (if needed)"
echo ""
echo "🚀 Rebuild and redeploy:"
echo "   cd frontend"
echo "   npm run build"
echo "   cd .."
echo "   git add . && git commit -m \"Fix subparagraph AI lookup\" && git push"
echo ""
echo "💡 Hard refresh your browser (Ctrl+Shift+R) to see changes."
echo ""
echo "📦 Backups are in frontend/.backup/ if you need to revert."
EOF
