import { expect, Locator, Page } from "@playwright/test";

export class DepositPage {
  readonly page: Page;
  readonly depositModal: Locator;
  readonly suggestedAmounts: Locator;
  readonly amountButtons: Locator;
  readonly amountInput: Locator;
  readonly confirmButton: Locator;
  readonly amountError: Locator;
  readonly depositLimitText: Locator;
  readonly balanceAccount: Locator;
  readonly amountForm: Locator;
  readonly amountText: Locator;
  readonly confirmDepositButtonWebView: Locator;

  constructor(page: Page) {
    this.page = page;
    this.depositModal = this.page.locator("[aria-label='Montant à déposer']");
    this.suggestedAmounts = page.locator(".suggested-amounts-holder");
    this.amountInput = this.page.locator("#item_amount_1");
    this.confirmButton = this.page.getByTestId("confirm-button");
    // this.amountError = this.page.getByTestId("amount-error");
    this.amountError = this.page.locator(".error");
    this.depositLimitText = this.page.locator("#label_open_amount_range");
    this.balanceAccount = this.page.getByTestId("balance-account");
    this.amountForm = this.page.locator("form");
    this.amountButtons = this.amountForm.locator(".suggested-amounts-holder.tcell");
    // this.amountText = this.amountForm.locator("p.font-semibold");
    this.amountText = this.amountForm.locator("#label_open_amount_range");
    this.confirmDepositButtonWebView = this.amountForm.locator("#continueButton");
  }

  async validateAmountButtons() {
    const count = await this.amountButtons.count();

    for (let i = 0; i < count; i++) {
      const button = this.amountButtons.nth(i);
      const amount = (await button.getAttribute("aria-label")) || "";
      await button.click();
      await expect(this.amountInput).toHaveValue(amount);
      await expect(button).toHaveClass(/text-primary-500!/);
      await expect(button).toHaveClass(/border-primary-500/);
    }
  }

  async validateAmountInput(mode: string = "") {
    const limitText = await this.depositLimitText.innerText();
    const limit = parseInt(limitText.replace(/[^0-9]/g, ""), 10);

    await this.amountInput.fill("9");
    await this.confirmDepositButtonWebView.click();
    await expect(this.amountError).toBeVisible({ timeout: 5000 });

    await this.amountInput.fill(String(limit + 1));
    await this.confirmDepositButtonWebView.click();
    await expect(this.amountError).toBeVisible({ timeout: 5000 });
    await this.amountInput.fill("10");
    await this.page.waitForTimeout(2000);
    if (mode !== "webview") {
      const [newPage] = await Promise.all([this.page.waitForEvent("popup"), this.confirmDepositButtonWebView.click()]);
      await expect(newPage).toHaveURL(/nuvei\.com/);
    } else {
      await this.confirmDepositButtonWebView.click();
      await expect(this.page).toHaveURL(/nuvei\.com/, { timeout: 30000 });
    }
  }

  async fillDepositAmount(page: Page, amount: string) {
    await page.locator("#item_amount_1").fill(amount);
  }

  async fillSignupDepositAmount(amount: string) {
    await this.page.locator("#item_amount_1").fill(amount);
  }

  async confirmDeposit(): Promise<Page> {
    const [newPage] = await Promise.all([this.page.waitForEvent("popup"), this.confirmButton.click()]);
    return newPage;
  }

  async verifyDepositSuccess(page: Page, balanceBefore: string) {
    await expect(page.getByText("Dépôt effectué !")).toBeVisible({
      timeout: 80000
    });
    await page.waitForTimeout(5000);
    await this.page.reload();
    await this.page.waitForLoadState("load");
    const balanceText = await this.balanceAccount.textContent();
    const before = await this.normalizeAmount(balanceBefore);
    const after = await this.normalizeAmount(balanceText || "");
    expect(before + 10).toEqual(after);
  }

  async normalizeAmount(amount: string): Promise<number> {
    if (!amount) return 0;
    const cleaned = amount.replace("€", "").replace(/\s/g, "").trim().replace(",", ".");
    return Math.floor(parseFloat(cleaned));
  }

  async verifyDepositAmountModalVisible() {
    await this.page.waitForLoadState("load");
    await expect(this.depositModal).toBeVisible({
      timeout: 25000
    });
  }

  async verifyDepositAmountInputVisible() {
    await expect(this.amountInput).toBeVisible();
  }

  async fillPaymentDetails(page: Page) {
    await expect(page.locator('[data-value="cc_card"]')).toBeVisible({
      timeout: 10000
    });
    await page.locator("#label_open_amount_range").waitFor({ state: "visible" });
    await page.locator('[data-value="cc_card"]').click();
    await page.locator("#cc_name_on_card").fill("TEST");
    await page.locator("#cc_card_number").fill("5101081046006034");
    await page.locator("#exp_date").fill("07/30");
    await page.locator("#cc_cvv2").fill("737");
    await page.locator("#continueButton").click();
  }

  async verifyAndConfirmPayment(page: Page) {
    await page.waitForLoadState("networkidle");
    await expect(page.getByText("*6034")).toBeVisible({
      timeout: 10000
    });
    await page.getByText("*6034").click();
    await expect(page.locator("#cc_name_on_card_read_only_text")).toBeVisible({
      timeout: 10000
    });
    await page.locator("#continueButton").click({ timeout: 10000 });
  }

  async payWithPayPal(page: Page) {
    await page.waitForLoadState("networkidle");
    await page.locator("#label_open_amount_range").waitFor({ state: "visible" });
    await page.locator('[title="PayPal"]').click();
    await page.waitForTimeout(2000);
    const [payPalPage] = await Promise.all([
      page.context().waitForEvent("page", { timeout: 40000 }),
      page.locator("#continueButton").click()
    ]);
    try {
      await payPalPage.locator("#email").fill("SCTest2@gmail.com");
      await payPalPage.locator("#password").fill("1q2w3e$R");
      await payPalPage.locator("#btnLogin").click();
      await payPalPage.getByTestId("submit-button-initial").click();
    } catch {
      await payPalPage.locator("#one-time-cta").click();
    }
  }

  async verifyAndConfirmPayPalPayment(page: Page) {
    await expect(page.getByText("sctest2@gmail.com")).toBeVisible({
      timeout: 10000
    });
    await page.locator("#label_open_amount_range").waitFor({ state: "visible" });
    await page.getByText("sctest2@gmail.com").click();
    await expect(page.locator('[title="PayPal"]')).toBeVisible({
      timeout: 10000
    });
    await page.waitForTimeout(2000);
    const [payPalPage] = await Promise.all([
      page.context().waitForEvent("page", { timeout: 50000 }),
      page.locator("#continueButton").click()
    ]);
    try {
      await payPalPage.locator("#password").fill("1q2w3e$R");
      await payPalPage.locator("#btnLogin").click();
      await payPalPage.getByTestId("submit-button-initial").click();
    } catch {
      await payPalPage.locator("#one-time-cta").click();
    }
  }

  async verifyPaymentMethods(page: Page) {
    await page.waitForLoadState("load");
    await expect(page.locator("[title='Skrill']")).toBeVisible();
    await expect(page.locator("[title='Neteller']")).toBeVisible();
    await expect(page.locator("[title='Neosurf']")).toBeVisible();
  }

  async waitForSuggestedAmountsVisible() {
    await this.suggestedAmounts.waitFor({ state: "visible" });
  }

  async waitUntilAmountLimitsGreaterThanZero() {
    await expect(this.amountText).toBeVisible({ timeout: 10000 });
    await expect
      .poll(async () => {
        const text = await this.amountText.textContent();
        const value = parseFloat(text!.replace(/[^\d.]/g, ""));
        return value;
      })
      .toBeGreaterThan(0);
  }
}
