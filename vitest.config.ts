import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url))
    }
  },
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
    reporters: ["default"],
    // The seed-bank suite validates all 800 questions; give it headroom on
    // slow or heavily loaded machines instead of failing on a 5s timeout.
    testTimeout: 20_000,
    hookTimeout: 20_000
  }
});
