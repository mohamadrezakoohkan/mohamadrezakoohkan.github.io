// astro.config.mjs
// ─────────────────────────────────────────────────────────────
// Main configuration file for the Astro project.
// We configure the `site` and `base` options here so that Astro
// generates correct URLs when deployed to GitHub Pages.
// ─────────────────────────────────────────────────────────────
import { defineConfig } from "astro/config";

export default defineConfig({
  // ── GitHub Pages deployment settings ──────────────────────
  // `site`  – The full URL where your site will be hosted.
  //           Replace "YOUR_GITHUB_USERNAME" with your actual
  //           GitHub username.
  // `base`  – The repository name, used as the path prefix.
  //           e.g. https://<user>.github.io/markdown/
  //           If you deploy to a custom domain or a user-site
  //           repo (<user>.github.io), set base to "/".
  site: "https://mohamadrezakoohkan.github.io",
  base: "/",
});
