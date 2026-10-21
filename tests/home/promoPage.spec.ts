import { loginWithProfile, test } from "../fixtures/fixtures";

test.describe("Tests suite Home Page - promo Page", () => {
  loginWithProfile.use({ account: "profil-ok" });
  test.beforeEach(async ({ page, pages }) => {
    await page.goto("/");
    await page.waitForLoadState("load");
    await pages.commonPage.open("promotions");
    await page.waitForLoadState("load");
  });

  test("should be promo mosaic", async ({ page, pages }) => {
    await test.step("Wait for page to fully load", async () => {
      await page.waitForLoadState("load");
      await page.waitForLoadState("domcontentloaded");
      await page.waitForTimeout(15000);
    });

    await test.step("Click the first promo mosaic card", async () => {
      await pages.promotionPage.clickFirstPromoMosaicCard();
    });

    await test.step("Reload and verify navigation to bonus-bienvenue promo page", async () => {
      await pages.promotionPage.checkWelcomeBonusPage();
    });
  });
});

test.describe("Tests suite Home Page - promo Page Introuvable", () => {
  loginWithProfile.use({ account: "profil-ok" });
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("load");
    await page.goto("/promotions/bonus-bienvenue-xyz");
  });

  test("should be promo page OUPS appear", async ({ pages }) => {
    await test.step("Verify OUPS image is visible", async () => {
      await pages.homePage.checkOupsImgIsVisible();
    });

    await test.step("Click home link", async () => {
      await pages.homePage.clickHomeLink();
    });

    await test.step("Verify sidebar is visible", async () => {
      await pages.homePage.checkSideBarIsVisible();
    });
  });
});
