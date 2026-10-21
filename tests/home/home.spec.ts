import { loginWithProfile, test } from "../fixtures/fixtures";
import { Utils } from "../../utils/helpers";
import { mockCookieConsent } from "../../utils/consent";

test.describe("Tests suite Home Page view desktop", () => {
  test.beforeEach(async ({ page }) => {
    await mockCookieConsent(page);
    await page.goto("/");
    await page.waitForLoadState("load");
    await page.waitForLoadState("networkidle");
  });

  test("@smoke should be check the behaviour of sidebar", async ({ pages }) => {
    await test.step("Verify homepage elements are visible", async () => {
      await pages.homePage.checkHomepageElementsAreVisible();
    });

    await test.step("Collapse the sidebar", async () => {
      await pages.homePage.clickCollapseSideBar();
    });

    await test.step("Verify sidebar is collapsed", async () => {
      await pages.homePage.checkHomePageSideBarIsCollapse();
    });
  });

  test("should be check the behaviour of logo -18", async ({ pages }) => {
    await test.step("Verify -18 logo is visible on homepage", async () => {
      await pages.homePage.verifyUnder18IsVisible();
    });

    await test.step("Navigate to login page", async () => {
      await pages.homePage.goToLoginPage();
    });

    await test.step("Verify -18 logo is no longer visible", async () => {
      await pages.homePage.verifyUnder18IsNotVisible();
    });
  });

  test("should be check the behaviour of desktop layout", async ({ pages }) => {
    await test.step("Verify desktop layout is visible on homepage", async () => {
      await pages.homePage.verifyDesktopLayoutIsVisible();
    });

    await test.step("Navigate to login page and verify desktop layout is still visible", async () => {
      await pages.homePage.goToLoginPage();
      await pages.homePage.verifyDesktopLayoutIsVisible();
    });

    await test.step("Navigate to signup page and verify desktop layout is still visible", async () => {
      await pages.homePage.clickSignupLink();
      await pages.homePage.verifyDesktopLayoutIsVisible();
    });
  });

  test("should logo on footer visible", async ({ pages }) => {
    await test.step("Verify all footer logos are visible", async () => {
      await pages.homePage.verifyFooterLogosAreVisible();
    });
  });

  test.skip("should redirect to correct url accessibility", async ({ pages, page }) => {
    await test.step("Wait for page to be ready", async () => {
      await pages.homePage.waitForUnder18Visible();
    });

    await test.step("Click accessibility link", async () => {
      await pages.homePage.accessibility.click();
    });

    await test.step("Verify redirect to accessibility url", async () => {
      await Utils.checkUrl(page, "accessibility");
    });
  });

  test.skip("should redirect to correct url regulations", async ({ pages, page }) => {
    await test.step("Click regulations link", async () => {
      await pages.homePage.regulations.click();
    });

    await test.step("Verify redirect to regulations url", async () => {
      await Utils.checkUrl(page, "404");
    });
  });
  test.skip("should redirect to correct url privacy policy", async ({ pages, page }) => {
    await test.step("Click privacy policy link", async () => {
      await pages.homePage.privacyPolicy.click();
    });

    await test.step("Verify redirect to privacy policy url", async () => {
      await Utils.checkUrl(page, "404");
    });
  });

  test.skip("should redirect to correct url legal notices", async ({ pages, page }) => {
    await test.step("Click legal notices link", async () => {
      await pages.homePage.legalNotices.click();
    });

    await test.step("Verify redirect to legal notices url", async () => {
      await Utils.checkUrl(page, "legalNotices");
    });
  });
});

test.describe("Tests suite Page OUPS", () => {
  test("should page oups appear with incorrect url", async ({ pages }) => {
    await test.step("Navigate to invalid url", async () => {
      await pages.homePage.navigateToInvalidUrl();
    });

    await test.step("Verify oups page is displayed", async () => {
      await pages.homePage.verifyOupsPageIsVisible();
    });

    await test.step("Click back to home link", async () => {
      await pages.homePage.clickBackHomeLink();
    });

    await test.step("Verify sidebar is visible", async () => {
      await pages.homePage.verifySideBarIsVisible();
    });
  });
});

test.describe("Inactivity modal", () => {
  test.setTimeout(300000);
  loginWithProfile.use({ account: "profil-ok" });
  test.beforeEach(async ({ pages }) => {
    await pages.homePage.triggerInactivityModal();
  });

  test.fixme("should keep session active when clicking 'Stay connected'", async ({ pages }) => {
    await test.step("Verify inactivity modal is visible", async () => {
      await pages.homePage.verifyInactivityModalIsVisible();
    });
    await test.step("Click 'Stay connected'", async () => {
      await pages.homePage.clickStayConnected();
    });
    await test.step("Verify user is still logged in", async () => {
      await pages.homePage.verifyUserIsStillLoggedIn();
    });
  });
});

if (process.env.ENV !== "pre-prod") {
  test.describe("Tests suite Cookie", () => {
    test.beforeEach(async ({ page, pages }) => {
      await page.goto("/");
      await page.waitForLoadState("load");
      await Utils.clearConsentAndReload(page);
      await pages.commonPage.verifyCookieBlocIsVisible();
    });

    test("should modal cookie disappear after click continue without cookie", async ({ pages }) => {
      await test.step("Click continue without cookie", async () => {
        await pages.commonPage.continueCookie.click();
      });

      await test.step("Verify cookie modal is no longer visible", async () => {
        await pages.commonPage.verifyCookieBlocIsNotVisible();
      });
    });

    test("should modal cookie disappear after click aggree cookie", async ({ pages }) => {
      await test.step("Click agree cookie", async () => {
        await pages.commonPage.agreeCookie.click();
      });

      await test.step("Verify cookie modal is no longer visible", async () => {
        await pages.commonPage.verifyCookieBlocIsNotVisible();
      });
    });

    test("should modal custome appear when customize cookie", async ({ pages }) => {
      await test.step("Click customize cookie", async () => {
        await pages.commonPage.customizeCookie.click();
      });

      await test.step("Verify customize cookie modal and all toggles are visible", async () => {
        await pages.commonPage.verifyCustomizeCookieModalIsVisible();
      });
    });
  });
}
