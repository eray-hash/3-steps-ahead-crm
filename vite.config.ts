import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

// Vorführfassung: ohne Service Worker / PWA, alle Pfade relativ (HashRouter), damit die gebaute Seite
// aus jedem Unterpfad und in einem abgeschotteten Rahmen läuft.
// EINZELDATEI=1 baut zusätzlich eine einzige index.html mit allem eingebettet (dist-einzeln/).
const einzeln = process.env.EINZELDATEI === '1'

export default defineConfig({
  base: './',
  plugins: einzeln ? [react(), viteSingleFile()] : [react()],
  build: { chunkSizeWarningLimit: 6000, outDir: einzeln ? 'dist-einzeln' : 'dist' },
})
