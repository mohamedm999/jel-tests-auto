import { defineConfig, devices } from "@playwright/test";
import { Utils } from "./utils/helpers";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  forbidOnly: false,
  //forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ["html", { outputFolder: "playwright-report", open: "never" }],
    [
      "playwright-ctrf-json-reporter",

      {
        outputFile: "/ctrf-report.json",
        buildUrl: `https://groupe-lucien-barriere.gitlab.io/-/online-apps/jel-tests-auto/-/jobs/${process.env.CI_JOB_ID}/artifacts/playwright-report/index.html`,
        buildName: `View more details`,
        buildNumber: process.env.CI_PIPELINE_IID || "1"
      }
    ],
    [
      "playwright-ctrf-json-reporter",
      {
        outputFile: "/ctrf-report-desktop-poker.json",
        buildUrl: `https://groupe-lucien-barriere.gitlab.io/-/online-apps/jel-tests-auto/-/jobs/${process.env.CI_JOB_ID}/artifacts/playwright-report/index.html`,
        buildName: `View more details for desktop tests`,
        buildNumber: process.env.CI_PIPELINE_IID || "1"
      }
    ],
    [
      "playwright-ctrf-json-reporter",
      {
        outputFile: "/ctrf-report-desktop-account.json",
        buildUrl: `https://groupe-lucien-barriere.gitlab.io/-/online-apps/jel-tests-auto/-/jobs/${process.env.CI_JOB_ID}/artifacts/playwright-report/index.html`,
        buildName: `View more details for desktop tests`,
        buildNumber: process.env.CI_PIPELINE_IID || "1"
      }
    ],
    [
      "playwright-ctrf-json-reporter",
      {
        outputFile: "/ctrf-report-mobile.json",
        buildUrl: `https://groupe-lucien-barriere.gitlab.io/-/online-apps/jel-tests-auto/-/jobs/${process.env.CI_JOB_ID}/artifacts/playwright-report/index.html`,
        buildName: `View more details for mobile tests`,
        buildNumber: process.env.CI_PIPELINE_IID || "1"
      }
    ],
    [
      "playwright-ctrf-json-reporter",
      {
        outputFile: "/ctrf-report-web-view.json",
        buildUrl: `https://groupe-lucien-barriere.gitlab.io/-/online-apps/jel-tests-auto/-/jobs/${process.env.CI_JOB_ID}/artifacts/playwright-report/index.html`,
        buildName: `View more details for web view tests`,
        buildNumber: process.env.CI_PIPELINE_IID || "1"
      }
    ],
    [
      "playwright-ctrf-json-reporter",
      {
        outputFile: "/ctrf-report-safari.json",
        buildUrl: `https://groupe-lucien-barriere.gitlab.io/-/online-apps/jel-tests-auto/-/jobs/${process.env.CI_JOB_ID}/artifacts/playwright-report/index.html`,
        buildName: `View more details for safari mobile tests`,
        buildNumber: process.env.CI_PIPELINE_IID || "1"
      }
    ],
    [
      "playwright-ctrf-json-reporter",
      {
        outputFile: "/ctrf-report-firefox.json",
        buildUrl: `https://groupe-lucien-barriere.gitlab.io/-/online-apps/jel-tests-auto/-/jobs/${process.env.CI_JOB_ID}/artifacts/playwright-report/index.html`,
        buildName: `View more details for firefox tests`,
        buildNumber: process.env.CI_PIPELINE_IID || "1"
      }
    ],
    [
      "playwright-ctrf-json-reporter",
      {
        outputFile: "/ctrf-report-accessibility.json",
        buildUrl: `https://groupe-lucien-barriere.gitlab.io/-/online-apps/jel-tests-auto/-/jobs/${process.env.CI_JOB_ID}/artifacts/a11y-report.html`,
        buildName: `View more details for accessibility tests`,
        buildNumber: process.env.CI_PIPELINE_IID || "1"
      }
    ]
  ],
  timeout: 240 * 1000,
  use: {
    actionTimeout: 30 * 1000,
    navigationTimeout: 120 * 1000,
    screenshot: "only-on-failure",
    ignoreHTTPSErrors: true,
    baseURL: Utils.getBaseUrl(process.env.ENV),
    trace: "retain-on-failure"
  },
  projects: [
    {
      name: "setup",
      testMatch: /.*\.setup\.ts/
    },
    {
      name: "chromium-local",

      use: {
        ...devices["Desktop Chrome"]
      },
      dependencies: ["setup"],
      testIgnore: ["**/mobile/**", "**/webView/**", "**/accessibility/**"]
    },
    {
      name: "chromium-poker",

      use: {
        // storageState: ".auth/user.json",
        ...devices["Desktop Chrome"]
      },
      dependencies: ["setup"],
      testIgnore: ["**/mobile/**", "**/webView/**", "**/setupEnv.spec.ts", "**/accessibility/**", "**/login/**", "**/signup/**"]
    },
    {
      name: "chromium-account",

      use: {
        // storageState: ".auth/user.json",
        ...devices["Desktop Chrome"]
      },
      dependencies: ["setup"],
      testMatch: ["**/login/**", "**/signup/**"]
    },
    {
      name: "firefox",

      use: {
        ...devices["Desktop Firefox"],
        launchOptions: {
          firefoxUserPrefs: {
            "browser.cache.disk.enable": false,
            "browser.cache.memory.enable": false,
            "layers.acceleration.disabled": true,
            "gfx.webrender.all": false
          }
        }
      },
      dependencies: ["setup"],
      testIgnore: ["**/mobile/**", "**/webView/**", "**/setupEnv.spec.ts", "**/accessibility/**"]
    },
    {
      name: "chrome-mobile",

      use: {
        browserName: "chromium",
        ...devices["Pixel 5"],
        isMobile: true,
        storageState: ".auth/user.json"
      },
      dependencies: ["setup"],
      testIgnore: [
        "**/account/**",
        "**/home/**",
        "**/login/**",
        "**/poker/**",
        "**/signup/**",
        "**/webView/**",
        "**/limits/**",
        "**/setupEnv.spec.ts",
        "**/accessibility/**"
      ]
    },
    {
      name: "safari-mobile",
      use: {
        browserName: "webkit",
        ...devices["iPhone 13"],
        storageState: ".auth/netlify.json"
      },
      dependencies: ["setup"],
      testIgnore: [
        "**/account/**",
        "**/home/**",
        "**/login/**",
        "**/poker/**",
        "**/signup/**",
        "**/webView/**",
        "**/limits/**",
        "**/setupEnv.spec.ts",
        "**/accessibility/**"
      ]
    },
    {
      name: "chrome-webview",

      use: {
        browserName: "chromium",
        ...devices["Desktop Chrome"],
        storageState: ".auth/netlify.json"
      },
      dependencies: ["setup"],
      testIgnore: [
        "**/home/**",
        "**/login/**",
        "**/account/**",
        "**/mobile/**",
        "**/poker/**",
        "**/signup/**",
        "**/limits/**",
        "**/setupEnv.spec.ts",
        "**/accessibility/**"
      ]
    },
    {
      name: "chrome-accessibility",

      use: {
        browserName: "chromium",
        ...devices["Desktop Chrome"],
        storageState: ".auth/netlify.json"
      },
      dependencies: ["setup"],
      testMatch: ["**/accessibility/**"]
    }
  ]

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
