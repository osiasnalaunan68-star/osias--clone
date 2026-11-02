import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Unique ID per build. The app compares its own ID with /version.json
// on the server to know if a newer version was deployed.
const BUILD_ID = String(Date.now());

function emitVersionFile() {
  return {
    name: 'emit-version-json',
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'version.json', source: JSON.stringify({ id: BUILD_ID }) });
    },
  };
}

export default defineConfig({
  base: './',
  define: { __BUILD_ID__: JSON.stringify(BUILD_ID) },
  plugins: [react(), emitVersionFile()],
  build: {
    outDir: '../docs',
    emptyOutDir: true,
  },
});
