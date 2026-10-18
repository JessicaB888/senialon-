import { defineConfig } from "@playwright/test";

// Synthetic credentials are confined to two disposable loopback test servers.
// This config deliberately accepts no remote baseURL or real demo credentials.
const environment = {
  DEMO_USERNAME: "synthetic-e2e-operator",
  DEMO_PASSWORD: "synthetic-e2e-only-password",
  DEMO_ALLOWED_ORIGIN: "http://127.0.0.1:3300",
  VERCEL: "",
  VERCEL_ENV: "development",
};

export default defineConfig({
  testDir: "./tests/e2e",
  workers: 1,
  retries: 0,
  timeout: 30_000,
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:3300",
    browserName: "chromium",
    trace: "off",
    screenshot: "off",
  },
  webServer: [
    {
      command:
        "uv run --project ../backend --locked --offline uvicorn main:app --app-dir ../backend --host 127.0.0.1 --port 3301 --no-access-log",
      url: "http://127.0.0.1:3301/api/v1/meta",
      env: environment,
      timeout: 30_000,
      reuseExistingServer: false,
    },
    {
      command: "npm run start -- --hostname 127.0.0.1 --port 3300",
      url: "http://127.0.0.1:3300",
      env: { ...environment, SENIALON_BACKEND_URL: "http://127.0.0.1:3301/" },
      timeout: 30_000,
      reuseExistingServer: false,
    },
  ],
});
