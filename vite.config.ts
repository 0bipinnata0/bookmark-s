import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/extension.ts'),
      name: 'Extension',
      fileName: 'extension',
      formats: ['cjs'],
    },
    rollupOptions: {
      external: ['vscode'],
      output: {
        globals: {
          vscode: 'vscode',
        },
      },
    },
    outDir: 'extension/out',
    emptyOutDir: true,
  },
}); 