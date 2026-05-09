import path from "node:path";
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import tailwindCanonical from "eslint-plugin-tailwind-canonical-classes";
import tailwind from "eslint-plugin-tailwindcss";

const tailwindEntryCss = path.join(import.meta.dirname, "src/app/globals.css");

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  ...tailwindCanonical.configs["flat/recommended"],
  ...tailwind.configs["flat/recommended"],
  {
    settings: {
      tailwindcss: {
        config: tailwindEntryCss,
        cssFiles: ["src/app/globals.css", "src/theme/**/*.css"],
      },
    },
    rules: {
      "tailwind-canonical-classes/tailwind-canonical-classes": [
        "warn",
        {
          cssPath: tailwindEntryCss,
          calleeFunctions: ["cn", "clsx", "classNames", "twMerge", "cva"],
        },
      ],
      "tailwindcss/no-custom-classname": "off",
      "tailwindcss/no-contradicting-classname": "warn",
    },
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
