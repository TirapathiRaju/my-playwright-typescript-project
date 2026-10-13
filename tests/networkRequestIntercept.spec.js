const { test, expect} = require('@playwright/test');
test('Security Test Network Request Intercept', async ({ page }) => {
    //login and reach to orders page
    await page.goto('https://rahulshettyacademy.com/client/');
    console.log("Page Title is:" + await page.title());
    const email = "tirapathi.raju460@gmail.com";
    const password = "Test@123";
    await page.getByPlaceholder("email@example.com").fill(email);
    await page.getByPlaceholder("enter your passsword").fill(password);
    await page.getByRole("button", { name: 'login' }).click();
    await page.waitForLoadState('networkidle');
    await page.locator('.card-body b').first().waitFor();

    await page.locator("button[routerlink*='myorders']").click();
    
    //below code is useful to intercept the request
    page.route('https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=*',
        route=>route.continue({url:'https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=621661f884b053f6765465b6'
        })
    );
    await page.locator("button:has-text('View')").first().click();
    await page.pause();
    await expect(page.locator("p").last()).toHaveText('You are not authorize to view this order');
})