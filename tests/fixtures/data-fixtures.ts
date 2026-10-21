import { test as base } from "@playwright/test";

export const test = base.extend<{
  testData: any;
}>({
  testData: async ({}, use) => {
    // Valeur initiale vide
    await use({});
  },
});
