import { test } from "./fixtures/fixtures";
import { Utils } from "../utils/helpers";
import path from "path";
import fs from "fs";
import { mockCookieConsent } from "../utils/consent";

const credentialsPath = path.join(__dirname, "../data/credentials.json");

// ─────────────────────────────────────────────
// Helper: save new profile to credentials.json
// ─────────────────────────────────────────────
function saveProfileToCredentials(
  key: string,
  email: string,
  password: string,
  personalInfo?: {
    civility: string;
    firstName: string;
    lastName: string;
    birthDate: string;
  }
) {
  const credentials = JSON.parse(fs.readFileSync(credentialsPath, "utf-8"));
  credentials[key] = {
    login: email.trim(),
    password: password.trim(),
    ...(personalInfo ? { personalInfo } : {})
  };
  fs.writeFileSync(credentialsPath, JSON.stringify(credentials, null, 2));
  console.log(`✅ Profile "${key}" saved to credentials.json`);
}

// ─────────────────────────────────────────────
// Reusable signup flow
// ─────────────────────────────────────────────
async function runSignupFlow(page: any, pages: any, testData: any, profileName: string) {
  await test.step("Generate test data", async () => {
    const dataApi = await Utils.getAddress("rue", 93190);
    const dataUser = Utils.createRandomUser();
    testData.infoUser = dataUser;
    testData.infoAddress = dataApi;
    testData.generatedEmail = Utils.generateProfileMail(profileName).trim();
  });

  await test.step("Fill credentials and submit", async () => {
    await pages.signUpPage.fillCredentialsWithGeneratedEmail(testData.generatedEmail, testData.infoUser.password);
    await pages.commonPage.submit(pages.signUpPage.submitForm);
    try {
      await pages.signUpPage.dismissOopsModalIfVisible();
      await page.waitForTimeout(5000);
      await pages.commonPage.submit(pages.signUpPage.submitForm);
    } catch (error) {
      console.log("No modal to close, continue with the flow");
    }
  });

  await test.step("Fill civility form", async () => {
    await pages.commonPage.visible(pages.askCivilityPage.form);
    await pages.commonPage.waitForNetworkIdle();
    await pages.askCivilityPage.selectGender(testData.infoUser.gender);
    await pages.askCivilityPage.fillForm(
      testData.infoUser.gender,
      testData.infoUser.firstName,
      testData.infoUser.lastName,
      testData.infoUser.birthDate
    );
    await pages.commonPage.submit(pages.signUpPage.submitForm);
  });

  await test.step("Fill phone number and submit", async () => {
    await page.waitForLoadState("load");
    await pages.commonPage.waitForNetworkIdle();
    await pages.commonPage.visible(page.getByTestId("signup-phone-form"));
    await pages.postalAdressPage.fillFormPhoneNumber();
    await pages.commonPage.submit(pages.signUpPage.submitForm);
  });

  await test.step("Validate OTP and complete profile", async () => {
    await page.waitForTimeout(5000);
    await pages.signUpPage.getOtpFromEmailContent(testData.generatedEmail);
    await pages.signUpPage.clickCompleteProfile();
  });

  await test.step("Fill birth place form and submit", async () => {
    await pages.commonPage.visible(pages.birthPlacePage.form);
    await pages.birthPlacePage.fillForm("Paris");
    await page.waitForTimeout(2000);
    await pages.commonPage.submit(pages.signUpPage.submitForm);
  });

  await test.step("Confirm nationality and submit", async () => {
    await pages.commonPage.visible(page.getByTestId("signup-nationality-form"));
    await pages.commonPage.submit(pages.signUpPage.submitForm);
  });

  await test.step("Fill postal address and submit", async () => {
    await pages.commonPage.visible(pages.postalAdressPage.form);
    await pages.postalAdressPage.fillForm(testData.infoAddress);
    await pages.commonPage.submit(pages.signUpPage.submitForm);
  });

  await test.step("Skip identity document upload", async () => {
    await pages.signUpPage.skipUploadDocument();
  });

  await test.step("Skip postal address confirmation", async () => {
    await pages.signUpPage.clickLaterButton();
  });

  await test.step("Define limits later", async () => {
    await page.waitForURL(/.*total_steps=15.*/);
    await page.waitForTimeout(5000);
    await pages.signUpPage.waitForProgress();
    await pages.signUpPage.defineLimitsLater();
  });

  await test.step("Complete sign up", async () => {
    await pages.signUpPage.endSignUp();
  });
}

// ═════════════════════════════════════════════
// SETUP ENV — serial: signup first, then connexion
// ═════════════════════════════════════════════

test.describe.serial("setupEnv", () => {
  // ───────────────────────────────────────────
  // BLOCK 1 — Login existing profiles to warm up storageState
  // ───────────────────────────────────────────

  test.describe("Login existing profiles", () => {
    const existingProfiles = ["profil-ok", "profil-game-no-sold", "profil-game-no-limit-defined"];

    for (const profile of existingProfiles) {
      test.describe(`Login - ${profile}`, () => {
        test.use({ account: profile });

        test(`@setup Login with ${profile}`, async ({ page }) => {
          test.setTimeout(190000);
          await page.getByTestId("balance-account").waitFor({ state: "visible", timeout: 60000 });
        });
      });
    }
  });

  // ───────────────────────────────────────────
  // BLOCK 2 — Create profiles via signup
  // ───────────────────────────────────────────

  test.describe("Create profiles", () => {
    test.beforeEach(async ({ page, pages }) => {
      test.setTimeout(190000);
      await mockCookieConsent(page);
      await page.goto("/");
      await page.waitForLoadState("load");
      await pages.commonPage.waitForNetworkIdle();
      await pages.signUpPage.goToSignUpPage();
      await Utils.patchCaptcha(page, "kJW1UheTwY96b0l5vyFX");
      await pages.commonPage.waitForNetworkIdle();
    });

    test("@setup Create profile - trust device", async ({ page, pages, testData }) => {
      test.setTimeout(190000);
      await runSignupFlow(page, pages, testData, "trust-device-profile");
      await test.step("Save profile to credentials.json", async () => {
        saveProfileToCredentials("profil-trust-device", testData.generatedEmail, testData.infoUser.password, {
          civility: testData.infoUser.gender,
          firstName: testData.infoUser.firstName,
          lastName: testData.infoUser.lastName,
          birthDate: testData.infoUser.birthDate
        });
      });
    });

    test("@setup Create profile - reinit pwd", async ({ page, pages, testData }) => {
      test.setTimeout(190000);
      await runSignupFlow(page, pages, testData, "reinit-pwd-profile");
      await test.step("Save profile to credentials.json", async () => {
        saveProfileToCredentials("profil-reinit-pwd", testData.generatedEmail, testData.infoUser.password, {
          civility: testData.infoUser.gender,
          firstName: testData.infoUser.firstName,
          lastName: testData.infoUser.lastName,
          birthDate: testData.infoUser.birthDate
        });
      });
    });

    test("@setup Create profile - compte bloqué", async ({ page, pages, testData }) => {
      test.setTimeout(190000);
      await runSignupFlow(page, pages, testData, "compte-bloque-profile");
      await test.step("Save profile to credentials.json", async () => {
        saveProfileToCredentials("profil-blocked-account", testData.generatedEmail, testData.infoUser.password, {
          civility: testData.infoUser.gender,
          firstName: testData.infoUser.firstName,
          lastName: testData.infoUser.lastName,
          birthDate: testData.infoUser.birthDate
        });
      });
    });

    test("@setup Create profile - 30/60 jours", async ({ page, pages, testData }) => {
      test.setTimeout(190000);
      await runSignupFlow(page, pages, testData, "profil-between-30-60");
      await test.step("Save profile to credentials.json", async () => {
        saveProfileToCredentials("profil-between-30-60", testData.generatedEmail, testData.infoUser.password, {
          civility: testData.infoUser.gender,
          firstName: testData.infoUser.firstName,
          lastName: testData.infoUser.lastName,
          birthDate: testData.infoUser.birthDate
        });
      });
    });
  });
});
