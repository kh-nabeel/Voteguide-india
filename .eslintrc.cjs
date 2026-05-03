/**
 * .eslintrc.cjs
 * ESLint configuration for VoteGuide India.
 * Extends recommended rules for JavaScript, React, and React Hooks.
 */

'use strict';

module.exports = {
  root: true,
  env: {
    browser: true,
    es2022:  true,
    node:    true,
  },
  parserOptions: {
    ecmaVersion:   'latest',
    sourceType:    'module',
    ecmaFeatures:  { jsx: true },
  },
  settings: {
    react: { version: 'detect' },
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
  ],
  plugins: ['vitest-globals', 'react', 'react-hooks'],
  rules: {
    // ── Style ────────────────────────────────────────────────────────────────
    'no-console':          'warn',
    'no-unused-vars':      ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    'prefer-const':        'error',
    'no-var':              'error',
    'eqeqeq':             ['error', 'always'],
    'curly':              'error',

    // ── Safety ───────────────────────────────────────────────────────────────
    'no-eval':             'error',
    'no-implied-eval':     'error',
    'no-new-func':         'error',
    'no-param-reassign':   'warn',

    // ── Imports ──────────────────────────────────────────────────────────────
    'no-duplicate-imports': 'error',
  },
  overrides: [
    // Test files may use vi, describe, it, expect without import
    {
      files: ['src/__tests__/**/*.{js,jsx}', 'src/setupTests.js'],
      env:   { 'vitest-globals/env': true },
      globals: {
        vi:         'readonly',
        describe:   'readonly',
        it:         'readonly',
        expect:     'readonly',
        beforeEach: 'readonly',
        afterEach:  'readonly',
        beforeAll:  'readonly',
        afterAll:   'readonly',
      },
    },
    // Server CommonJS files
    {
      files: ['server/**/*.js'],
      parserOptions: { sourceType: 'script' },
      env: { node: true },
    },
  ],
};
