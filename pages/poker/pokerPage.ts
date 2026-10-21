import { expect, type Locator, type Page } from "@playwright/test";
import { faker } from "@faker-js/faker";

export class PokerPage {
  readonly page: Page;
  readonly gameCardButton: Locator;
  readonly playOnBrowserLink: Locator;
  readonly modalContainer: Locator;
  readonly slickSlide: Locator;
  readonly confirmButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.gameCardButton = page.getByTestId("twister-card").first().getByRole("button");
    this.playOnBrowserLink = page.getByText("Jouer sur navigateur");
    this.modalContainer = page.getByTestId("modal-container");
    this.slickSlide = page.locator('[class="slick-slide"]');
    this.confirmButton = page.getByTestId("confirm");
  }

  async clickFirstGameCardButton() {
    await this.page.waitForLoadState("networkidle");
    await this.page.waitForTimeout(5000);
    await this.gameCardButton.click();
  }

  async clickOnPlayOnBrowserLogged(page: Page): Promise<Page> {
    const [newPage] = await Promise.all([page.context().waitForEvent("page", { timeout: 60000 }), this.playOnBrowserLink.first().click()]);
    await newPage.waitForLoadState("domcontentloaded");
    return newPage;
  }

  async clickOnPlayOnBrowserNoLogged(): Promise<void> {
    await Promise.all([this.playOnBrowserLink.click(), this.page.waitForLoadState("domcontentloaded")]);
  }

  async expectGameLaunchUrl(page: Page) {
    await expect(page.url()).toContain("game-launch");
  }

  async verifyPokerGameIsVisible(newPage: Page): Promise<void> {
    await newPage.waitForLoadState("domcontentloaded");
    try {
      await expect(newPage.frameLocator('iframe[title="Playtech Game"]').locator(".table-header-items ")).toBeVisible({
        timeout: 50000
      });
    } catch {
      await expect(newPage.frameLocator('iframe[title="Playtech Game"]').locator(".poker-header-content-wrapper")).toBeVisible({
        timeout: 50000
      });
    }
  }

  async navigateToPlayWebview(): Promise<void> {
    await this.page.goto("/fr/play?useWebview=true");
    await this.page.waitForLoadState("load");
  }

  async navigateToPlayTwister1EURWebview(): Promise<void> {
    await this.page.goto("/fr/play/PS_TW_HE_SNG_1_EUR-=-1%20€?useWebview=true");
    await this.page.waitForLoadState("load");
    await this.page.waitForLoadState("networkidle");
  }

  async verifyModalContainerAndSlickSlideAreVisible(): Promise<void> {
    await expect(this.modalContainer).toBeVisible({
      timeout: 20000
    });
    await expect(this.slickSlide).toBeVisible({
      timeout: 20000
    });
  }

  async verifyGameLaunchPageOpensOnConfirm(): Promise<void> {
    const [newPage] = await Promise.all([this.page.context().waitForEvent("page", { timeout: 90000 }), this.confirmButton.click()]);
    await newPage.waitForLoadState("domcontentloaded");
    expect(newPage.url()).toContain("game-launch");
  }

  async fillUsernamePokerIfExists(page: Page) {
    const iframe = page.frameLocator('iframe[title="Playtech Game"]');
    const input = iframe.locator(".body-action-input input");
    const submitButton = iframe.locator(".general-popup-button.cta-button");

    try {
      await submitButton.waitFor({ state: "visible", timeout: 20000 });
      await input.fill(faker.string.alphanumeric(10));
      await submitButton.click();
    } catch {
      console.log("Username input not found, skipping filling username.");
    }
  }
}
