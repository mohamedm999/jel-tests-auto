import { loginWithProfile, test } from "../../fixtures/fixtures";

test.describe("Tests suite Documents - between 30 and 60", () => {
  loginWithProfile.use({ account: "profil-between-30-60" });
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.reload();
  });

  test('should modal "compte suspendu" appear', async ({ pages, page }) => {
    await test.step("Check modal container is visible", async () => {
      await page.reload();
      await pages.documentsPage.checkModalContainerIsVisible();
    });

    await test.step("Check confirm button is visible", async () => {
      await pages.documentsPage.checkModalConfirmButtonIsVisible();
    });

    await test.step("Check 'Envoyer plus tard' button is visible", async () => {
      await pages.documentsPage.checkModalSendLaterButtonIsVisible();
    });
  });

  test('should modal upload "Justificatif de domicile" open successfully', async ({ pages, page }) => {
    await test.step("Reload the page and dismiss the modal", async () => {
      await page.waitForLoadState("load");
      await page.waitForLoadState("networkidle");
      if (await pages.documentsPage.sendLaterButton.isVisible({ timeout: 10000 })) {
        await pages.documentsPage.sendLaterButton.click();
      }
    });

    await test.step("Navigate to documents section", async () => {
      await pages.documentsPage.clickSendMyDocuments();
      await page.waitForURL(/documents#administratifs/, { timeout: 20000 });
    });

    await test.step("Verify informative banner is visible", async () => {
      await pages.documentsPage.checkInformativeBannerIsVisible();
    });

    await test.step('Open the "Justificatif de domicile" upload modal', async () => {
      await pages.documentsPage.clickAddProoveAddressButton();
      await pages.documentsPage.checkModalUploadIsVisible();
    });
  });
});

test.describe("Tests suite Documents - RIB", () => {
  loginWithProfile.use({ account: "profil-ok" });
  test.beforeEach(async ({ pages, page }) => {
    await page.goto("/");
    await page.waitForLoadState("load");
    await pages.commonPage.open("documentsPage");
    await page.reload();
    await pages.documentsPage.clickEdit();
    await pages.documentsPage.verifyIbanValidation();
  });

  test("should all error message should be appear on RIB", async ({ pages }) => {
    await test.step("Fill IBAN with invalid value and confirm", async () => {
      await pages.documentsPage.fillIbanWithInvalidValue("xxxxxxx");
    });

    await test.step("Verify IBAN prefix error", async () => {
      await pages.documentsPage.verifyIbanPrefixError();
    });

    await test.step("Verify IBAN length error", async () => {
      await pages.documentsPage.verifyIbanLengthError();
    });

    await test.step("Verify IBAN invalid digits error", async () => {
      await pages.documentsPage.verifyIbanInvalidDigitsError();
    });

    await test.step("Verify confirm button is disabled", async () => {
      await pages.documentsPage.verifyConfirmButtonIsDisabled();
    });
  });

  test("should message FR & inavlid should be appear on RIB", async ({ pages }) => {
    await test.step("Fill IBAN with invalid FR value and confirm", async () => {
      await pages.documentsPage.fillIbanWithInvalidValue("AAAAAAAAAAAAAAAAAAAAAAAAAAA");
    });

    await test.step("Verify IBAN prefix error", async () => {
      await pages.documentsPage.verifyIbanPrefixError();
    });

    await test.step("Verify IBAN invalid digits error", async () => {
      await pages.documentsPage.verifyIbanInvalidDigitsError();
    });

    await test.step("Verify confirm button is disabled", async () => {
      await pages.documentsPage.verifyConfirmButtonIsDisabled();
    });
  });

  test("should message inavlid should be appear on RIB", async ({ pages }) => {
    await test.step("Fill IBAN with invalid digits and confirm", async () => {
      await pages.documentsPage.fillIbanWithInvalidValue("FRAAAAAAAAAAAAAAAAAAAAAAAAA");
    });

    await test.step("Verify IBAN invalid digits error", async () => {
      await pages.documentsPage.verifyIbanInvalidDigitsError();
    });
  });

  test("should dissapear after click on after text", async ({ pages }) => {
    await test.step("Click on Envoyer plus tard", async () => {
      await pages.documentsPage.clickSendLater();
    });

    await test.step("Verify IBAN input is not visible", async () => {
      await pages.documentsPage.verifyIbanInputNotVisible();
    });

    await test.step("Verify Modifier button is visible", async () => {
      await pages.documentsPage.verifyEditButtonVisible();
    });
  });
});
