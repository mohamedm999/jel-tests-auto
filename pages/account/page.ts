import { expect, type Locator, type Page, type FrameLocator } from "@playwright/test";
const jsonProfil = require("../../data/credentials.json");

type Address = {
  address: string;
  postcode: string;
  city: string;
  street: string;
};

export type PokerHistoryItem = {
  day: number;
  month: number;
  monthName: string;
  year: number;
  dateFormatted: string;
  fullDateFilter: string;
};

export class AccountPage {
  readonly page: Page;
  readonly frame: FrameLocator;
  readonly communicationsFrame: FrameLocator;
  readonly registrationFrame: FrameLocator;
  readonly buttonModify: Locator;
  readonly iconEmail: Locator;
  readonly iconSms: Locator;
  readonly iconPost: Locator;
  readonly userName: string;
  // Profile tab
  readonly personalUserDataTab: Locator;
  // Profil
  readonly address: Locator;
  readonly street: Locator;
  readonly placeKnownAs: Locator;
  readonly postalCode: Locator;
  readonly city: Locator;
  readonly phoneNumber: Locator;
  readonly modify: Locator;
  readonly confirmPhoneNumber: Locator;
  readonly iconCheckUpdate: Locator;
  readonly additionalAddressInput: Locator;
  //Game Limit
  readonly blocLimitSevenDays: Locator;
  readonly iconEditlimit: Locator;
  readonly blocAutomaticWithdrawal: Locator;
  //Communication
  readonly comByMail: Locator;
  readonly comByMsg: Locator;
  readonly comByPostal: Locator;
  readonly balanceAccount: Locator;
  // historic
  readonly historicLink: Locator;
  readonly accountProfileLink: Locator;
  readonly accountDocumentLink: Locator;
  readonly accountHistoricLink: Locator;
  readonly accountLimitsLink: Locator;
  readonly historicItem: Locator;
  readonly calendarCustomInput: Locator;
  readonly reactDatepickerPopper: Locator;
  readonly depositWithdrawTab: Locator;
  readonly pokerHistoricTab: Locator;
  readonly calendarApplyButton: Locator;
  readonly calendarResetButton: Locator;
  readonly previousMonthButton: Locator;
  readonly nextMonthButton: Locator;
  readonly GamblingLink: Locator;
  readonly CalendarPicker: Locator;
  readonly autobanConfirmButton: Locator;
  readonly limitInputGlobal: Locator;
  readonly limitInputPoker: Locator;
  readonly withdrawalThreshold: Locator;
  readonly gamblingPreventionTab: Locator;
  readonly calendar: Locator;
  readonly modalContainer: Locator;
  readonly identitySection: Locator;
  readonly accountOutlineIcon: Locator;
  readonly toggleSidebar: Locator;
  readonly depositText: Locator;
  readonly transactionsSection: Locator;
  readonly updatePasswordButton: Locator;
  readonly oldPasswordInput: Locator;
  readonly newPasswordInput: Locator;
  readonly saveRegistrationBtn: Locator;
  readonly loginMeansTab: Locator;
  readonly userNameDisplay: Locator;
  readonly communicationsTab: Locator;
  readonly userNameHeading: Locator;
  readonly saveCommunicationsBtn: Locator;
  readonly communicationSaveSuccess: Locator;
  readonly limitsModal: Locator;
  readonly validateLimitsButton: Locator;
  readonly errorIcon: Locator;

  constructor(page: Page) {
    this.page = page;
    this.frame = this.page.frameLocator('iframe[title="account-personal-iframe"]');
    this.communicationsFrame = this.page.frameLocator('[title="account-communications-iframe"]');
    this.registrationFrame = this.page.frameLocator('[title="account-registration-iframe"]');

    // Profil
    this.address = this.frame.getByTestId("address-input");
    this.placeKnownAs = this.frame.locator("#placeKnownAs");
    this.postalCode = this.frame.getByTestId("postal-code-input");
    this.city = this.frame.getByTestId("city-input");
    this.phoneNumber = this.frame.locator("#phoneNumber");
    this.modify = this.frame.getByRole("button", { name: "Modifier" });
    this.confirmPhoneNumber = this.frame.getByTestId("phone-confirm-button");
    this.iconCheckUpdate = this.frame.locator('[data-icon="check-filled"]');
    this.street = this.frame.getByTestId("address-input");
    this.additionalAddressInput = this.frame.getByTestId("additional-address-input");
    this.identitySection = this.frame.locator(".text-base").first();

    // Communication
    this.buttonModify = this.communicationsFrame.getByRole("button", {
      name: "Modifier"
    });
    this.iconEmail = this.communicationsFrame.locator('[for="acceptEmail"]').first();
    this.iconSms = this.communicationsFrame.locator('[for="acceptSms"]').first();
    this.iconPost = this.communicationsFrame.locator('[for="acceptPost"]').first();
    this.saveCommunicationsBtn = this.communicationsFrame.getByRole("button", {
      name: "Enregistrer"
    });
    this.communicationSaveSuccess = this.communicationsFrame.locator(".text-positive");

    this.userName = jsonProfil["profil-ok"].personalInfo.firstName;
    this.comByMail = page.getByTestId("button-email");
    this.comByMsg = page.getByTestId("button-sms");
    this.comByPostal = page.getByTestId("button-postal");
    this.balanceAccount = page.getByTestId("balance-account");
    this.personalUserDataTab = page.getByTestId("personal-user-data-tab");

    // Game Limit
    this.blocLimitSevenDays = page.locator("#limit-input-mandatory-deposit_seven_days");
    this.iconEditlimit = this.blocLimitSevenDays.locator('[data-icon="edit"]');
    this.blocAutomaticWithdrawal = page.locator("#limit-input-mandatory-automatic_withdrawal");

    // Historic
    this.historicLink = page.locator('[href="/fr/account/historic"]').nth(1);
    this.accountProfileLink = page.locator('[href="/fr/account/profile"]');
    this.accountDocumentLink = page.locator('[href="/fr/account/documents"]');
    this.accountHistoricLink = page.locator('[href="/fr/account/historic"]');
    this.accountLimitsLink = page.locator('[href="/fr/account/limits"]');
    this.historicItem = page.getByText("Dépôt / Retrait").first();
    this.calendarCustomInput = page.getByTestId("calendar-custom-input");
    this.reactDatepickerPopper = page.locator(".react-datepicker-popper");
    this.depositWithdrawTab = page.getByRole("button", { name: "Dépôt / Retrait", exact: true });
    this.pokerHistoricTab = page.getByRole("button", { name: "Poker", exact: true }).filter({ hasText: /^Poker$/ });
    this.calendarApplyButton = page.locator(".react-datepicker-popper").getByRole("button", { name: "Appliquer" });
    this.calendarResetButton = page.locator(".react-datepicker-popper").getByRole("button", { name: "Réinitialiser" });
    this.previousMonthButton = page.locator('.react-datepicker-popper button[aria-label="Mois précédent"]');
    this.nextMonthButton = page.locator('.react-datepicker-popper button[aria-label="Mois suivant"]');
    this.GamblingLink = page.locator('[href="https://preferezunjeuresponsable.com/quel-joueur-etes-vous.html?useWebview=true"]');
    this.CalendarPicker = page.getByTestId("calendar-picker-icon");
    this.autobanConfirmButton = page.getByTestId("autoban-confirm-button");
    this.limitInputGlobal = page.locator("#limit-input-global-depositSevenDays");
    this.limitInputPoker = page.locator("#limit-input-poker-betLimitSevenDays");
    this.withdrawalThreshold = page.locator("#withdrawal-threshold");
    this.gamblingPreventionTab = page.getByTestId("gambling-prevention-tab");
    this.calendar = page.locator(".calendar");
    this.modalContainer = page.getByTestId("modal-container");
    this.accountOutlineIcon = page.locator("[data-icon='account-outline']").first();
    this.toggleSidebar = page.getByTestId("toggle-sidebar");
    this.depositText = page.getByText("Déposer");
    this.transactionsSection = page.getByText("Dépôt / Retrait").first();
    this.updatePasswordButton = this.registrationFrame.getByRole("button", { name: "Modifier le mot de passe" }).first();
    this.oldPasswordInput = this.registrationFrame.locator("#oldPassword");
    this.newPasswordInput = this.registrationFrame.locator("#password");
    this.saveRegistrationBtn = this.registrationFrame.getByText("Enregistrer");
    this.loginMeansTab = page.getByTestId("login-means-tab");
    this.userNameDisplay = page.locator('[class="min-h-6 text-lg font-semibold text-white md:text-jlg"]').nth(1);
    this.communicationsTab = page.getByTestId("communications-tab");
    this.userNameHeading = page.getByRole("heading", {
      name: this.userName
    });
    this.limitsModal = page.getByLabel("Fixez vos limites avant votre premier dépôt");
    this.validateLimitsButton = page.getByRole("button", {
      name: "Valider mes limites"
    });
    this.errorIcon = this.registrationFrame.getByTestId("icon-ui");
  }

  async updateNumberPhone() {
    const iframe = this.page.locator('iframe[title="account-personal-iframe"]');
    await iframe.waitFor({ state: "attached", timeout: 60000 });
    await this.page.waitForTimeout(5000);
    await this.modify.first().waitFor({ state: "visible", timeout: 120000 });
    await this.modify.first().click({ timeout: 80000 });
  }

  async checkUpdateNumberPhoneModal() {
    await expect(this.modalContainer).toBeVisible();
  }

  async updateAdress() {
    await this.page.waitForTimeout(2000);
    const iframe = this.page.locator('iframe[title="account-personal-iframe"]');

    await iframe.waitFor({ state: "attached", timeout: 60000 });
    await this.page.waitForTimeout(5000);

    for (let i = 0; i < 10; i++) {
      try {
        await this.identitySection.waitFor({ state: "visible", timeout: 5000 });
        await expect(this.identitySection).toContainText("Identité");
        break;
      } catch {
        if (i === 9) throw new Error("Timeout après 10 tentatives");
        await this.page.waitForTimeout(2000);
      }
    }
    await this.modify.nth(1).click();
  }

  async checkUpdateNumberPhone(phoneNumber: string) {
    const formatPhoneNumber = `+33 ${phoneNumber.substring(0, 1)} ${phoneNumber.substring(1, 3)} ${phoneNumber.substring(
      3,
      5
    )} ${phoneNumber.substring(5, 7)} ${phoneNumber.substring(7, 9)}`;

    await expect(this.phoneNumber).toHaveValue(formatPhoneNumber); // TO IMPROVE
  }

  async checkUpdateAddressForm() {
    await expect(this.address).toBeVisible();
    await expect(this.additionalAddressInput).toBeVisible();
    await expect(this.postalCode).toBeVisible();
    await expect(this.city).toBeVisible();
  }

  async checkUpdateAddress(data: Address) {
    await expect(this.frame.locator("p").filter({ hasText: data.street })).toBeVisible();
    await expect(this.frame.locator("p").filter({ hasText: data.city })).toBeVisible();
    await expect(this.frame.locator("p").filter({ hasText: data.postcode })).toBeVisible();
  }

  async checkIconUpdate() {
    await this.iconCheckUpdate.isVisible();
  }

  async checkBalanceAccountVisible() {
    await expect(this.balanceAccount).toBeVisible({
      timeout: 20000
    });
  }

  async openProfilePageInWebview() {
    await this.page.goto("/fr/account/profile?useWebview=true");
    await this.page.waitForLoadState("load");
  }

  async goToProfilePage() {
    await this.page.goto("/fr/account/profile");
    await this.page.waitForLoadState("load");
  }

  async goToDocumentsPage() {
    await this.page.goto("/fr/account/documents");
    await this.page.waitForLoadState("load");
  }

  async goToHistoricPage() {
    await this.page.goto("/fr/account/historic");
    await this.page.waitForLoadState("load");
  }

  async goToLimitsPage() {
    await this.page.goto("/fr/account/limits");
    await this.page.waitForLoadState("load");
  }

  async expectPersonalUserDataTabVisible() {
    await expect(this.personalUserDataTab).toBeVisible({ timeout: 10000 });
  }

  async goToDeposit(): Promise<Page> {
    await this.accountOutlineIcon.click();
    await expect(this.toggleSidebar).toContainText(jsonProfil["profil-ok"].personalInfo.firstName, { timeout: 25000 });

    const [newPage] = await Promise.all([this.page.context().waitForEvent("page"), this.depositText.click()]);

    await newPage.waitForLoadState();
    return newPage;
  }

  async clickHistoricLink() {
    await this.historicLink.click();
  }

  async verifyHistoricURL() {
    await expect(this.page).toHaveURL(/.*\/fr\/account\/historic/, {
      timeout: 50000
    });
  }

  async verifyTransactionsVisible() {
    await expect(this.transactionsSection).toBeVisible({ timeout: 50000 });
  }

  async verifyCalendarInputVisible() {
    await expect(this.calendarCustomInput).toBeVisible();
  }

  async verifyDepositWithdrawTabActive() {
    await expect(this.depositWithdrawTab).toBeVisible({ timeout: 15000 });
    await expect(this.depositWithdrawTab).toHaveClass(/border-primary-500/);
  }

  async verifyPokerTabInactive() {
    await expect(this.pokerHistoricTab).toBeVisible({ timeout: 15000 });
    await expect(this.pokerHistoricTab).toHaveClass(/border-transparent/);
  }

  async selectPokerTab() {
    await this.pokerHistoricTab.click();
  }

  async verifyPokerTabActive() {
    await expect(this.pokerHistoricTab).toBeVisible({ timeout: 15000 });
    await expect(this.pokerHistoricTab).toHaveClass(/border-primary-500/);
  }

  async verifyDepositWithdrawTabInactive() {
    await expect(this.depositWithdrawTab).toBeVisible({ timeout: 15000 });
    await expect(this.depositWithdrawTab).toHaveClass(/border-transparent/);
  }

  async openCalendarPicker() {
    await expect(this.calendarCustomInput).toBeVisible({ timeout: 15000 });
    await this.calendarCustomInput.click();
    await expect(this.reactDatepickerPopper).toBeVisible({ timeout: 10000 });
  }

  async verifyCalendarFilterValue(expectedValue: string | RegExp) {
    await expect(this.calendarCustomInput).toBeVisible();
    await expect(this.calendarCustomInput).toHaveAttribute("value", expectedValue);
  }

  async navigateToPreviousMonth() {
    await expect(this.previousMonthButton).toBeVisible({ timeout: 5000 });
    await this.previousMonthButton.click();
  }

  async ensureMonthInCalendar(monthName: string, maxMonthsBack = 12) {
    const header = this.reactDatepickerPopper.locator(".react-datepicker__header p").first();
    await expect(header).toBeVisible({ timeout: 5000 });

    for (let i = 0; i < maxMonthsBack; i++) {
      const currentText = await header.innerText();
      if (currentText.toLowerCase().includes(monthName.toLowerCase())) {
        return;
      }
      await this.navigateToPreviousMonth();
      await expect(header).not.toHaveText(currentText, { timeout: 3000 });
    }
    throw new Error(`Could not navigate to month "${monthName}" within ${maxMonthsBack} months.`);
  }

  async selectSingleDayAndApply(day: number) {
    const dayStr = day.toString().padStart(3, "0");
    const dayLocator = this.reactDatepickerPopper.locator(`.react-datepicker__day--${dayStr}:not(.react-datepicker__day--outside-month)`);

    await expect(dayLocator).toBeVisible({ timeout: 5000 });
    await dayLocator.click();
    await dayLocator.click({ delay: 150 });
    await expect(this.calendarApplyButton).toBeEnabled({ timeout: 5000 });
    await this.calendarApplyButton.click();
    await expect(this.reactDatepickerPopper).toBeHidden({ timeout: 10000 });
  }

  async verifyPokerHistoryItemVisible(text: string) {
    await expect(this.page.getByText(text).and(this.page.locator(":visible")).first()).toBeVisible({ timeout: 15000 });
  }

  async extractFirstPokerHistoryItem(): Promise<PokerHistoryItem> {
    const dateLocator = this.page.locator(".hidden.md\\:block").filter({ hasText: /\d{2}\/\d{2}\/\d{2}/ });
    await expect(dateLocator.first()).toBeVisible({ timeout: 15000 });

    const text = (await dateLocator.first().textContent()) || "";
    const match = text.match(/(\d{2})\/(\d{2})\/(\d{2,4})/);
    if (!match) {
      throw new Error(`Could not find date in text: "${text}"`);
    }

    const [dateFormatted, dayStr, monthStr, rawYear] = match;
    const day = parseInt(dayStr, 10);
    const month = parseInt(monthStr, 10);
    const year = rawYear.length === 2 ? 2000 + parseInt(rawYear, 10) : parseInt(rawYear, 10);
    const monthNames = [
      "janvier",
      "février",
      "mars",
      "avril",
      "mai",
      "juin",
      "juillet",
      "août",
      "septembre",
      "octobre",
      "novembre",
      "décembre"
    ];

    return {
      day,
      month,
      monthName: monthNames[month - 1],
      year,
      dateFormatted,
      fullDateFilter: `${dayStr}/${monthStr}/${year} - ${dayStr}/${monthStr}/${year}`
    };
  }

  getRegistrationFrame() {
    return this.page.frameLocator('[title="account-registration-iframe"]');
  }

  getCommunicationsFrame() {
    return this.page.frameLocator('[title="account-communications-iframe"]');
  }

  async openPasswordEditor(): Promise<void> {
    await this.updatePasswordButton.waitFor({
      state: "visible",
      timeout: 120000
    });
    await this.page.waitForTimeout(5000);
    await this.updatePasswordButton.click({ timeout: 80000 });
  }

  async submitPasswordChange(oldPassword: string, newPassword: string): Promise<void> {
    await this.oldPasswordInput.fill(oldPassword);
    await this.newPasswordInput.fill(newPassword);
    await this.saveRegistrationBtn.click();
  }

  async assertPasswordFieldsHaveError(): Promise<void> {
    await this.errorIcon.waitFor({ state: "visible", timeout: 20000 });
    await expect(this.oldPasswordInput).toHaveCSS("border-color", "rgb(237, 93, 64)");
    await expect(this.newPasswordInput).toHaveCSS("border-color", "rgb(237, 93, 64)");
  }

  async waitForIdentitySection(): Promise<void> {
    await this.identitySection.waitFor({ state: "visible", timeout: 80000 });
    await expect(this.identitySection).toContainText("Identité", {
      timeout: 80000
    });
  }

  async navigateToLoginMeansTab(): Promise<void> {
    await this.loginMeansTab.waitFor({ state: "visible", timeout: 120000 });
    await this.loginMeansTab.click({ timeout: 80000 });
    await this.page.waitForLoadState("load");
    await this.page.waitForLoadState("domcontentloaded");
    await this.page.waitForTimeout(2000);
  }

  async verifyFirstNameIsVisibleInAccountPage(): Promise<void> {
    await expect(this.userNameDisplay).toContainText(jsonProfil["profil-ok"].personalInfo.firstName, { timeout: 20000 });
  }

  async navigateToCommunicationsTab(): Promise<void> {
    await this.communicationsTab.click();
    await this.page.waitForLoadState("load");
    await this.page.waitForLoadState("domcontentloaded");
  }

  async verifyCommunicationOptionsVisible(projectName?: string): Promise<void> {
    if (projectName?.includes("chromium")) {
      await expect(this.userNameHeading).toBeVisible({ timeout: 30000 });
    }
    await expect(this.iconEmail).toBeVisible({ timeout: 50000 });
    await expect(this.iconSms).toBeVisible({ timeout: 20000 });
    await expect(this.iconPost).toBeVisible({ timeout: 20000 });
  }

  async toggleAllCommunicationOptions(): Promise<void> {
    await this.page.waitForTimeout(3000);
    await this.buttonModify.click();
    await this.iconEmail.click();
    await this.iconSms.click();
    await this.iconPost.click();
  }

  async saveCommunicationChanges(): Promise<void> {
    await this.saveCommunicationsBtn.click();
    await this.buttonModify.waitFor({ state: "visible" });
  }

  async verifyCommunicationSaveSuccess(): Promise<void> {
    await expect(this.communicationSaveSuccess).toBeVisible();
  }

  async navigateToHistoricWebview(): Promise<void> {
    await this.page.goto("/fr/account/historic?useWebview=true");
    await this.page.waitForLoadState("load");
    await this.page.waitForLoadState("networkidle");
  }

  async verifyNavigationLinksAreHidden(): Promise<void> {
    await expect(this.accountProfileLink).not.toBeVisible({ timeout: 40000 });
    await expect(this.accountDocumentLink).not.toBeVisible({ timeout: 40000 });
    await expect(this.accountHistoricLink).not.toBeVisible({ timeout: 40000 });
    await expect(this.accountLimitsLink).not.toBeVisible({ timeout: 40000 });
  }

  async verifyHistoricItemsContainerIsVisible(): Promise<void> {
    await expect(this.historicItem).toBeVisible({ timeout: 40000 });
  }

  async verifyCalendarInputOpensDatePicker(): Promise<void> {
    await expect(this.calendarCustomInput).toBeVisible({ timeout: 40000 });
    await this.calendarCustomInput.dblclick();
    await expect(this.reactDatepickerPopper).toBeVisible({ timeout: 40000 });
  }

  async navigateToPracticeWebview(): Promise<void> {
    await this.page.goto("/fr/account/limits?useWebview=true&tab=gamblingHabits");
    await this.page.waitForLoadState("load");
  }

  async verifyResponsibleGamblingLinkIsVisible(): Promise<void> {
    await expect(this.GamblingLink).toBeVisible({ timeout: 40000 });
  }

  async navigateToPreventionWebview(): Promise<void> {
    await this.page.goto("/fr/account/limits?useWebview=true&tab=gamblingPrevention");
    await this.page.waitForLoadState("load");
  }

  async verifyCalendarPickerIconIsVisible(): Promise<void> {
    await expect(this.CalendarPicker).toBeVisible({ timeout: 40000 });
  }

  async verifyAutobanConfirmButtonIsVisible(): Promise<void> {
    await expect(this.autobanConfirmButton.nth(1)).toBeVisible({
      timeout: 40000
    });
  }

  async navigateToDepositWebview(): Promise<void> {
    await this.page.goto("/fr/account/deposit?useWebview=true");
    await this.page.waitForLoadState("load");
    await this.page.waitForLoadState("networkidle");
  }

  async navigateToLimitsWebview(): Promise<void> {
    await this.page.goto("/fr/account/limits?useWebview=true");
    await this.page.waitForLoadState("domcontentloaded");
    await this.page.waitForTimeout(5000);
  }

  async verifyLimitsInputsAreVisible(): Promise<void> {
    await expect(this.limitInputGlobal).toBeVisible({ timeout: 80000 });
    await expect(this.limitInputPoker).toBeVisible({ timeout: 80000 });
  }

  async verifyWithdrawalThresholdIsVisible(): Promise<void> {
    await expect(this.withdrawalThreshold).toBeVisible({ timeout: 15000 });
  }

  async navigateToAutoExclusionWebview(): Promise<void> {
    await this.page.goto("/fr/account/limits?useWebview=true&tab=gamblingPrevention");
    await this.page.waitForLoadState("load");
  }

  async clickGamblingPreventionTab(): Promise<void> {
    await this.gamblingPreventionTab.click();
  }

  async verifyCalendarIsVisible(): Promise<void> {
    await expect(this.calendar).toBeVisible();
  }

  async getBalanceAccountText(): Promise<string | null> {
    return await this.balanceAccount.textContent();
  }

  async defineLimitsIfNeeded(): Promise<void> {
    if (await this.limitsModal.isVisible()) {
      await this.validateLimitsButton.waitFor({ state: "attached" });
      await this.validateLimitsButton.click();
    }
    return;
  }
}
