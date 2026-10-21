import { expect, type Locator, type Page } from "@playwright/test";

export class PreventionPage {
  readonly page: Page;
  readonly preventionLink: Locator;
  readonly accordion: Locator;
  readonly chevron: Locator;
  readonly evalujeuLink: Locator;
  readonly editLimits: Locator;
  readonly autoExclusionButton: Locator;
  readonly gameExclusionButton: Locator;
  readonly closeMyAccount: Locator;
  readonly editMyLimits: Locator;
  readonly gamblingPreventionLink: Locator;
  readonly accordionItem: Locator;
  readonly accordionElement: Locator;

  constructor(page: Page) {
    this.page = page;
    this.preventionLink = page.locator('[href="/fr/prevention"]');
    this.accordion = page.locator(".accordion");
    this.chevron = page.locator('[data-icon="chevron-down"]');
    this.evalujeuLink = page.locator('[href="https://www.evalujeu.fr"]');
    this.editLimits = page.locator('a[href="/fr/account/limits"]').filter({ hasText: "Modifier les limites" });
    this.autoExclusionButton = page.getByText("Procéder à une auto-exclusion");
    this.gameExclusionButton = page.getByText("Demander une exclusion de jeu");
    this.closeMyAccount = page.getByText("Fermer mon compte");
    this.editMyLimits = page.getByText("Modifier mes limites");
    this.gamblingPreventionLink = page.locator('[href="/fr/account/limits?tab=gamblingPrevention"]');
    this.accordionItem = page.locator('[class="flex w-full items-center justify-between gap-2"]');
    this.accordionElement = page.locator(".accordion");
  }

  async clickPreventionLink() {
    await this.page.waitForLoadState("load");
    await this.page.waitForLoadState("networkidle");
    await this.preventionLink.click();
    await this.page.waitForURL("**/fr/prevention");
  }

  async waitForAccordionVisible() {
    // await this.page.waitForLoadState("networkidle");
    await expect(this.accordion.first()).toBeVisible({
      timeout: 15000
    });
  }

  async clickChevronByIndex(index: any) {
    const ariaExpanded = await this.accordionElement.nth(index).locator("button").first().getAttribute("aria-expanded");
    if (ariaExpanded === "false") {
      await this.chevron.nth(index).click();
    }
  }

  async clickEvalujeuLink(page: Page): Promise<Page> {
    const link = this.evalujeuLink.first();
    const [newPage] = await Promise.all([page.context().waitForEvent("page"), link.click({ force: true })]);
    await newPage.waitForLoadState("load");
    return newPage;
  }

  async clickEditLimits() {
    const link = this.editLimits.first();
    await link.scrollIntoViewIfNeeded();
    await link.click({ force: true });
  }

  async clickEditMyLimits() {
    await this.page.waitForLoadState("load");
    await this.editMyLimits.click();
  }

  async clickAutoExclusion() {
    await this.autoExclusionButton.click();
  }

  async clickRequestGameExclusion(): Promise<void> {
    await this.gameExclusionButton.nth(1).click();
  }

  async clickCloseMyAccount() {
    await this.closeMyAccount.nth(1).click();
  }

  async expectAccordionExpanded(index: any) {
    await expect(this.accordionItem.nth(index)).toHaveAttribute("aria-expanded", "true");
  }

  async clickGamblingPreventionLink() {
    await this.gamblingPreventionLink.nth(0).click();
  }
}
