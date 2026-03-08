
const eslintPluginTs = require('@typescript-eslint/eslint-plugin');

module.exports = [
    {
        files: ['**/*.ts', '**/*.tsx'],
        languageOptions: 
        {
          parser: tseslint.parser,
          globals: 
          {
            require: "readonly",
            module: "readonly",
            __dirname: "readonly",
          },
        },
        plugins: 
        {
          '@typescript-eslint': eslintPluginTs,
        },
        rules: 
        {
          "no-unused-vars": "warn",
          "no-console": "off",
          "@typescript-eslint/no-require-imports": "off",
        },
    },
];