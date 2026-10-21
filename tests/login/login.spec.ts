import { mockCookieConsent } from "../../utils/consent";
import { test } from "../fixtures/fixtures";

test.describe("Tests suite Login", () => {
  test.beforeEach(async ({ page, pages }) => {
    await mockCookieConsent(page);
    await page.goto("/");
    await page.waitForLoadState("load");
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(5000);
    await pages.homePage.goToLoginPage();
  });

  test("@smoke @visual should be connected with a correct credential", async ({ pages }) => {
    await test.step("Visual check: login form", async () => {
      await pages.commonPage.visible(pages.connexionPage.loginForm);
      await pages.commonPage.percySnapshot("Login - form", { scope: '[data-testid="login-form"]' });
    });

    await test.step("Login with valid credentials", async () => {
      await pages.connexionPage.loginWithProfile("profil-ok");
    });

    await test.step("Verify account balance is visible", async () => {
      await pages.commonPage.balanceAccount();
    });
  });

  // * need JDD
  test("@smoke should be not connected with a correct credential but an auto-exclusion profil", async ({ pages }) => {
    await test.step("Login with auto-exclusion profile", async () => {
      await pages.connexionPage.loginWithProfile("profil-auto-exclu");
    });

    await test.step("Verify access denied message and close", async () => {
      await pages.connexionPage.verifyBlockedAccountAndClose();
    });
  });

  test("@smoke @b-auth should be not connected with a incorrect credential", async ({ pages }) => {
    await test.step("Fill credentials with wrong password", async () => {
      await pages.connexionPage.loginWithWrongCredentialsProfile("profil-ok", "AAAAAAAAAAA");
    });

    await test.step("Verify credentials error is displayed", async () => {
      await pages.connexionPage.checkCredentialsError();
    });
  });

  test("@b-auth should message error appear on email and password incorrect data", async ({ pages }) => {
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

  test("@b-auth @visual should be redirected to the reinit password", async ({ pages }) => {
    await test.step("Click forgot password link", async () => {
      await pages.connexionPage.linkForgotPassword.click();
    });

    await test.step("Verify forgot password form is visible", async () => {
      await pages.commonPage.visible(pages.forgotPasswordPage.forgotPasswordForm);
    });

    await test.step("Visual check: forgot password form", async () => {
      await pages.commonPage.percySnapshot("Login - forgot password form", { scope: '[data-testid="forgotPassword-page"]' });
    });
  });

  test("@b-auth should be redirected to the signup page", async ({ pages }) => {
    await test.step("Click signup link", async () => {
      await pages.connexionPage.linkSingUp.click();
    });

    await test.step("Verify signup registration form is visible", async () => {
      await pages.commonPage.visible(pages.signUpPage.signupRegistrationForm);
    });
  });

  test("should be redirected to the home page", async ({ pages }) => {
    await test.step("Click cross icon to close", async () => {
      await pages.commonPage.crossIcon.click();
    });

    await test.step("Verify sidebar is visible on home page", async () => {
      await pages.homePage.sideBar.isVisible();
    });
  });

  test("should temporarily block account after 6 failed login attempts", async ({ pages }) => {
    const profile = "profil-blocked-account";
    const wrongPassword = "WrongPassword123!";

    await test.step("Perform 6 failed login attempts with wrong password", async () => {
      await pages.connexionPage.performFailedLoginAttempts(profile, wrongPassword, 6);
    });
    await test.step("Verify account is temporarily blocked", async () => {
      await pages.connexionPage.expectAccountTemporarilyBlocked();
    });
  });
});
