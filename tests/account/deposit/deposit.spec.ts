import { loginWithProfile, test } from "../../fixtures/fixtures";
let balanceAmount: string;
let newPageDeposit: any;

test.describe("Tests suite Deposit", () => {
  loginWithProfile.use({ account: "profil-ok" });
  test.beforeEach(async ({ page, pages }) => {
    await page.goto("/");
    await page.waitForLoadState("load");
    await page.waitForLoadState("networkidle");
    await pages.accountPage.checkBalanceAccountVisible();
    balanceAmount = (await pages.accountPage.getBalanceAccountText()) ?? "";
    newPageDeposit = await pages.accountPage.goToDeposit();
    await pages.accountPage.defineLimitsIfNeeded();
  });

  test.fixme("Validate deposit amount rules and redirection flow", async ({ pages, page }) => {
    await test.step("Modal Deposit should appear", async () => {
      await pages.depositPage.verifyDepositAmountModalVisible();
    });

    await test.step("Check the validation when I click on the button of the modal deposit", async () => {
      await pages.depositPage.validateAmountButtons();
    });

    await test.step("Check the validation when I fill the value of the modal deposit with the verification of error message", async () => {
      await pages.depositPage.validateAmountInput();
    });
  });

  test("should deposit with CB", async ({ pages, page }) => {
    await test.step("I fill the value on the the modal deposit", async () => {
      await pages.depositPage.fillDepositAmount(newPageDeposit, "10");
    });

    await test.step("Choose and fill the CB information and check that the amout is added to the balance", async () => {
      await pages.depositPage.fillPaymentDetails(newPageDeposit);
      await pages.depositPage.verifyDepositSuccess(newPageDeposit, balanceAmount);
    });
  });

  test("should deposit with CB saved", async ({ pages }) => {
    await test.step("I fill the value on the the modal deposit", async () => {
      await pages.depositPage.fillDepositAmount(newPageDeposit, "10");
    });

    await test.step("I choose the CB saved and check that the amout is added to the balance", async () => {
      await pages.depositPage.verifyAndConfirmPayment(newPageDeposit);
      await pages.depositPage.verifyDepositSuccess(newPageDeposit, balanceAmount);
    });
  });

  test("should deposit with Paypal", async ({ pages }) => {
    await test.step("I fill the value on the modal deposit", async () => {
      await pages.depositPage.fillDepositAmount(newPageDeposit, "10");
    });

    await test.step("Choose and fill the Paypal information and check that the amount is added to the balance", async () => {
      await pages.depositPage.payWithPayPal(newPageDeposit);
      await pages.depositPage.verifyDepositSuccess(newPageDeposit, balanceAmount);
    });
  });

  test("should deposit with Paypal saved", async ({ pages }) => {
    await test.step("I fill the value on the the modal deposit", async () => {
      await pages.depositPage.fillDepositAmount(newPageDeposit, "10");
    });

    await test.step("I choose the Paypal account saved and check that the amout is added to the balance", async () => {
      await pages.depositPage.verifyAndConfirmPayPalPayment(newPageDeposit);
      await pages.depositPage.verifyDepositSuccess(newPageDeposit, balanceAmount);
    });
  });

  test("should methods payments be visible on deposit page", async ({ pages }) => {
    await test.step("I fill the value on the the modal deposit", async () => {
      await pages.depositPage.fillDepositAmount(newPageDeposit, "10");
    });

    await test.step("I check the UI of the nuvei page", async () => {
      await pages.depositPage.verifyPaymentMethods(newPageDeposit);
    });
  });
});
