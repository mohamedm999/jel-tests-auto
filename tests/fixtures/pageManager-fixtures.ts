import { test as base } from "@playwright/test";
import { PageManager } from "../../pages/pageManager";

type MyFixtures = {
  pages: PageManager;
};

export const test = base.extend<MyFixtures>({
  pages: async ({ page }, use) => {
    const pages = new PageManager(page);
    await use(pages);
  },
});
