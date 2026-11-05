import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./src/tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: "html",
  use: {
    baseURL: "http://localhost:5173",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: [
    {
      command: "pnpm --filter cafeteria-origen-backend dev",
      url: "http://localhost:3000/health",
      reuseExistingServer: !process.env.CI,
      env: { NODE_ENV: "test" },
    },
    {
      command: "pnpm preview",
      url: "http://localhost:5173",
      reuseExistingServer: !process.env.CI,
    },
  ],
});
