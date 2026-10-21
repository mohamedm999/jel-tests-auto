import { loginWithProfile, test } from "../../fixtures/fixtures";
import type { PokerHistoryItem } from "../../../pages/account/page";

test.describe("Tests suite Historic", () => {
  loginWithProfile.use({ account: "profil-ok" });

  test.describe("Access to historic page from profile page", () => {
    test.beforeEach(async ({ pages, page }) => {
      await page.goto("/");
      await page.waitForLoadState("load");
      await page.waitForLoadState("networkidle");
      await pages.commonPage.goToProfilePageByMenu();
      await pages.accountPage.expectPersonalUserDataTabVisible();
      await page.reload();
      await page.waitForLoadState("load");
    });

    test("should access to historic page", async ({ pages }) => {
      await test.step("Click on historic link", async () => {
        await pages.accountPage.clickHistoricLink();
      });

      await test.step("Verify historic URL", async () => {
        await pages.accountPage.verifyHistoricURL();
      });

      await test.step("Verify Transactions text is visible", async () => {
        await pages.accountPage.verifyTransactionsVisible();
      });

      await test.step("Verify calendar input is visible", async () => {
        await pages.accountPage.verifyCalendarInputVisible();
      });
    });
  });

  test.describe("Poker history selection and date filter from dashboard", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("load");
      await page.waitForLoadState("networkidle");
    });

    test("should switch to Poker and filter by date from dashboard profile menu", async ({ pages }) => {
      await test.step("Click on profile icon on dashboard and verify dropdown menu displays", async () => {
        await pages.commonPage.accountIcon.click();
        await pages.commonPage.verifyHistoricMenuVisible();
      });

      await test.step("Select Historique from dropdown menu", async () => {
        await pages.commonPage.historicLink.first().click();
        await pages.accountPage.verifyHistoricURL();
      });

      await test.step("Verify default selection is Dépôt / Retrait", async () => {
        await pages.accountPage.verifyDepositWithdrawTabActive();
        await pages.accountPage.verifyPokerTabInactive();
      });

      await test.step("Switch tab selection to Poker and verify active state", async () => {
        await pages.accountPage.selectPokerTab();
        await pages.accountPage.verifyPokerTabActive();
        await pages.accountPage.verifyDepositWithdrawTabInactive();
      });

      let firstItem: PokerHistoryItem;

      await test.step("Dynamically extract existing date from Poker history", async () => {
        firstItem = await pages.accountPage.extractFirstPokerHistoryItem();
      });

      await test.step("Filter Poker history by date and verify matching records are displayed", async () => {
        await pages.accountPage.openCalendarPicker();
        await pages.accountPage.ensureMonthInCalendar(firstItem.monthName);
        await pages.accountPage.selectSingleDayAndApply(firstItem.day);
        await pages.accountPage.verifyCalendarFilterValue(firstItem.fullDateFilter);
        await pages.accountPage.verifyPokerHistoryItemVisible(firstItem.dateFormatted);
      });
    });
  });
});
