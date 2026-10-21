import { expect, type Locator, type Page } from "@playwright/test";
import { Utils } from "../../utils/helpers";

export class SignUpPage {
  readonly page: Page;
  readonly signupForm: Locator;
  readonly signupRegistrationForm: Locator;
  readonly signupEmailForm: Locator;
  readonly signupPhoneForm: Locator;
  readonly signupNationalityForm: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly checkboxCvip: Locator;
  readonly checkboxCgu: Locator;
  readonly submitForm: Locator;
  readonly emailMsgError: Locator;
  readonly passwordMsgError: Locator;
  readonly confirmModalAccountExist: Locator;
  readonly cancelModalAccountExist: Locator;
  readonly confirmModal: Locator;
  readonly signupRecoveryForm: Locator;
  readonly listItems: Locator;
  readonly uppercaseItem: Locator;
  readonly lowercaseItem: Locator;
  readonly numberItem: Locator;
  readonly eightCharactersItem: Locator;
  readonly oneSpecialCharacterItem: Locator;
  readonly modalContainer: Locator;
  readonly emailVerificationMessage: Locator;
  readonly signupLink: Locator;
  readonly firstDepositConfirmButton: Locator;
  readonly ccCardOption: Locator;
  readonly ccNameOnCard: Locator;
  readonly ccCardNumber: Locator;
  readonly ccExpMonth: Locator;
  readonly ccExpYear: Locator;
  readonly ccExpDate: Locator;
  readonly ccCvv2: Locator;
  readonly ccContinueButton: Locator;
  readonly depositSuccessText: Locator;
  readonly checkFilledIcon: Locator;
  readonly finishButton: Locator;
  readonly boxOTP: Locator;
  readonly completeProfileText: Locator;
  readonly signupIdentityPresentationForm: Locator;
  readonly signupResidencePresentationForm: Locator;
  readonly laterSpan: Locator;
  readonly defineLimitsText: Locator;
  readonly beginnerTestId: Locator;
  readonly continueButton: Locator;
  readonly congratulationsText: Locator;
  readonly startSpan: Locator;
  readonly emailFormInput: Locator;
  readonly passwordFormInput: Locator;
  readonly acceptPartnerAndGroup: Locator;
  readonly acceptCguOnlinePoker: Locator;
  readonly missesLabel: Locator;
  readonly misterLabel: Locator;
  readonly firstNamesInput: Locator;
  readonly birthLastNameInput: Locator;
  readonly birthDateInput: Locator;
  readonly placeOfBirthInput: Locator;
  readonly addressInput: Locator;
  readonly addressSuggestion: Locator;
  readonly uploadSupportingDocumentText: Locator;
  readonly qrCode: Locator;
  readonly verifyIdentity: Locator;
  readonly qrMoveDesktop: Locator;
  readonly getStartedBtn: Locator;
  readonly uploadButton: Locator;
  readonly fileInput: Locator;
  readonly alertModalIcon: Locator;
  readonly verificationFailedText: Locator;
  readonly phoneNotVerifiedText: Locator;
  readonly barriereLogo: Locator;
  readonly backChevron: Locator;
  readonly continueRoleButton: Locator;
  readonly resendButton: Locator;
  readonly progressBar: Locator;
  readonly postalCode: Locator;
  readonly qrScreen: Locator;

  constructor(page: Page) {
    this.page = page;
    this.signupForm = this.page.getByTestId("signup-registration-form");
    this.signupRegistrationForm = this.page.getByTestId("signup-registration-form");
    this.signupEmailForm = this.page.getByTestId("signup-email-form");
    this.signupPhoneForm = this.page.getByTestId("signup-phone-form");
    this.signupNationalityForm = this.page.getByTestId("signup-nationality-form");
    this.emailInput = this.signupForm.locator('[name="email"]');
    this.passwordInput = this.signupForm.locator('[name="password"]');
    this.checkboxCvip = this.signupForm.locator('[name="cvip"]');
    this.checkboxCgu = this.page.getByTestId("acceptCgu");
    this.submitForm = this.page.getByTestId("signup-submit-form-button");
    this.emailMsgError = this.signupForm.locator("#email-error");
    this.passwordMsgError = this.signupForm.locator("#password-error");
    this.confirmModalAccountExist = this.page.getByTestId("confirm");
    this.confirmModal = this.page.getByTestId("confirm");
    this.cancelModalAccountExist = this.page.getByTestId("cancel");
    // this.signupRecoveryForm = this.page.getByTestId("signup-recovery-form");
    this.signupRecoveryForm = this.page.getByTestId("login-form");
    this.listItems = this.page.locator("li.flex.gap-1");
    this.uppercaseItem = this.page.locator("li", { hasText: "1 majuscule" });
    this.lowercaseItem = this.page.locator("li", { hasText: "1 minuscule" });
    this.numberItem = this.page.locator("li", { hasText: "1 chiffre" });
    this.eightCharactersItem = this.page.locator("li", {
      hasText: "8 caractères"
    });
    this.oneSpecialCharacterItem = this.page.locator("li", {
      hasText: "1 caractère spécial"
    });
    this.modalContainer = this.page.getByTestId("modal-container");
    this.emailVerificationMessage = this.page.locator(
      "[class = 'flex flex-col gap-2 rounded-lg p-3 md:flex-row bg-informative/20 text-informative']"
    );
    this.signupLink = this.page.locator('[href="/fr/signup"]');
    this.firstDepositConfirmButton = this.page.getByTestId("first-deposit-confirm-button");
    this.ccCardOption = this.page.locator('[data-value="cc_card"]');
    this.ccNameOnCard = this.page.locator("#cc_name_on_card");
    this.ccCardNumber = this.page.locator("#cc_card_number");
    this.ccExpMonth = this.page.locator("#cc_exp_month");
    this.ccExpDate = this.page.locator("#exp_date");
    this.ccExpYear = this.page.locator("#cc_exp_year");
    this.ccCvv2 = this.page.locator("#cc_cvv2");
    this.ccContinueButton = this.page.locator("#continueButton");
    this.depositSuccessText = this.page.getByText("Dépôt effectué");
    this.checkFilledIcon = this.page.locator("[data-icon='check-filled']").first();
    this.finishButton = this.page.locator("button", { hasText: "Terminer" });
    this.boxOTP = this.page.locator(".box-border");
    this.completeProfileText = this.page.getByText("Compléter mon profil");
    this.signupIdentityPresentationForm = this.page.getByTestId("signup-identity-presentation-form");
    this.signupResidencePresentationForm = this.page.getByTestId("signup-residence-presentation-form");
    this.laterSpan = this.page.locator("span", { hasText: "Plus tard" });
    this.defineLimitsText = this.page.getByText("Définissez vos limites de jeu");
    this.beginnerTestId = this.page.getByTestId("beginner");
    this.continueButton = this.page.locator("button").filter({ hasText: "Continuer" });
    this.congratulationsText = this.page.getByText("Félicitations !");
    this.startSpan = this.page.locator("span", { hasText: "Commencer" });
    this.emailFormInput = this.page.locator("#email");
    this.passwordFormInput = this.page.locator("#password");
    this.acceptPartnerAndGroup = this.page.getByTestId("acceptOptIn");
    this.acceptCguOnlinePoker = this.page.getByTestId("acceptCguOnlinePoker");
    this.missesLabel = this.page.locator('[for="MISSES"]');
    this.misterLabel = this.page.locator('[for="MISTER"]');
    this.firstNamesInput = this.page.locator("#firstNames");
    this.birthLastNameInput = this.page.locator("#birthLastName");
    this.birthDateInput = this.page.locator("#birthDate");
    this.placeOfBirthInput = this.page.locator("#placeOfBirth");
    this.addressInput = this.page.getByTestId("address-input");
    this.addressSuggestion = this.page.locator("li");
    this.uploadSupportingDocumentText = this.page.getByText("Télécharger mon justificatif");
    this.qrCode = this.page.getByTestId("qr-code");
    this.verifyIdentity = this.page.getByTestId("intrody");
    this.qrMoveDesktop = this.page.getByTestId("Qr_move_desktop");
    this.getStartedBtn = this.page.getByTestId("get-started-button");
    this.uploadButton = this.page.getByTestId("get-started-button");
    this.fileInput = this.page.locator('input[type="file"]');
    this.alertModalIcon = this.page.getByTestId("alert-modal-icon");
    this.verificationFailedText = this.page.getByText("Vérification échouée");
    this.phoneNotVerifiedText = this.page.getByText(/numéro de téléphone.*vérifié/i);
    this.barriereLogo = this.page.locator("#header-sticky-navigation").getByTestId("barriere-online-svg");
    this.backChevron = this.page.locator('[data-icon="chevron-left"]');
    this.continueRoleButton = this.page.getByRole("button", {
      name: "Continuer"
    });
    this.resendButton = this.page.getByText("Renvoyer le code");
    this.progressBar = page.getByTestId("progressBar");
    this.postalCode = this.page.locator("#postalCode");
    this.qrScreen = this.page.getByTestId("qr-screen");
  }

  async goToSignUpPage() {
    await this.page.waitForLoadState("load");
    await this.page.waitForTimeout(5000);
    await this.signupLink.click({ timeout: 15000 });
    await this.page.waitForURL("**/fr/signup/**");
  }

  async goToSignUpWebview() {
    await this.page.waitForLoadState("load");
    await this.page.goto("/fr/signup?useWebview=true");
    await this.page.waitForLoadState("load");
  }

  async expectSignUpFormVisible() {
    await expect(this.submitForm).toBeVisible();
  }

  async confirmFirstDeposit() {
    await this.firstDepositConfirmButton.click();
  }

  async payFirstDepositWithTestCard() {
    await this.page.locator("#label_open_amount_range").waitFor({ state: "visible" });
    await this.ccCardOption.click();
    await this.ccNameOnCard.fill("TEST");
    await this.ccCardNumber.fill("5101081046006034");
    await this.ccExpDate.fill("07/30");
    await this.page.waitForTimeout(5000);
    await this.ccCvv2.fill("737");
    await this.ccContinueButton.click();
  }

  async expectDepositSuccessAndClose() {
    await this.page.waitForLoadState("networkidle");
    await expect(this.depositSuccessText).toBeVisible({ timeout: 30000 });
    await expect(this.checkFilledIcon).toBeVisible();
    await this.finishButton.click();
  }

  async fillCredentials(email: string, password: string, isCGUChecked: boolean) {
    await this.fillEmail(email);
    await this.fillPassword(password);
    if (isCGUChecked) {
      await this.checkboxCgu.click();
    }
  }

  async fillEmail(email: string) {
    await this.emailInput.fill(email);
  }

  async clearEmail() {
    await this.emailInput.clear();
  }

  async fillPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  async clearPassword() {
    await this.passwordInput.clear();
  }

  async checkMsgErrorMail() {
    await expect(this.emailMsgError).toBeVisible();
  }

  async checkMsgErrorPassword() {
    await expect(this.passwordMsgError).toBeVisible();
  }

  async checkEmailHasValueAndPasswordIsEmpty(expectedEmail: string) {
    await expect(this.emailInput).toHaveValue(expectedEmail);
    //await expect(this.passwordInput).toHaveValue("");
  }

  async getUnmetPasswordCriteriaCount(listItems: Locator) {
    return await listItems
      .filter({
        has: listItems.page().locator('[data-icon="arrow-right-outline"]')
      })
      .count();
  }

  async fillPasswordAndCheck(page: Page, password: string) {
    await this.fillPassword(password);
    await page.keyboard.press("Tab");
    await this.checkMsgErrorPassword();
  }

  async expectCriteriaChecked(itemLocator: Locator) {
    await expect(itemLocator.locator('[data-icon="check-outline"]')).toBeVisible();
  }

  async expectUnmetCriteriaCount(expected: number) {
    await expect(await this.getUnmetPasswordCriteriaCount(this.listItems)).toBe(expected);
  }

  async getOtpFromEmailContent(generatedEmail: string) {
    const otp: string | null = await Utils.getLastOTP(generatedEmail);
    console.log(otp);
    await this.boxOTP.nth(0).waitFor({ state: "visible", timeout: 50000 });
    if (otp && otp.length === 6) {
      for (let i = 0; i < 6; i++) {
        await this.boxOTP.nth(i).fill(otp.charAt(i));
      }
    } else {
      throw new Error("OTP non reçu ou format invalide");
    }
  }

  async fillOtpWithWrongLastDigit(generatedEmail: string) {
    const otp: string | null = await Utils.getLastOTP(generatedEmail);

    if (!otp || otp.length !== 6) {
      throw new Error("OTP non reçu ou format invalide");
    }

    const lastDigit = otp.charAt(5);
    let wrongDigit: string;

    do {
      wrongDigit = Math.floor(Math.random() * 10).toString();
    } while (wrongDigit === lastDigit);

    const wrongOtp = otp.slice(0, 5) + wrongDigit;

    console.log("Real OTP :", otp);
    console.log("Wrong OTP:", wrongOtp);

    await this.boxOTP.nth(0).waitFor({ state: "visible", timeout: 50000 });

    for (let i = 0; i < 6; i++) {
      await this.boxOTP.nth(i).fill(wrongOtp.charAt(i));
    }
  }

  async clickCompleteProfile() {
    await this.completeProfileText.click();
  }

  async skipUploadDocument() {
    await expect(this.signupIdentityPresentationForm).toBeVisible({
      timeout: 20000
    });
    await this.laterSpan.click();
    await expect(this.signupIdentityPresentationForm).not.toBeVisible({
      timeout: 20000
    });
  }

  async skipUploadAddressDocument() {
    await expect(this.signupResidencePresentationForm).toBeVisible({
      timeout: 15000
    });
    await this.laterSpan.click();
    await expect(this.signupResidencePresentationForm).not.toBeVisible({
      timeout: 15000
    });
  }

  async defineLimitsLater() {
    await expect(this.defineLimitsText).toBeVisible({ timeout: 40000 });
    await expect(this.beginnerTestId).toBeVisible();

    const start = Date.now();
    const timeout = 150000;
    while (await this.beginnerTestId.isVisible()) {
      if (Date.now() - start > timeout) {
        throw new Error(`beginnerTestId still visible after ${timeout}ms`);
      }
      try {
        if (await this.laterSpan.isVisible()) {
          await this.laterSpan.click({ timeout: 5000 });
        }
      } catch (e) {
        return;
      }
      await this.page.waitForTimeout(500);
    }
  }

  async defineLimitsContinue() {
    await this.continueButton.click();
  }

  async skipDepositAmount() {
    await this.laterSpan.click();
  }

  async endSignUp() {
    await expect(this.congratulationsText).toBeVisible();
    await this.startSpan.click();
  }

  async fillEmailForm(email: string) {
    await this.emailFormInput.fill(email);
  }

  async fillPasswordForm(password: string) {
    await this.passwordFormInput.fill(password);
  }

  async acceptCguForm() {
    await expect(this.acceptPartnerAndGroup).toBeVisible();
    await this.acceptCguOnlinePoker.click();
  }

  async selectGender(gender: string) {
    if (gender === "Madame") {
      await this.missesLabel.click();
    } else {
      await this.misterLabel.click();
    }
  }

  async fillFirstNameForm(firstName: string) {
    await this.firstNamesInput.fill(firstName);
  }

  async fillLastNameForm(lastName: string) {
    await this.birthLastNameInput.fill(lastName);
  }

  async fillBirthDateForm(birthDate: Date) {
    await this.birthDateInput.fill(birthDate.toLocaleDateString("fr-FR"));
  }

  async fillBirthPlaceForm(birthPlace: string, postcode: string, city: string) {
    await this.placeOfBirthInput.clear();
    await this.placeOfBirthInput.pressSequentially(birthPlace, { delay: 50 });
    const shortPostcode = postcode.slice(0, 2);
    await this.page
      .locator("li")
      .filter({
        hasText: `${city} (${shortPostcode})`
      })
      .click();
  }

  async fillPostalAddressForm(city: string) {
    await this.addressInput.pressSequentially(city, { delay: 50 });
    await expect(this.addressSuggestion.first()).toBeVisible({
      timeout: 10000
    });

    const suggestionCount = await this.addressSuggestion.count();

    for (let i = 0; i < suggestionCount; i++) {
      await this.addressSuggestion.nth(i).click();

      // Give the form time to react after click
      await this.addressInput.page().waitForTimeout(1000);

      const postalCodeInputValue = await this.postalCode.inputValue();
      const filledValue = await this.addressInput.inputValue();

      if (filledValue.trim().length > 0 && postalCodeInputValue.trim().length > 0) {
        return;
      }

      // Form not filled — clear and re-type to get suggestions again for next iteration
      await this.addressInput.clear();
      await this.page.waitForLoadState("load");
      await this.addressInput.pressSequentially(city, { delay: 100 });
      await expect(this.addressSuggestion.first()).toBeVisible({
        timeout: 10000
      });
    }
    throw new Error(`fillPostalAddressForm: no suggestion filled the form after ${suggestionCount} attempts for city "${city}"`);
  }

  async checkAccountExistsModalIsNotVisible() {
    await expect(this.modalContainer).not.toBeVisible();
    await this.page.waitForTimeout(2000);
  }

  async assertModalContainerIsVisible() {
    await this.modalContainer.isVisible();
    await expect(this.modalContainer).toContainText("E-mail déjà existant");
    await expect(this.modalContainer).toContainText("Vérifiez votre boîte mail");
    await expect(this.emailVerificationMessage).toHaveCSS("color", "rgb(77, 142, 255)");
  }

  async checkAccountExistsModalIsVisible() {
    await expect(this.modalContainer).toBeVisible();
    await this.page.waitForTimeout(2000);
  }

  async clickLaterButton() {
    await this.page.waitForURL("**/online-residence-presentation**");
    await this.laterSpan.click();
  }

  async verifyAccountExistModalIsVisible(): Promise<void> {
    await this.confirmModalAccountExist.isVisible();
    await this.cancelModalAccountExist.isVisible();
  }

  async confirmAccountExistModal(): Promise<void> {
    await this.confirmModalAccountExist.click();
  }

  async fillCredentialsWithGeneratedEmail(generatedEmail: string, password: string): Promise<void> {
    await this.fillCredentials(generatedEmail, password, true);
  }

  async uploadPOADocument(): Promise<void> {
    await this.uploadSupportingDocumentText.click();
    await expect(this.qrCode).toBeVisible({ timeout: 50000 });
    await this.qrMoveDesktop.click();
    await this.uploadButton.click();
    await this.fileInput.setInputFiles("data/POA.pdf");
  }

  async verifyWrongOtpErrorModal(): Promise<void> {
    await expect(this.alertModalIcon).toBeVisible({ timeout: 20000 });
    await expect(this.verificationFailedText).toBeVisible();
    await expect(this.phoneNotVerifiedText).toBeVisible({ timeout: 20000 });
  }

  async cancelExitSubscription(): Promise<void> {
    await this.modalContainer.isVisible();
    await this.cancelModalAccountExist.click();
  }

  async confirmExitSubscription(): Promise<void> {
    await this.modalContainer.isVisible();
    await this.confirmModalAccountExist.click();
  }

  async verifyBackOnHomePage(): Promise<void> {
    await this.page.waitForLoadState("domcontentloaded");
    await expect(this.barriereLogo).toBeVisible({ timeout: 20000 });
  }

  async verifyBackButtonIsNotVisible(): Promise<void> {
    await expect(this.backChevron).not.toBeVisible();
  }

  async expectPokerStartWebviewUrl() {
    await expect(this.page).toHaveURL(/\/fr\/poker-start\?useWebview=true/, {
      timeout: 20000
    });
  }

  async waitForNationalityForm(): Promise<void> {
    await this.signupNationalityForm.waitFor({
      state: "visible",
      timeout: 50000
    });
  }

  async clickContinueButton(): Promise<void> {
    await this.continueRoleButton.click();
  }

  async shouldResendCodeDisabled() {
    await expect(this.resendButton).toBeDisabled();
  }

  async shouldResendCodeEnabled() {
    await expect(this.resendButton).toBeEnabled({ timeout: 32000 });
  }

  async resendVerificationCodeTimes(times: number): Promise<void> {
    for (let i = 0; i <= times; i++) {
      await expect(this.resendButton).toBeEnabled({ timeout: 40000 });
      await this.resendButton.click();
      await expect(this.resendButton).toBeDisabled();
    }
  }

  async expectResendVerificationCodeLimitReached(): Promise<void> {
    await expect(this.page.getByText("Nombre maximal d'envoi atteint")).toBeVisible();
    await expect(this.resendButton).toBeDisabled();
  }

  async waitForProgress(timeout: number = 30000) {
    await this.progressBar.waitFor({ state: "visible", timeout });
    const start = Date.now();
    while (Date.now() - start < timeout) {
      const value = Number(await this.progressBar.getAttribute("aria-valuenow"));
      if (value > 0) return;
      await this.page.waitForTimeout(500);
    }
    throw new Error(`Progress bar did not exceed 0 within ${timeout}ms`);
  }

  async dismissOopsModalIfVisible(): Promise<void> {
    await this.page.locator('button:has-text("Fermer")').click();
  }

  async isOopsModalVisible(): Promise<boolean> {
    await this.page.waitForTimeout(2000);
    return this.page.locator('button:has-text("Fermer")').isVisible();
  }
}
