import js from "@eslint/js";
import tseslint from "@typescript-eslint/parser";

export default [
  js.configs.recommended,
  {
    ignores: ["**/*.astro", "**/*.md", "dist/", ".astro/", "node_modules/"],
  },
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    languageOptions: {
      parser: tseslint,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    rules: {
      "no-unused-vars": "warn",
      "no-console": "warn",
    },
  },
];