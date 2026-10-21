import { expect, type Locator, type Page } from "@playwright/test";

type Address = {
  address: string;
  postcode: string;
  city: string;
  street: string;
};

export class PostalAdressPage {
  readonly page: Page;
  readonly form: Locator;
  readonly nameStreet: Locator;
  readonly namePlaceKnownAs: Locator;
  readonly phoneNumber: Locator;
  readonly postalCode: Locator;
  readonly city: Locator;
  readonly skipStepPhoneNumber: Locator;
  readonly formStepPhoneMobile: Locator;
  readonly submitFormtepPhoneMobile: Locator;
  readonly submitForm: Locator;
  readonly countryFlagImg: Locator;

  constructor(page: Page) {
    this.page = page;
    this.form = this.page.getByTestId("signup-address-form");
    this.formStepPhoneMobile = this.page.getByTestId("step-2");
    this.nameStreet = this.form.getByTestId("address-input");
    this.namePlaceKnownAs = this.form.locator("#placeKnownAs");
    this.postalCode = this.form.locator('[name="postalCode"]');
    this.city = this.form.locator('[name="city"]');
    this.phoneNumber = this.page.getByTestId("phone-number-country-input");
    this.skipStepPhoneNumber = this.page.getByTestId("ignoreStep");
    this.submitForm = this.form.getByText("Continuer");
    this.submitFormtepPhoneMobile = this.formStepPhoneMobile.getByText("Continuer");
    this.countryFlagImg = this.page.locator("[aria-controls='country-listbox']").locator("img");
  }

  async fillForm(data: Address) {
    await this.nameStreet.waitFor({ state: "visible", timeout: 10000 });
    //await this.nameStreet.fill(data.address);
    for (const char of data.address) {
      await this.nameStreet.type(char, { delay: 60 + Math.random() * 120 });
    }
    // WORKAROUND
    await this.page.waitForTimeout(2000);
    await this.nameStreet.press("Control+End");
    await this.nameStreet.press("Backspace");
    await this.page
      .locator("li")
      .filter({
        hasText: `${data.street}, ${data.postcode} ${data.city}`
      })
      .click();
  }

  async fillFormPhoneNumber() {
    await this.page.waitForLoadState("domcontentloaded");
    await this.page.waitForLoadState("load");
    await this.page.waitForTimeout(2500);
    await this.phoneNumber.fill("+33665645328");
  }

  async checkDataForm(data: Address, phoneNumer: string) {
    const formatPhoneNumber = `+33 ${phoneNumer.substring(0, 1)} ${phoneNumer.substring(1, 3)} ${phoneNumer.substring(
      3,
      5
    )} ${phoneNumer.substring(5, 7)} ${phoneNumer.substring(7, 9)}`;
    await expect(this.nameStreet).toHaveValue(data.street);
    await expect(this.postalCode).toHaveValue(data.postcode);
    await expect(this.city).toHaveValue(data.city);
    await expect(this.phoneNumber).toHaveValue(formatPhoneNumber); // TO IMPROVE
  }

  async waitForPhoneNumberInput() {
    await this.phoneNumber.waitFor({ state: "visible" });
  }
}
