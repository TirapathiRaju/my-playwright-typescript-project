const {test, expect} = require('@playwright/test');

test('Special Locators', async ({page}) => {
await page.goto('https://rahulshettyacademy.com/angularpractice/');
await page.getByLabel("Check me out if you Love IceCreams!").check();
await page.getByLabel("Gender").selectOption("Female");
await page.getByLabel("Employed").click();
await page.getByPlaceholder("Password").fill("Test@123");
await page.getByRole("button",{name :'Submit'}).click();
expect(await page.getByText("Success! The Form has been submitted successfully!.").isVisible()).toBeTruthy();
//The default timeout is 5 seconds for all the actions in playwright, if you want to increase the timeout for a specific action/line/step then you can use the below line of code
//await expect(page.getByText("Success! The Form has been submitted successfully!.")).toBeVisible({timeout: 10000});
await page.getByRole("link", {name : 'Shop'}).click();
//bellow line is used to get the all products located with 'locator' and filter the product with the name "Nokia Edge" and click on the 'Add' button
await page.locator("app-card").filter({hasText: 'Nokia Edge'}).getByRole("button", {name : 'Add'}).click();

});

test('Different Waits', async ({page}) => {

//waits flow "Global" -> "Test Level" -> "Step Level"
//overall single test timeout is 40 seconds, but for this test we are increasing the timeout to 60 seconds
test.timeout(60000);

//below line is used for test level action timeouts, this will override the default timeout set in playwright.config.js
page.setDefaultTimeout(20000);

//below line is used to increase the timeout for all the actions in this test level, this will override the default timeout set in playwright.config.js
const newExpect = expect.configure({timeout: 10000});

await page.goto('https://rahulshettyacademy.com/angularpractice/');
await page.getByLabel("Check me out if you Love IceCreams!").check();
await page.getByLabel("Gender").selectOption("Female");
await page.getByLabel("Employed").click();
await page.getByPlaceholder("Password").fill("Test@123");
await page.getByRole("button",{name :'Submit'}).click();

//'newExpect' is the new customized expect with increased timeout, this will override the default timeout set in playwright.config.js
newExpect(await page.getByText("Success! The Form has been submitted successfully!.").isVisible()).toBeTruthy();

await page.getByRole("link", {name : 'Shop'}).click();
await newExpect(page.locator(".my-4").first()).toContainText('Shop');
//bellow line is used to get the all products located with 'locator' and filter the product with the name "Nokia Edge" and click on the 'Add' button
await page.locator("app-card").filter({hasText: 'Nokia Edge'}).getByRole("button", {name : 'Add'}).click();


});