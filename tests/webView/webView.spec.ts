import { loginWithProfile, test } from "../fixtures/fixtures";
import jsonProfil from "../../data/credentials.json";
import { Utils } from "../../utils/helpers";
import { mockCookieConsent } from "../../utils/consent";

test.describe("Tests WebView pages rendering - no logged before test", () => {
  test.beforeEach(async ({ pages, page }) => {
    await mockCookieConsent(page);
    await pages.commonPage.open("homePage");
    await pages.commonPage.goToCleanUrl();
    await page.waitForTimeout(3000);
    await page.waitForLoadState("load");
  });

  test("should display signup form", async ({ page, pages }) => {
    await test.step("Open signup form in webview", async () => {
      await page.waitForURL("**/fr");
      await page.waitForTimeout(1500);
      await pages.signUpPage.goToSignUpWebview();
    });

    await test.step("Verify signup form is visible", async () => {
      await pages.signUpPage.expectSignUpFormVisible();
    });
  });

  test.fixme("WebView - should be create a new user on view desktop", async ({ page, pages, testData }) => {
    test.setTimeout(120000);
    await test.step("Generate test data", async () => {
      const dataApi = await Utils.getAddress("rue", 93190);
      const dataUser = Utils.createRandomUser();
      const generatedEmail = await Utils.generateRandomMail();
      testData.infoUser = dataUser;
      testData.infoAddress = dataApi;
      testData.generatedEmail = generatedEmail;
    });

    const city = "Paris";

    await test.step("Navigate to signup webview", async () => {
      await pages.signUpPage.goToSignUpPage();
      await page.waitForTimeout(5000);
      await pages.signUpPage.goToSignUpWebview();
    });

    await test.step("Fill credentials and submit", async () => {
      await pages.signUpPage.fillCredentials(testData.generatedEmail, testData.infoUser.password, true);
      await pages.commonPage.submit(pages.signUpPage.submitForm);
    });

    await test.step("Fill civility form", async () => {
      await pages.commonPage.visible(pages.askCivilityPage.form);
      await pages.askCivilityPage.selectGender(testData.infoUser.gender);
      await pages.askCivilityPage.fillForm(
        testData.infoUser.gender,
        testData.infoUser.firstName,
        testData.infoUser.lastName,
        testData.infoUser.birthDate
      );
      await pages.commonPage.submit(pages.signUpPage.submitForm);
    });

    await test.step("Fill phone number and submit", async () => {
      await page.waitForLoadState("load");
      await pages.commonPage.visible(pages.signUpPage.signupPhoneForm);
      await pages.postalAdressPage.fillFormPhoneNumber();
      await pages.commonPage.submit(pages.signUpPage.submitForm);
    });

    await test.step("Validate OTP and complete profile", async () => {
      await page.waitForTimeout(5000);
      await pages.signUpPage.getOtpFromEmailContent(testData.generatedEmail);
      await pages.signUpPage.clickCompleteProfile();
    });

    await test.step("Fill birth place form and submit", async () => {
      await pages.commonPage.visible(pages.birthPlacePage.form);
      await pages.birthPlacePage.fillForm(city);
      await pages.commonPage.submit(pages.signUpPage.submitForm);
    });

    await test.step("Confirm nationality and submit", async () => {
      await pages.commonPage.visible(pages.signUpPage.signupNationalityForm);
      await pages.commonPage.submit(pages.signUpPage.submitForm);
    });

    await test.step("Fill postal address and submit", async () => {
      await pages.commonPage.visible(pages.postalAdressPage.form);
      await pages.postalAdressPage.fillForm(testData.infoAddress);
      await pages.commonPage.submit(pages.signUpPage.submitForm);
    });

    await test.step("Skip identity document upload", async () => {
      await pages.signUpPage.skipUploadDocument();
    });

    await test.step("Skip address document upload", async () => {
      await pages.signUpPage.skipUploadAddressDocument();
    });

    await test.step("Set limits and continue", async () => {
      await page.waitForTimeout(5000);
      await pages.signUpPage.defineLimitsContinue();
    });

    await test.step("Make first deposit in webview", async () => {
      await pages.depositPage.fillSignupDepositAmount("10");
      await pages.signUpPage.confirmFirstDeposit();
      await page.waitForLoadState("load");
      await page.waitForLoadState("domcontentloaded");
      await pages.signUpPage.payFirstDepositWithTestCard();
      await pages.signUpPage.expectDepositSuccessAndClose();
    });

    await test.step("Complete sign up", async () => {
      await pages.signUpPage.endSignUp();
    });
  });

  test("should display login form", async ({ page, pages }) => {
    await test.step("Open login webview", async () => {
      await page.waitForURL("**/fr");
      await page.waitForTimeout(1500);
      await page.goto("/fr/login?useWebview=true");
      await page.waitForLoadState("load");
      await pages.connexionPage.expectLoginFormVisible();
    });

    await test.step("Fill credentials and submit", async () => {
      await pages.connexionPage.fillCredentials(jsonProfil["profil-ok"].login, jsonProfil["profil-ok"].password);
      await pages.commonPage.submit(pages.connexionPage.submitButton);
    });

    await test.step("Verify redirected to poker start webview", async () => {
      await pages.signUpPage.expectPokerStartWebviewUrl();
    });
  });
});

test.describe("Tests WebView pages rendering - logged before test", () => {
  loginWithProfile.use({ account: "profil-ok" });
  test.beforeEach(async ({ pages, page }) => {
    await pages.commonPage.open("homePage");
    await pages.commonPage.goToCleanUrl();
    await page.waitForLoadState("load");
  });

  test("should display profile page", async ({ pages }) => {
    await test.step("Open profile page in webview", async () => {
      await pages.accountPage.openProfilePageInWebview();
    });

    await test.step("Verify personal data tab is visible", async () => {
      await pages.accountPage.expectPersonalUserDataTabVisible();
    });
  });

  test("should display documents page", async ({ pages }) => {
    await test.step("Open documents page in webview", async () => {
      await pages.documentsPage.openDocumentsPageInWebview();
    });
    await test.step("Verify documents page in webview", async () => {
      await pages.documentsPage.verifyDocumentsPageInWebview();
    });
  });

  test("should display historic page", async ({ pages }) => {
    await test.step("Navigate to historic page in webview mode", async () => {
      await pages.accountPage.navigateToHistoricWebview();
    });

    await test.step("Verify navigation links are hidden", async () => {
      await pages.accountPage.verifyNavigationLinksAreHidden();
    });

    await test.step("Verify historic items container is visible", async () => {
      await pages.accountPage.verifyHistoricItemsContainerIsVisible();
    });

    await test.step("Verify calendar input opens date picker", async () => {
      await pages.accountPage.verifyCalendarInputOpensDatePicker();
    });
  });

  test("should display pratic page", async ({ pages }) => {
    await test.step("Navigate to pratic page in webview mode", async () => {
      await pages.accountPage.navigateToPracticeWebview();
    });

    await test.step("Verify navigation links are hidden", async () => {
      await pages.accountPage.verifyNavigationLinksAreHidden();
    });

    await test.step("Verify responsible gambling link is visible", async () => {
      await pages.accountPage.verifyResponsibleGamblingLinkIsVisible();
    });
  });

  test("should display prevention page", async ({ pages }) => {
    await test.step("Navigate to prevention page in webview mode", async () => {
      await pages.accountPage.navigateToPreventionWebview();
    });

    await test.step("Verify navigation links are hidden", async () => {
      await pages.accountPage.verifyNavigationLinksAreHidden();
    });

    await test.step("Verify calendar picker icon is visible", async () => {
      await pages.accountPage.verifyCalendarPickerIconIsVisible();
    });

    await test.step("Verify autoban confirm button is visible", async () => {
      await pages.accountPage.verifyAutobanConfirmButtonIsVisible();
    });
  });

  test("should display download page", async ({ pages }) => {
    await test.step("Navigate to download page in webview mode", async () => {
      await pages.commonPage.navigateToDownloadWebview();
    });

    await test.step("Verify overflow container is not visible", async () => {
      await pages.commonPage.verifyOverflowContainerIsNotVisible();
    });
  });

  test("should display play navigateur page", async ({ pages }) => {
    await test.step("Navigate to play navigateur page in webview mode", async () => {
      await pages.pokerPage.navigateToPlayWebview();
    });

    await test.step("Verify overflow container is not visible", async () => {
      await pages.commonPage.verifyOverflowContainerIsNotVisible();
    });
  });

  test("should display play twister page", async ({ pages }) => {
    await test.step("Navigate to play twister page in webview mode", async () => {
      await pages.pokerPage.navigateToPlayWebview();
    });

    await test.step("Verify overflow container is not visible", async () => {
      await pages.commonPage.verifyOverflowContainerIsNotVisible();
    });
  });

  test.fixme("should display play twister 1 EUR page", async ({ pages, page }) => {
    await test.step("Navigate to play twister 1 EUR page in webview mode", async () => {
      await page.waitForTimeout(10000);
      await pages.pokerPage.navigateToPlayTwister1EURWebview();
    });

    await test.step("Verify overflow container is not visible", async () => {
      await pages.commonPage.verifyOverflowContainerIsNotVisible();
    });

    await test.step("Verify modal container and slick slide are visible", async () => {
      await pages.pokerPage.verifyModalContainerAndSlickSlideAreVisible();
    });

    await test.step("Verify game launch page opens on confirm click", async () => {
      await pages.pokerPage.verifyGameLaunchPageOpensOnConfirm();
    });
  });

  test("should display format game twister page", async ({ pages }) => {
    await test.step("Navigate to format game twister page in webview mode", async () => {
      await pages.commonPage.navigateToFormatTwisterWebview();
    });

    await test.step("Verify overflow container is not visible", async () => {
      await pages.commonPage.verifyOverflowContainerIsNotVisible();
    });

    await test.step("Verify twister link is visible", async () => {
      await pages.commonPage.verifyTwisterLinkIsVisible();
    });
  });

  test("should display format game tournaments page", async ({ pages }) => {
    await test.step("Navigate to format game tournaments page in webview mode", async () => {
      await pages.commonPage.navigateToFormatTournamentsWebview();
    });

    await test.step("Verify overflow container is not visible", async () => {
      await pages.commonPage.verifyOverflowContainerIsNotVisible();
    });

    await test.step("Verify download app and play on browser buttons are visible", async () => {
      await pages.commonPage.verifyDownloadAppAndPlayOnBrowserAreVisible();
    });
  });

  test("should display format cash-games tournaments page", async ({ pages }) => {
    await test.step("Navigate to format cash-games page in webview mode", async () => {
      await pages.commonPage.navigateToFormatCashGamesWebview();
    });

    await test.step("Verify overflow container is not visible", async () => {
      await pages.commonPage.verifyOverflowContainerIsNotVisible();
    });

    await test.step("Verify play now and play on browser buttons are visible", async () => {
      await pages.commonPage.verifyPlayNowAndPlayOnBrowserAreVisible();
    });
  });

  test("should display format sit-and-go tournaments page", async ({ pages }) => {
    await test.step("Navigate to format sit-and-go page in webview mode", async () => {
      await pages.commonPage.navigateToFormatSitAndGoWebview();
    });

    await test.step("Verify overflow container is not visible", async () => {
      await pages.commonPage.verifyOverflowContainerIsNotVisible();
    });

    await test.step("Verify play twister and play on browser buttons are visible", async () => {
      await pages.commonPage.verifyPlayTwisterAndPlayOnBrowserAreVisible();
    });
  });

  test("should display deposit page", async ({ pages, page }) => {
    await test.step("Navigate to deposit page in webview mode", async () => {
      await pages.accountPage.navigateToDepositWebview();
    });

    await test.step("Verify deposit amount input is visible", async () => {
      await page.waitForTimeout(5000);
      await pages.depositPage.waitUntilAmountLimitsGreaterThanZero();
      await pages.depositPage.verifyDepositAmountInputVisible();
    });

    await test.step("Verify amount buttons are valid", async () => {
      await pages.depositPage.validateAmountButtons();
    });

    await test.step("Verify amount input is valid in webview", async () => {
      await pages.depositPage.validateAmountInput("webview");
    });
  });
  test("should display limits page", async ({ pages }) => {
    await test.step("Navigate to limits page in webview mode", async () => {
      await pages.accountPage.navigateToLimitsWebview();
    });

    await test.step("Verify deposit and bet limit inputs are visible", async () => {
      await pages.accountPage.verifyLimitsInputsAreVisible();
    });

    await test.step("Verify withdrawal threshold is visible", async () => {
      await pages.accountPage.verifyWithdrawalThresholdIsVisible();
    });
  });

  test("should display Auto-Exclusion page", async ({ pages }) => {
    await test.step("Navigate to auto-exclusion page in webview mode", async () => {
      await pages.accountPage.navigateToAutoExclusionWebview();
    });

    await test.step("Click on gambling prevention tab", async () => {
      await pages.accountPage.clickGamblingPreventionTab();
    });

    await test.step("Verify calendar is visible", async () => {
      await pages.accountPage.verifyCalendarIsVisible();
    });
  });
});
