import { Page } from "@playwright/test";
import { loginWithProfile, test } from "../fixtures/fixtures";
import { Utils } from "../../utils/helpers";
import { mockCookieConsent } from "../../utils/consent";

test.describe("Tests suite Home Page - Prevention - no logged", () => {
  test.beforeEach(async ({ page, pages }) => {
    await mockCookieConsent(page);
    await page.goto("/");
    await page.waitForLoadState("load");
    await page.waitForLoadState("networkidle");
    await pages.homePage.waitForUnder18Visible();
    await page.waitForTimeout(1500);
    await pages.preventionPage.clickPreventionLink();
    await pages.preventionPage.waitForAccordionVisible();
  });

  test("should be redirect to the correct URL - evalujeu.fr", async ({ page, pages }) => {
    let newPage: Page;

    await test.step("Click chevron to expand accordion", async () => {
      await pages.preventionPage.clickChevronByIndex(0);
    });

    await test.step("Click evalujeu.fr link and wait for new tab", async () => {
      newPage = await pages.preventionPage.clickEvalujeuLink(page);
    });

    await test.step("Verify redirect to evalujeu.fr", async () => {
      await Utils.checkUrl(newPage, "https://www.evalujeu.fr");
    });
  });

  test("should be redirect to login page when I click on limit", async ({ pages }) => {
    await test.step("Click second chevron to expand accordion", async () => {
      await pages.preventionPage.clickChevronByIndex(1);
    });

    await test.step("Click 'Modifier les limites' link", async () => {
      await pages.preventionPage.clickEditLimits();
    });

    await test.step("Verify login form is visible", async () => {
      await pages.connexionPage.expectLoginFormVisible();
    });
  });

  test("should be redirect to login page when I click on auto-exclusion", async ({ pages }) => {
    await test.step("Click second chevron to expand accordion", async () => {
      await pages.preventionPage.clickChevronByIndex(1);
    });

    await test.step("Click 'Procéder à une auto-exclusion' link", async () => {
      await pages.preventionPage.clickAutoExclusion();
    });

    await test.step("Verify login form is visible", async () => {
      await pages.connexionPage.expectLoginFormVisible();
    });
  });

  // test.fixme("should be redirect to login page when I click on update limit", async ({ pages }) => {
  //   await test.step("Click fourth chevron to expand accordion", async () => {
  //     await pages.preventionPage.clickChevronByIndex(3);
  //   });

  //   await test.step("Click 'Modifier mes limites' link", async () => {
  //     await pages.preventionPage.clickEditMyLimits();
  //   });

  //   await test.step("Verify login form is visible", async () => {
  //     await pages.connexionPage.expectLoginFormVisible();
  //   });
  // });

  // test.fixme("should be redirect to login page when I click on auto-exclusion button", async ({ pages }) => {
  //   await test.step("Click fifth chevron to expand accordion", async () => {
  //     await pages.preventionPage.clickChevronByIndex(4);
  //   });

  //   await test.step("Click 'Demander une exclusion de jeu' button", async () => {
  //     await pages.preventionPage.clickRequestGameExclusion();
  //   });

  //   await test.step("Verify login form is visible", async () => {
  //     await pages.connexionPage.expectLoginFormVisible();
  //   });
  // });

  // test("should be redirect to login page when I click on close account", async ({ pages }) => {
  //   await test.step("Click seventh chevron to expand accordion", async () => {
  //     await pages.preventionPage.clickChevronByIndex(6);
  //   });

  //   await test.step("Click 'Fermer mon compte' button", async () => {
  //     await pages.preventionPage.clickCloseMyAccount();
  //   });

  //   await test.step("Verify login form is visible", async () => {
  //     await pages.connexionPage.expectLoginFormVisible();
  //   });
  // });
});

test.describe("Tests suite Home Page - Prevention - logged", () => {
  loginWithProfile.use({ account: "profil-ok" });
  test.beforeEach(async ({ page, pages }) => {
    await mockCookieConsent(page);
    await page.goto("/");
    await page.waitForLoadState("load");
    await pages.preventionPage.clickPreventionLink();
    await page.waitForLoadState("load");
    await pages.preventionPage.waitForAccordionVisible();
  });

  test("should be redirect to limit page when I click on limit", async ({ pages, page }) => {
    await test.step("Click second chevron to expand accordion", async () => {
      await pages.preventionPage.clickChevronByIndex(1);
    });

    await test.step("Verify accordion is expanded", async () => {
      await pages.preventionPage.expectAccordionExpanded(2);
    });

    await test.step("Click 'Modifier les limites' link", async () => {
      await pages.preventionPage.clickEditLimits();
    });

    await test.step("Verify redirect to limits page", async () => {
      await Utils.checkUrl(page, "/fr/account/limits");
    });
  });

  test("should be redirect to auto-exclusion page when I click on auto-exclusion", async ({ pages, page }) => {
    await test.step("Click second chevron to expand accordion", async () => {
      await pages.preventionPage.clickChevronByIndex(1);
    });

    await test.step("Click auto-exclusion link", async () => {
      await pages.preventionPage.clickGamblingPreventionLink();
    });

    await test.step("Verify redirect to auto-exclusion page", async () => {
      await Utils.checkUrl(page, "fr/account/limits?tab=gamblingPrevention");
    });
  });

  test("should be redirect to limit page when I click on update limit", async ({ pages, page }) => {
    await test.step("Wait for page to be ready", async () => {
      await page.waitForTimeout(3500);
    });

    await test.step("Click fourth chevron to expand accordion", async () => {
      await pages.preventionPage.clickChevronByIndex(3);
    });

    await test.step("Click 'Modifier mes limites' link", async () => {
      await pages.preventionPage.clickEditMyLimits();
    });

    await test.step("Verify redirect to limits page", async () => {
      await Utils.checkUrl(page, "/fr/account/limits");
    });
  });

  test("should be redirect to auto-exclusion page when I click on auto-exclusion button", async ({ pages, page }) => {
    await test.step("Wait for page to be ready", async () => {
      await page.waitForTimeout(3500);
    });

    await test.step("Click fifth chevron to expand accordion", async () => {
      await pages.preventionPage.clickChevronByIndex(4);
    });

    await test.step("Verify accordion is expanded", async () => {
      await pages.preventionPage.expectAccordionExpanded(5);
    });

    await test.step("Click 'Demander une exclusion de jeu' link", async () => {
      await pages.preventionPage.clickRequestGameExclusion();
    });

    await test.step("Verify redirect to auto-exclusion page", async () => {
      await Utils.checkUrl(page, "/fr/account/limits?tab=gamblingPrevention");
    });
  });

  test("should be redirect to login page when I click on close account", async ({ pages, page }) => {
    await test.step("Wait for page to be ready", async () => {
      await page.waitForLoadState("domcontentloaded");
      await page.waitForTimeout(500);
    });

    await test.step("Click seventh chevron to expand accordion", async () => {
      await pages.preventionPage.clickChevronByIndex(6);
    });

    await test.step("Click 'Fermer mon compte' link", async () => {
      await pages.preventionPage.clickCloseMyAccount();
    });

    await test.step("Verify redirect to close account page", async () => {
      await Utils.checkUrl(page, "fr/account/limits?tab=gamblingPrevention");
    });
  });
});
