import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "@typescript-eslint/no-unused-vars": "off",

      // Prevent yellow/amber utility classes to avoid color regressions
      "no-restricted-syntax": [
        "error",
        {
          selector: "Literal[value=/\\b(text|bg|border)-(yellow|amber)-\\d+\\b/]",
          message: "Use design tokens instead of yellow/amber utilities. Use var(--color-primary), var(--color-warning), etc."
        },
        {
          selector: "TemplateLiteral *[value=/\\b(text|bg|border)-(yellow|amber)-\\d+\\b/]",
          message: "Use design tokens instead of yellow/amber utilities. Use var(--color-primary), var(--color-warning), etc."
        }
      ],
    },
  }
);
