import { defineConfig } from "@playwright/test";

// FE 1.6 only. Does not run or retry the older FE 1.4/1.5 suites.
const environment = {
  DEMO_USERNAME: "synthetic-comparison-operator",
  DEMO_PASSWORD: "synthetic-comparison-password",
  DEMO_ALLOWED_ORIGIN: "http://127.0.0.1:3350",
  VERCEL: "",
  VERCEL_ENV: "development",
};
export default defineConfig({
  testDir: "./tests/comparison-e2e",
  workers: 1,
  retries: 0,
  timeout: 30_000,
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:3350",
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
      url: "http://127.0.0.1:3351/health",
      env: {
        ...environment,
        SENIALON_SYNTHETIC_TEST_ONLY: "1",
        SENIALON_SYNTHETIC_PORT: "3351",
      },
      reuseExistingServer: false,
    },
    {
      command: "npm run start -- --hostname 127.0.0.1 --port 3350",
      url: "http://127.0.0.1:3350",
      env: { ...environment, SENIALON_BACKEND_URL: "http://127.0.0.1:3351/" },
      reuseExistingServer: false,
    },
  ],
});
