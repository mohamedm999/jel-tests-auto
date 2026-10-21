import { test as base, expect, Page, BrowserContext } from "@playwright/test";
import path from "path";
import fs from "fs";
import { Utils } from "../../utils/helpers";
import { mockCookieConsent } from "../../utils/consent";

const credentialsPath = path.join(__dirname, "../../data/credentials.json");
const authDir = path.join(__dirname, "../../.auth");
const netlifyStateFile = path.join(authDir, "netlify.json");

if (!fs.existsSync(authDir)) {
  fs.mkdirSync(authDir, { recursive: true });
}

type AuthFixtures = {
  page: Page;
  account: string | null;
};

async function createContextWithNetlify(browser: any): Promise<BrowserContext> {
  if (fs.existsSync(netlifyStateFile)) {
    try {
      return await browser.newContext({ storageState: netlifyStateFile });
    } catch {
      return await browser.newContext();
    }
  }
  return await browser.newContext();
}

async function humanFillWithRetry(page: Page, selector: string, value: string, maxRetries: number = 5) {
  const input = page.locator(selector);

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    await input.click();
    await input.press("Control+A");
    await input.press("Backspace");
    await page.waitForTimeout(200 + Math.random() * 300);
    for (const char of value) {
      await input.type(char, { delay: 60 + Math.random() * 120 });
    }
    const currentValue = await input.inputValue();
    if (currentValue === value) return;
    await page.waitForTimeout(300);
  }

  throw new Error(`Unable to correctly fill ${selector}`);
}

async function login(page: Page, credentials: { login: string; password: string }): Promise<void> {
  const currentUrl = page.url().split("?")[0];
  if (!currentUrl.includes("r5_request_token") && !currentUrl.includes("login")) {
    await mockCookieConsent(page);
    await page.getByText("Se connecter", { exact: true }).click();
    await page.waitForURL(/.*r5_request_token/, { timeout: 120000 });
  }

  await humanFillWithRetry(page, '[name="email"]', credentials.login);
  await humanFillWithRetry(page, '[name="password"]', credentials.password);
  await page.getByTestId("connect-button").click();

  const mfaModal = page.locator("#personal-user-data");
  const isMfaVisible = await mfaModal
    .waitFor({ state: "visible", timeout: 5000 })
    .then(() => true)
    .catch(() => false);

  if (isMfaVisible) {
    await page.waitForTimeout(3000);
    let otp: string | null;
    otp = await Utils.getLastOTP(credentials.login);
    if (!otp || otp.length < 4) {
      throw new Error("OTP non reçu ou format invalide");
    }
    const boxOTP = page.locator(".box-border");
    await boxOTP.nth(0).waitFor({ state: "visible", timeout: 50000 });
    for (let i = 0; i < otp.length; i++) {
      await boxOTP.nth(i).fill(otp.charAt(i));
    }
  }

  const netlifyCard = page.locator(".card");
  const isNetlifyCardVisible = await netlifyCard
    .waitFor({ state: "visible", timeout: 5000 })
    .then(() => true)
    .catch(() => false);

  if (isNetlifyCardVisible) {
    await mockCookieConsent(page);
    await page.locator('[name="password"]').fill("GlbJel2024Netlify");
    await page.getByRole("button", { name: "Submit" }).click();

    const isDevelop = process.env.ENV === "develop";
    if (isDevelop) {
      await page.goto("https://develop--jel-poker.netlify.app/fr", {
        timeout: 250000,
        waitUntil: "load"
      });
    }

    const loginButton = page.getByRole("button", { name: "Se connecter" });
    await loginButton.waitFor({ state: "visible" });
    await loginButton.click();
    await page.waitForURL(/.*r5_request_token/);
    await humanFillWithRetry(page, '[name="email"]', credentials.login);
    await humanFillWithRetry(page, '[name="password"]', credentials.password);
    await page.getByTestId("connect-button").click();
  }

  await page.getByTestId("balance-account").waitFor({ state: "visible", timeout: 60000 });

  await mockCookieConsent(page);
}

function isSessionValid(cookies: any[]): boolean {
  const hasSession = cookies.some((c: any) => c.name === "__Host-SESSION");
  const hasReauth = cookies.some((c: any) => c.name === "reauth_required");
  return hasSession && !hasReauth;
}

async function saveOrInvalidateSession(context: BrowserContext, accountAuthFile: string): Promise<void> {
  const cookiesAfterTest = await context.cookies();
  const sessionSurvived = cookiesAfterTest.some((c) => c.name === "__Host-SESSION");
  const reauthAppeared = cookiesAfterTest.some((c) => c.name === "reauth_required");

  if (!sessionSurvived || reauthAppeared) {
    if (fs.existsSync(accountAuthFile)) {
      fs.unlinkSync(accountAuthFile);
    }
  } else {
    await context.storageState({ path: accountAuthFile });
  }
}

async function performFreshLogin(
  browser: any,
  account: string,
  profile: { login: string; password: string },
  accountAuthFile: string,
  use: (page: Page) => Promise<void>
): Promise<void> {
  const context = await createContextWithNetlify(browser);
  const page = await context.newPage();
  await mockCookieConsent(page);
  await page.goto("/", { timeout: 250000, waitUntil: "load" });
  await page.waitForTimeout(5000);
  await login(page, { login: profile.login, password: profile.password });
  await use(page);
  await saveOrInvalidateSession(context, accountAuthFile);
  await page.close();
  await context.close();
}

export const test = base.extend<AuthFixtures>({
  account: [null, { option: true }],

  page: async ({ browser, account }, use) => {
    let context: BrowserContext;
    let page: Page;

    if (account) {
      const accountAuthFile = path.join(authDir, `user-${account}.json`);
      const allCredentials = JSON.parse(fs.readFileSync(credentialsPath, "utf-8"));
      const profile = allCredentials[account];
      if (!profile) {
        throw new Error(`Profile ${account} not found in credentials.json`);
      }

      // Branch 1 — auth file exists, try to load and verify session
      if (fs.existsSync(accountAuthFile)) {
        try {
          const fileContent = fs.readFileSync(accountAuthFile, "utf-8");
          const authData = JSON.parse(fileContent);
          const hasNoCookies = !authData.cookies || authData.cookies.length === 0;
          const sessionInvalid = !isSessionValid(authData.cookies || []);

          if (hasNoCookies || sessionInvalid) {
            // Cookies look dead client-side — delete immediately
            fs.unlinkSync(accountAuthFile);
          } else {
            // Cookies look valid client-side — verify with server
            context = await browser.newContext({
              storageState: accountAuthFile
            });
            page = await context.newPage();
            await page.goto("/", { waitUntil: "load", timeout: 60000 });

            const isLoggedIn = await page
              .getByTestId("balance-account")
              .isVisible()
              .catch(() => false);

            if (!isLoggedIn) {
              // Server rejected the session — clean up and fall through to fresh login
              await page.close();
              await context.close();
              fs.unlinkSync(accountAuthFile);
            } else {
              // Session confirmed alive — run the test
              await use(page);
              await saveOrInvalidateSession(context, accountAuthFile);
              await page.close();
              await context.close();
              return;
            }
          }
        } catch {
          if (fs.existsSync(accountAuthFile)) {
            fs.unlinkSync(accountAuthFile);
          }
        }
      }

      // Branch 2 — no valid auth file or server rejected session, perform fresh login
      await performFreshLogin(browser, account, profile, accountAuthFile, use);
    } else {
      // Branch 3 — no account, unauthenticated context
      context = await createContextWithNetlify(browser);
      page = await context.newPage();
      await use(page);
      await page.close();
      await context.close();
    }
  }
});

export const loginWithProfile = {
  use: (options: { account: string }) => {
    test.use({ account: options.account });
  }
};

export { expect };
