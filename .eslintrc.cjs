/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  env: { browser: true, es2022: true },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  ignorePatterns: ["dist/", ".astro/", "node_modules/", "public/"],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {
    "no-unused-vars": "warn",
    "no-console": "warn",
  },
};