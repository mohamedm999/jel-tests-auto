import { loginWithProfile, test } from "../fixtures/fixtures";

test.describe("Manage modal limit appear with no limit defined", () => {
  loginWithProfile.use({ account: "profil-game-no-limit-defined" });

  test.beforeEach(async ({ pages }) => {
    await pages.commonPage.open("homePage");
  });

  test("Should display button Define limit when limit is not configure", async ({ pages }) => {
    await test.step("Navigate to limits page", async () => {
      await pages.commonPage.open("limitsPage");
    });

    await test.step("Wait for limits page title to be visible", async () => {
      await pages.limitsPage.waitForLimitsPageTitle();
    });

    await test.step('Verify "Définir mes limites" button is visible', async () => {
      await pages.limitsPage.checkSetMyLimitsButtonIsVisible();
    });
  });

  test("Should display modal limit after game", async ({ pages }) => {
    await test.step("Click the first twister card button", async () => {
      await pages.limitsPage.clickFirstTwisterCardButton();
    });

    await test.step("Verify modal limit elements are visible", async () => {
      await pages.limitsPage.checkModalLimitAfterGameIsVisible();
    });
  });

  test("Should display modal limit after deposit", async ({ pages, page }) => {
    await test.step("Verify collapse and plus icons are visible", async () => {
      await pages.limitsPage.checkIconsAreVisible();
    });

    await test.step("Click balance account", async () => {
      await pages.limitsPage.balanceAccount.click();
    });

    await test.step("Verify modal limit elements are visible", async () => {
      await pages.limitsPage.checkModalLimitDepositIsVisible();
    });
  });
});
