const { test, expect } = require('@playwright/test');

test('Playwright test case using browser fixture', async ({ browser }) => {

    const context = await browser.newContext();
    const page = await context.newPage();

    const userName = page.locator('input#username');
    const signInButton = page.locator('#signInBtn');
    const cardTitles = page.locator(".card-title a");

    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
    console.log("Page Title is: " + await page.title());
    await userName.fill('rahulshetty');
    await page.locator("[type='password']").fill('Learning@830$3mK2');
    await signInButton.click();
    console.log("Incorrect User Details Message is: " + await page.locator("[style*='block']").textContent());
    await expect(page.locator("[style*='block']")).toContainText('Incorrect');
    //to clear the data in input text box fill empty ("") value
    await userName.fill("");
    await userName.fill("rahulshettyacademy");
    await signInButton.click();
    //to see the first element from the elements list
    //console.log("The First Product From the list is : " + await cardTitles.first().textContent());

    //to see the nth element from the elements list
    //console.log("The nth Product From the list is : " + await cardTitles.nth(1).textContent());

    //Sometimes 'allTextContents()' might gives you the flacky results so we need to wait until complete all the network calls got completed
    //await page.waitForLoadState('networkidle');
    //OR
    await cardTitles.first().waitFor();

    //to get the all the elements titles
    const allProductTitles = await cardTitles.allTextContents();
    console.log(allProductTitles);
});

//'test.only' annotation will run focused test case and skip all other test cases
test('Playwright test case using page fixture', async ({ page }) => {
    //if you go with the default add "page" fixture in the test function no need to add below 2 lines, page would set automatically below 2 steps.    
    //const context = await browser.newContext();
    //const page = await context.newPage();
    await page.goto("https://google.com");
    console.log("Page Title is: " + await page.title());
    //below is the assertion for loaded page
    await expect(page).toHaveTitle('Google');
});

test('UI Controls', async ({ page }) => {
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
    const userName = page.locator('input#username');
    const signInButton = page.locator('#signInBtn');
    const cardTitles = page.locator(".card-title a");
    const dropDown = page.locator("select.form-control");
    const radioButton = page.locator(".checkmark");
    const popupOkButton = page.locator("#okayBtn");
    const checkBox = page.locator('[type=checkbox]');
    //this can be select the value from the dropdown - dropdown validation
    await dropDown.selectOption('consult');
    //this can be pause the execution before closing the test, this 'pause' method will open 'playwright inspector' window.
    //await page.pause();
    await radioButton.last().click();
    await popupOkButton.click();
    //adding assertion to the radio button whether it checked
    const radioButtonStatus = await radioButton.last().isChecked();
    console.log("Radio Button Checked : " + radioButtonStatus);
    await expect(radioButton.last()).toBeChecked();
    //checkbox validation
    await checkBox.click();
    //to check the checkbox
    const checkBoxStatus = await checkBox.isChecked();
    //to print the checkbox status log
    console.log("Checkbox Checked : " + checkBoxStatus);
    //to add assertion for checked checkbox
    await expect(checkBox.isChecked()).toBeTruthy();
    //to unccheck the checkbox
    await checkBox.uncheck();
    //to print the unchecked checkbox status
    const uncheckboxStatus = await checkBox.isChecked();
    console.log("Checkbox Checked : " + uncheckboxStatus);
    //to add assertion for un-checked checkbox
    await expect(uncheckboxStatus).toBeFalsy();
    //to verify blinking text on the page
    const blinkingText = page.locator("[href*=documents-request]");
    //await expect(blinkingText).toHaveText('Free Access to InterviewQues/ResumeAssistance/Material');
    await expect(blinkingText).toHaveAttribute("class", "blinkingText");
});


test('Window Handling', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
    //blinking text locator
    const blinkingText = page.locator("[href*=documents-request]");
    //to open the new tab on the same page, handle the new tab using 'Promise.all' method, this will wait until the new tab opened and click on the blinking text link
    //promises are => 'pending', ''fulfilled', 'rejected'
    const [newPage] = await Promise.all([
        context.waitForEvent('page'),
        blinkingText.click(),
    ]);
    const newPageContent = await newPage.locator(".red").textContent();
    console.log("New Page Content is: " + newPageContent);
    //get the domain name from the new page content and use it in the current page
    const arrayText = newPageContent.split('@'); //this split the string into 2 parts based on the '@' symbol and store it in the array => Array[0,1]}
    const domain = arrayText[1].split(" ")[0]; //this split the string at Array[1] into 2 parts based on the 'space' and store it in the NewArray[0,1] and we are taking the first part of the NewArray[0] which is the domain name
    console.log("Domain Name is: " + domain);
    //to use the domain name in the current page, we need to switch back to the current page
    await page.locator("#username").fill(domain);
    console.log("Username with textContent method is: " + await page.locator("#username").textContent());//this will return null because the textContent method is used to get the text from the element, but in this case we are trying to get the value from the input box, so we need to use the 'inputValue' method to get the value from the input box
    console.log("Username with inputValue method is: " + await page.locator("#username").inputValue());//this will return the value from the input box

    //declare pages if we have more than 2 pages to handle, we can use the below code to get the all pages in the current context
    // const [newPage1, newPage2] = await Promise.all([
    //     context.waitForEvent('page'),
    //     context.waitForEvent('page'),
    //     blinkingText.click(),
    // ]);

    //if we have more pages to handle, we can use the below code to get all the pages in the current context
    const allPages = context.pages();
    console.log("Total Pages in the current context: " + allPages.length);
    //print all active pages titles in the current context
    for (let i = 0; i < allPages.length; i++) {
        console.log("Page Title of Page " + (i + 1) + " is: " + await allPages[i].title());
    }
});

