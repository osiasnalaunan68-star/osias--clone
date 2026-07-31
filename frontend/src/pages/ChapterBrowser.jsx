*** Begin Patch
*** Update File: frontend/src/pages/ChapterBrowser.jsx
@@
-function AiContextModal({ node, onClose }) {
-  const [entry] = useState(() => getAiContext(node));
+function AiContextModal({ node, onClose }) {
+  const entry = useMemo(() => getAiContext(node), [
+    node?.id,
+    node?.section_number,
+    node?.paragraph_number,
+    node?.subparagraph_number,
+    node?.title,
+  ]);
@@
-  const aiEntry = useMemo(() => getAiContext(node), [node.id]);
+  const aiEntry = useMemo(() => getAiContext(node), [
+    node?.id,
+    node?.section_number,
+    node?.paragraph_number,
+    node?.subparagraph_number,
+    node?.title,
+  ]);
*** End Patch