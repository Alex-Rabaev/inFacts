import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: [
      "**/dist/**",
      "**/node_modules/**",
      "**/coverage/**",
      ".pnpm-store/**",
      ".corepack/**",
      "legacy/**",
      "**/src/generated/**",
      "**/*.config.*",
      "apps/web/vite-env.d.ts",
    ],
  },
  ...tseslint.configs.recommended,
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "no-undef": "off",
    },
  },
);
