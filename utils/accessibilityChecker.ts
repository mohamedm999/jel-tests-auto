import AxeBuilder from "@axe-core/playwright";
import { Page, TestInfo } from "@playwright/test";
import fs from "fs";
import path from "path";

interface AccessibilityOptions {
  disableRules?: string[];
  softFailRules?: string[];
  stepName?: string;
}

export async function performAccessibilityScan(page: Page, testInfo: TestInfo, options?: AccessibilityOptions): Promise<boolean> {
  const builder = new AxeBuilder({ page });

  if (options?.disableRules) {
    builder.disableRules(options.disableRules);
  }

  const results = await builder.analyze();

  // Logic to separate hard/soft violations remains the same...
  let hardViolations = results.violations;
  if (options?.softFailRules && options.softFailRules.length > 0) {
    hardViolations = results.violations.filter((v) => !options.softFailRules!.includes(v.id));
  }

  // Create a dynamic name for the report
  const attachmentSuffix = options?.stepName ? ` – ${options.stepName}` : "";

  // Update Violations Attachment Name
  if (results.violations.length > 0) {
    const violationMessages = results.violations
      .map((v) => {
        return `Violation: ${v.id}\nDescription: ${v.description}\nImpact: ${v.impact}\nHelp: ${v.helpUrl}\nNodes: ${v.nodes.map((n) => n.target.join(", ")).join(" | ")}\n`;
      })
      .join("\n");

    testInfo.attachments.push({
      name: `Accessibility Violations${attachmentSuffix}`, // <--- Dynamic Name
      contentType: "text/plain",
      body: Buffer.from(violationMessages)
    });
  }

  // Update Passes Attachment Name
  if (results.passes.length > 0) {
    const passMessages = results.passes.map((p) => `Pass: ${p.id}\nDescription: ${p.description}\nImpact: ${p.impact}\n\n`).join("\n");

    testInfo.attachments.push({
      name: `Accessibility Passes${attachmentSuffix}`, // <--- Dynamic Name
      contentType: "text/plain",
      body: Buffer.from(passMessages)
    });
  }

  // Keep your existing JSON file logic...
  const a11yFile = path.join("playwright-report", "accessibility-results.json");

  let existingResults: any[] = [];
  if (fs.existsSync(a11yFile)) {
    existingResults = JSON.parse(fs.readFileSync(a11yFile, "utf-8"));
  }

  existingResults.push({
    test: testInfo.title,
    url: page.url(),
    results
  });

  fs.mkdirSync(path.dirname(a11yFile), { recursive: true });
  fs.writeFileSync(a11yFile, JSON.stringify(existingResults, null, 2), "utf-8");

  return hardViolations.length === 0;
}
