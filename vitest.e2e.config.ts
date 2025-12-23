import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests-e2e/**/*.test.js"],
    exclude: ["node_modules", "dist"],
    coverage: {
      enabled: true,
    },
  },
});
