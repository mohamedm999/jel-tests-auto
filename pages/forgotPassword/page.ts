import { expect, type Locator, type Page } from "@playwright/test";

export class ForgotPasswordPage {
  readonly page: Page;
  readonly forgotPasswordForm: Locator;
  readonly emailInput: Locator;
  readonly submitButton: Locator;
  readonly msgEmailError: Locator;
  readonly confirmPasswordInput: Locator;
  readonly resetPasswordSubmitButton: Locator;
  readonly passwordAlreadyUsedError: Locator;
  readonly createNewPasswordForm: Locator;
  readonly passwordSucessText: Locator;
  readonly expiredLinkError: Locator;

  constructor(page: Page) {
    this.page = page;
    this.forgotPasswordForm = page.getByTestId("forgotPassword-page");
    this.emailInput = this.forgotPasswordForm.locator("#email");
    this.submitButton = this.forgotPasswordForm.getByTestId("forgotPassword");
    this.msgEmailError = this.forgotPasswordForm.locator("#email-error");
    this.confirmPasswordInput = this.page.locator("#password");
    this.resetPasswordSubmitButton = this.page.getByTestId("reset-password-form-submit-button");
    this.passwordAlreadyUsedError = this.page.getByText("Mot de passe déjà utilisé");
    this.createNewPasswordForm = this.page.locator('[class="text-xs text-gray-200"]');
    this.passwordSucessText = this.page.getByText("Votre mot de passe est à jour");
    this.expiredLinkError = this.page.getByText("Lien de réinitialisation expiré");
  }

  async fillEmail(email: string) {
    await this.emailInput.fill(email);
  }

  async checkMessageError() {
    await expect(this.msgEmailError).toBeVisible();
  }

  async fillNewPasswordField(password: string) {
    const newPassword = this.confirmPasswordInput;
    await expect(newPassword.first()).toBeVisible({ timeout: 20000 });
    await newPassword.first().fill(password);
  }

  async fillConfirmPasswordField(password: string): Promise<void> {
    const input = this.confirmPasswordInput.first();
    await input.fill(password);
  }

  async submitResetPasswordForm(): Promise<void> {
    await this.resetPasswordSubmitButton.click();
  }

  async expectPasswordAlreadyUsedError(): Promise<void> {
    await expect(this.passwordAlreadyUsedError).toBeVisible();
    await expect(this.createNewPasswordForm).toContainText(
      "Veuillez choisir un nouveau mot de passe différent de ceux que vous avez déjà utilisés."
    );
  }

  async expectPasswordResetSuccess(): Promise<void> {
    await expect(this.passwordSucessText).toBeVisible({ timeout: 20000 });
  }

  async expectExpiredLinkError(): Promise<void> {
    await expect(this.expiredLinkError).toBeVisible({ timeout: 20000 });
  }
}
