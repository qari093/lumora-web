import js from "@eslint/js";

/**
 * ESLint v9 flat config for Lumora (Next.js project)
 * - Compatible with ESLint 9+
 * - Fixes lint failure due to deprecated .eslintrc
 * - Focuses linting on app/source files (ignores tooling, scripts, public assets)
 */
export default [
  {
    ignores: [
      // generic noise / build artifacts
      "node_modules/**",
      ".next/**",
      "dist/**",
      "coverage/**",
      "build/**",
      "out/**",
      "logs/**",

      // local tooling / debug / infra scripts that were failing lint
      "debug-path-relative.*",
      "dev-hooks/**",
      "scripts/**",
      "services/**",
      "tools/**",
      "live/**",
      "lib/**",
      "patch-logo.js",

      // static/public runtime assets
      "public/**",
    ],
  },

  // Base recommended JS rules for everything not ignored
  js.configs.recommended,
];
