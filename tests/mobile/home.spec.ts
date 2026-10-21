import { test } from "../fixtures/fixtures";

test.describe("Tests suite Home Page view mobile", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("load");
  });

  test("should be check the behaviour of sidebar", async ({ pages, page }, testInfo) => {
    await test.step("Verify navbar elements are visible", async () => {
      await pages.homePage.checkElementsNavBarAreVisible(testInfo.project.name);
    });

    await test.step("Verify navbar menu colors", async () => {
      await pages.homePage.checkElementsNavBarMenuColor(testInfo.project.name);
    });
  });
});
