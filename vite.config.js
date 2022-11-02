import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    emptyOutDir: false,
    outDir: 'dist',
    sourcemap: true,
    lib: {
      entry: {
        primary: 'src/index.ts',
      },
      formats: ['cjs', 'es'],
    },
    rollupOptions: {
      input: ['./src/index.ts'],
      output: {
        exports: 'named',
      },
    },
  },
});
