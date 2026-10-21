import playwright from "eslint-plugin-playwright";
import eslintConfigPrettier from "eslint-config-prettier";
import js from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";

export default [
  js.configs.recommended,
  {
    files: ["**/*.{js,ts}"],
    plugins: {
      playwright
    },
    languageOptions: {
      globals: {
        console: "readonly",
        process: "readonly"
      }
    },
    rules: {
      ...playwright.configs["flat/recommended"].rules,
      "no-console": "off",
      "playwright/no-skipped-test": "warn",
      "playwright/no-networkidle": "warn",
      "no-unused-vars": "warn",
      "playwright/no-page-pause": "error",
      "playwright/no-focused-test": "error",
      "no-undef": "error"
    }
  },

  {
    files: ["**/*.ts"],
    plugins: {
      "@typescript-eslint": tsPlugin
    },
    languageOptions: {
      parser: tsParser
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-require-imports": "off",
      "no-undef": "off"
    }
  },
  eslintConfigPrettier
];
