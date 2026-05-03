/**
 * vitest.config.js
 * Vitest test runner configuration for VoteGuide India.
 * Uses jsdom environment so React components can be tested
 * without a real browser.
 */

import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    /** Inject describe/it/expect/vi as globals (required for @testing-library/jest-dom) */
    globals: true,

    /** Browser-like environment for React component testing */
    environment: 'jsdom',

    /** Import @testing-library/jest-dom matchers globally */
    setupFiles: ['./src/setupTests.js'],

    /** Include all .test.{js,jsx} files */
    include: ['src/__tests__/**/*.{test,spec}.{js,jsx}'],

    /** Coverage configuration */
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{js,jsx}'],
      exclude: [
        'src/main.jsx',
        'src/__tests__/**',
        'src/setupTests.js',
      ],
      thresholds: {
        statements: 70,
        branches:   65,
        functions:  70,
        lines:      70,
      },
    },

    /** Make test IDs deterministic */
    sequence: { shuffle: false },
  },
});
