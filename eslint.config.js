//  @ts-check

import { tanstackConfig } from "@tanstack/eslint-config";

import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";

export default defineConfig({
    files: ["**/*.{js,ts}"],
    extends: [
        js.configs.recommended,
        tseslint.configs.recommended,
        ...tanstackConfig,
        {
            rules: {
                "import/no-cycle": "off",
                "import/order": "off",
                "sort-imports": "warn",
                "pnpm/json-enforce-catalog": "off",
                "@typescript-eslint/consistent-type-imports": "error",
                "@typescript-eslint/array-type": [
                    "error",
                    { default: "generic" },
                ],
                "no-unused-vars": [
                    "warn",
                    {
                        args: "all",
                        argsIgnorePattern: "^_",
                        varsIgnorePattern: "^_",
                    },
                ],
                "@typescript-eslint/no-unused-vars": [
                    "warn",
                    {
                        args: "all",
                        argsIgnorePattern: "^_",
                        varsIgnorePattern: "^_",
                    },
                ],
            },
        },
        {
            ignores: [
                "eslint.config.js",
                "prettier.config.js",
                ".tanstack/",
                ".output/",
                ".wrangler/",
                ".import/",
                ".direnv/",
            ],
        },
    ],
});
