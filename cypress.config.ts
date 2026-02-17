import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
    },
    baseUrl: 'http://192.168.0.6:4000/',
    chromeWebSecurity: false,
    modifyObstructiveCode: false
  },
});
