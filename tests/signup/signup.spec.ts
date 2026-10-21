import { test } from "../fixtures/fixtures";
import { Utils } from "../../utils/helpers";
import jsonProfil from "../../data/credentials.json";
import { mockCookieConsent } from "../../utils/consent";

test.describe("SignUP view Desktop with email exist", () => {
  test.beforeEach(async ({ page, pages }) => {
    await mockCookieConsent(page);
    await page.goto("/");
    await page.waitForLoadState("load");
    await pages.signUpPage.goToSignUpPage();
    await pages.commonPage.waitForNetworkIdle();
    await Utils.patchCaptcha(page, "kJW1UheTwY96b0l5vyFX");
    await pages.commonPage.waitForNetworkIdle();
  });

  test("@smoke should be create a new user with email exist", async ({ pages, testData }) => {
    await test.step("Generate random user data", async () => {
      const dataUser = Utils.createRandomUser();
      testData.infoUser = dataUser;
    });

    await test.step("Fill credentials with existing email", async () => {
      await pages.signUpPage.fillCredentials(jsonProfil["profil-ok"].login, testData.infoUser.password, true);
    });

    await test.step("Submit signup form", async () => {
      await pages.commonPage.submit(pages.signUpPage.submitForm, false);
    });

    await test.step("Verify account already exists modal is visible", async () => {
      await pages.signUpPage.verifyAccountExistModalIsVisible();
    });

    await test.step("Confirm account exists modal and verify login form", async () => {
      await pages.signUpPage.confirmAccountExistModal();
      await pages.connexionPage.loginForm.isVisible();
    });
  });

  test("@smoke Should display existing email modal when signing up with lite account email", async ({ pages }) => {
    await test.step("Fill credentials with lite account email", async () => {
      await pages.signUpPage.fillCredentials(jsonProfil["profil-lite-account"].login, jsonProfil["profil-lite-account"].password, true);
    });

    await test.step("Submit signup form", async () => {
      await pages.signUpPage.submitForm.click();
    });

    await test.step("Verify existing email modal is visible", async () => {
      await pages.signUpPage.assertModalContainerIsVisible();
    });
  });
});

test.describe("SignUP view Desktop", () => {
  test.beforeEach(async ({ page, pages }) => {
    await mockCookieConsent(page);
    await page.goto("/");
    await page.waitForLoadState("load");
    await page.waitForLoadState("networkidle");
    await pages.signUpPage.goToSignUpPage();
    await Utils.patchCaptcha(page, "kJW1UheTwY96b0l5vyFX");
    await pages.commonPage.waitForNetworkIdle();
  });

  test("@smoke @visual should be create a new user on view desktop without information POA/POI/Deposit/Limit", async ({
    page,
    pages,
    testData
  }) => {
    test.setTimeout(160000);

    await test.step("Generate test data", async () => {
      const dataApi = await Utils.getAddress("rue", 93190);
      const dataUser = Utils.createRandomUser();
      testData.infoUser = dataUser;
      testData.infoAddress = dataApi;
      testData.generatedEmail = await Utils.generateRandomMail();
    });

    await test.step("Fill credentials and submit", async () => {
      await pages.signUpPage.fillCredentialsWithGeneratedEmail(testData.generatedEmail, testData.infoUser.password);
      await page.waitForTimeout(2000);
      await pages.commonPage.submit(pages.signUpPage.submitForm);
    });

    await test.step("Fill civility form", async () => {
      await pages.commonPage.visible(pages.askCivilityPage.form);
      await pages.commonPage.waitForNetworkIdle();
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
      await pages.commonPage.visible(page.getByTestId("signup-phone-form"));
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
      await pages.birthPlacePage.fillForm("Paris");
      await pages.commonPage.submit(pages.signUpPage.submitForm);
    });

    await test.step("Confirm nationality and submit", async () => {
      await pages.commonPage.visible(page.getByTestId("signup-nationality-form"));
      await pages.commonPage.submit(pages.signUpPage.submitForm);
    });

    await test.step("Fill postal address and submit", async () => {
      await pages.commonPage.visible(pages.postalAdressPage.form);
      await pages.postalAdressPage.fillForm(testData.infoAddress);
      await pages.commonPage.percySnapshot("Signup - address autocomplete confirmed", {
        scope: '[data-testid="signup-address-form"]'
      });
      await pages.commonPage.submit(pages.signUpPage.submitForm);
    });

    await test.step("Skip identity document upload", async () => {
      await pages.signUpPage.skipUploadDocument();
    });

    await test.step("Skip postal address confirmation", async () => {
      await pages.signUpPage.clickLaterButton();
    });

    await test.step("Define limits later", async () => {
      await page.waitForTimeout(5000);
      await pages.signUpPage.waitForProgress();
      await pages.signUpPage.defineLimitsLater();
    });

    await test.step("Complete sign up", async () => {
      await pages.signUpPage.endSignUp();
    });
  });

  // WIP
  // * have error : display (acces refused) after upload POA document
  test("@smoke @visual should be create a new user on view desktop with POA and check doc on account/doc", async ({
    page,
    pages,
    testData
  }) => {
    test.setTimeout(300000);

    await test.step("Generate test data", async () => {
      const dataApi = await Utils.getAddress("rue", 93190);
      const dataUser = Utils.createRandomUser();
      const generatedEmail = await Utils.generateRandomMail();
      testData.infoUser = dataUser;
      testData.infoAddress = dataApi;
      testData.generatedEmail = generatedEmail;
      console.log("generatedEmail", generatedEmail);
    });

    await test.step("Fill credentials and submit", async () => {
      await pages.signUpPage.fillCredentialsWithGeneratedEmail(testData.generatedEmail, testData.infoUser.password);
      await pages.commonPage.submit(pages.signUpPage.submitForm);
    });

    await test.step("Fill civility form", async () => {
      await pages.commonPage.visible(pages.askCivilityPage.form);
      await pages.commonPage.waitForNetworkIdle();
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
      await pages.commonPage.visible(page.getByTestId("signup-phone-form"));
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
      await pages.birthPlacePage.fillForm("Paris");
      await pages.commonPage.submit(pages.signUpPage.submitForm);
    });

    await test.step("Confirm nationality and submit", async () => {
      await pages.commonPage.visible(page.getByTestId("signup-nationality-form"));
      await pages.commonPage.submit(pages.signUpPage.submitForm);
    });

    await test.step("Fill postal address and submit", async () => {
      await pages.commonPage.visible(pages.postalAdressPage.form);
      await pages.postalAdressPage.fillForm(testData.infoAddress);
      await pages.commonPage.submit(pages.signUpPage.submitForm);
    });

    await test.step("Visual check: POI identity document step", async () => {
      await page.waitForLoadState("load");
      await pages.commonPage.visible(pages.signUpPage.signupIdentityPresentationForm);
      await pages.commonPage.percySnapshot("Signup - POI identity document", {
        scope: '[data-testid="signup-identity-presentation-form"]'
      });
    });

    await test.step("Visual check: POI scan identity screen", async () => {
      await page.getByText("Scanner ma pièce d'identité").click();
      await pages.commonPage.visible(pages.signUpPage.qrScreen);
      await pages.commonPage.percySnapshot("Signup - POI scan identity screen");
      await page.goBack();
      await pages.commonPage.visible(pages.signUpPage.signupIdentityPresentationForm);
    });

    await test.step("Skip identity document upload", async () => {
      await pages.signUpPage.skipUploadDocument();
    });

    await test.step("Visual check: POA residence document step", async () => {
      await page.waitForLoadState("load");
      await pages.commonPage.visible(pages.signUpPage.signupResidencePresentationForm);
      await pages.commonPage.percySnapshot("Signup - POA residence document", {
        scope: '[data-testid="signup-residence-presentation-form"]'
      });
    });

    await test.step("Visual check: POA scan document screen", async () => {
      await pages.signUpPage.uploadSupportingDocumentText.click();
      await pages.signUpPage.qrCode.waitFor({ state: "visible", timeout: 50000 });
      await pages.commonPage.percySnapshot("Signup - POA scan document screen");
    });

    await test.step("Upload POA document", async () => {
      await pages.signUpPage.qrMoveDesktop.click();
      await pages.signUpPage.uploadButton.click();
      await pages.signUpPage.fileInput.setInputFiles("data/POA.pdf");
    });

    await test.step("Click Continuer button", async () => {
      await pages.signUpPage.clickContinueButton();
    });

    await test.step("Define limits later", async () => {
      await page.waitForTimeout(2000);
      await pages.signUpPage.defineLimitsLater();
    });

    await test.step("Complete sign up", async () => {
      await pages.signUpPage.endSignUp();
    });
  });

  // WIP
  test("@smoke should be create a new user on view desktop with limit and check limit on account/limit", async ({
    page,
    pages,
    testData
  }) => {
    test.setTimeout(120000);

    await test.step("Generate test data", async () => {
      const dataApi = await Utils.getAddress("rue", 93190);
      const dataUser = Utils.createRandomUser();
      const generatedEmail = await Utils.generateRandomMail();
      testData.infoUser = dataUser;
      testData.infoAddress = dataApi;
      testData.generatedEmail = generatedEmail;
      console.log("generatedEmail", generatedEmail);
    });

    await test.step("Fill credentials and submit", async () => {
      await pages.signUpPage.fillCredentialsWithGeneratedEmail(testData.generatedEmail, testData.infoUser.password);
      await pages.commonPage.submit(pages.signUpPage.submitForm);
    });

    await test.step("Fill civility form", async () => {
      await pages.commonPage.visible(pages.askCivilityPage.form);
      await pages.commonPage.waitForNetworkIdle();
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
      await pages.commonPage.visible(page.getByTestId("signup-phone-form"));
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
      await pages.birthPlacePage.fillForm("Paris");
      await pages.commonPage.submit(pages.signUpPage.submitForm);
    });

    await test.step("Confirm nationality and submit", async () => {
      await pages.commonPage.visible(page.getByTestId("signup-nationality-form"));
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

    await test.step("Skip postal address confirmation", async () => {
      await pages.signUpPage.clickLaterButton();
    });

    await test.step("Define limits later", async () => {
      await page.waitForTimeout(2000);
      await pages.signUpPage.defineLimitsLater();
    });

    await test.step("Complete sign up", async () => {
      await pages.signUpPage.endSignUp();
    });
  });

  // WIP
  test("@smoke should be create a new user on view desktop with deposit and check amout on balance", async ({ page, pages, testData }) => {
    test.setTimeout(120000);

    await test.step("Generate test data", async () => {
      const dataApi = await Utils.getAddress("rue", 93190);
      const dataUser = Utils.createRandomUser();
      const generatedEmail = await Utils.generateRandomMail();
      testData.infoUser = dataUser;
      testData.infoAddress = dataApi;
      testData.generatedEmail = generatedEmail;
      console.log("generatedEmail", generatedEmail);
    });

    await test.step("Fill credentials and submit", async () => {
      await pages.signUpPage.fillCredentialsWithGeneratedEmail(testData.generatedEmail, testData.infoUser.password);
      await pages.commonPage.submit(pages.signUpPage.submitForm);
    });

    await test.step("Fill civility form", async () => {
      await pages.commonPage.visible(pages.askCivilityPage.form);
      await pages.commonPage.waitForNetworkIdle();
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
      await pages.commonPage.visible(page.getByTestId("signup-phone-form"));
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
      await pages.birthPlacePage.fillForm("Paris");
      await pages.commonPage.submit(pages.signUpPage.submitForm);
    });

    await test.step("Confirm nationality and submit", async () => {
      await pages.commonPage.visible(page.getByTestId("signup-nationality-form"));
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

    await test.step("Skip postal address confirmation", async () => {
      await pages.signUpPage.clickLaterButton();
    });

    await test.step("Define limits later", async () => {
      await page.waitForTimeout(2000);
      await pages.signUpPage.defineLimitsLater();
    });

    await test.step("Complete sign up", async () => {
      await pages.signUpPage.endSignUp();
    });
  });

  test("should check modal error on wrong OTP", async ({ page, pages, testData }) => {
    test.setTimeout(120000);

    await test.step("Generate test data", async () => {
      const dataApi = await Utils.getAddress("rue", 93190);
      const dataUser = Utils.createRandomUser();
      const generatedEmail = await Utils.generateRandomMail();
      testData.infoUser = dataUser;
      testData.infoAddress = dataApi;
      testData.generatedEmail = generatedEmail;
    });

    await test.step("Fill credentials and submit", async () => {
      await pages.signUpPage.fillCredentialsWithGeneratedEmail(testData.generatedEmail, testData.infoUser.password);
      await pages.commonPage.submit(pages.signUpPage.submitForm);
    });

    await test.step("Fill civility form", async () => {
      await pages.commonPage.visible(pages.askCivilityPage.form);
      await pages.commonPage.waitForNetworkIdle();
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
      await pages.commonPage.visible(page.getByTestId("signup-phone-form"));
      await pages.postalAdressPage.fillFormPhoneNumber();
      await pages.commonPage.submit(pages.signUpPage.submitForm);
    });

    await test.step("Fill OTP with wrong last digit", async () => {
      await page.waitForTimeout(5000);
      await pages.signUpPage.fillOtpWithWrongLastDigit(testData.generatedEmail);
    });

    await test.step("Verify wrong OTP error modal is displayed", async () => {
      await pages.signUpPage.verifyWrongOtpErrorModal();
    });
  });

  test("should be exit subscription by cross", async ({ pages, testData }) => {
    await test.step("Generate test data", async () => {
      const dataApi = await Utils.getAddress("rue", 93190);
      const dataUser = Utils.createRandomUser();
      testData.infoUser = dataUser;
      testData.infoAddress = dataApi;
    });

    await test.step("Fill credentials and submit", async () => {
      await pages.signUpPage.fillCredentials(testData.infoUser.email, testData.infoUser.password, true);
      await pages.commonPage.submit(pages.signUpPage.submitForm);
    });

    await test.step("Fill civility form and submit", async () => {
      await pages.commonPage.visible(pages.signUpPage.submitForm);
      await pages.askCivilityPage.fillForm(
        testData.infoUser.gender,
        testData.infoUser.firstName,
        testData.infoUser.lastName,
        testData.infoUser.birthDate
      );
      await pages.commonPage.submit(pages.signUpPage.submitForm);
    });

    await test.step("Attempt to exit and cancel", async () => {
      await pages.commonPage.visible(pages.signUpPage.page.getByTestId("signup-phone-form"));
      await pages.signUpPage.waitForProgress();
      await pages.commonPage.clickCrossIcon();
      await pages.signUpPage.cancelExitSubscription();
      await pages.commonPage.visible(pages.signUpPage.page.getByTestId("signup-phone-form"));
    });

    await test.step("Exit subscription and confirm", async () => {
      await pages.signUpPage.waitForProgress();
      await pages.commonPage.clickCrossIcon();
      await pages.signUpPage.confirmExitSubscription();
    });

    await test.step("Verify back on home page", async () => {
      await pages.signUpPage.verifyBackOnHomePage();
    });
  });

  test("should be data not be go back on step phone number", async ({ page, pages, testData }) => {
    await test.step("Generate test data", async () => {
      const dataApi = await Utils.getAddress("rue", 93190);
      const dataUser = Utils.createRandomUser();
      testData.infoUser = dataUser;
      testData.infoAddress = dataApi;
    });

    await test.step("Fill credentials and submit", async () => {
      await pages.signUpPage.fillCredentials(testData.infoUser.email, testData.infoUser.password, true);
      await pages.commonPage.submit(pages.signUpPage.submitForm);
    });

    await test.step("Fill civility form and submit", async () => {
      await pages.commonPage.visible(pages.signUpPage.submitForm);
      await pages.askCivilityPage.fillForm(
        testData.infoUser.gender,
        testData.infoUser.firstName,
        testData.infoUser.lastName,
        testData.infoUser.birthDate
      );
      await pages.commonPage.submit(pages.signUpPage.submitForm);
    });

    await test.step("Verify phone number step is visible and back button is not visible", async () => {
      await pages.commonPage.visible(page.getByTestId("signup-phone-form"));
      await pages.signUpPage.verifyBackButtonIsNotVisible();
    });
  });

  test("should be email no clear and password be clear after back on subcription tunnel", async ({ page, pages, testData }) => {
    await test.step("Generate test data", async () => {
      const dataApi = await Utils.getAddress("rue", 93190);
      const dataUser = Utils.createRandomUser();
      testData.infoUser = dataUser;
      testData.infoAddress = dataApi;
    });

    await test.step("Fill credentials and submit", async () => {
      await pages.signUpPage.fillCredentials(testData.infoUser.email, testData.infoUser.password, true);
      await pages.commonPage.submit(pages.signUpPage.submitForm);
    });

    await test.step("Go back to credentials step", async () => {
      await pages.commonPage.visible(page.getByTestId("signup-personal-form"));
      await page.goBack();
    });

    await test.step("Verify email is preserved and password is cleared", async () => {
      await pages.commonPage.visible(pages.signUpPage.signupForm);
      await pages.signUpPage.checkEmailHasValueAndPasswordIsEmpty(testData.infoUser.email);
    });
  });

  // **********************************************
  // ************ TEST UI ON EACH STEP ************
  // **********************************************
  test("should check UI step registration", async ({ page, pages, testData }) => {
    await test.step("Generate test data", async () => {
      const dataApi = await Utils.getAddress("rue", 93190);
      const dataUser = Utils.createRandomUser();
      testData.infoUser = dataUser;
      testData.infoAddress = dataApi;
    });

    await test.step("Verify error messages on empty email and password", async () => {
      await pages.signUpPage.clearEmail();
      await pages.signUpPage.clearPassword();
      await page.keyboard.press("Tab");
      await pages.signUpPage.checkMsgErrorMail();
      await pages.signUpPage.checkMsgErrorPassword();
    });

    await test.step("Reload and fill email", async () => {
      await page.reload();
      await pages.signUpPage.fillEmail(testData.infoUser.email);
    });

    await test.step("Verify uppercase criteria is met", async () => {
      await pages.signUpPage.fillPasswordAndCheck(page, "AA");
      await pages.signUpPage.expectCriteriaChecked(pages.signUpPage.uppercaseItem);
      await pages.signUpPage.expectUnmetCriteriaCount(4);
    });

    await test.step("Verify uppercase + lowercase criteria are met", async () => {
      await pages.signUpPage.fillPasswordAndCheck(page, "Aa");
      await pages.signUpPage.expectCriteriaChecked(pages.signUpPage.lowercaseItem);
      await pages.signUpPage.expectUnmetCriteriaCount(3);
    });

    await test.step("Verify numeric criteria is met", async () => {
      await pages.signUpPage.fillPasswordAndCheck(page, "Aa12345");
      await pages.signUpPage.expectCriteriaChecked(pages.signUpPage.numberItem);
      await pages.signUpPage.expectUnmetCriteriaCount(2);
    });

    await test.step("Verify 8 characters criteria is met", async () => {
      await pages.signUpPage.fillPasswordAndCheck(page, "Aa123456");
      await pages.signUpPage.expectCriteriaChecked(pages.signUpPage.eightCharactersItem);
      await pages.signUpPage.expectUnmetCriteriaCount(1);
    });

    await test.step("Verify special character criteria is met", async () => {
      await pages.signUpPage.fillPassword("Aa123456$");
      await pages.signUpPage.expectCriteriaChecked(pages.signUpPage.oneSpecialCharacterItem);
      await pages.signUpPage.expectUnmetCriteriaCount(0);
    });
  });

  test("should be check UI step personal", async ({ page, pages, testData }) => {
    await test.step("Generate test data", async () => {
      const dataApi = await Utils.getAddress("rue", 93190);
      const dataUser = Utils.createRandomUser();
      testData.infoUser = dataUser;
      testData.infoAddress = dataApi;
    });

    await test.step("Fill credentials and submit", async () => {
      await page.waitForLoadState("networkidle");
      await pages.signUpPage.fillCredentials(testData.infoUser.email, testData.infoUser.password, true);
      await pages.commonPage.submit(pages.signUpPage.submitForm);
    });

    await test.step("Verify error messages on empty fields", async () => {
      await pages.commonPage.visible(pages.askCivilityPage.form);
      await pages.askCivilityPage.fillFirstName("a");
      await pages.askCivilityPage.clearFirstName();
      await pages.askCivilityPage.fillLastName("a");
      await pages.askCivilityPage.clearLastName();
      await pages.askCivilityPage.fillBirthDate("10/10/2000");
      await pages.askCivilityPage.clearDate();
      await page.keyboard.press("Tab");
      await pages.askCivilityPage.checkErrorMsgFirstName();
      await pages.askCivilityPage.checkErrorMsgLastName();
      await pages.askCivilityPage.checkErrorMsgBirthName();
    });

    await test.step("Verify error on invalid birth date format", async () => {
      await pages.askCivilityPage.fillBirthDate("11111000");
      await page.keyboard.press("Tab");
      await pages.askCivilityPage.checkErrorMsgBirthName();
    });

    await test.step("Verify error on birth date older than 100 years", async () => {
      await pages.askCivilityPage.clearBirthDateInput();
      await pages.askCivilityPage.fillBirthDate("11/11/1000");
      await page.keyboard.press("Tab");
      await pages.askCivilityPage.checkErrorMsgBirthName();
    });

    await test.step("Fill form with valid data", async () => {
      await pages.askCivilityPage.clearBirthDateInput();
      await pages.askCivilityPage.fillForm(
        testData.infoUser.gender,
        testData.infoUser.firstName,
        testData.infoUser.lastName,
        testData.infoUser.birthDate
      );
    });
  });

  test("@visual should be check UI step birthplace", async ({ page, pages, testData }) => {
    await test.step("Generate test data", async () => {
      const dataApi = await Utils.getAddress("rue", 93190);
      const dataUser = Utils.createRandomUser();
      const generatedEmail = await Utils.generateRandomMail();
      testData.infoUser = { ...dataUser, generatedEmail };
      testData.infoAddress = dataApi;
      testData.generatedEmail = generatedEmail;
    });

    await test.step("Fill credentials and submit", async () => {
      await pages.signUpPage.fillCredentials(testData.generatedEmail, testData.infoUser.password, true);
      await pages.commonPage.submit(pages.signUpPage.submitForm);
    });

    await test.step("Fill civility form and submit", async () => {
      await pages.commonPage.visible(pages.signUpPage.submitForm);
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
      await pages.signUpPage.waitForProgress();
      await pages.commonPage.visible(page.getByTestId("signup-phone-form"));
      await pages.postalAdressPage.fillFormPhoneNumber();
      await pages.commonPage.submit(pages.signUpPage.submitForm);
    });

    await test.step("Validate OTP and complete profile", async () => {
      await page.waitForTimeout(5000);
      await pages.signUpPage.getOtpFromEmailContent(testData.generatedEmail);
      await pages.signUpPage.clickCompleteProfile();
    });

    await test.step("Verify error message on empty birth place", async () => {
      await pages.birthPlacePage.triggerPlaceOfBirthValidation();
    });

    await test.step("Verify suggestions list opens with valid city", async () => {
      await pages.birthPlacePage.fillCityInput("Paris");
      await pages.birthPlacePage.checkSuggestionsCityListIsOpen();
      await pages.commonPage.percySnapshot("Signup - birthplace autocomplete suggestions open", {
        scope: '[data-testid="signup-birthplace-form"]'
      });
    });

    await test.step("Verify suggestions list does not open with invalid city", async () => {
      await pages.birthPlacePage.fillCityInput("azertyuiop");
      await pages.birthPlacePage.checkSuggestionsCityListNotOpen();
      await pages.commonPage.percySnapshot("Signup - birthplace autocomplete no suggestions", {
        scope: '[data-testid="signup-birthplace-form"]'
      });
    });
  });
});

test.describe("SignUP account LITE", () => {
  test.beforeEach(async ({ page, pages }) => {
    await mockCookieConsent(page);
    await page.goto("/fr/signup");
    await page.waitForLoadState("load");
    // patch captcha
    await Utils.patchCaptcha(page, "kJW1UheTwY96b0l5vyFX");
    const dataUser = Utils.createRandomUser();
    const email = dataUser.email;
    // STEP - credential
    await pages.signUpPage.fillCredentials(email, dataUser.password, true);
    await pages.commonPage.submit(pages.signUpPage.submitForm);
    // STEP - AskCivility
    await pages.commonPage.visible(pages.signUpPage.submitForm);
    await pages.askCivilityPage.fillForm(dataUser.gender, "Mimoun", "Kissi", new Date("1989-10-17"));
    await pages.commonPage.submit(pages.signUpPage.submitForm);
    await pages.signUpPage.checkAccountExistsModalIsVisible();
  });

  test("@visual should redirect to login when existing user info is detected during signup", async ({ pages, page }) => {
    await test.step("Visual check: lite account exists modal", async () => {
      await pages.commonPage.percySnapshot("Signup - LITE account exists modal", { scope: '[data-testid="modal-container"]' });
    });

    await test.step("Confirm account already exists modal", async () => {
      await pages.commonPage.submit(pages.signUpPage.confirmModalAccountExist);
      await Utils.bypassNetlifySecurityIfDisplayed(page);
    });

    await test.step("Verify signup recovery form is visible", async () => {
      await pages.commonPage.visible(pages.signUpPage.signupRecoveryForm);
    });
  });

  test("@visual should create a new account when user info is detected during signup", async ({ pages, page }) => {
    await test.step("Create new account from existing account modal", async () => {
      await pages.commonPage.submit(pages.signUpPage.cancelModalAccountExist);
      await pages.commonPage.submit(pages.signUpPage.confirmModal);
    });

    await test.step("Verify account exists modal is dismissed", async () => {
      await pages.signUpPage.checkAccountExistsModalIsNotVisible();
    });

    await test.step("Verify phone form is visible", async () => {
      await pages.commonPage.visible(pages.signUpPage.signupPhoneForm);
    });
  });
});

test.describe("OTP", () => {
  test.beforeEach(async ({ page, pages }) => {
    await mockCookieConsent(page);
    await page.goto("/");
    await page.waitForLoadState("load");
    await pages.signUpPage.goToSignUpPage();
    await Utils.patchCaptcha(page, "kJW1UheTwY96b0l5vyFX");
    const user = Utils.createRandomUser();

    await pages.signUpPage.fillCredentials(user.email, user.password, true);
    await pages.commonPage.submit(pages.signUpPage.submitForm);

    await pages.commonPage.visible(pages.askCivilityPage.form);
    await pages.askCivilityPage.fillForm(user.gender, user.firstName, user.lastName, user.birthDate);
    await pages.commonPage.submit(pages.signUpPage.submitForm);

    await pages.commonPage.visible(page.getByTestId("signup-phone-form"));
    await pages.postalAdressPage.fillFormPhoneNumber();
    await pages.commonPage.submit(pages.signUpPage.submitForm);
  });

  test("should toggle resend verification code button", async ({ pages }) => {
    await test.step("Verify resend code button toggles between disabled and enabled", async () => {
      await pages.signUpPage.shouldResendCodeDisabled();
      await pages.signUpPage.shouldResendCodeEnabled();
    });
  });

  test("should stop resend verification after 3 attempts", async ({ pages, page }) => {
    await test.step("Verify resend verification code is limited to 3 attempts", async () => {
      await pages.signUpPage.resendVerificationCodeTimes(3);
      await pages.signUpPage.expectResendVerificationCodeLimitReached();
    });
  });
});
