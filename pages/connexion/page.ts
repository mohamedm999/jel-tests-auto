import { expect, type Locator, type Page } from "@playwright/test";
import { Utils } from "../../utils/helpers";
const jsonProfil = require("../../data/credentials.json");

export class ConnexionPage {
  readonly page: Page;
  readonly loginForm: Locator;
  readonly emailInput: Locator;
  readonly msgEmailError: Locator;
  readonly msgPasswordError: Locator;
  readonly passwordInput: Locator;
  readonly iconError: Locator;
  readonly linkForgotPassword: Locator;
  readonly linkSingUp: Locator;
  readonly crossIcon: Locator;
  readonly submitButton: Locator;
  readonly alertModalIcon: Locator;
  readonly closeModal: Locator;
  readonly accessDeniedText: Locator;
  readonly closeSpan: Locator;
  readonly blockedAccountText: Locator;
  readonly failedConnectionIcon: Locator;

  constructor(page: Page) {
    this.page = page;
    this.loginForm = page.getByTestId("login-form");
    this.emailInput = this.loginForm.locator('[name="email"]');
    this.passwordInput = this.loginForm.locator('[name="password"]');
    this.submitButton = this.loginForm.getByTestId("connect-button");
    this.msgEmailError = this.loginForm.locator("#email-error");
    this.linkForgotPassword = this.loginForm.locator('[href^="forgotPassword"]');
    this.linkSingUp = this.loginForm.locator('[href="/fr/signup"]');
    this.msgPasswordError = this.loginForm.locator("#password-error");
    this.crossIcon = this.page.getByTestId("button-close");
    this.iconError = this.loginForm.getByTestId("icon-ui");
    this.alertModalIcon = this.page.getByTestId("alert-modal-icon");
    this.closeModal = this.page.getByTestId("confirm");
    this.accessDeniedText = this.page.getByText("Accès refusé");
    this.closeSpan = this.page.locator("span", { hasText: "Fermer" });
    this.blockedAccountText = this.page.getByText("bloqué temporairement");
    this.failedConnectionIcon = this.page.getByTestId("icon-ui");
  }

  async fillCredentials(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
  }

  async checkCredentialsError() {
    await expect(this.iconError).toBeVisible({ timeout: 1000 });
  }

  async checkMessageError() {
    await expect(this.msgEmailError).toBeVisible();
    await expect(this.msgPasswordError).toBeVisible();
  }

  async expectLoginFormVisible(): Promise<void> {
    await expect(this.loginForm).toBeVisible({
      timeout: 5000
    });
  }

  async loginWithProfile(profile: string): Promise<void> {
    await this.fillCredentials(jsonProfil[profile].login, jsonProfil[profile].password);
    await expect(this.submitButton).toBeEnabled({ timeout: 15000 });
    await this.submitButton.click();
  }

  async loginWithWrongCredentialsProfile(profile: string, wrongPassword: string): Promise<void> {
    await this.fillCredentials(jsonProfil[profile].login, wrongPassword);
    await this.page.waitForTimeout(1000);
    await this.submitButton.click();
  }

  async performFailedLoginAttempts(profile: string, wrongPassword: string, attempts: number): Promise<void> {
    for (let i = 0; i < attempts; i++) {
      const dataUser = Utils.createRandomUser();
      await this.loginWithWrongCredentialsProfile(profile, dataUser.password);
      if (i !== attempts - 1) {
        await expect(this.failedConnectionIcon).toBeVisible({ timeout: 15000 });
        await this.passwordInput.clear();
        await this.passwordInput.fill(wrongPassword);
      }
    }
  }

  async expectAccountTemporarilyBlocked(): Promise<void> {
    await expect(this.blockedAccountText).toBeVisible({ timeout: 20000 });
  }

  async verifyBlockedAccountAndClose(): Promise<void> {
    await expect(this.blockedAccountText).toBeVisible();
    await this.closeSpan.click();
  }

  async fillInvalidEmail(): Promise<void> {
    await this.emailInput.fill("xxx");
    await this.page.keyboard.press("Tab");
  }

  async fillInvalidPassword(): Promise<void> {
    await this.passwordInput.fill(" ");
    await this.passwordInput.clear();
    await this.page.keyboard.press("Tab");
  }

  async assertSubmitDisabled(): Promise<void> {
    await expect(this.submitButton).toBeDisabled();
  }

  async waitForEmailInput(): Promise<void> {
    await this.page.waitForSelector('[name="email"][placeholder="Adresse e-mail"]', {
      state: "visible"
    });
  }
  async clickForgotPasswordLink(): Promise<void> {
    await this.linkForgotPassword.click();
  }
}
