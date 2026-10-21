import { expect, type Locator, type Page } from "@playwright/test";
import { Utils } from "../../utils/helpers";

export class HomePage {
  readonly page: Page;
  readonly sideBar: Locator;
  readonly menuHome: Locator;
  readonly menuDownloadApp: Locator;
  readonly menuPromotions: Locator;
  readonly menuTwister: Locator;
  readonly menuGameFormats: Locator;
  readonly menuLoyalty: Locator;
  readonly menuPrevention: Locator;
  readonly menuGroupe: Locator;
  readonly menuBlog: Locator;
  readonly homeIcon: Locator;
  readonly toggleMenuButon: Locator;
  readonly menuMobile: Locator;
  readonly menuTxtHome: Locator;
  readonly menuHomeMobile: Locator;
  readonly menuTwisterMobile: Locator;
  readonly menuDownloadChromeMobile: Locator;
  readonly menuDownloadSafariMobile: Locator;
  readonly menuPromosMobile: Locator;
  readonly navBarMobile: Locator;
  readonly tokenIcon: Locator;
  readonly under18: Locator;
  readonly desktopLayout: Locator;
  readonly accessibility: Locator;
  readonly legalNotices: Locator;
  readonly privacyPolicy: Locator;
  readonly regulations: Locator;
  readonly oupsImg: Locator;
  readonly signinLink: Locator;
  readonly loginButton: Locator;
  readonly tabbarCoin: Locator;
  readonly tabbarCoinBlock: Locator;
  readonly backHomeLink: Locator;
  readonly inactivityModal: Locator;
  readonly stayConnectedButton: Locator;
  readonly logoutButton: Locator;
  readonly balanceAccount: Locator;

  constructor(page: Page) {
    this.page = page;
    this.sideBar = page.getByTestId("side-menu-container");
    this.menuHome = this.sideBar.locator('[href="/fr"]');
    this.menuDownloadApp = this.sideBar.getByRole("link", {
      name: "Telecharger l'app"
    });
    this.menuPromotions = this.sideBar.getByRole("link", {
      name: "Promotions"
    });
    this.menuTwister = this.sideBar.getByRole("link", { name: "Twister" });
    this.menuGameFormats = this.sideBar.getByRole("link", {
      name: "Formats de jeu"
    });
    this.menuLoyalty = this.sideBar.getByRole("link", { name: "Fidélité" });
    this.menuPrevention = this.sideBar.getByRole("link", {
      name: "Prévention"
    });
    this.menuGroupe = this.sideBar.getByRole("link", {
      name: "Groupe Barrière"
    });
    this.menuBlog = this.sideBar.getByRole("link", { name: "Blog" });
    this.homeIcon = this.sideBar.locator('[data-icon = "home"]');
    this.toggleMenuButon = this.sideBar.getByTestId("side-menu-toggle");
    this.menuTxtHome = this.sideBar.locator('[class="text-xs transition-all font-semibold text-white"]');
    this.accessibility = this.page.locator(`[href$="/accessibility"]`);
    this.legalNotices = this.page.locator(`[href$="/legalNotices"]`);
    this.privacyPolicy = this.page.locator(`[href$="/privacyPolicy"]`);
    this.regulations = this.page.locator(`[href$="/regulations"]`);
    this.oupsImg = this.page.getByTestId("error-image");

    // Locator view Mobile
    this.menuMobile = page.locator('[data-icon="menu"]').first();
    this.menuHomeMobile = this.page.locator('[href="/fr"]');
    this.menuTwisterMobile = this.page.locator('[href="/fr/twister"]');
    this.menuDownloadChromeMobile = this.page.locator(
      '[href="https://play.google.com/store/apps/details?id=com.barriere.casino.augmente&pcampaignid=web_share&pli=1"]'
    );
    this.menuDownloadSafariMobile = this.page
      .locator('[href="https://apps.apple.com/fr/app/barri%C3%A8re-play-mon-casino/id1623206376"]')
      .first();
    this.menuPromosMobile = this.page.locator('[href="/fr/promotions"]');
    this.navBarMobile = this.page.locator('[class="mb-[1.125rem] mt-2 flex grow items-center justify-around"))]');
    this.tokenIcon = page.locator("svg.tabbar(coin__icon");
    this.under18 = page.locator('img[src*="Majority18"]');
    this.desktopLayout = page.getByTestId("desktop-layout");
    this.signinLink = this.page.locator('[href="/fr/signup"]');
    this.loginButton = this.page.getByText("Se connecter", { exact: true });
    this.tabbarCoin = this.page.locator(".tabbar-coin").first();
    this.tabbarCoinBlock = this.tabbarCoin.locator(".block");
    this.backHomeLink = this.page.locator('[href="/"]').nth(1);
    this.inactivityModal = this.page.getByTestId("modal-container");
    this.stayConnectedButton = this.inactivityModal.getByTestId("confirm");
    this.logoutButton = this.inactivityModal.getByText("Se déconnecter");
    this.balanceAccount = this.page.getByTestId("balance-account");
  }

  async opensidebarIfInMobile() {
    if (await this.menuMobile.isVisible()) await this.menuMobile.click();
    await this.page.waitForTimeout(1000);
  }

  async checkHomepageElementsAreVisible() {
    await expect(this.menuHome).toBeVisible();
    await expect(this.menuDownloadApp).toBeVisible();
    // await expect(this.menuPromotions).toBeVisible();
    // await expect(this.menuPromotions).toBeVisible();
    await expect(this.menuTwister).toBeVisible();
    await expect(this.menuGameFormats).toBeVisible();
    // await expect(this.menuLoyalty).toBeVisible();
    await expect(this.menuPrevention).toBeVisible();
    // await expect(this.menuGroupe).toBeVisible();
    // await expect(this.menuBlog).toBeVisible();
  }

  async clickCollapseSideBar() {
    await this.toggleMenuButon.click();
  }

  async checkHomePageSideBarIsCollapse() {
    await expect(this.menuTxtHome).not.toBeVisible();
  }
  //check mobile element are visible
  async checkElementsNavBarAreVisible(projectName: string) {
    await expect(this.menuHomeMobile.nth(1)).toBeVisible();
    await expect(this.menuTwisterMobile.nth(1)).toBeVisible();
    if (projectName === "chrome-mobile") {
      await expect(this.menuDownloadChromeMobile).toBeVisible();
    } else if (projectName === "safari-mobile") {
      await expect(this.menuDownloadSafariMobile).toBeVisible();
    }
    await expect(this.menuPromosMobile.nth(1)).toBeVisible();
  }

  async checkNavBarMenuColor(menuLocator: Locator) {
    await menuLocator.click();
    if (menuLocator === this.menuDownloadSafariMobile) {
      return;
    }
    if (menuLocator === this.menuDownloadChromeMobile) {
      await this.page.goBack();
      return;
    }
    await expect(this.tabbarCoinBlock).toBeVisible();
  }

  async checkElementsNavBarMenuColor(projectName: string) {
    const locatorNavBar = [this.menuTwisterMobile.nth(1), this.menuPromosMobile.nth(1), this.menuHomeMobile.nth(1)];

    if (projectName === "chrome-mobile") {
      locatorNavBar.unshift(this.menuDownloadChromeMobile);
    } else if (projectName === "safari-mobile") {
      locatorNavBar.unshift(this.menuDownloadSafariMobile);
    }

    for (const locator of locatorNavBar) {
      await this.checkNavBarMenuColor(locator);
    }
  }

  async checkSidebarNavigationAndUrl() {}

  async goToLoginPage() {
    await this.loginButton.waitFor({ state: "visible" });
    await this.loginButton.click();
    await this.page.waitForURL(/.*r5_request_token/);
  }

  async goToPromotionsPage() {
    await this.menuPromotions.click();
    await this.page.waitForURL("**/fr/promotions");
  }

  async goToDownloadAppPage() {
    await this.menuDownloadApp.click();
    await this.page.waitForURL("**/fr/download");
  }

  async goToPreventionPage() {
    await this.menuPrevention.click();
    await this.page.waitForURL("**/fr/prevention");
  }

  async goToLoyaltyPage() {
    await this.menuLoyalty.click();
    await this.page.waitForURL("**/fr/loyalty");
  }

  async verifyUnder18IsVisible(): Promise<void> {
    await expect(this.under18).toBeVisible({ timeout: 10000 });
  }

  async verifyUnder18IsNotVisible(): Promise<void> {
    await expect(this.under18).not.toBeVisible();
  }

  async verifyDesktopLayoutIsVisible(): Promise<void> {
    await expect(this.desktopLayout.first()).toBeVisible({ timeout: 10000 });
  }

  async clickSignupLink(): Promise<void> {
    await this.signinLink.click();
  }

  async verifyFooterLogosAreVisible(): Promise<void> {
    const logos = [
      "Logo Evalujeu",
      "Logo ANJ",
      "Logo cb",
      "Logo virement",
      "Logo paypal",
      "Logo visa",
      "Logo mastercard",
      "Logo skrill",
      "Logo neteller",
      "Logo paysafe",
      "Logo googlePay",
      "Logo applePay"
    ];
    for (const logo of logos) {
      await expect(await Utils.getLogoByAlt(this.page, logo)).toBeVisible();
    }
  }

  async waitForUnder18Visible(): Promise<void> {
    await this.under18.waitFor({ state: "visible" });
  }

  async navigateToInvalidUrl(): Promise<void> {
    await this.page.goto("/xxxxx");
  }

  async verifyOupsPageIsVisible(): Promise<void> {
    await expect(this.oupsImg).toBeVisible({ timeout: 10000 });
  }

  async clickBackHomeLink(): Promise<void> {
    await this.backHomeLink.click();
  }

  async verifySideBarIsVisible(): Promise<void> {
    await expect(this.sideBar).toBeVisible({ timeout: 10000 });
  }

  async clickHomeLink() {
    await this.backHomeLink.click();
  }

  async checkOupsImgIsVisible() {
    await expect(this.oupsImg).toBeVisible({ timeout: 20000 });
  }

  async checkSideBarIsVisible() {
    await expect(this.sideBar).toBeVisible({ timeout: 10000 });
  }

  async verifyInactivityModalIsVisible() {
    await expect(this.inactivityModal).toBeVisible();
  }

  async triggerInactivityModal() {
    await this.inactivityModal.waitFor({ state: "visible", timeout: 300000 });
  }

  async clickStayConnected() {
    await this.stayConnectedButton.click();
  }

  async verifyUserIsStillLoggedIn() {
    await expect(this.balanceAccount).toBeVisible();
  }

  async clickLogout() {
    await this.logoutButton.click();
  }

  async verifyUserIsLoggedOut() {
    await expect(this.balanceAccount).not.toBeVisible();
  }
}
