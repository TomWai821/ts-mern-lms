
const eslintPluginTs = require('@typescript-eslint/eslint-plugin');
const eslintParserTs = require('@typescript-eslint/parser');

module.exports = [
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tseslint.parser,
      globals: {
        require: "readonly",
        module: "readonly",
        __dirname: "readonly",
      },
    },
    plugins: {
      '@typescript-eslint': eslintPluginTs,
    },
    rules: {
      "no-unused-vars": "warn",
      "no-console": "off",
      "@typescript-eslint/no-require-imports": "off",
    },
  },
];

import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.ts", "**/*.tsx"],
    
  },
];