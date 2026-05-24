import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://benoxley.com",
  base: "/",
  trailingSlash: "never",
  build: {
    format: "file",
  },
});