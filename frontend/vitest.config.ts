import { defineConfig, mergeConfig } from "vitest/config";
import viteConfig from "./vite.config";

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: "jsdom",
      globals: true,
      setupFiles: ["./src/tests/setup.ts"],
      css: true,
      exclude: ["**/node_modules/**", "**/dist/**", "./src/tests/e2e/**"],
      coverage: {
        provider: "v8",
        reporter: ["text", "html"],
        exclude: ["src/main.tsx", "src/mocks/**", "e2e/**"],
      },
    },
  }),
);
