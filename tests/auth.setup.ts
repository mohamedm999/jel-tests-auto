import { test as setup, expect } from "@playwright/test";

import fs from "fs";
import { mockCookieConsent } from "../utils/consent";

setup("authenticate", async ({ page }) => {
  await page.goto("/", { timeout: 250000, waitUntil: "load" });
  if (fs.existsSync("../.auth/user.json")) {
    console.log("auth file exists");
  } else {
    await mockCookieConsent(page);
    if (process.env.ENV !== "LOCAL") {
      await page.locator('[name="password"]').fill("GlbJel2024Netlify");
      await page.getByRole("button", { name: "Submit" }).click();
      await expect(page.getByRole("button", { name: "Submit" })).toBeHidden({
        timeout: 10000
      });
    }
    await page.context().storageState({ path: ".auth/netlify.json" });
  }
});
