import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";

/** @type {import('@typescript-eslint/utils').TSESLint.FlatConfig.ConfigArray} */
export default tseslint.config(
  {
    files: ["**/*.{js,ts}"],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      eslintConfigPrettier,
    ],
    plugins: {
      "@typescript-eslint": tseslint.plugin,
    },
    rules: { "@typescript-eslint/prefer-for-of": "off" },
    languageOptions: {
      ecmaVersion: "latest",
      parser: tseslint.parser,
      parserOptions: {
        project: true,
      },
    },
  },
  {
    ignores: ["node_modules/**", "pnpm-lock.yaml", "out/**"],
  },
);
