import { type Locator, type Page, expect } from "@playwright/test";
const jsonProfil = require("../../data/credentials.json");

export class LimitsPage {
  readonly page: Page;

  readonly limitsTab: Locator;
  // Deposit
  readonly editDepositBtn: Locator;
  readonly depositInput: Locator;
  readonly iconWarning: Locator;
  // Withdraw
  readonly editWithdrawBtn: Locator;
  readonly withdrawInput: Locator;
  // Bet
  readonly editBetBtn: Locator;
  readonly betInput: Locator;
  // Residual reserve amount
  readonly editResidualReserveBtn: Locator;
  readonly residualReserveInput: Locator;
  // Save + Cancel
  readonly saveBtn: Locator;
  readonly cancelBtn: Locator;
  // locators for self-exclusion
  readonly selfExclusionTab: Locator;
  readonly calendarIcon: Locator;
  readonly dayToSelect: Locator;
  readonly applyButton: Locator;
  readonly confirmExclusionBtn: Locator;
  readonly closeModalBtn: Locator;
  readonly modalAutoExclsuion: Locator;
  readonly modalRemainingBalance: Locator;
  readonly depositMinError: Locator;
  readonly depositIncreaseWarning: Locator;
  readonly depositRemainingLine: Locator;
  readonly depositSevenDaysInput: Locator;
  // account info
  readonly userNameSection: Locator;
  // gambling habits
  readonly gamblingHabitsTab: Locator;
  readonly whatKindOfPlayerAreYouLink: Locator;
  readonly URL_GAME = "https://preferezunjeuresponsable.com/quel-joueur-etes-vous.html";
  // Abstain from playing
  readonly abstainFromPlayingBtn: Locator;
  readonly closeMyAccountBtn: Locator;
  // modal limits
  readonly closeModalLimitsBtn: Locator;
  readonly twitterCard: Locator;
  readonly beginnerButton: Locator;
  readonly informed: Locator;
  readonly regular: Locator;
  readonly deposit: Locator;
  readonly stake: Locator;
  readonly automaticWithdrawal: Locator;
  readonly collapseIcon: Locator;
  readonly plusIcon: Locator;
  readonly balanceAccount: Locator;
  readonly betValueInput: Locator;
  readonly withdrawValueInput: Locator;
  readonly residualReserveValueInput: Locator;
  readonly withdrawalMaxText: Locator;
  readonly mandatoryLimitsText: Locator;
  readonly balanceNumber: Locator;
  readonly setMyLimitsBtn: Locator;
  readonly limitsPageTitle: Locator;
  readonly setMyLimitsText: Locator;
  readonly firstTwisterCardButton: Locator;
  readonly closeModalLimitsDepositBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.limitsTab = page.getByRole("button", { name: "Limites" });
    // Edit buttons
    this.editDepositBtn = page.locator('#limit-input-global-depositSevenDays [data-testid="edit-button"]');
    this.iconWarning = page.locator('[data-icon="warning-filled"]');
    // Withdraw
    this.editWithdrawBtn = page.locator('#withdrawal-threshold [data-testid="edit-button"]');
    // Bet
    this.editBetBtn = page.locator('#limit-input-poker-betLimitSevenDays [data-testid="edit-button"]');
    // Residual Reserve
    this.editResidualReserveBtn = page.locator('#withdrawal-reserve [data-testid="edit-button"]');
    this.residualReserveInput = page.locator('#withdrawal-reserve input[type="text"]');
    // Inputs inside modifiable blocks
    this.depositInput = page.locator("#limit-input-global-depositSevenDays").locator("#value");
    this.withdrawInput = page.locator('#withdrawal-threshold input[type="text"]');
    this.betInput = page.locator('#limit-input-poker-betLimitSevenDays input[type="text"]');
    this.saveBtn = page.locator('[data-testid="save-button"]');
    this.cancelBtn = page.getByRole("button", { name: "Annuler" });
    // Self-exclusion locators
    this.modalAutoExclsuion = page.getByTestId("AutoBanModal");
    this.modalRemainingBalance = page.getByText("Clôturer mon compte").first();
    this.calendarIcon = page.locator('[data-testid="calendar-picker-icon"]');
    this.dayToSelect = page.locator('[role="gridcell"][aria-disabled="false"]').first();
    this.applyButton = page.getByRole("button", { name: "Appliquer" });
    this.confirmExclusionBtn = page.getByRole("button", { name: "Confirmer" });
    this.closeModalBtn = page.getByTestId("modal-container").locator('button:has-text("Annuler")').first();
    this.depositSevenDaysInput = page.locator("#limit-input-global-depositSevenDays");
    this.depositMinError = page.getByTestId("amount-error");
    this.depositIncreaseWarning = page.locator("#limit-input-mandatory-depositSevenDays").locator("p.text-gray-200", {
      hasText: /Augmentation demandée .* Modification effective/i
    });
    this.depositRemainingLine = page
      .locator("#limit-input-mandatory-depositSevenDays")
      .locator("p")
      .filter({ hasText: /Montant restant:/i });
    // account info
    this.userNameSection = page.locator('[class="min-h-6 text-lg font-semibold text-white md:text-jlg"]');
    // gambling habits
    this.gamblingHabitsTab = page.getByTestId("gambling-habits-tab");
    this.whatKindOfPlayerAreYouLink = page.locator(`[href="${this.URL_GAME}"]`);
    // Abstain from playing
    this.abstainFromPlayingBtn = page.getByRole("button", {
      name: "S'abstenir de jouer"
    });
    this.closeMyAccountBtn = page.getByRole("button", {
      name: "Clôturer mon compte"
    });
    // Modal limits
    this.closeModalLimitsBtn = page.getByTestId("button-close");
    this.closeModalLimitsDepositBtn = page.getByTestId("button-close");
    this.twitterCard = page.getByTestId("twister-card");
    this.beginnerButton = page.getByTestId("beginner");
    this.informed = page.getByTestId("informed");
    this.regular = page.getByTestId("regular");
    this.deposit = page.locator("#deposit");
    this.stake = page.locator("#stake");
    this.automaticWithdrawal = page.locator("#automaticWithdrawal");
    this.collapseIcon = page.locator("[data-icon='collapse']");
    this.plusIcon = page.locator("[data-icon='plus']");
    this.balanceAccount = page.getByTestId("balance-account");
    this.betValueInput = page.locator("#limit-input-poker-betLimitSevenDays").locator("#value");
    this.withdrawValueInput = page.locator("#withdrawal-threshold").locator("#value");
    this.residualReserveValueInput = page.locator("#withdrawal-reserve").locator("#value");
    this.withdrawalMaxText = page.locator("#withdrawal-threshold").locator("[class='mt-1 text-xs text-gray-400']");
    this.mandatoryLimitsText = page.getByText("Limites Obligatoires");
    this.balanceNumber = page.locator('[data-testid="balance-number"]');
    this.setMyLimitsBtn = page.getByRole("button", {
      name: "Définir mes lilites"
    });
    this.limitsPageTitle = page.locator("h1", {
      hasText: "Limites et pratique de jeu"
    });
    this.setMyLimitsText = page.getByText("Définir mes limites");
    this.firstTwisterCardButton = this.twitterCard.first().getByRole("button");
  }

  async assertSaveDisabled() {
    await expect(this.saveBtn).toBeDisabled();
  }

  async assertSaveEnabled() {
    await expect(this.saveBtn).toBeEnabled();
  }

  async getDepositInitialValue(): Promise<string> {
    const value = await this.depositInput.getAttribute("value");
    return value!;
  }

  async getBetInitialValue(): Promise<string> {
    const value = await this.betValueInput.getAttribute("value");
    return value!;
  }

  async getWithdrawalInitialValue(): Promise<string> {
    const value = await this.withdrawValueInput.getAttribute("value");
    return value!;
  }

  async getResidualReserveInitialValue(): Promise<string> {
    const value = await this.residualReserveValueInput.getAttribute("value");
    return value!;
  }

  async editDepositLimit() {
    await this.editDepositBtn.waitFor({ state: "visible", timeout: 45000 });
    await this.editDepositBtn.click();
  }

  async editBet() {
    await this.editBetBtn.waitFor({ state: "visible", timeout: 45000 });
    await this.editBetBtn.click();
  }

  async editWithdrawal() {
    await this.editWithdrawBtn.waitFor({ state: "visible", timeout: 45000 });
    await this.editWithdrawBtn.click();
  }

  async editResidualReserve() {
    await this.editResidualReserveBtn.waitFor({
      state: "visible",
      timeout: 20000
    });
    await this.editResidualReserveBtn.click();
  }

  async fillDepositLimit(value: string) {
    await this.depositInput.waitFor({ state: "visible", timeout: 5000 });
    await this.depositInput.clear();
    await this.depositInput.fill(value);
  }

  async editWithdrawLimit(value: string) {
    await this.withdrawInput.clear();
    await this.withdrawInput.fill(value);
  }

  async editBetLimit(value: string) {
    await this.betInput.waitFor({ state: "visible", timeout: 5000 });
    await this.betInput.fill(value);
  }

  async editResidualReserveLimit(value: string) {
    await this.residualReserveInput.clear();
    await this.residualReserveInput.fill(value);
  }

  async openDepositEditor() {
    await this.editDepositBtn.click();
    await this.depositInput.waitFor({ state: "visible" });
  }

  async clearDepositLimit() {
    await this.depositInput.clear();
    await expect(this.depositInput).toHaveValue("");
  }

  async clearBetLimit() {
    await this.betInput.clear();
    await expect(this.betInput).toHaveValue("");
  }

  async openSelfExclusionAndApply() {
    await this.calendarIcon.click({ timeout: 30000 });
    await this.dayToSelect.click();
    await this.applyButton.click();
    await this.confirmExclusionBtn.click();
    await this.closeModalBtn.click();
  }

  async confirmSelfExclusion() {
    await this.confirmExclusionBtn.click();
  }

  async closeModal() {
    await this.closeModalBtn.click();
  }

  async getMaxWithdrawalLimit(): Promise<number> {
    const text = await this.withdrawalMaxText.textContent();
    const match = text?.match(/et\s([\d\s]+)(?:,\d{2})?\s€\smax/i);
    if (!match || !match[1]) {
      throw new Error(`Unable to parse max withdrawal limit from text: ${text}`);
    }
    const max = Number(match[1].replace(/\s/g, ""));
    return max;
  }

  async getMinWithdrawalLimit(): Promise<number> {
    const text = await this.editResidualReserveBtn.textContent();

    if (!text) {
      throw new Error("Residual reserve amount not found");
    }

    const amount = Number(text.replace(/\s/g, "").replace("€", "").replace(",", "."));

    const min = Math.floor(amount);
    return min;
  }

  async checkModalAutoExclusion() {
    await expect(this.modalAutoExclsuion).toBeVisible();
  }

  async checkRemainingBalance() {
    await expect(this.modalRemainingBalance).toBeVisible({ timeout: 10000 });
  }

  async checkIconInfo() {
    await expect(this.iconWarning.first()).toBeVisible({ timeout: 10000 });
  }

  async verifyFirstNameIsPresent() {
    await expect(this.userNameSection).toContainText(jsonProfil["profil-ok"].personalInfo.firstName, {
      timeout: 50000
    });
  }

  async verifyDepositSevenDaysInputVisible() {
    await expect(this.depositSevenDaysInput).toBeVisible({
      timeout: 800000
    });
  }

  async clickGamblingPracticeTab() {
    await this.gamblingHabitsTab.click();
  }

  async verifyGameURLTargetBlank() {
    await expect(this.whatKindOfPlayerAreYouLink).toHaveAttribute("target", "_blank", {
      timeout: 20000
    });
  }

  async clickGameURLAndVerifyRedirection() {
    const [newPage] = await Promise.all([this.page.context().waitForEvent("page"), this.whatKindOfPlayerAreYouLink.click()]);
    await newPage.waitForLoadState();
    expect(newPage.url()).toContain(this.URL_GAME);
  }

  async clickGamblingHabitsTab() {
    await this.gamblingHabitsTab.click();
  }

  async clickAbstainFromPlaying() {
    await this.abstainFromPlayingBtn.click();
  }

  async clickCloseMyAccount() {
    await this.closeMyAccountBtn.click();
  }

  async waitForMandatoryLimits(): Promise<void> {
    await this.mandatoryLimitsText.waitFor({
      state: "visible",
      timeout: 60000
    });
  }

  async getIncreasedValue(initValue: string): Promise<number> {
    return Math.ceil(Math.random() * (1000 - parseInt(initValue)) + parseInt(initValue));
  }

  async waitForDepositEditButton(): Promise<void> {
    await this.editDepositBtn.waitFor({
      timeout: 30000,
      state: "attached"
    });
  }

  async getDecreasedValue(initValue: string): Promise<number | null> {
    const max = parseInt(initValue, 10);
    if (max === 10) {
      console.warn("Initial value is 10 → skipping decrease scenario");
      return null;
    }
    if (max <= 50) {
      return max - 1;
    }
    return Math.floor(Math.random() * (max - 50)) + 50;
  }

  async waitForBalanceNumber(): Promise<void> {
    await this.balanceNumber.waitFor({ state: "visible", timeout: 30000 });
  }

  async handleSetMyLimits(): Promise<void> {
    if (await this.setMyLimitsBtn.isVisible()) {
      await this.setMyLimitsBtn.click();
    }
  }

  async fillWithSameDepositValue(initValue: string): Promise<void> {
    await this.clearDepositLimit();
    await this.depositInput.fill(initValue);
  }

  async getIncreasedWithdrawalValue(initValue: string): Promise<number> {
    const min = Math.max(200, parseInt(initValue));
    const max = await this.getMaxWithdrawalLimit();
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  async getDecreasedWithdrawalValue(): Promise<number> {
    const min = await this.getMinWithdrawalLimit();
    const max = await this.getMaxWithdrawalLimit();
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  async waitForLimitsPageTitle() {
    await this.limitsPageTitle.waitFor({ state: "visible", timeout: 60000 });
  }

  async checkSetMyLimitsButtonIsVisible() {
    await expect(this.setMyLimitsText).toBeVisible({ timeout: 80000 });
  }

  async clickFirstTwisterCardButton() {
    await this.page.waitForTimeout(5000);
    await this.firstTwisterCardButton.click();
  }

  async checkModalLimitAfterGameIsVisible() {
    await expect(this.closeModalLimitsBtn).toBeVisible({ timeout: 50000 });
    await expect(this.beginnerButton).toBeVisible({ timeout: 20000 });
    await expect(this.informed).toBeVisible();
    await expect(this.regular).toBeVisible();
    await expect(this.deposit).toBeVisible();
    await expect(this.stake).toBeVisible();
    await expect(this.automaticWithdrawal).toBeVisible();
  }

  async checkIconsAreVisible() {
    await expect(this.collapseIcon.first()).toBeVisible({ timeout: 20000 });
    await expect(this.plusIcon.first()).toBeVisible({ timeout: 20000 });
  }

  async checkModalLimitDepositIsVisible() {
    await expect(this.closeModalLimitsDepositBtn).toBeVisible({ timeout: 50000 });
    await this.closeModalLimitsDepositBtn.click();
  }
}
