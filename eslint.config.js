import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig(
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
      globals: {
        ...globals.node,
      },
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    ignores: ["node_modules/**", "pnpm-lock.yaml", "out/**"],
  },
);
