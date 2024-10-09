import react from "@vitejs/plugin-react";
import { loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  resolve: {
    alias: {
      "@*": "./src/*",
      "@public/*": "./../public/*",
      "@images/*": "./../public/images/*",
      "@app/*": "./src/app/*",
      "@components/*": "./src/components/*",
      "@customTypes/*": "./src/types/*",
      "@lib/*": "./src/lib/*",
      "@styles/*": "./src/styles/*",
      "@ui/*": ".src/components/ui/*",
      // Map static image imports to a mock file
      // "\\.(jpg|jpeg|png|gif|svg)$": path.resolve(__dirname, "./tests/__mocks__/nextjs.ts"),
    },
  },
  test: {
    globals: true, // This is needed by @testing-library to be cleaned up after each test
    include: ["src/**/*.test.{js,jsx,ts,tsx}"],
    coverage: {
      include: ["src/**/*"],
      exclude: ["src/**/*.stories.{js,jsx,ts,tsx}", "**/*.d.ts"],
      reporter: ["html"],
    },
    environmentMatchGlobs: [["**/*.test.tsx", "jsdom"]],
    setupFiles: ["./vitest-setup.ts"], //, "./tests/__mocks__/nextjs.ts", "./tests/__mocks__/components.tsx"
    env: loadEnv("", process.cwd(), ""),
  },
});
