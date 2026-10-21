import { loginWithProfile, test } from "../fixtures/fixtures";

test.describe("Tests suite Home Page - Download APP", () => {
  loginWithProfile.use({ account: "profil-ok" });
  test.beforeEach(async ({ page, pages }) => {
    await page.goto("/");
    await page.waitForLoadState("load");
    await page.waitForLoadState("networkidle");
    await pages.homePage.goToDownloadAppPage();
    await page.waitForLoadState("load");
  });

  test("@smoke should be download APP", async ({ pages }) => {
    await pages.commonPage.clickDownloadAppLink();
  });
});
