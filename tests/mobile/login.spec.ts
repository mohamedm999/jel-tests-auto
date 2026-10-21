import { test } from "../fixtures/fixtures";
import { mockCookieConsent } from "../../utils/consent";

const jsonProfil = require("../../data/credentials.json");

test.describe("Mobile - Tests suite Login", () => {
  test.beforeEach(async ({ page, pages }) => {
    await mockCookieConsent(page);
    await page.goto("/");
    await page.waitForLoadState("load");
    await page.waitForTimeout(5000);
    await pages.homePage.goToLoginPage();
  });

  test("Mobile - @smoke should be connected with a correct credential", async ({ pages }) => {
    await test.step("Wait for email input to be visible", async () => {
      await pages.connexionPage.waitForEmailInput();
    });

    await test.step("Login with valid credentials", async () => {
      await pages.connexionPage.loginWithProfile("profil-ok");
    });

    await test.step("Verify account balance is visible", async () => {
      await pages.commonPage.balanceAccount();
    });
  });

  test("Mobile - @smoke @b-auth should be not connected with a incorrect credential", async ({ pages }) => {
    await test.step("Wait for email input to be visible", async () => {
      await pages.connexionPage.waitForEmailInput();
    });

    await test.step("Fill credentials with wrong password", async () => {
      await pages.connexionPage.fillCredentials(jsonProfil["profil-ok"].login, "AAAAAAAAAAA");
    });

    await test.step("Submit login form", async () => {
      await pages.commonPage.submit(pages.connexionPage.submitButton, false);
    });

    await test.step("Verify credentials error is displayed", async () => {
      await pages.connexionPage.checkCredentialsError();
    });
  });

  test("Mobile - @b-auth should message error appear on email and password incorrect data", async ({ pages }) => {
    await test.step("Fill email with invalid data", async () => {
      await pages.connexionPage.fillInvalidEmail();
    });

    await test.step("Fill password with invalid data", async () => {
      await pages.connexionPage.fillInvalidPassword();
    });

    await test.step("Verify error messages are displayed", async () => {
      await pages.connexionPage.checkMessageError();
    });

    await test.step("Verify submit button is disabled", async () => {
      await pages.connexionPage.assertSubmitDisabled();
    });
  });

  test("Mobile - @b-auth should be redirected to the reinit password", async ({ pages }) => {
    await test.step("Click forgot password link", async () => {
      await pages.connexionPage.clickForgotPasswordLink();
    });

    await test.step("Verify forgot password form is visible", async () => {
      await pages.commonPage.visible(pages.forgotPasswordPage.forgotPasswordForm);
    });
  });

  test("Mobile - @b-auth should be redirected to the signup page", async ({ pages }) => {
    await test.step("Click signup link", async () => {
      await pages.homePage.clickSignupLink();
    });

    await test.step("Verify signup email form is visible", async () => {
      await pages.commonPage.visible(pages.signUpPage.signupEmailForm);
    });
  });

  test.fixme("Mobile - @b-auth should be redirected to the home page", async ({ pages, page }) => {
    await test.step("Click cross icon to close", async () => {
      await page.waitForLoadState("networkidle", { timeout: 60000 });
      await pages.commonPage.clickCrossIcon();
    });

    await test.step("Verify sidebar is visible on home page", async () => {
      await pages.homePage.verifySideBarIsVisible();
    });
  });
});
