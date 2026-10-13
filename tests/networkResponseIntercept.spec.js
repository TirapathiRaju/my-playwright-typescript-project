const { test, expect, request } = require('@playwright/test');
//this is to import utils class
const { APiUtils } = require('./utils/APiUtils');
const loginPayload = { userEmail: "tirapathi.raju460@gmail.com", userPassword: "Test@123" };
const orderPayload = { orders: [{ country: "Cuba", productOrderedId: "6960ea76c941646b7a8b3dd5" }] };
let response;
let fakePayloadOrder = { data: [], message: 'No Orders' };
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

    //below code will help you to intercept the api response
    //'*' - can accept any id value
    await page.route("https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*",
        async route => {
            //actual response
            const response = await page.request.fetch(route.request());
            //below 'JSON.stringfy' is used to convert javascript value to javascript object
            let body = JSON.stringify(fakePayloadOrder);
            route.fulfill({
                response,
                body,
            });
            //Intercepting response=> actual api response -> {playwright fake the response before click order} -> browser -> render data

        });

    await page.locator("button[routerlink*='myorders']").click();
    await page.waitForResponse("https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*");
    //await page.pause();
    //await page.locator("tbody").waitFor();
    //const orderRows = page.locator('tbody tr');

    expect(await page.locator(".mt-4").textContent()).toContain("You have No Orders to show at this time. Please Visit Back Us");

});