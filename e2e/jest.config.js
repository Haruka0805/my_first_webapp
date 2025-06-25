export default {
  preset: "jest-puppeteer",
  testTimeout: 80000,
  testMatch: ["<rootDir>/tests/*.js"],
  globalSetup: "./jest-global-setup.js",
  globalTeardown: "./jest-global-teardown.js",
  globals: {
    TARGET_PORT: process.env.PORT ?? 3002,
    TARGET_PAGE_URL: `http://localhost:${process.env.PORT ?? 3002}`,
  },
  watchman: false,
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
};

process.env.JEST_PUPPETEER_CONFIG = "./jest-puppeteer.config.js";
