const { test, expect } = require('@playwright/test');

test('Client  Application', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('https://rahulshettyacademy.com/client/');
    console.log("Page Title is:" + await page.title());
    const email = "tirapathi.raju460@gmail.com";
    const password = "Test@123";
    await page.getByPlaceholder("email@example.com").fill(email);
    await page.getByPlaceholder("enter your passsword").fill(password);
    await page.getByRole("button", { name: 'login' }).click();
    await page.waitForLoadState('networkidle');
    await page.locator('.card-body b').first().waitFor();
    await page.locator(".card-body").filter({ hasText: "iphone 13 pro" }).getByRole("button", { name: 'Cart' }).click();
    await page.getByRole("listitem").getByRole("button", { name: 'Cart' }).click();
    await page.waitForLoadState('networkidle');
    await expect(page.getByText("iphone 13 pro")).toBeVisible();
    await page.getByRole("button", { name: 'Checkout' }).click();
    await page.waitForLoadState('networkidle');
    await page.getByPlaceholder("Select Country").pressSequentially("Ind");
    await page.getByRole("button", { name: 'India' }).nth(1).waitFor();
    //await page.dropdownOptions.waitFor();
    await page.getByRole("button", { name: 'India' }).nth(1).click();
    //await expect(page.getByLabel("tirapathi.raju460@gmail.com").includes(email));
    await page.getByText("PLACE ORDER").click();
    await page.waitForLoadState('networkidle');
    await expect(page.getByText(" Thankyou for the order. ")).toBeVisible();

    const orderId = await page.locator('.em-spacer-1 .ng-star-inserted').textContent();
    console.log("Order ID is: " + orderId);
    await page.getByText(" Orders History Page ").click();
    //await page.locator(".em-spacer-1 [routerlink*='myorders']").click();
    await page.locator("tbody").waitFor();
    const orderRows = page.locator('tbody tr');
    for (let i = 0; i < await orderRows.count(); ++i) {
        const rowOrderId = await orderRows.nth(i).locator("th").textContent();
        if (orderId.includes(rowOrderId)) {
            console.log("Order History If Condition Started");
            await orderRows.nth(i).locator("td button").first().click();
            console.log("Order History If Condition Ended, View Order Details Clicked");
            break;
        }
    }
    const summaryPageHeader = await page.locator(".email-title").textContent();
    expect(summaryPageHeader.includes(" order summary ")).toBeTruthy();

    const orderIDDetails = await page.locator(".col-text").textContent();
    expect(orderId.includes(orderIDDetails)).toBeTruthy();


});