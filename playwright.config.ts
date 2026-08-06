import { defineConfig, devices } from "@playwright/test";

// End-to-end tests run against a real running instance (dev server or
// deployed preview) with a seeded database (npm run db:seed).
// Override the target with PLAYWRIGHT_BASE_URL, e.g. a Vercel preview URL.
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000";

export default defineConfig({
    testDir: "./tests/e2e",
    fullyParallel: true,
    retries: process.env.CI ? 1 : 0,
    reporter: [["html", { open: "never" }]],
    use: {
        baseURL,
        trace: "on-first-retry",
    },
    projects: [
        { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    ],
    // Only auto-start a dev server when no external URL was given.
    webServer: process.env.PLAYWRIGHT_BASE_URL
        ? undefined
        : {
              command: "npm run dev",
              url: "http://localhost:3000",
              reuseExistingServer: !process.env.CI,
              timeout: 120_000,
          },
});
