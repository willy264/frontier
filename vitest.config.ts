import { defineConfig } from "vitest/config";
export default defineConfig({ test: { include: ["apps/game/**/*.test.ts", "sim/**/*.test.ts"] } });
