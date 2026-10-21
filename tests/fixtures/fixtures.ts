import { mergeTests } from "@playwright/test";
import { test as dataTest } from "./data-fixtures";
import { test as pageManagerTest } from "./pageManager-fixtures";
import { test as authTest, loginWithProfile } from "./auth-fixtures";

// Merge tous les tests
export const test = mergeTests(dataTest, pageManagerTest, authTest);

// ✨ Export loginWithProfile pour utilisation dans les tests
export { loginWithProfile };
