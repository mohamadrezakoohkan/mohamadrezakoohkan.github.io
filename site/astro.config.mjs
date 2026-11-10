import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://mohamadreza.com",
  base: "/",
  // Build into the repo root so the deploy workflow keeps publishing dist/.
  outDir: "../dist",
  vite: {
    // The spec lives in ../spec, outside this folder.
    server: { fs: { allow: [".."] } },
  },
});
