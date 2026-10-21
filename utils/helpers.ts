import fs from "fs";
import axios from "axios";
import { faker } from "@faker-js/faker";
import test, { expect, Page, TestInfo } from "@playwright/test";
const jsonProfil = require("../data/credentials.json");
import { mockCookieConsent } from "./consent";
import { performAccessibilityScan } from "./accessibilityChecker";
import { StepScanResult, Address, ScenarioKOLog } from "./types";
import { BrowserContext } from "@playwright/test";

const URLS_PATH = require("../data/urlPath.json");

export class Utils {
  static getBaseUrl(ENV: string | undefined) {
    let url: string;
    if (ENV === "develop") {
      url = `https://${ENV}--jel-poker.netlify.app/fr`;
    } else if (ENV === "pre-prod") {
      url = "https://poker-uat.barriereplay.fr/fr";
    } else {
      url = "http://localhost:3000/fr";
    }
    return url;
  }

  static getPathUrl(path: string) {
    return URLS_PATH[path]["urlPath"];
  }

  static createRandomUser() {
    const tabGender = ["Madame", "Monsieur"];
    return {
      gender: tabGender[Math.floor(Math.random() * 2)],
      email: faker.internet.email(),
      password: `${faker.internet.password()}$Aa1`,
      birthDate: faker.date.birthdate(),
      lastName: faker.person.lastName(),
      firstName: faker.person.firstName()
    };
  }

  static async getAddress(type: string, postCode: number): Promise<Address> {
    let data: Address;
    const response = await axios.get(`https://api-adresse.data.gouv.fr/search/?q=${type}&postcode=${postCode}`);
    if (response.status === 200) {
      data = {
        address: response.data.features[0].properties.label,
        postcode: response.data.features[0].properties.postcode,
        city: response.data.features[0].properties.city,
        street: response.data.features[0].properties.street
      };
    } else {
      data = {
        address: "6 Boulevard Roger Salengro ",
        postcode: "93190",
        city: "Livry-Gargan",
        street: "6 Boulevard Roger Salengro"
      };
    }
    return data;
  }

  static async saveDataScenarioKO(scenarioName: string, data: any) {
    const fileName = "data_scenarios_ko.json";

    let existingData: ScenarioKOLog[] = [];

    if (fs.existsSync(fileName)) {
      const raw = fs.readFileSync(fileName, "utf-8");
      existingData = JSON.parse(raw) as ScenarioKOLog[];
    }

    existingData.push({
      scenario: scenarioName,
      timestamp: new Date().toISOString(),
      data
    });

    fs.writeFileSync(fileName, JSON.stringify(existingData, null, 2), "utf-8");
  }

  static async patchCaptcha(page: any, clientId: string) {
    const response = await page.request.post("https://api-uat.groupebarriere.com/public-identity-api/users/signupSessions", {
      headers: { clientId: clientId },
      data: { recaptchaToken: "recaptcha_automated_tests_valid" }
    });
    const data = await response.json();
    const sessionId = data.sessionId;

    await page.addInitScript((sessionId: string) => {
      localStorage.setItem("sessionId", sessionId);

      Object.defineProperty(window, "grecaptcha", {
        writable: true,
        value: {
          enterprise: {
            ready: (cb: () => void) => cb(),
            execute: async (_siteKey: string, _options: any) => {
              return "recaptcha_automated_tests_valid";
            },
            render: () => {},
            reset: () => {},
            getResponse: () => "recaptcha_automated_tests_valid"
          }
        }
      });
    }, sessionId);
    await page.reload();

    await page.route("/recaptcha/", (route: any) => route.abort());
    await page.route("/gstatic.com/recaptcha/", (route: any) => route.abort());
  }

  static async setPasswordEnv(page: any) {
    if (process.env.ENV !== "LOCAL") {
      await page.locator('[name="password"]').fill("GlbJel2024Netlify");
      await page.getByRole("button", { name: "Submit" }).click();
      await expect(page.getByRole("button", { name: "Submit" })).toBeHidden({
        timeout: 10000
      });
    }
  }

  static async checkUrl(page: Page, expectedPath: string) {
    const escapedPath = expectedPath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    await expect(page).toHaveURL(new RegExp(escapedPath), { timeout: 20000 });
  }

  static getLogoByAlt(page: Page, alt: string) {
    return page.locator(`img[alt="${alt}"]`);
  }

  static async doLogout(page: Page) {
    await page.waitForTimeout(5000);
    await page.locator('[class="flex items-center justify-center rounded-full bg-white p-2.5"]').click({ timeout: 10000 });
    const companion = page.locator('[data-testid="navigation-companion"]');
    await expect(companion).toContainText(jsonProfil["profil-ok"].personalInfo.firstName, { timeout: 15000 });
    await page.getByTestId("navigation-companion-logout").click({ timeout: 15000 });
    await expect(page.getByTestId("navigation-companion-logout")).toBeHidden({
      timeout: 20000
    });
    await page.waitForLoadState("domcontentloaded");
    await page.waitForURL("**/fr", { timeout: 20000 });
    await expect(page.url()).toContain("/fr");
    await expect(page.locator("#header-sticky-navigation")).toBeVisible({
      timeout: 15000
    });
    await mockCookieConsent(page);
    await page.reload();
    await page.waitForLoadState("load");
    await expect(page.locator("#header-sticky-navigation")).toBeVisible({
      timeout: 15000
    });
    await expect(page.locator("#side-menu-actions")).toBeVisible({
      timeout: 15000
    });
  }

  static async doLogoutMobile(page: Page) {
    const svgHandle = page.locator('[data-icon="account-outline"]').first();
    await svgHandle.click();

    const logoutButton = page
      .locator('[data-testid="navigation-companion-logout"]')
      .filter({ has: page.locator(":visible") })
      .first();

    await logoutButton.scrollIntoViewIfNeeded();
    await logoutButton.waitFor({ state: "visible" });
    await logoutButton.click();
    await page.waitForURL("**/fr");
    await mockCookieConsent(page);
  }

  static generateRandomMail() {
    return `testuser_${Date.now()}@qatestbarriereteam.testinator.email `;
  }

  static generateProfileMail(profileName: string) {
    return `${profileName}-${Date.now()}@qatestbarriereteam.testinator.email `;
  }

  static async getLastOTP(generatedEmail: string, retries = 3, delayMs = 3000): Promise<string | null> {
    const apiToken = "a6e7d20a391e473388c5d3d801a4a64b";

    for (let attempt = 1; attempt <= retries; attempt++) {
      console.log(`Tentative ${attempt}/${retries} de récupération de l'OTP...`);

      const inboxResponse = await axios.get(`https://api.mailinator.com/api/v2/domains/private/inboxes/${generatedEmail.split("@")[0]}`, {
        headers: { Authorization: apiToken }
      });

      const messages = inboxResponse.data.msgs;
      console.log("Messages reçus:", messages.length);

      const otpMail = messages.find((m) => m.from.includes("Notifications") || m.subject?.toLowerCase().includes("sms"));

      console.log(generatedEmail);
      console.log("OTP Mail trouvé:", otpMail);

      if (!otpMail) {
        if (attempt < retries) {
          console.log(`Mail OTP non trouvé, nouvel essai dans ${delayMs / 1000}s...`);
          await new Promise((resolve) => setTimeout(resolve, delayMs));
          continue;
        }
        console.log("Mail OTP introuvable après", retries, "tentatives.");
        return null;
      }

      const messageResponse = await axios.get(`https://api.mailinator.com/api/v2/domains/private/messages/${otpMail.id}`, {
        headers: { Authorization: apiToken }
      });

      const otpCodeMatch = messageResponse.data.parts[0].body.match(/\b\d{4,8}\b/);
      const otpCode = otpCodeMatch ? otpCodeMatch[0] : null;
      console.log("OTP Code trouvé:", otpCode);
      return otpCode;
    }

    return null;
  }

  static async getLastResetPasswordLink(email: string): Promise<string | null> {
    const apiToken = "a6e7d20a391e473388c5d3d801a4a64b";
    const inbox = email.split("@")[0];
    const inboxUrl = `https://api.mailinator.com/api/v2/domains/private/inboxes/${inbox}`;

    const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

    const extractResetLink = (text: string): string | null => {
      const match = text.match(/https?:\/\/[^\s"'<>]+\/fr\/resetPassword\?[^\s"'<>]+/i);
      return match?.[0] ?? null;
    };

    for (let attempt = 0; attempt < 60; attempt++) {
      try {
        const inboxResponse = await axios.get(inboxUrl, {
          headers: { Authorization: apiToken }
        });

        const messages = inboxResponse.data.msgs as Array<any>;
        const lastMail = messages[0];

        if (!lastMail?.id) {
          await sleep(5000);
          continue;
        }

        const messageResponse = await axios.get(`https://api.mailinator.com/api/v2/domains/private/messages/${lastMail.id}`, {
          headers: { Authorization: apiToken }
        });

        const parts = (messageResponse.data.parts ?? []) as Array<any>;
        const body = parts
          .map((p) => p?.body)
          .filter((b): b is string => typeof b === "string")
          .join("\n");

        const link = extractResetLink(body);
        if (!link) {
          await sleep(5000);
          continue;
        }

        return link;
      } catch {
        await sleep(5000);
      }
    }

    return null;
  }
  static async clearConsentAndReload(page: Page) {
    await page.evaluate(() => {
      localStorage.removeItem("euconsent-v2");
    });
    await page.reload({ waitUntil: "load" });
  }

  static async generatePhoneNumber(): Promise<string> {
    const randomDigits = Math.floor(Math.random() * 100000000);
    const paddedDigits = randomDigits.toString().padStart(8, "0");
    return `7${paddedDigits}`;
  }

  static async softAccessibilityScan(
    page: Page,
    testInfo: TestInfo,
    options: { disableRules?: string[]; softFailRules?: string[]; stepName: string },
    results: StepScanResult[]
  ) {
    await test.step(` A11y scan – ${options.stepName}`, async () => {
      const passed = await performAccessibilityScan(page, testInfo, options);

      results.push({ step: options.stepName, passed });
    });
  }

  static async bypassNetlifySecurityIfDisplayed(page: Page): Promise<void> {
    await page.waitForTimeout(3000);
    const securityCard = page.locator("[class='card']");

    if (await securityCard.isVisible({ timeout: 5000 }).catch(() => false)) {
      await page.locator('[name="password"]').fill("GlbJel2024Netlify");
      await page.getByRole("button", { name: "Submit" }).click();
    }
  }
}
