import { mockCookieConsent } from "../../../../utils/consent";
import { loginWithProfile, test } from "../../../fixtures/fixtures";
const jsonProfil = require("../../../../data/credentials.json");

test.describe("Mobile - Tests suite Account > update address", () => {
  loginWithProfile.use({ account: "profil-ok" });
  test.beforeEach(async ({ pages, page }) => {
    await mockCookieConsent(page);
    await pages.commonPage.open("profilPage");
  });

  test("Mobile - should be update address on section account", async ({ pages }) => {
    await test.step("Trigger address update", async () => {
      await pages.accountPage.updateAdress();
    });

    await test.step("Verify update address form is displayed", async () => {
      await pages.accountPage.checkUpdateAddressForm();
    });
  });

  test("Mobile - should be update phone number on section account", async ({ pages }) => {
    await test.step("Trigger phone number update", async () => {
      await pages.accountPage.updateNumberPhone();
    });

    await test.step("Verify update phone number modal is displayed", async () => {
      await pages.accountPage.checkUpdateNumberPhoneModal();
    });
  });
});

test.describe("Mobile - Tests suite Account > update password", () => {
  loginWithProfile.use({ account: "profil-ok" });
  test.beforeEach(async ({ pages, page }) => {
    await mockCookieConsent(page);
    await pages.commonPage.open("profilPage");
    await pages.accountPage.navigateToLoginMeansTab();
  });

  test("Mobile - should be update password on section account with the same password", async ({ pages }) => {
    await test.step("Open password editor", async () => {
      await pages.accountPage.openPasswordEditor();
    });

    await test.step("Submit password change with the same password", async () => {
      await pages.accountPage.submitPasswordChange(jsonProfil["profil-ok"].password, jsonProfil["profil-ok"].password);
    });

    await test.step("Verify both password fields have error state", async () => {
      await pages.accountPage.assertPasswordFieldsHaveError();
    });
  });

  test("Mobile - should be update password on section account with the actual password wrong", async ({ pages }) => {
    await test.step("Open password editor", async () => {
      await pages.accountPage.openPasswordEditor();
    });

    await test.step("Submit password change with wrong current password", async () => {
      await pages.accountPage.submitPasswordChange("Aa123456$098", jsonProfil["profil-ok"].password);
    });

    await test.step("Verify both password fields have error state", async () => {
      await pages.accountPage.assertPasswordFieldsHaveError();
    });
  });
});

test.describe("Mobile - Tests suite Account > communication", () => {
  loginWithProfile.use({ account: "profil-ok" });
  test.beforeEach(async ({ pages, page }) => {
    await mockCookieConsent(page);
    await pages.commonPage.open("profilPage");
    await pages.accountPage.navigateToCommunicationsTab();
  });

  test("Mobile - should be update communication options", async ({ pages }, testInfo) => {
    await test.step("Verify communication options are visible", async () => {
      await pages.accountPage.verifyCommunicationOptionsVisible(testInfo.project.name);
    });

    await test.step("Toggle all communication options", async () => {
      await pages.accountPage.toggleAllCommunicationOptions();
    });

    await test.step("Save communication changes", async () => {
      await pages.accountPage.saveCommunicationChanges();
    });

    await test.step("Verify success message is displayed", async () => {
      await pages.accountPage.verifyCommunicationSaveSuccess();
    });
  });
});
