import { loginWithProfile, test } from "../fixtures/fixtures";

test.describe("Mobile - Game Access: Insufficient Funds Modal", () => {
  loginWithProfile.use({ account: "profil-game-no-sold" });
  test.beforeEach(async ({ pages, page }) => {
    await page.waitForLoadState("load");
    await pages.pokerPage.clickFirstGameCardButton();
  });

  test("Mobile - Should display insufficient funds modal", async ({ pages }) => {
    await test.step("Verify insufficient funds modal is displayed", async () => {
      await pages.commonPage.checkModalInsufficientGame();
    });
  });
});

test.describe("Mobile - Game Access: Successful Entry With Sufficient Balance", () => {
  loginWithProfile.use({ account: "profil-ok" });
  test.beforeEach(async ({ pages, page }) => {
    await pages.commonPage.open("homePage");
    await page.waitForLoadState("load");
    await pages.pokerPage.clickFirstGameCardButton();
  });

  test("Mobile - Should display play game modal and redirect to game page", async ({ pages }) => {
    await test.step("Verify play game modal is displayed", async () => {
      await pages.commonPage.checkModalPlayGame();
    });

    await test.step("Verify redirect to game page", async () => {
      await pages.commonPage.checkPagePoker();
    });
  });
});
