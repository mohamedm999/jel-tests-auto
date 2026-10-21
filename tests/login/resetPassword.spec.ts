import { expect } from "@playwright/test";
import { test } from "../fixtures/fixtures";
import { Utils } from "../../utils/helpers";
import { mockCookieConsent } from "../../utils/consent";

const credentials = require("../../data/credentials.json");

test.describe("Reset Password", () => {
  test.beforeEach(async ({ page, pages }) => {
    await mockCookieConsent(page);
    await page.goto("/");
    await page.waitForLoadState("load");
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(5000);
    await pages.homePage.goToLoginPage();
  });

  test("@visual should show error when password already used", async ({ page, pages }) => {
    const email = credentials["profil-reinit-pwd"].login;
    const password = credentials["profil-reinit-pwd"].password;

    await test.step('Navigate to Reset Password ?"', async () => {
      await pages.connexionPage.clickForgotPasswordLink();
      await expect(pages.forgotPasswordPage.forgotPasswordForm).toBeVisible();
    });

    await test.step("Request reset password link", async () => {
      await pages.forgotPasswordPage.fillEmail(email);
      await pages.forgotPasswordPage.submitButton.click();
    });

    const resetLink = await test.step("Fetch last reset password link from mailbox", async () => {
      return await Utils.getLastResetPasswordLink(email);
    });

    await test.step("Open reset password link", async () => {
      expect(resetLink).toBeTruthy();
      await page.goto(resetLink!);
      await page.waitForLoadState("domcontentloaded");
    });

    await test.step("Visual check: reset password form", async () => {
      await expect(pages.forgotPasswordPage.confirmPasswordInput.first()).toBeVisible({ timeout: 20000 });
      await pages.commonPage.percySnapshot("Reset password - form");
    });

    await test.step("Submit already-used password and assert error", async () => {
      await pages.forgotPasswordPage.fillNewPasswordField(password);
      await pages.forgotPasswordPage.fillConfirmPasswordField(password);
      await pages.forgotPasswordPage.submitResetPasswordForm();
      await pages.forgotPasswordPage.expectPasswordAlreadyUsedError();
    });
  });

  test("should show error when reset password link is expired after successful reset", async ({ page, pages }) => {
    const credentialsPath = require("path").resolve(__dirname, "../../data/credentials.json");
    const fs = require("fs");

    const allCredentials = JSON.parse(fs.readFileSync(credentialsPath, "utf-8"));
    const email = allCredentials["profil-reinit-pwd"].login;
    const currentPassword = allCredentials["profil-reinit-pwd"].password;

    const newPassword = `NewPass_${Date.now()}!`;

    await test.step('Navigate to Reset Password "', async () => {
      await pages.connexionPage.clickForgotPasswordLink();
      await expect(pages.forgotPasswordPage.forgotPasswordForm).toBeVisible();
    });

    await test.step("Request reset password link", async () => {
      await pages.forgotPasswordPage.fillEmail(email);
      await pages.forgotPasswordPage.submitButton.click();
    });

    const resetLink = await test.step("Fetch last reset password link from mailbox", async () => {
      return await Utils.getLastResetPasswordLink(email);
    });

    await test.step("Open reset password link", async () => {
      expect(resetLink).toBeTruthy();
      await page.goto(resetLink!);
      await page.waitForLoadState("domcontentloaded");
    });

    await test.step("Successfully reset password with new password", async () => {
      await pages.forgotPasswordPage.fillNewPasswordField(newPassword);
      await pages.forgotPasswordPage.fillConfirmPasswordField(newPassword);
      await pages.forgotPasswordPage.submitResetPasswordForm();
      await pages.forgotPasswordPage.expectPasswordResetSuccess();
    });

    await test.step("Update credentials.json with new password", async () => {
      allCredentials["profil-reinit-pwd"].password = newPassword;
      fs.writeFileSync(credentialsPath, JSON.stringify(allCredentials, null, 2));
    });

    await test.step("Navigate to the same (now expired) reset link again", async () => {
      await page.goto(resetLink!);
      await page.waitForLoadState("domcontentloaded");
    });

    await test.step("Submit password on expired link and assert error", async () => {
      await pages.forgotPasswordPage.fillNewPasswordField(currentPassword);
      await pages.forgotPasswordPage.fillConfirmPasswordField(currentPassword);
      await pages.forgotPasswordPage.submitResetPasswordForm();
      await pages.forgotPasswordPage.expectExpiredLinkError();
    });
  });
});
