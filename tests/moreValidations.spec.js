const {test, expect} = require('@playwright/test');
test('Navigate back and forth', async({page}) => {
    await page.goto('https://rahulshettyacademy.com/AutomationPractice/');
    await page.goto('https://www.google.com/');
    //this line will navigate back to the previous page
    await page.goBack();
    //this line will navigate forward to the next page
    await page.goForward();
});

test.only('JavaScript Pop and iframes and other validations', async({page}) => {
    await page.goto('https://rahulshettyacademy.com/AutomationPractice/');
    await expect(page.locator('#displayed-text')).toBeVisible();
    await page.locator('#hide-textbox').click();
    await expect(page.locator('#displayed-text')).toBeHidden();
    await page.locator('#confirmbtn').click();
    //below line will accept the javascript alert pop up
    page.on('dialog', dialog => dialog.accept());
    await page.locator('#confirmbtn').click();
    //below line will dismiss the javascript alert pop up
    page.on('dialog', dialog => dialog.dismiss());   
    //mouse hover action
    await page.locator('#mousehover').hover();
    await expect(page.locator('.mouse-hover-content')).toBeVisible();
    //iframe handling
    const framesPage = page.frameLocator('#courses-iframe');
    //if we have multimple elements with same locator but some of them are hidden and some are visible
    await framesPage.locator("li a[href*='lifetime-access']:visible").click();
    const textCheck = await framesPage.locator(".text h2").textContent();
    console.log("Number of subscribers are : " + textCheck.split(" ")[1]);
});
