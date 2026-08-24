// import path from 'path';
// import checker from 'vite-plugin-checker';
// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react-swc';
// const PORT = 3039;
// export default defineConfig({
//   base: '/',
//   plugins: [
//     react(),
//     checker({
//       typescript: true,
//       eslint: {
//         useFlatConfig: true,
//         lintCommand: 'eslint "./src/**/*.{js,jsx,ts,tsx}"',
//         dev: { logLevel: ['error'] },
//       },
//       overlay: { position: 'tl', initialIsOpen: false },
//     }),
//   ],
//   resolve: {
//     alias: [
//       {
//         find: /^src(.+)/,
//         replacement: path.resolve(process.cwd(), 'src/$1'),
//       },
//     ],
//   },
//   server: { port: PORT, host: true },
//   preview: { port: PORT, host: true },
// });
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';

// ----------------------------------------------------------------------

const PORT = 3039;

export default defineConfig({
  plugins: [
    react(),
    checker({
      typescript: true,
      eslint: {
        useFlatConfig: true,
        lintCommand: 'eslint "./src/**/*.{js,jsx,ts,tsx}"',
        dev: { logLevel: ['error'] },
      },
      overlay: {
        position: 'tl',
        initialIsOpen: false,
      },
    }),
  ],
  resolve: {
    alias: [
      {
        find: /^src(.+)/,
        replacement: path.resolve(process.cwd(), 'src/$1'),
      },
      // Add this new alias for features
      {
        find: /^features(.+)/,
        replacement: path.resolve(process.cwd(), 'src/features/$1'),
      },
      // Add other common aliases
      {
        find: /^components(.+)/,
        replacement: path.resolve(process.cwd(), 'src/components/$1'),
      },
      {
        find: /^layouts(.+)/,
        replacement: path.resolve(process.cwd(), 'src/layouts/$1'),
      },
    ],
  },
  server: { port: PORT, host: true },
  preview: { port: PORT, host: true },
});
