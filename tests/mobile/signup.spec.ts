import { test } from "../fixtures/fixtures";
import { Utils } from "../../utils/helpers";
import { mockCookieConsent } from "../../utils/consent";

test.describe("SignUP view Mobile", () => {
  test.beforeEach(async ({ page, pages }) => {
    await mockCookieConsent(page);
    await page.goto("/");
    await page.waitForTimeout(3000);
    await page.waitForTimeout(3000);
    pages.signUpPage.goToSignUpPage();
    await page.waitForLoadState("load");
    await pages.signUpPage.waitForProgress();
    await Utils.patchCaptcha(page, "kJW1UheTwY96b0l5vyFX");
    await pages.commonPage.waitForNetworkIdle();
  });

  test("should be create a new user on view mobile", async ({ page, pages, testData }) => {
    await test.step("Generate test data", async () => {
      const dataApi = await Utils.getAddress("rue", 93190);
      const dataUser = Utils.createRandomUser();
      const generatedEmail = await Utils.generateRandomMail();
      testData.infoUser = dataUser;
      testData.infoAddress = dataApi;
      testData.generatedEmail = generatedEmail;
    });

    await test.step("Fill email and submit", async () => {
      await pages.signUpPage.fillEmailForm(testData.generatedEmail);
      await pages.commonPage.submit(pages.signUpPage.submitForm);
    });

    await test.step("Fill password and submit", async () => {
      await pages.signUpPage.fillPasswordForm(testData.infoUser.password);
      await pages.commonPage.submit(pages.signUpPage.submitForm);
    });

    await test.step("Accept CGU and submit", async () => {
      await pages.signUpPage.acceptCguForm();
      await pages.commonPage.submit(pages.signUpPage.submitForm);
    });

    await test.step("Select gender", async () => {
      await pages.signUpPage.selectGender(testData.infoUser.gender);
    });

    await test.step("Fill first name and submit", async () => {
      await pages.signUpPage.fillFirstNameForm(testData.infoUser.firstName);
      await pages.commonPage.submit(pages.signUpPage.submitForm);
    });

    await test.step("Fill last name and submit", async () => {
      await pages.signUpPage.fillLastNameForm(testData.infoUser.lastName);
      await pages.commonPage.submit(pages.signUpPage.submitForm);
    });

    await test.step("Fill birth date and submit", async () => {
      await pages.signUpPage.fillBirthDateForm(testData.infoUser.birthDate);
      await pages.commonPage.submit(pages.signUpPage.submitForm);
    });

    await test.step("Fill phone number and submit", async () => {
      await pages.postalAdressPage.waitForPhoneNumberInput();
      await pages.signUpPage.waitForProgress();
      await pages.postalAdressPage.fillFormPhoneNumber();
      await pages.commonPage.submit(pages.signUpPage.submitForm);
    });

    await test.step("Validate OTP and complete profile", async () => {
      await page.waitForTimeout(5000);
      await pages.signUpPage.getOtpFromEmailContent(testData.generatedEmail);
      await pages.signUpPage.clickCompleteProfile();
    });

    await test.step("Fill birth place and submit", async () => {
      await pages.signUpPage.fillBirthPlaceForm(testData.infoAddress.address, testData.infoAddress.postcode, testData.infoAddress.city);
      await pages.commonPage.submit(pages.signUpPage.submitForm);
    });

    await test.step("Confirm nationality and submit", async () => {
      await pages.signUpPage.waitForNationalityForm();
      await pages.commonPage.submit(pages.signUpPage.submitForm);
    });

    await test.step("Fill postal address and submit", async () => {
      await pages.signUpPage.waitForProgress();
      await pages.signUpPage.fillPostalAddressForm("Paris");
      await pages.commonPage.submit(pages.signUpPage.submitForm);
    });

    await test.step("Skip identity document upload", async () => {
      await pages.signUpPage.waitForProgress();
      await pages.signUpPage.skipUploadDocument();
    });

    await test.step("Skip address document upload", async () => {
      await pages.signUpPage.skipUploadAddressDocument();
    });

    await test.step("Define limits later", async () => {
      await page.waitForTimeout(2000);
      await pages.signUpPage.defineLimitsLater();
    });

    await test.step("Complete sign up", async () => {
      await pages.signUpPage.endSignUp();
    });
  });
});
