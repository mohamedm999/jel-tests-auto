import { loginWithProfile, test } from "../fixtures/fixtures";
import { Page } from "@playwright/test";
import { mockCookieConsent } from "../../utils/consent";
const jsonProfil = require("../../data/credentials.json");

test.describe("Game Access and Playability Checks logged - no sold", () => {
  loginWithProfile.use({ account: "profil-game-no-sold" });
  test.beforeEach(async ({ pages, page }) => {
    await mockCookieConsent(page);
    await pages.commonPage.open("homePage");
    await page.waitForLoadState("load");
  });

  test("Should display insufficient funds modal", async ({ pages }) => {
    await test.step("Click first game card button", async () => {
      await pages.pokerPage.clickFirstGameCardButton();
    });

    await test.step("Verify insufficient funds modal is displayed", async () => {
      await pages.commonPage.checkModalInsufficientGame();
    });
  });

  test("Should display insufficient funds modal AFTER click on Jouer sur un navigateur", async ({ pages, page }) => {
    let newPage: Page;

    await test.step("Wait for page to be ready", async () => {
      await page.waitForLoadState("domcontentloaded");
    });

    await test.step("Click 'Jouer sur navigateur' and wait for new tab", async () => {
      newPage = await pages.pokerPage.clickOnPlayOnBrowserLogged(page);
    });

    await test.step("Verify redirect to game-launch page", async () => {
      await pages.pokerPage.expectGameLaunchUrl(newPage);
    });
  });
});

test.describe("Game Access and Playability Checks logged - with sold", () => {
  loginWithProfile.use({ account: "profil-ok" });
  test.beforeEach(async ({ pages, page }) => {
    await mockCookieConsent(page);
    await pages.commonPage.open("homePage");
    await page.waitForLoadState("load");
    await page.waitForLoadState("domcontentloaded");
  });

  test("Should display play game modal and redirect to game page", async ({ pages }) => {
    await test.step("Click first twister card button", async () => {
      await pages.pokerPage.clickFirstGameCardButton();
    });

    await test.step("Verify play game modal is displayed", async () => {
      await pages.commonPage.checkModalPlayGame();
    });

    await test.step("Verify redirect to game page", async () => {
      await pages.commonPage.checkPagePoker();
    });
  });

  test("Should display play game modal and redirect to game page AFTER click on Jouer sur un navigateur", async ({ pages, page }) => {
    await test.step("Verify game page elements are visible", async () => {
      await pages.commonPage.verifyGamePageElementsVisible();
    });

    const newPage = await test.step("Click 'Jouer sur navigateur'", async () => {
      return await pages.pokerPage.clickOnPlayOnBrowserLogged(page);
    });

    await test.step("Verify redirect to game launch url", async () => {
      await pages.pokerPage.expectGameLaunchUrl(newPage);
    });
  });
});

test.describe("Game Access and Playability Checks NO logged - no sold", () => {
  test.beforeEach(async ({ page, pages }) => {
    await mockCookieConsent(page);
    await pages.commonPage.open("homePage");
    await page.waitForTimeout(5000);
  });

  test("Should display insufficient funds modal", async ({ pages }) => {
    await test.step("Click first twister card button", async () => {
      await pages.pokerPage.clickFirstGameCardButton();
    });

    await test.step("Wait for game redirect and verify login form", async () => {
      await pages.commonPage.waitForGameRedirectAndLogin();
    });

    await test.step("Login with no-funds profile", async () => {
      await pages.connexionPage.fillCredentials(jsonProfil["profil-game-no-sold"].login, jsonProfil["profil-game-no-sold"].password);
      await pages.commonPage.submit(pages.connexionPage.submitButton);
    });

    await test.step("Reload and verify balance account is visible", async () => {
      await pages.commonPage.reloadAndVerifyBalanceAccount();
    });

    await test.step("Verify insufficient funds modal is displayed", async () => {
      await pages.commonPage.checkModalInsufficientGame();
    });
  });

  // * skipped: after clicking "Play" and logging in we should see the insufficient funds modal, but it still loads the home page without any data or modals
  test.fixme("Should display insufficient funds modal AFTER click on Jouer sur un navigateur", async ({ page, pages }) => {
    await test.step("Click 'Jouer sur navigateur'", async () => {
      await pages.pokerPage.clickOnPlayOnBrowserNoLogged();
    });

    await test.step("Wait for game redirect and verify login form", async () => {
      await pages.commonPage.waitForGameRedirectAndLogin();
    });

    const newPage = await test.step("Login with no-funds profile and wait for new page", async () => {
      const [newPage] = await Promise.all([
        page.context().waitForEvent("page", { timeout: 60000 }),
        pages.connexionPage.fillCredentials(jsonProfil["profil-game-no-sold"].login, jsonProfil["profil-game-no-sold"].password),
        pages.commonPage.submit(pages.connexionPage.submitButton),
        page.waitForLoadState("load"),
        page.waitForLoadState("networkidle"),
        pages.commonPage.balanceAccount()
      ]);
      return newPage;
    });

    await test.step("Verify poker game is visible in new page", async () => {
      await pages.pokerPage.fillUsernamePokerIfExists(newPage);
      await pages.pokerPage.verifyPokerGameIsVisible(newPage);
    });
  });
});

test.describe("Game Access and Playability Checks NO logged - with sold", () => {
  test.beforeEach(async ({ pages, page }) => {
    await mockCookieConsent(page);
    await pages.commonPage.open("homePage");
    await page.waitForTimeout(5000);
  });

  test("Should display play game modal and redirect to game page", async ({ pages, page }) => {
    await test.step("Click first twister card button", async () => {
      await pages.pokerPage.clickFirstGameCardButton();
    });

    await test.step("Wait for game redirect and verify login form", async () => {
      await pages.commonPage.waitForGameRedirectAndLogin();
    });

    await test.step("Login with valid profile", async () => {
      await pages.connexionPage.fillCredentials(jsonProfil["profil-ok"].login, jsonProfil["profil-ok"].password);
      await page.waitForTimeout(5000);
      await pages.commonPage.submit(pages.connexionPage.submitButton);
    });

    await test.step("Verify play game modal is displayed", async () => {
      await pages.commonPage.checkModalPlayGame();
    });

    await test.step("Verify redirect to game page", async () => {
      await pages.commonPage.checkPagePoker();
    });
  });

  // * skipped: after clicking "Play" and logging in we should see the insufficient funds modal, but it still loads the home page without any data or modals
  test.fixme("Should display play game modal and redirect to game page AFTER click on Jouer sur un navigateur", async ({ page, pages }) => {
    await test.step("Click 'Jouer sur navigateur'", async () => {
      await pages.pokerPage.clickOnPlayOnBrowserNoLogged();
    });

    await test.step("Wait for game redirect and verify login form", async () => {
      await pages.commonPage.waitForGameRedirectAndLogin();
    });

    const newPage = await test.step("Login with valid profile and wait for new page", async () => {
      const [newPage] = await Promise.all([
        page.context().waitForEvent("page", { timeout: 60000 }),
        pages.connexionPage.fillCredentials(jsonProfil["profil-ok"].login, jsonProfil["profil-ok"].password),
        pages.commonPage.submit(pages.connexionPage.submitButton),
        page.waitForLoadState("load"),
        page.waitForLoadState("networkidle"),
        pages.commonPage.balanceAccount()
      ]);
      return newPage;
    });

    await test.step("Verify poker game is visible in new page", async () => {
      await pages.pokerPage.verifyPokerGameIsVisible(newPage);
    });
  });
});
