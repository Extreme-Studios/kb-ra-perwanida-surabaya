import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/browser", fullyParallel: false, workers: 1,
  reporter: [["list"], ["html", { open: "never" }]],
  use: { baseURL: "http://localhost:3215", browserName: "chromium", headless: true,
    launchOptions: { channel: "chrome" }, trace: "retain-on-failure" },
  webServer: { command: "npm run start -- --port 3215", url: "http://localhost:3215", reuseExistingServer: true, timeout: 120000 },
});
