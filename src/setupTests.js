/**
 * setupTests.js
 * Global test setup executed before every test file.
 * - Imports @testing-library/jest-dom matchers (toBeInTheDocument etc.)
 * - Installs a no-op stub for window.gtag so GA4 code paths run cleanly
 * - Stubs global fetch so network calls don't escape to the real internet
 */

import '@testing-library/jest-dom';
import { vi, afterEach } from 'vitest';

// ── Stub window.gtag ──────────────────────────────────────────────────────────
// GA4 script is injected by the HTML shell in production; it's absent in tests.
// Components that call window.gtag must not throw when it is undefined.
globalThis.window = globalThis.window || {};
window.gtag = vi.fn();

// ── Stub window.scrollTo ──────────────────────────────────────────────────────
window.scrollTo = vi.fn();

// ── Stub Element.scrollIntoView ───────────────────────────────────────────────
// jsdom does not implement scrollIntoView; stub it to prevent errors in
// components that call ref.current?.scrollIntoView()
Element.prototype.scrollIntoView = vi.fn();

// ── Stub global fetch ─────────────────────────────────────────────────────────
// Individual test files override this with vi.stubGlobal / mockResolvedValue
// to control specific API responses. The default is a generic empty response.
if (!globalThis.fetch) {
  globalThis.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({}),
    }),
  );
}

// ── Clean up mocks after every test ──────────────────────────────────────────
afterEach(() => {
  vi.clearAllMocks();
});
