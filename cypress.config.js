const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    defaultCommandTimeout: 15000,
  requestTimeout: 15000,
  responseTimeout: 15000,
    retries: {
      runMode: 2,
      openMode: 0
    },
    baseUrl: 'http://sdetchallenge.fetch.com/',
    setupNodeEvents(on, config) {

    },
  },
});
