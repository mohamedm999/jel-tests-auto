import { Locator, Page } from "@playwright/test";
import { Utils } from "../../utils/helpers";

export class PromotionPage {
  readonly page: Page;
  readonly firstPromoMosaicCard: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstPromoMosaicCard = this.page
      .locator(
        '[class="news-card flex flex-col overflow-hidden rounded-lg bg-gray-950 bg-cover bg-center text-white h-103"]',
      )
      .first();
  }

  async clickFirstPromoMosaicCard() {
    await this.page.waitForLoadState("load");
    await this.firstPromoMosaicCard.click();
  }

  async checkWelcomeBonusPage() {
    await this.page.waitForLoadState("load");
    await this.page.waitForURL("**/promotions/bonus-bienvenue");
    await Utils.checkUrl(this.page, "promotions/bonus-bienvenue");
  }
}
