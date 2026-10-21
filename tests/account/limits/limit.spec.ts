import { expect } from "@playwright/test";
import { loginWithProfile, test } from "../../fixtures/fixtures";
import { mockCookieConsent } from "../../../utils/consent";

test.describe("Tests suite Pratic", () => {
  loginWithProfile.use({ account: "profil-ok" });
  test.beforeEach(async ({ pages, page }) => {
    await mockCookieConsent(page);
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.waitForLoadState("load");
    await pages.commonPage.goToLimitsPage();

    await page.waitForLoadState("load");
    await pages.limitsPage.verifyFirstNameIsPresent();
    await pages.limitsPage.verifyDepositSevenDaysInputVisible();
    page.on("requestfailed", (request) => {
      console.log("REQUEST FAILED");
      console.log("URL:", request.url());
      console.log("METHOD:", request.method());
      console.log("FAILURE:", request.failure());
    });
    await page.waitForLoadState("networkidle");
  });

  test("should be redirect to the correct URL - jeu responsable", async ({ pages }) => {
    await test.step("Click on Pratique de jeu button", async () => {
      await pages.limitsPage.clickGamblingPracticeTab();
    });

    await test.step("Verify game URL has target blank", async () => {
      await pages.limitsPage.verifyGameURLTargetBlank();
    });

    await test.step("Click game URL and verify redirection", async () => {
      await pages.limitsPage.clickGameURLAndVerifyRedirection();
    });
  });
  // RETRAIT
  // MISE
  test("should be redirected to pratique de jeux", async ({ pages }) => {
    await test.step("Click on gambling habits tab", async () => {
      await pages.limitsPage.clickGamblingHabitsTab();
    });

    await test.step("Verify game URL has target blank", async () => {
      await pages.limitsPage.verifyGameURLTargetBlank();
    });

    await test.step("Click game URL and verify redirection", async () => {
      await pages.limitsPage.clickGameURLAndVerifyRedirection();
    });
  });

  test("should allow self-exclusion", async ({ pages }) => {
    await test.step("Click on gambling habits tab", async () => {
      await pages.limitsPage.clickAbstainFromPlaying();
    });

    await test.step("Open self exclusion and apply", async () => {
      await pages.limitsPage.openSelfExclusionAndApply();
    });

    await test.step("Confirm self exclusion", async () => {
      await pages.limitsPage.confirmSelfExclusion();
    });

    await test.step("Check auto exclusion modal", async () => {
      await pages.limitsPage.checkModalAutoExclusion();
    });
  });

  test("should allow close account", async ({ pages }) => {
    await test.step("Click on S'abstenir de jouer button", async () => {
      await pages.limitsPage.clickAbstainFromPlaying();
    });

    await test.step("Click on Clôturer mon compte button", async () => {
      await pages.limitsPage.clickCloseMyAccount();
    });

    await test.step("Check remaining balance", async () => {
      await pages.limitsPage.checkRemainingBalance();
    });
  });
});

test.describe("Tests suite Limit", () => {
  loginWithProfile.use({ account: "profil-game-no-sold" });
  test.beforeEach(async ({ page, pages }) => {
    await page.goto("/");
    await page.waitForLoadState("load");
    await page.waitForLoadState("networkidle");
    await pages.commonPage.goToLimitsPage();
    await pages.limitsPage.waitForMandatoryLimits();
  });

  // UPDATE LIMIT
  // DEPOSIT
  test("should allow increase the deposit amount", async ({ page, pages }) => {
    await test.step("Open deposit limit edit mode", async () => {
      await pages.limitsPage.editDepositLimit();
    });

    const initEditDepositValue = await test.step("Get initial deposit value", async () => {
      return await pages.limitsPage.getDepositInitialValue();
    });

    const newValue = await test.step("Generate a new higher deposit value", async () => {
      return await pages.limitsPage.getIncreasedValue(initEditDepositValue);
    });

    await test.step("Fill and save new deposit limit", async () => {
      await pages.limitsPage.fillDepositLimit(newValue.toString());
      await expect(pages.limitsPage.saveBtn).toBeEnabled({ timeout: 10000 });
      await pages.limitsPage.saveBtn.click();
    });

    await test.step("Wait for page to reload and edit button to appear", async () => {
      await page.waitForLoadState("load");
      await pages.limitsPage.waitForDepositEditButton();
    });

    await test.step("Verify info icon is displayed", async () => {
      await pages.limitsPage.checkIconInfo();
    });
  });

  test("should allow lower the deposit amount", async ({ pages }) => {
    await test.step("Open deposit limit edit mode", async () => {
      await pages.limitsPage.editDepositLimit();
    });

    const initEditDepositValue = await test.step("Get initial deposit value", async () => {
      return await pages.limitsPage.getDepositInitialValue();
    });

    const newValue = await test.step("Generate a new lower deposit value", async () => {
      return await pages.limitsPage.getDecreasedValue(initEditDepositValue);
    });

    await test.step("Fill and save new deposit limit", async () => {
      console.log(newValue);
      await pages.limitsPage.fillDepositLimit(newValue!.toString());
      await expect(pages.limitsPage.saveBtn).toBeEnabled({ timeout: 10000 });
      await pages.limitsPage.saveBtn.click();
    });
  });

  test("should be impossible to update with value lower than 10€", async ({ pages }) => {
    await test.step("Open deposit limit edit mode", async () => {
      await pages.limitsPage.editDepositLimit();
    });

    await test.step("Fill deposit limit with invalid value (8€)", async () => {
      await pages.limitsPage.fillDepositLimit("8");
    });

    await test.step("Verify minimum value error is displayed", async () => {
      await expect(pages.limitsPage.depositMinError).toBeVisible();
    });

    await test.step("Verify save button is disabled", async () => {
      await pages.limitsPage.assertSaveDisabled();
    });
  });

  test("should impossible to save when the initial value is equal to the new value", async ({ pages }) => {
    await test.step("Wait for balance number to be visible", async () => {
      await pages.limitsPage.waitForBalanceNumber();
    });

    await test.step("Handle 'Définir mes limites' button if visible", async () => {
      await pages.limitsPage.handleSetMyLimits();
    });

    await test.step("Open deposit editor", async () => {
      await pages.limitsPage.openDepositEditor();
    });

    const initEditDepositValue = await test.step("Get initial deposit value", async () => {
      return await pages.limitsPage.getDepositInitialValue();
    });

    await test.step("Fill deposit input with the same initial value", async () => {
      await pages.limitsPage.fillWithSameDepositValue(initEditDepositValue);
    });

    await test.step("Verify save button is disabled", async () => {
      await pages.limitsPage.assertSaveDisabled();
    });
  });

  // Bet section
  test("should allow increase the Bet amount", async ({ pages }) => {
    await test.step("Open bet limit edit mode", async () => {
      await pages.limitsPage.editBet();
    });

    const initEditBetValue = await test.step("Get initial bet value", async () => {
      return await pages.limitsPage.getBetInitialValue();
    });

    const newValue = await test.step("Generate a new higher bet value", async () => {
      return await pages.limitsPage.getIncreasedValue(initEditBetValue);
    });

    await test.step("Fill and save new bet limit", async () => {
      await pages.limitsPage.editBetLimit(newValue.toString());
      await expect(pages.limitsPage.saveBtn).toBeEnabled({ timeout: 5000 });
      await pages.limitsPage.saveBtn.click();
    });
  });

  test("should allow lower the Bet amount", async ({ pages }) => {
    await test.step("Open bet limit edit mode", async () => {
      await pages.limitsPage.editBet();
    });

    const initEditBetValue = await test.step("Get initial bet value", async () => {
      return await pages.limitsPage.getBetInitialValue();
    });

    const newValue = await test.step("Generate a new lower bet value", async () => {
      return await pages.limitsPage.getDecreasedValue(initEditBetValue);
    });

    if (newValue === null) {
      test.skip(true, "Skipping: initial bet value is 10, cannot decrease");
    }

    await test.step("Fill and save new bet limit", async () => {
      await pages.limitsPage.editBetLimit(newValue!.toString());
      await expect(pages.limitsPage.saveBtn).toBeEnabled({ timeout: 5000 });
      await pages.limitsPage.saveBtn.click();
    });
  });

  test("should impossible to save when the initial Bet amount value is equal to the new value", async ({ pages }) => {
    await test.step("Open bet limit edit mode", async () => {
      await pages.limitsPage.editBet();
    });

    const initEditBetValue = await test.step("Get initial bet value", async () => {
      return await pages.limitsPage.getBetInitialValue();
    });

    await test.step("Clear and fill bet input with the same initial value", async () => {
      await pages.limitsPage.clearBetLimit();
      await pages.limitsPage.editBetLimit(initEditBetValue);
    });

    await test.step("Verify save button is disabled", async () => {
      await pages.limitsPage.assertSaveDisabled();
    });
  });

  //Retrait section
  test("should allow increase the Withdrawal amount", async ({ pages }) => {
    await test.step("Open withdrawal limit edit mode", async () => {
      await pages.limitsPage.editWithdrawal();
    });

    const initEditWithdrawalValue = await test.step("Get initial withdrawal value", async () => {
      return await pages.limitsPage.getWithdrawalInitialValue();
    });

    const newValue = await test.step("Generate a new higher withdrawal value", async () => {
      return await pages.limitsPage.getIncreasedWithdrawalValue(initEditWithdrawalValue);
    });

    await test.step("Fill and save new withdrawal limit", async () => {
      await pages.limitsPage.editWithdrawLimit(newValue.toString());
      await expect(pages.limitsPage.saveBtn).toBeEnabled({ timeout: 5000 });
      await pages.limitsPage.saveBtn.click();
    });
  });

  test("should allow lower the Withdrawal amount", async ({ page, pages }) => {
    await test.step("Open withdrawal limit edit mode", async () => {
      await pages.limitsPage.editWithdrawal();
    });

    const newValue = await test.step("Generate a new lower withdrawal value", async () => {
      return await pages.limitsPage.getDecreasedWithdrawalValue();
    });

    await test.step("Fill and save new withdrawal limit", async () => {
      await pages.limitsPage.editWithdrawLimit(newValue.toString());
      await expect(pages.limitsPage.saveBtn).toBeEnabled({ timeout: 5000 });
      await pages.limitsPage.saveBtn.click();
    });
  });

  test("should be impossible to update Withdrawal amount with value lower than (Montant de réserve résiduel)", async ({ pages }) => {
    await test.step("Open withdrawal limit edit mode", async () => {
      await pages.limitsPage.editWithdrawal();
    });

    const min = await test.step("Get minimum withdrawal limit", async () => {
      return await pages.limitsPage.getMinWithdrawalLimit();
    });

    await test.step("Fill withdrawal input with value lower than minimum", async () => {
      await pages.limitsPage.editWithdrawLimit((min - 10).toString());
    });

    await test.step("Verify minimum value error is displayed", async () => {
      await expect(pages.limitsPage.depositMinError).toBeVisible();
    });

    await test.step("Verify save button is disabled", async () => {
      await pages.limitsPage.assertSaveDisabled();
    });
  });

  // (Montant de réserve résiduel ) section

  test("should allow increase the (Montant de réserve résiduel) amount", async ({ pages }) => {
    await test.step("Open residual reserve limit edit mode", async () => {
      await pages.limitsPage.editResidualReserve();
    });

    const initEditResidualReserveValue = await test.step("Get initial residual reserve value", async () => {
      return await pages.limitsPage.getResidualReserveInitialValue();
    });

    const newValue = await test.step("Generate a new higher residual reserve value", async () => {
      return await pages.limitsPage.getIncreasedValue(initEditResidualReserveValue);
    });

    await test.step("Fill and save new residual reserve limit", async () => {
      await pages.limitsPage.editResidualReserveLimit(newValue.toString());
      await expect(pages.limitsPage.saveBtn).toBeEnabled({ timeout: 5000 });
      await pages.limitsPage.saveBtn.click();
    });
  });

  test("should allow lower the (Montant de réserve résiduel) amount", async ({ pages }) => {
    await test.step("Open residual reserve limit edit mode", async () => {
      await pages.limitsPage.editResidualReserve();
    });

    const initEditResidualReserveValue = await test.step("Get initial residual reserve value", async () => {
      return await pages.limitsPage.getResidualReserveInitialValue();
    });

    const newValue = await test.step("Generate a new lower residual reserve value", async () => {
      return await pages.limitsPage.getDecreasedValue(initEditResidualReserveValue);
    });

    await test.step("Fill and save new residual reserve limit", async () => {
      await pages.limitsPage.editResidualReserveLimit(newValue!.toString());
      await expect(pages.limitsPage.saveBtn).toBeEnabled({ timeout: 5000 });
      await pages.limitsPage.saveBtn.click();
    });
  });

  test("should be impossible to update (Montant de réserve résiduel) amount with value lower than 10€", async ({ pages }) => {
    await test.step("Open residual reserve limit edit mode", async () => {
      await pages.limitsPage.editResidualReserve();
    });

    await test.step("Fill residual reserve input with invalid value (8€)", async () => {
      await pages.limitsPage.editResidualReserveLimit("8");
    });

    await test.step("Verify minimum value error is displayed", async () => {
      await expect(pages.limitsPage.depositMinError).toBeVisible();
    });

    await test.step("Verify save button is disabled", async () => {
      await pages.limitsPage.assertSaveDisabled();
    });
  });
});
