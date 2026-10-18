import { defineConfig } from "@playwright/test";

// Separate from the Next–FastAPI suite: these scenarios are synthetic contracts.
const environment = {
  DEMO_USERNAME: "synthetic-e2e-operator",
  DEMO_PASSWORD: "synthetic-e2e-only-password",
  DEMO_ALLOWED_ORIGIN: "http://127.0.0.1:3340",
  VERCEL: "",
  VERCEL_ENV: "development",
};
export default defineConfig({
  testDir: "./tests/runs-e2e",
  workers: 1,
  retries: 0,
  timeout: 30_000,
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:3340",
    browserName: "chromium",
    httpCredentials: {
      username: environment.DEMO_USERNAME,
      password: environment.DEMO_PASSWORD,
    },
    trace: "off",
    screenshot: "off",
  },
  webServer: [
    {
      command: "node tests/fixtures/runs-server.mjs",
      url: "http://127.0.0.1:3341/health",
      env: { ...environment, SENIALON_SYNTHETIC_TEST_ONLY: "1" },
      reuseExistingServer: false,
    },
    {
      command: "npm run start -- --hostname 127.0.0.1 --port 3340",
      url: "http://127.0.0.1:3340",
      env: { ...environment, SENIALON_BACKEND_URL: "http://127.0.0.1:3341/" },
      reuseExistingServer: false,
    },
  ],
});
