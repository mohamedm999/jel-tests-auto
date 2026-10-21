import { expect, Locator, Page } from "@playwright/test";

export class DocumentsPage {
  readonly page: Page;
  readonly informativeBanner: Locator;
  readonly sendMyDocumentsButton: Locator;
  readonly sendMyDocumentsButtonByModal: Locator;
  readonly postalAddressModal: Locator;
  readonly modalContainer: Locator;
  readonly confirmButton: Locator;
  readonly editButton: Locator;
  readonly addButton: Locator;
  readonly IbanInput: Locator;
  readonly IbanError: Locator;
  readonly sendLaterButton: Locator;
  readonly profileLink: Locator;
  readonly documentsLink: Locator;
  readonly historicLink: Locator;
  readonly limitsLink: Locator;
  readonly administrativeSection: Locator;
  readonly navigationCompanion: Locator;
  readonly identityIcon: Locator;
  readonly poaIcon: Locator;
  readonly ribIcon: Locator;
  readonly addProoveAddressButton: Locator;
  readonly modalContentRole: Locator;
  readonly qrIssuesButton: Locator;
  readonly modalSendLater: Locator;
  readonly ibanValidationText: Locator;
  readonly titleUploadModal: Locator;
  readonly confirmAdressButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.informativeBanner = page.getByTestId("informative-banner");
    this.sendMyDocumentsButton = page.getByTestId("informative-banner-cta");
    this.sendMyDocumentsButtonByModal = page.getByTestId("confirm");
    this.postalAddressModal = page.locator("[aria-label='Adresse postale']");
    this.modalContainer = page.getByTestId("modal-container");
    this.confirmButton = page.getByTestId("confirm");
    this.editButton = page.getByText("Modifier");
    this.addButton = page.getByText("Ajouter");
    this.IbanInput = page.getByTestId("iban");
    this.IbanError = page.locator("#iban-error");
    this.sendLaterButton = page.getByText("Envoyer plus tard");
    this.profileLink = page.locator('[href="/fr/account/profile"]');
    this.documentsLink = page.locator('[href="/fr/account/documents"]');
    this.historicLink = page.locator('[href="/fr/account/historic"]');
    this.limitsLink = page.locator('[href="/fr/account/limits"]');
    this.administrativeSection = page.locator("#administratifs");
    this.navigationCompanion = page.getByTestId("navigation-companion");
    this.identityIcon = page.locator('[data-icon="identity"]');
    this.poaIcon = page.locator('[data-icon="poa"]');
    this.ribIcon = page.locator('[data-icon="rib"]');
    this.addProoveAddressButton = page.getByRole("button", { name: "Ajouter" });
    this.modalContentRole = page.locator('[data-role="content"]');
    this.qrIssuesButton = page.locator("[class='c-qr__issues']");
    this.modalSendLater = this.modalContainer.getByText("Envoyer plus tard");
    this.ibanValidationText = page.getByText("Veuillez saisir votre IBAN avant d'envoyer votre RIB");
    this.titleUploadModal = page.getByTestId("welcome_header");
    this.confirmAdressButton = page.getByTestId("Poa-step-card");
  }

  async clickSendMyDocuments() {
    await this.sendMyDocumentsButton.click();
  }

  async checkInformativeBannerIsVisible() {
    await this.informativeBanner.first().isVisible();
  }

  async clickAddProoveAddressButton() {
    await this.addProoveAddressButton.nth(1).click({ timeout: 80000 });
  }

  async checkModalUploadIsVisible() {
    if (await this.titleUploadModal.isVisible({ timeout: 80000 })) {
      await expect(this.titleUploadModal).toBeVisible({ timeout: 80000 });
      await expect(this.confirmAdressButton).toBeVisible({ timeout: 80000 });
      return;
    }
    await expect(this.postalAddressModal).toBeVisible({ timeout: 80000 });
    await expect(this.modalContentRole).toBeVisible({ timeout: 80000 });
    await expect(this.qrIssuesButton).toBeVisible();
  }

  async checkModalContainerIsVisible() {
    await expect(this.modalContainer).toBeVisible({ timeout: 10000 });
  }

  async checkModalConfirmButtonIsVisible() {
    await expect(this.confirmButton).toBeVisible();
  }

  async checkModalSendLaterButtonIsVisible() {
    await expect(this.modalSendLater).toBeVisible();
  }

  async clickEdit() {
    if (await this.editButton.isVisible({ timeout: 10000 })) {
      await this.editButton.click();
    } else {
      await this.addButton.click();
    }
  }

  async verifyIbanValidation() {
    await expect(this.ibanValidationText).toBeVisible();
    await expect(this.confirmButton).toBeDisabled();
  }

  async fillIbanWithInvalidValue(value: string) {
    await this.IbanInput.fill(value);
    await this.confirmButton.click();
  }

  async verifyIbanPrefixError() {
    await expect(this.IbanError).toContainText("L'IBAN doit commencer par 'FR' pour la France.");
  }

  async verifyIbanLengthError() {
    await expect(this.IbanError).toContainText("L'IBAN doit contenir exactement 27 caractères.");
  }

  async verifyIbanInvalidDigitsError() {
    await expect(this.IbanError).toContainText("L'IBAN saisi est invalide. Veuillez vérifier les chiffres saisis.");
  }

  async verifyConfirmButtonIsDisabled() {
    await expect(this.confirmButton).toBeDisabled();
  }

  async clickSendLater() {
    await this.sendLaterButton.click();
  }

  async verifyIbanInputNotVisible() {
    await expect(this.IbanInput).not.toBeVisible();
  }

  async verifyEditButtonVisible() {
    if (await this.addButton.isVisible({ timeout: 10000 })) {
      await expect(this.addButton).toBeVisible();
    } else {
      await expect(this.editButton).toBeVisible();
    }
  }

  async openDocumentsPageInWebview() {
    await this.page.goto("/fr/account/documents?useWebview=true");
    await this.page.waitForLoadState("load");
  }

  async verifyWebviewNavigationAndSections() {
    await expect(this.profileLink).not.toBeVisible({ timeout: 40000 });
    await expect(this.documentsLink).not.toBeVisible({ timeout: 40000 });
    await expect(this.historicLink).not.toBeVisible({ timeout: 40000 });
    await expect(this.limitsLink).not.toBeVisible({ timeout: 40000 });
    await expect(this.administrativeSection).toBeVisible();
    await expect(this.navigationCompanion).not.toBeVisible({ timeout: 40000 });
    await expect(this.identityIcon).toBeVisible({ timeout: 40000 });
    await expect(this.poaIcon).toBeVisible({ timeout: 40000 });
    await expect(this.ribIcon).toBeVisible({ timeout: 40000 });
  }

  async verifyDocumentsPageInWebview() {
    await expect(this.profileLink).not.toBeVisible({ timeout: 40000 });
    await expect(this.documentsLink).not.toBeVisible({ timeout: 40000 });
    await expect(this.historicLink).not.toBeVisible({ timeout: 40000 });
    await expect(this.limitsLink).not.toBeVisible({ timeout: 40000 });
    await expect(this.administrativeSection).toBeVisible();
    await expect(this.navigationCompanion).not.toBeVisible({ timeout: 40000 });
    await expect(this.identityIcon).toBeVisible({ timeout: 40000 });
    await expect(this.poaIcon).toBeVisible({ timeout: 40000 });
    await expect(this.ribIcon).toBeVisible({ timeout: 40000 });
  }
}
