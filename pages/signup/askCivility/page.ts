import { expect, type Locator, type Page } from "@playwright/test";

export class AskCivilityPage {
  readonly page: Page;
  readonly form: Locator;
  readonly mister: Locator;
  readonly misses: Locator;
  readonly firstNamesInput: Locator;
  readonly birthLastNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly birthDateInput: Locator;
  readonly submitForm: Locator;
  readonly errorMsgLastName: Locator;
  readonly errorMsgFirstName: Locator;
  readonly errorMsgBirthDate: Locator;

  constructor(page: Page) {
    this.page = page;
    this.form = this.page.getByTestId("signup-personal-form");
    this.mister = this.form.locator('[for="MISTER"]');
    this.misses = this.form.locator('[for="MISSES"]');
    this.firstNamesInput = this.form.locator('[name="firstNames"]');
    this.lastNameInput = this.form.locator('[name="birthLastName"]');
    this.birthDateInput = this.form.locator('[name="birthDate"]');
    this.submitForm = this.page.getByTestId("ask-civility-form-submit-button");
    this.errorMsgLastName = this.form.locator("#birthLastName-error");
    this.errorMsgFirstName = this.form.locator("#firstNames-error");
    this.errorMsgBirthDate = this.form.locator("#birthDate-error");
  }

  async fillForm(
    gender: string,
    firstName: string,
    lastName: string,
    birthDate: Date,
  ) {
    gender === "Madame" ? await this.misses.click() : await this.mister.click();
    await this.fillFirstName(firstName);
    await expect(this.firstNamesInput).toHaveValue(firstName);
    await this.fillLastName(lastName);
    await expect(this.lastNameInput).toHaveValue(lastName);
    await this.fillBirthName(birthDate);
    await expect(this.birthDateInput).toHaveValue(
      birthDate.toLocaleDateString("fr-FR"),
    );
  }

  async checkDataForm(
    gender: string,
    firstName: string,
    lastName: string,
    birthDate: Date,
  ) {
    gender === "Madame"
      ? await expect(this.misses).toHaveCSS(
          "background-color",
          "rgb(244, 198, 68)",
        )
      : await expect(this.mister).toHaveCSS(
          "background-color",
          "rgb(244, 198, 68)",
        );
    await expect(this.firstNamesInput).toHaveValue(firstName);
    await expect(this.lastNameInput).toHaveValue(lastName);
    await expect(this.birthDateInput).toHaveValue(
      birthDate.toLocaleDateString("fr-FR"),
    );
  }

  async fillFirstName(firstName: string) {
    await this.firstNamesInput.click();
    await this.page.keyboard.insertText(firstName);
  }

  async clearFirstName() {
    await this.firstNamesInput.clear();
  }

  async fillLastName(lastName: string) {
    await this.lastNameInput.click();
    await this.page.keyboard.insertText(lastName);
  }

  async clearLastName() {
    await this.lastNameInput.clear();
  }

  async fillBirthDate(birthDate: string) {
    await this.birthDateInput.click();
    await this.page.keyboard.insertText(birthDate);
  }

  async clearDate() {
    await this.birthDateInput.clear();
  }

  async clearBirthDateInput() {
    await this.birthDateInput.click();
    await this.birthDateInput.fill("");
  }

  async fillBirthName(birthDate: Date) {
    await this.birthDateInput.click();
    await this.page.keyboard.insertText(birthDate.toLocaleDateString("fr-FR"));
  }

  async checkErrorMsgFirstName() {
    expect(this.errorMsgFirstName).toBeVisible();
  }

  async checkErrorMsgLastName() {
    await expect(this.errorMsgLastName).toBeVisible();
  }

  async checkErrorMsgBirthName() {
    await expect(this.errorMsgBirthDate).toBeVisible();
  }

  async selectGender(gender: string): Promise<void> {
    await this.page.getByText(`${gender}`).click();
  }
}
