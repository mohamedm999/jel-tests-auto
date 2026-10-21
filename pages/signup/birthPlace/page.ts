import { expect, type Locator, type Page } from "@playwright/test";

export class BirthPlacePage {
  readonly page: Page;
  readonly form: Locator;
  readonly placeOfBirth: Locator;
  readonly city: Locator;
  readonly errorMsg: Locator;
  readonly submitForm: Locator;
  readonly placeOfBirthInput: Locator;
  readonly suggestionsList: Locator;
  readonly suggestionParis: Locator;

  constructor(page: Page) {
    this.page = page;
    this.form = this.page.getByTestId("signup-birthplace-form");
    this.placeOfBirth = this.form.locator("#placeOfBirth");
    this.errorMsg = this.form.locator("#placeOfBirth-error");
    this.city = this.page.getByPlaceholder("Ex. Paris");
    this.submitForm = this.page.getByTestId("proceed");
    this.placeOfBirthInput = this.page.getByTestId("placeOfBirth-input");
    this.suggestionsList = this.page.getByTestId("suggestions-list");
    this.suggestionParis = this.page.locator("li", {
      hasText: "Paris (75)",
    });
  }

  async fillForm(city: string) {
    await this.city.waitFor({ state: "visible", timeout: 10000 });
    await this.city.click();
    for (const char of city) {
      await this.city.type(char, { delay: 60 + Math.random() * 120 });
    }
    // WORKAROUND
    await this.page.waitForTimeout(2000);
    await this.city.press("Control+End");
    await this.city.press("Backspace");
    await expect(this.suggestionParis).toBeVisible({ timeout: 10000 });
    await this.suggestionParis.click();
  }

  async checkDataForm(city: string) {
    await expect(this.placeOfBirth).toHaveValue(city + " (75)");
  }

  async fillCityInput(city: string) {
    await this.placeOfBirthInput.clear();
    await this.placeOfBirthInput.click();
    for (const char of city) {
      await this.placeOfBirthInput.type(char, {
        delay: 60 + Math.random() * 120,
      });
    }
    // WORKAROUND
    await this.page.waitForTimeout(2000);
  }

  async checkSuggestionsCityListIsOpen() {
    await expect(this.suggestionsList).toBeVisible();
  }

  async checkSuggestionsCityListNotOpen() {
    await this.placeOfBirthInput.click();
    await expect(this.suggestionsList).not.toBeVisible();
  }

  async triggerPlaceOfBirthValidation() {
    await this.placeOfBirth.click();
    const viewport = this.page.viewportSize();
    if (viewport) {
      await this.page.mouse.click(viewport.width / 2, viewport.height - 5);
    }
    await expect(this.errorMsg).toBeVisible({ timeout: 20000 });
  }
}
