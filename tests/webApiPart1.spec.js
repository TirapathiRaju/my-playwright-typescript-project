const { test, expect, request } = require('@playwright/test');
//this is to import utils class
const {APiUtils} = require('./utils/APiUtils');
const loginPayload = { userEmail: "tirapathi.raju460@gmail.com", userPassword: "Test@123" };
const orderPayload = { orders: [{ country: "Cuba", productOrderedId: "6960ea76c941646b7a8b3dd5" }] };
let response;
test.beforeAll('Web API Testing', async () => {
    //login API
    const apiContext = await request.newContext();
    const apiUtils = new APiUtils(apiContext, loginPayload);
    response = await apiUtils.createOrder(orderPayload);

});

test('Place Order', async ({ page }) => {
    //instead of login through UI, we are setting the token in local storage and then loading the page
    //this will avoid the login through UI and will directly take us to the page after login
    //we are setting the token in local storage before page load, so that when the page loads, it will have the token in local storage and will be logged in
    //setting the token in local storage before page load
    page.addInitScript(value => {
        window.localStorage.setItem('token', value);
    }, response.token);
    await page.goto('https://rahulshettyacademy.com/client/');

    await page.locator("button[routerlink*='myorders']").click();
    await page.locator("tbody").waitFor();
    const orderRows = page.locator('tbody tr');
    for (let i = 0; i < await orderRows.count(); ++i) {
        const rowOrderId = await orderRows.nth(i).locator("th").textContent();
        if (response.orderId.includes(rowOrderId)) {
            console.log("Order History If Condition Started");
            await orderRows.nth(i).locator("td button").first().click();
            console.log("Order History If Condition Ended, View Order Details Clicked");
            break;
        }
    }
    const summaryPageHeader = await page.locator(".email-title").textContent();
    expect(summaryPageHeader.includes(" order summary ")).toBeTruthy();

    const orderIDDetails = await page.locator(".col-text").textContent();
    expect(response.orderId.includes(orderIDDetails)).toBeTruthy();
});