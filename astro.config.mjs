import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://ben-oxley-site-redesign-production.up.railway.app",
  base: "/",
  trailingSlash: "never",
  build: {
    format: "file",
  },
});