import { expect, Locator, TestInfo, type Page } from "@playwright/test";
import percySnapshot from "@percy/playwright";
import { performAccessibilityScan } from "../utils/accessibilityChecker";
import { Utils } from "../utils/helpers";

export class CommonPage {
  readonly page: Page;
  readonly beginner: Locator;
  readonly informed: Locator;
  readonly regular: Locator;
  readonly modalGame: Locator;
  readonly deposit: Locator;
  readonly stake: Locator;
  readonly soldeInsufficient: Locator;
  readonly playGame: Locator;
  readonly automaticWithdrawal: Locator;
  readonly cookieBloc: Locator;
  readonly continueCookie: Locator;
  readonly customizeCookie: Locator;
  readonly agreeCookie: Locator;
  readonly modalCustomize: Locator;
  readonly toggleDisagree: Locator;
  readonly toggleAgree: Locator;
  readonly toggleSave: Locator;
  readonly crossIcon: Locator;
  readonly downloadAppButton: Locator;
  readonly OverflowContainer: Locator;
  readonly twisterLink: Locator;
  readonly jouersurNavigateur: Locator;
  readonly downloadApp: Locator;
  readonly jouerMaintenant: Locator;
  readonly playTwister: Locator;
  readonly balanceAccountLocator: Locator;
  readonly headerStickyNavigation: Locator;
  readonly sideMenuActions: Locator;
  readonly jouerSurNavigateurText: Locator;
  readonly loginForm: Locator;
  readonly accountIcon: Locator;
  readonly limitsLink: Locator;
  readonly profileLink: Locator;
  readonly historicLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.modalGame = this.page.getByTestId("modal-container");
    this.beginner = this.modalGame.getByTestId("beginner");
    this.informed = this.modalGame.getByTestId("informed");
    this.regular = this.modalGame.getByTestId("regular");
    this.deposit = this.modalGame.locator("#deposit");
    this.stake = this.modalGame.locator("#stake");
    this.soldeInsufficient = this.modalGame.getByText("solde insuffisant");
    this.playGame = this.modalGame.getByTestId("confirm");
    this.automaticWithdrawal = this.modalGame.locator("#automaticWithdrawal");
    this.cookieBloc = this.page.getByTestId("notice");
    this.continueCookie = this.cookieBloc.locator('[class="didomi-continue-without-agreeing"]');
    this.customizeCookie = this.cookieBloc.locator("#didomi-notice-learn-more-button");
    this.agreeCookie = this.cookieBloc.locator("#didomi-notice-agree-button");
    this.modalCustomize = this.page.getByTestId("dialog-purposes");
    this.toggleDisagree = this.modalCustomize.locator("#btn-toggle-disagree");
    this.toggleAgree = this.modalCustomize.locator("#btn-toggle-agree");
    this.toggleSave = this.modalCustomize.locator("#btn-toggle-agree");
    this.crossIcon = page.getByTestId("button-close");
    this.downloadAppButton = page.getByRole("link", {
      name: "Télécharger l'app"
    });
    this.OverflowContainer = page.locator('[class="overflow-y-auto p-4"]');
    this.twisterLink = page.locator('[href="/fr/twister?useWebview=true"]');
    this.downloadApp = page.getByText("Télécharger l'app");
    this.jouersurNavigateur = page.getByRole("button", {
      name: "Jouer sur le navigateur"
    });
    this.jouerMaintenant = page.getByText("Jouer Maintenant");
    this.playTwister = page.getByText("Jouer au Twister");
    this.balanceAccountLocator = this.page.getByTestId("balance-account");
    this.headerStickyNavigation = this.page.locator("#header-sticky-navigation");
    this.sideMenuActions = this.page.locator("#side-menu-actions");
    this.jouerSurNavigateurText = this.page.getByText("Jouer sur navigateur");
    this.loginForm = this.page.getByTestId("login-form");
    this.accountIcon = page.locator('[data-icon="account-outline"]').first();
    this.limitsLink = page.locator('[href="/fr/account/limits"]');
    this.profileLink = page.locator('[href="/fr/account/profile"]');
    this.historicLink = page.locator('[href="/fr/account/historic"]');
  }

  async open(urlPath: string) {
    const path = Utils.getPathUrl(urlPath);
    if (urlPath === "homePage") {
      await this.page.goto("/");
    } else {
      await this.page.goto(`/fr/${path}`);
    }
    await this.page.waitForLoadState("domcontentloaded");
    await this.page.waitForLoadState("load");
  }

  async accessibility(testInfo: TestInfo) {
    const accessibilityOk = await performAccessibilityScan(this.page, testInfo);
    expect(accessibilityOk).toBe(true);
  }

  async balanceAccount() {
    await expect(this.balanceAccountLocator).toBeVisible({ timeout: 60000 });
  }

  async visible(form: Locator) {
    await expect(form).toBeVisible({ timeout: 30000 });
  }

  async submit(submitButton: Locator, isUsed: boolean = true) {
    await expect(submitButton).toBeEnabled({ timeout: 15000 });
    await submitButton.click();
  }

  async checkUrl(path: string) {
    await this.page.waitForLoadState("domcontentloaded");
    await expect(this.page).toHaveURL(path, {
      timeout: 30000
    });
  }

  async checkModalLevelGame() {
    await expect(this.modalGame).toBeVisible({ timeout: 20000 });
    await expect(this.beginner).toBeVisible({ timeout: 20000 });
    await expect(this.regular).toBeVisible({ timeout: 20000 });
    await expect(this.informed).toBeVisible({ timeout: 20000 });
  }

  async checkModalInsufficientGame() {
    const modalTimeout = process.env.CI ? 120000 : 90000;
    await expect(this.modalGame).toBeVisible({ timeout: modalTimeout });
    await expect(this.modalGame).toBeVisible({ timeout: 30000 });
    await expect(this.soldeInsufficient).toBeVisible({ timeout: 30000 });
  }

  async checkModalPlayGame() {
    await expect(this.modalGame).toBeVisible({ timeout: 40000 });
  }

  async checkPagePoker() {
    await this.page.waitForTimeout(1500);
    const [newPage] = await Promise.all([this.page.context().waitForEvent("page", { timeout: 90000 }), this.playGame.click()]);

    await newPage.waitForLoadState("domcontentloaded");
    expect(newPage.url()).toContain("game-launch");
  }

  async checkLevelIsSelected(level: Locator) {
    await level.click();
    await expect(level).toHaveCSS("border-color", "rgb(244, 198, 68)");
  }

  async clickCrossIcon() {
    await expect(this.crossIcon).toBeVisible({
      timeout: 10000
    });
    await this.crossIcon.click();
  }

  async clickDownloadAppLink(): Promise<void> {
    await this.downloadAppButton.click();
  }

  async verifyCookieBlocIsVisible(): Promise<void> {
    await expect(this.cookieBloc).toBeVisible({ timeout: 10000 });
  }

  async verifyCookieBlocIsNotVisible(): Promise<void> {
    await expect(this.cookieBloc).not.toBeVisible();
  }

  async verifyCustomizeCookieModalIsVisible(): Promise<void> {
    await expect(this.cookieBloc).toBeVisible();
    await expect(this.modalCustomize).toBeVisible();
    await expect(this.toggleDisagree).toBeVisible();
    await expect(this.toggleAgree).toBeVisible();
    await expect(this.toggleSave).toBeVisible();
  }

  async goToCleanUrl() {
    const cleanUrl = this.page.url().split("?")[0];
    await this.page.goto(cleanUrl);
  }

  async navigateToDownloadWebview(): Promise<void> {
    await this.page.goto("/fr/download?useWebview=true");
    await this.page.waitForLoadState("load");
  }

  async verifyOverflowContainerIsNotVisible(): Promise<void> {
    await expect(this.OverflowContainer.first()).not.toBeVisible();
  }

  async navigateToFormatTwisterWebview(): Promise<void> {
    await this.page.goto("/fr/formats-twisters?useWebview=true");
    await this.page.waitForLoadState("load");
  }

  async verifyTwisterLinkIsVisible(): Promise<void> {
    await expect(this.twisterLink).toBeVisible();
  }

  async navigateToFormatTournamentsWebview(): Promise<void> {
    await this.page.goto("/fr/formats-tournaments?useWebview=true");
    await this.page.waitForLoadState("load");
  }

  async verifyDownloadAppAndPlayOnBrowserAreVisible(): Promise<void> {
    await expect(this.downloadApp.nth(0)).toBeVisible();
    await expect(this.jouersurNavigateur).toBeVisible();
  }

  async navigateToFormatCashGamesWebview(): Promise<void> {
    await this.page.goto("/fr/formats-cash-games?useWebview=true");
    await this.page.waitForLoadState("load");
  }

  async verifyPlayNowAndPlayOnBrowserAreVisible(): Promise<void> {
    await expect(this.jouerMaintenant).toBeVisible();
    await expect(this.jouersurNavigateur).toBeVisible();
  }

  async navigateToFormatSitAndGoWebview(): Promise<void> {
    await this.page.goto("/fr/formats-sit-and-go?useWebview=true");
    await this.page.waitForLoadState("load");
  }

  async verifyPlayTwisterAndPlayOnBrowserAreVisible(): Promise<void> {
    await expect(this.playTwister.first()).toBeVisible();
    await expect(this.jouersurNavigateur).toBeVisible();
  }

  async verifyGamePageElementsVisible(): Promise<void> {
    await this.page.waitForTimeout(2000);
    await expect(this.headerStickyNavigation).toBeVisible({ timeout: 15000 });
    await expect(this.sideMenuActions).toBeVisible({ timeout: 15000 });
    await expect(this.jouerSurNavigateurText).toBeVisible({ timeout: 15000 });
  }

  async waitForGameRedirectAndLogin(): Promise<void> {
    await this.page.waitForURL(/.*r5_request_token/);
    await this.page.waitForLoadState("networkidle");
    await expect(this.loginForm).toBeVisible();
    await this.page.waitForLoadState("load");
  }

  async reloadAndVerifyBalanceAccount(): Promise<void> {
    await this.page.waitForLoadState("load");
    await this.page.waitForLoadState("networkidle");
    await this.balanceAccount();
  }

  async waitForNetworkIdle(): Promise<void> {
    await this.page.waitForLoadState("networkidle");
  }

  async goToLimitsPage(): Promise<void> {
    await this.accountIcon.click();
    await this.limitsLink.click();
  }

  async goToProfilePageByMenu(): Promise<void> {
    await this.accountIcon.click();
    await this.profileLink.click();
  }

  async goToHistoricPageByMenu(): Promise<void> {
    await this.accountIcon.click();
    await this.historicLink.first().click();
    await this.page.waitForURL(/.*\/fr\/account\/historic/, { timeout: 30000 });
  }

  async verifyHistoricMenuVisible(): Promise<void> {
    await expect(this.historicLink.first()).toBeVisible({ timeout: 15000 });
  }

  /**
   * Visual regression snapshot via Percy (percy.io). Percy renders and diffs the DOM+CSS in the
   * cloud, so baselines/approvals live on the Percy dashboard instead of committed image files.
   * Pass `scope` (a CSS selector) to snapshot a single element instead of the full page, and
   * `percyCSS` to hide elements whose content changes between runs (e.g. account balance).
   */
  async percySnapshot(name: string, options?: { scope?: string; percyCSS?: string }): Promise<void> {
    await percySnapshot(this.page, name, options);
  }
}
