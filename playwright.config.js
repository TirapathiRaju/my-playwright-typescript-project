// @ts-check
const { devices }= require('@playwright/test');

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * @see https://playwright.dev/docs/test-configuration
 */
const config = ({
  testDir: './tests',
  //default time out for each action in overall project level (system default time out is 30 msec)
  timeout: 40*1000,
  //assertion level time out
  expect:{
    timeout:5000
  },

  //to see the reports use the reporter
  reporter: 'html',

  use:{
    //below waits are for action level time out and navigation level time out, this will override the default time out set in playwright.config.js
    actionTimeout: 10000,
    navigationTimeout: 30000,
    //browser to be open/launch
    browserName: 'chromium',
    //browserName: 'firefox'
    //browserName: 'webkit'
    headless : false,
    screenshot: 'on',
    //below trace is used to capture the trace for the failed test cases, this will help us to debug the failed test cases
    trace: 'retain-on-failure',
  },

});


module.exports = config

