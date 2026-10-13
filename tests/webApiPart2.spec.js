//this code i s useful to login with api when login api is having more key value pairs in browser cookies

const { test, expect } = require('@playwright/test');
let webContext;

test.beforeAll('Before all', async({browser})=>{
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('https://rahulshettyacademy.com/client/');
    console.log("Page Title is:" + await page.title());
    const loginButton = page.locator('#login');
    const emailField = page.locator('#userEmail');
    const passwordField = page.locator('#userPassword');
    const email = "tirapathi.raju460@gmail.com";
    const password = "Test@123";
    await expect(loginButton).toHaveText('Login');
    await emailField.fill(email);
    await passwordField.fill(password);
    await loginButton.click();
    await page.waitForLoadState('networkidle');
    //below line is used to create a json file and store all the active browser cookies into a json file
    await context.storageState({path: 'state.json'});
    //below line is for creating a new browser context and passong storage cookies
    webContext = await browser.newContext({storageState:'state.json'});
    
})

test('Client  Application', async () => {
    const email = "tirapathi.raju460@gmail.com";
    //here we are creating 'page' dynamically so page fixture is not required in test function declaration
    const page = await webContext.newPage();
    await page.goto('https://rahulshettyacademy.com/client/');
    //await page.locator('.card-body b').first().waitFor();
    //const homeIcon = page.locator('.fa-home');
    //await expect(homeIcon).toBeVisible();
    const products = page.locator('.card-body');
    const productNames = await page.locator('.card-body b').allTextContents();
    console.log("Product Names are: " + productNames);
    //IPHONE 13 PRO
    const requiredProductName = "iphone 13 pro";
    const productsCount = await products.count();
    console.log("Products Count is: " + productsCount);
    for (let i = 0; i < productsCount; ++i) {
        if (await products.nth(i).locator("b").textContent() === requiredProductName) {
            //add product to cart
            console.log("if condition started");
            await products.nth(i).locator("text= Add To Cart").click();
            console.log("if condition ended and product added to cart");
            break;
            // const productName = await products.nth(i).locator("b").textContent();

            // if (productName?.trim().toLowerCase() === requiredProductName.toLowerCase()) {
            //     await products.nth(i).getByText("Add To Cart").click();
            //     break;
            // }
        }
    }
    //await page.pause();
    //await page.waitForTimeout(3000);
    await page.locator('[routerlink*="cart"]').click();
    await page.locator('div li').first().waitFor();
    const cartValueStatus = await page.locator("h3:has-text('" + requiredProductName + "')").isVisible();
    expect(cartValueStatus).toBeTruthy();
    await page.locator('text=Checkout').click();
    await page.locator('[placeholder*="Country"]').pressSequentially('ind');
    const dropdownOptions = page.locator('.ta-results');
    await dropdownOptions.waitFor();
    const optionsCount = await dropdownOptions.locator('button').count();
    for (let i = 0; i < optionsCount; ++i) {
        if (await dropdownOptions.locator('button').nth(i).textContent() === " India") {
            console.log("dropdown if condition started");
            await dropdownOptions.locator('button').nth(i).click();
            console.log("dropdown if condition ended and country selected");
            break;
        }
    }
    await expect(page.locator(".user__name [type = 'text']").first()).toHaveText(email);
    await page.locator('.action__submit').click();
    await expect(page.locator('.hero-primary')).toHaveText(' Thankyou for the order. ');
    const orderId = await page.locator('.em-spacer-1 .ng-star-inserted').textContent();
    console.log("Order ID is: " + orderId);
    await page.locator(".em-spacer-1 [routerlink*='myorders']").click();
    await page.locator("tbody").waitFor();
    const orderRows = page.locator('tbody tr');
    for (let i = 0; i < await orderRows.count(); ++i) {
        const rowOrderId = await orderRows.nth(i).locator("th").textContent();
        if(orderId.includes(rowOrderId)){
            console.log("Order History If Condition Started");
            await orderRows.nth(i).locator("td button").first().click();
            console.log("Order History If Condition Ended, View Order Details Clicked");
            break;
        }
    }
    const summaryPageHeader = await page.locator(".email-title").textContent();
    expect(summaryPageHeader.includes(" order summary ")).toBeTruthy();
    
    const orderIDDetails= await page.locator(".col-text").textContent();
    expect(orderId.includes(orderIDDetails)).toBeTruthy();

})

test('Test Case 2', async () => {
    const email = "tirapathi.raju460@gmail.com";
    //here we are creating 'page' dynamically so page fixture is not required in test function declaration
    const page = await webContext.newPage();
    await page.goto('https://rahulshettyacademy.com/client/');
    const products = page.locator('.card-body');
    const productNames = await page.locator('.card-body b').allTextContents();
    console.log("Product Names are: " + productNames);
});

