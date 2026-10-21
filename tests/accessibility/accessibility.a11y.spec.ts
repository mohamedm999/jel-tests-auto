import { performAccessibilityScan } from "../../utils/accessibilityChecker";
import { loginWithProfile, test } from "../fixtures/fixtures";
import { Utils } from "../../utils/helpers";
import { expect } from "@playwright/test";
import { mockCookieConsent } from "../../utils/consent";
import { StepScanResult } from "../../utils/types";

test.describe.configure({ retries: 0 });

test.describe("signup page accessibility", () => {
  test("credentials steps", async ({ page, pages, testData }, testInfo) => {
    await mockCookieConsent(page);
    await page.goto("/");
    await page.waitForLoadState("load");
    await pages.signUpPage.goToSignUpPage();
    await Utils.patchCaptcha(page, "kJW1UheTwY96b0l5vyFX");

    const scanOptions = {
      disableRules: ["region"],
      softFailRules: ["meta-viewport"]
    };

    const scanResults: StepScanResult[] = [];

    await test.step("Generate test data", async () => {
      const dataApi = await Utils.getAddress("rue", 93190);
      const dataUser = Utils.createRandomUser();
      testData.infoUser = dataUser;
      testData.infoAddress = dataApi;
      testData.generatedEmail = await Utils.generateRandomMail();
    });

    await test.step("Fill credentials and submit", async () => {
      await pages.signUpPage.fillCredentialsWithGeneratedEmail(testData.generatedEmail, testData.infoUser.password);
      await page.waitForTimeout(2000);
      await pages.commonPage.submit(pages.signUpPage.submitForm);
    });
    await Utils.softAccessibilityScan(page, testInfo, { ...scanOptions, stepName: "After credentials" }, scanResults);

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
    await Utils.softAccessibilityScan(page, testInfo, { ...scanOptions, stepName: "After civility form" }, scanResults);

    await test.step("Fill phone number and submit", async () => {
      await page.waitForLoadState("load");
      await pages.commonPage.visible(page.getByTestId("signup-phone-form"));
      await pages.postalAdressPage.fillFormPhoneNumber();
      await pages.commonPage.submit(pages.signUpPage.submitForm);
    });
    await Utils.softAccessibilityScan(page, testInfo, { ...scanOptions, stepName: "After phone number" }, scanResults);

    await test.step("Validate OTP and complete profile", async () => {
      await page.waitForTimeout(5000);
      await pages.signUpPage.getOtpFromEmailContent(testData.generatedEmail);
      await pages.signUpPage.clickCompleteProfile();
    });
    await Utils.softAccessibilityScan(page, testInfo, { ...scanOptions, stepName: "After OTP validation" }, scanResults);

    await test.step("Fill birth place form and submit", async () => {
      await pages.commonPage.visible(pages.birthPlacePage.form);
      await pages.birthPlacePage.fillForm("Paris");
      await pages.commonPage.submit(pages.signUpPage.submitForm);
    });
    await Utils.softAccessibilityScan(page, testInfo, { ...scanOptions, stepName: "After birth place" }, scanResults);

    await test.step("Confirm nationality and submit", async () => {
      await pages.commonPage.visible(page.getByTestId("signup-nationality-form"));
      await pages.commonPage.submit(pages.signUpPage.submitForm);
    });
    await Utils.softAccessibilityScan(page, testInfo, { ...scanOptions, stepName: "After nationality" }, scanResults);

    await test.step("Fill postal address and submit", async () => {
      await pages.commonPage.visible(pages.postalAdressPage.form);
      await pages.postalAdressPage.fillForm(testData.infoAddress);
      await pages.commonPage.submit(pages.signUpPage.submitForm);
    });
    await Utils.softAccessibilityScan(page, testInfo, { ...scanOptions, stepName: "After postal address" }, scanResults);

    await test.step("Skip identity document upload", async () => {
      await pages.signUpPage.skipUploadDocument();
    });
    await Utils.softAccessibilityScan(page, testInfo, { ...scanOptions, stepName: "After skip document upload" }, scanResults);

    await test.step("Skip postal address confirmation", async () => {
      await pages.signUpPage.clickLaterButton();
    });
    await Utils.softAccessibilityScan(page, testInfo, { ...scanOptions, stepName: "After skip postal confirmation" }, scanResults);

    await test.step("Define limits later", async () => {
      await page.waitForTimeout(2000);
      await pages.signUpPage.defineLimitsLater();
    });
    await Utils.softAccessibilityScan(page, testInfo, { ...scanOptions, stepName: "After define limits" }, scanResults);

    await test.step("Complete sign up", async () => {
      await pages.signUpPage.endSignUp();
    });
    await Utils.softAccessibilityScan(page, testInfo, { ...scanOptions, stepName: "After complete sign up" }, scanResults);
    const failedSteps = scanResults.filter((r) => !r.passed);

    if (failedSteps.length > 0) {
      const summary = failedSteps.map((r) => `   ✗ ${r.step}`).join("\n");

      throw new Error(
        `Accessibility hard violations found in ${failedSteps.length}/${scanResults.length} step(s):\n${summary}\n\n` +
          `→ See attachments "Accessibility Violations – <step name>" for details.`
      );
    }
  });
});

test("login page accessibility", async ({ page, pages }, testInfo) => {
  await mockCookieConsent(page);
  await page.goto("/");
  await page.waitForLoadState("load");
  await pages.homePage.goToLoginPage();

  const a11yPassed = await performAccessibilityScan(page, testInfo, {
    disableRules: ["region"],
    softFailRules: ["meta-viewport"]
  });

  expect(a11yPassed).toBeTruthy();
});

test("home page accessibility", async ({ page }, testInfo) => {
  await mockCookieConsent(page);
  await page.goto("/");
  await page.waitForLoadState("load");

  const a11yPassed = await performAccessibilityScan(page, testInfo, {
    disableRules: ["region"],
    softFailRules: ["meta-viewport"]
  });

  expect(a11yPassed).toBeTruthy();
});

test("forgot password page accessibility", async ({ page, pages }, testInfo) => {
  await mockCookieConsent(page);
  await page.goto("/");
  await page.waitForLoadState("load");
  await pages.homePage.goToLoginPage();
  await pages.connexionPage.clickForgotPasswordLink();
  await page.waitForLoadState("load");

  const a11yPassed = await performAccessibilityScan(page, testInfo, {
    disableRules: ["region"],
    softFailRules: ["meta-viewport"]
  });

  expect(a11yPassed).toBeTruthy();
});

test("promotions page accessibility", async ({ page, pages }, testInfo) => {
  await mockCookieConsent(page);
  await page.goto("/");
  await page.waitForLoadState("load");
  await pages.homePage.goToPromotionsPage();
  await page.waitForLoadState("load");

  const a11yPassed = await performAccessibilityScan(page, testInfo, {
    disableRules: ["region"],
    softFailRules: ["meta-viewport"]
  });

  expect(a11yPassed).toBeTruthy();
});

test("download app page accessibility", async ({ page, pages }, testInfo) => {
  await mockCookieConsent(page);
  await page.goto("/");
  await page.waitForLoadState("load");
  await pages.homePage.goToDownloadAppPage();
  await page.waitForLoadState("load");

  const a11yPassed = await performAccessibilityScan(page, testInfo, {
    disableRules: ["region"],
    softFailRules: ["meta-viewport"]
  });

  expect(a11yPassed).toBeTruthy();
});

test("prevention page accessibility", async ({ page, pages }, testInfo) => {
  await mockCookieConsent(page);
  await page.goto("/");
  await page.waitForLoadState("load");
  await pages.homePage.goToPreventionPage();
  await page.waitForLoadState("load");

  const a11yPassed = await performAccessibilityScan(page, testInfo, {
    disableRules: ["region"],
    softFailRules: ["meta-viewport"]
  });

  expect(a11yPassed).toBeTruthy();
});

test("loyalty page accessibility", async ({ page, pages }, testInfo) => {
  await mockCookieConsent(page);
  await page.goto("/");
  await page.waitForLoadState("load");
  await pages.homePage.goToLoyaltyPage();
  await page.waitForLoadState("load");

  const a11yPassed = await performAccessibilityScan(page, testInfo, {
    disableRules: ["region"],
    softFailRules: ["meta-viewport"]
  });

  expect(a11yPassed).toBeTruthy();
});

test.describe("account desktop pages accessibility", () => {
  loginWithProfile.use({ account: "profil-ok" });
  test.beforeEach(async ({ page }) => {
    await mockCookieConsent(page);
    await page.goto("/");
    await page.waitForLoadState("load");
  });

  test("profile page accessibility", async ({ page, pages }, testInfo) => {
    await pages.accountPage.goToProfilePage();

    const a11yPassed = await performAccessibilityScan(page, testInfo, {
      disableRules: ["region"],
      softFailRules: ["meta-viewport"]
    });

    expect(a11yPassed).toBeTruthy();
  });

  test("documents page accessibility", async ({ page, pages }, testInfo) => {
    await pages.accountPage.goToDocumentsPage();

    const a11yPassed = await performAccessibilityScan(page, testInfo, {
      disableRules: ["region"],
      softFailRules: ["meta-viewport"]
    });

    expect(a11yPassed).toBeTruthy();
  });

  test("historic page accessibility", async ({ page, pages }, testInfo) => {
    await pages.accountPage.goToHistoricPage();

    const a11yPassed = await performAccessibilityScan(page, testInfo, {
      disableRules: ["region"],
      softFailRules: ["meta-viewport"]
    });

    expect(a11yPassed).toBeTruthy();
  });

  test("limits page accessibility", async ({ page, pages }, testInfo) => {
    await pages.accountPage.goToLimitsPage();

    const a11yPassed = await performAccessibilityScan(page, testInfo, {
      disableRules: ["region"],
      softFailRules: ["meta-viewport"]
    });

    expect(a11yPassed).toBeTruthy();
  });
});

test.describe("poker accessibility", () => {
  loginWithProfile.use({ account: "profil-ok" });

  test("play on poker accessibility", async ({ page, pages }, testInfo) => {
    await page.goto("/");
    await page.waitForLoadState("load");
    await pages.pokerPage.clickFirstGameCardButton();
    await page.waitForLoadState("domcontentloaded");

    const a11yPassed = await performAccessibilityScan(page, testInfo, {
      disableRules: ["region"],
      softFailRules: ["meta-viewport"]
    });

    expect(a11yPassed).toBeTruthy();
  });
});
