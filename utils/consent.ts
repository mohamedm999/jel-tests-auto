import { Page } from "@playwright/test";

const CONSENT_V2 =
  "CQimfQAQimfQAAHABBENCaFsAP_gAAAAAAqIHNQBwAQACEAIgAYQBGoC8wHNAAAAFJQAYAAgxaUgAwABBi0dABgACDFpCADAAEGLQkAGAAIMWgAA.IHNQBwAQACEAIgAYQBGoC8wHNAAA.f_wAAAAAAAAA";

const ORIGINS = [
  "https://develop--accounts-devgroupebarriere.netlify.app",
  "https://develop--jel-poker.netlify.app",
  "https://privacy.casinosbarriere.com",
];

export async function mockCookieConsent(page: Page) {
  await page.addInitScript((consent) => {
    window.localStorage.setItem("euconsent-v2", consent);
    window.localStorage.setItem(
      "didomi_token",
      JSON.stringify({
        user_id: "test-user",
        created: new Date().toISOString(),
        updated: new Date().toISOString(),
        version: 2,
        vendors: { enabled: [] },
        purposes: { enabled: [] },
      }),
    );
  }, CONSENT_V2);

  for (const origin of ORIGINS) {
    await page.context().addInitScript(
      ({ o, c }) => {
        if (location.origin === o) {
          window.localStorage.setItem("euconsent-v2", c);
        }
      },
      { o: origin, c: CONSENT_V2 },
    );
  }
}
