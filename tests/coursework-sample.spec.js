import exp from 'constants';

// @ts-check
const { test, expect} = require('@playwright/test');

// change this to the URL of your website, could be local or GitHub pages
const websiteURL = 'https://finndude.github.io/DBI-Coursework/People-Search/people-search.html';

// Go to the website home page before each test.
test.beforeEach(async ({ page }) => {
   await page.goto(websiteURL);
});

// # html tests

// page links
test('homepage heading', async ({ page }) => {

   // Expect a heading 'People Search"
   await expect(page.getByRole('heading', { name: 'People Search' })).toBeVisible();

});

test('link - vehicle search', async ({ page }) => {

   // Click the 'vehicle search' link.
   await page.getByRole('link', { name: 'Vehicle search' }).click();

   // Expects page to have a heading 'Vehicle search'.
   await expect(page.getByRole('heading', { name: 'Vehicle Search' })).toBeVisible();
});

// head
test('should set the language to English', async ({ page }) => {
   const htmlElement = await page.locator('html');
   await expect(htmlElement).toHaveAttribute('lang','en');
});

// semantic structure elements
test('there is a <header> element', async ({ page }) => {
   const headerNum = await page.locator('header').count()
   expect(headerNum).toBeGreaterThan(0)
})

// ul for navigation link
test('there is a <ul> inside <header> for navigation links', async ({ page }) => {

   const ulNum = await page.locator('header').locator('ul').count()
   expect(ulNum).toBeGreaterThan(0)

})

test('there are three navigation links (<li>)', async ({ page }) => {
   const liNum = await page.locator('header').locator('ul').locator('li').count()
   // console.log(`liNum: ${liNum}`)
   expect(liNum).toBeGreaterThan(2)
})

// there is an image or video in side bar
test('html - image or video', async ({ page }) => {
   const imageNum = await page.locator('aside').locator('img').count()
   const videoNum = await page.locator('aside').locator('video').count()
   expect(imageNum + videoNum).toBeGreaterThan(0)
})

// # CSS tests

// all pages use the same css

test('same external css for all html pages', async ({ page }) => {
   
   const cssFile = await page.locator('link').getAttribute('href')

   await page.getByRole('link', { name: 'Vehicle search' }).click();
   await expect(page.locator('link')).toHaveAttribute('href', cssFile);

   await page.getByRole('link', { name: 'Add a vehicle' }).click();
   await expect(page.locator('link')).toHaveAttribute('href', cssFile);
})

// css flex for navigation links

test('use css flex to place navigation links horizontally', async ({ page }) => {

   await expect(page.locator('header').locator('ul')).toHaveCSS('display', 'flex')

   await expect(page.getByRole('link', { name: 'Vehicle search' })).toHaveCSS('flex', '0 1 auto')

})

// border margin padding

test('header should have padding 10px, margin 10px, and border 1px solid black', async ({ page }) => {
   
   const space = '10px'
   const border = '1px solid rgb(0, 0, 0)'

   await expect(page.locator('header')).toHaveCSS('padding', space)
   await expect(page.locator('header')).toHaveCSS('margin', space)
   await expect(page.locator('header')).toHaveCSS('border', border)
})

// CSS grid

test ('CSS grid is used to layout the page components', async({page}) => {
   await expect(page.locator('#container')).toHaveCSS('display','grid')
})

// # JavaScript Tests

// people search
test ('search "rachel" should return two records', async ({page}) => {
   await page.locator('#name').fill('rachel')
   await page.getByRole('button', { name: 'Submit' }).click();
   await expect(page.locator('#results')).toContainText('SG345PQ')
   await expect(page.locator('#results')).toContainText('JK239GB')
   await expect(page.locator('#results').locator('div')).toHaveCount(2)
   await expect(page.locator('#message')).toContainText('Search successful')
})


// vehicle search
test('search "KWK24JI" should return tesla but no owner', async ({page}) => {
   await page.getByRole('link', { name: 'Vehicle search' }).click();
   await page.locator('#rego').fill('KWK24JI')
   await page.getByRole('button', { name: 'Submit' }).click();
   await expect(page.locator('#results')).toContainText('Tesla')
   await expect(page.locator('#results').locator('div')).toHaveCount(1)
   await expect(page.locator('#message')).toContainText('Search successful')
})


// add a vehicle (missing owner)
test('add a vehicle', async ({page}) => {
   await page.getByRole('link', { name: 'Add a vehicle' }).click();
   await page.locator('#rego').fill('LKJ23UO')
   await page.locator('#make').fill('Porsche')
   await page.locator('#model').fill('Taycan')
   await page.locator('#colour').fill('white')
   await page.locator('#owner').fill('Kai')
   await page.getByRole('button', { name: 'Add vehicle' }).click();

   // add a new person
   await page.locator('#personid').fill('6')
   await page.locator('#name').fill('Kai')
   await page.locator('#address').fill('Edinburgh')
   await page.locator('#dob').fill('1990-01-01')
   await page.locator('#license').fill('SD876ES')
   await page.locator('#expire').fill('2030-01-01')
   await page.getByRole('button', { name: 'Add owner' }).click();

   await expect(page.locator('#message')).toContainText('Vehicle added successfully')

   await page.getByRole('link', { name: 'People search' }).click();
   await page.locator('#name').fill('Kai')
   await page.getByRole('button', { name: 'Submit' }).click();
   await expect(page.locator('#results')).toContainText('SD876ES')
   await expect(page.locator('#results').locator('div')).toHaveCount(1)
})



// Additional Tests I Created

// People search with license number
test ('Search "RW765FR" should return one record', async ({page}) => {
   await page.locator('#license').fill('RW765FR')
   await page.getByRole('button', { name: 'Submit' }).click();
   await expect(page.locator('#results')).toContainText('Lewis Thomson')
   await expect(page.locator('#results')).toContainText('RW765FR')
   await expect(page.locator('#results').locator('div')).toHaveCount(1)
   await expect(page.locator('#message')).toContainText('Search successful')
})


// People search with a person who doesn't exist
test ('Person does not exist', async ({page}) => {
   await page.locator('#name').fill('Timmy')
   await page.getByRole('button', { name: 'Submit' }).click();
   await expect(page.locator('#message')).toContainText('No result found')
})


// People search with a license number which doesn't exist
test ('License does not exist', async ({page}) => {
   await page.locator('#license').fill('HT492HJ')
   await page.getByRole('button', { name: 'Submit' }).click();
   await expect(page.locator('#message')).toContainText('No result found')
})

// Vehicle search with non existent number plate
test('Vehicle search with non existent number plate', async ({page}) => {
   await page.getByRole('link', { name: 'Vehicle search' }).click();
   await page.locator('#rego').fill('HGT38SO')
   await page.getByRole('button', { name: 'Submit' }).click();
   await expect(page.locator('#message')).toContainText('No result found')
})

// Add a vehicle (Owner already in database)
test('add a vehicle (owner already exists)', async ({page}) => {
   await page.getByRole('link', { name: 'Add a vehicle' }).click();
   await page.locator('#rego').fill('JSU91FE')
   await page.locator('#make').fill('Bugatti')
   await page.locator('#model').fill('Veyron')
   await page.locator('#colour').fill('Black')
   await page.locator('#owner').fill('Rachel Johnson')
   await page.getByRole('button', { name: 'Add vehicle' }).click();

   var seconds = 5;
   await new Promise((resolve) => setTimeout(resolve, seconds * 1000));  //Delay 35 seconds

   await page.getByRole('link', { name: 'Vehicle search' }).click();
   await page.locator('#rego').fill('JSU91FE')
   await page.getByRole('button', { name: 'Submit' }).click();
   await expect(page.locator('#results')).toContainText('Bugatti')
   await expect(page.locator('#results')).toContainText('Rachel Johnson')
   await expect(page.locator('#results').locator('div')).toHaveCount(1)
   await expect(page.locator('#message')).toContainText('Search successful')
})


// Vehicle Registration Taken
test('Registration Taken', async ({page}) => {
   await page.getByRole('link', { name: 'Add a vehicle' }).click();
   await page.locator('#rego').fill('KWK24JI')
   await page.locator('#make').fill('Bugatti')
   await page.locator('#model').fill('Veyron')
   await page.locator('#colour').fill('Black')
   await page.locator('#owner').fill('Rachel Johnson')
   await page.getByRole('button', { name: 'Add vehicle' }).click();
   await expect(page.locator('#message')).toContainText('Registration: KWK24JI is already in the database!')
})


// ID not an integer
test('ID not an integer', async ({page}) => {
   await page.getByRole('link', { name: 'Add a vehicle' }).click();
   await page.locator('#rego').fill('SDF19FD')
   await page.locator('#make').fill('McLaren')
   await page.locator('#model').fill('720S')
   await page.locator('#colour').fill('Cream')
   await page.locator('#owner').fill('Marcelo')
   await page.getByRole('button', { name: 'Add vehicle' }).click();
   
   
   await page.locator('#personid').fill('Nineteen')
   await page.locator('#name').fill('Marcelo')
   await page.locator('#address').fill('London')
   await page.locator('#dob').fill('2005-06-19')
   await page.locator('#license').fill('SD876ES')
   await page.locator('#expire').fill('2025-06-19')
   await page.getByRole('button', { name: 'Add owner' }).click();

   await expect(page.locator('#message')).toContainText('ID must be an integer')
})


// DOB not in YYYY-MM-DD format
test('DOB in incorrect format', async ({page}) => {
   await page.getByRole('link', { name: 'Add a vehicle' }).click();
   await page.locator('#rego').fill('LSO39SM')
   await page.locator('#make').fill('Ford')
   await page.locator('#model').fill('Focus')
   await page.locator('#colour').fill('Orange')
   await page.locator('#owner').fill('Eden')
   await page.getByRole('button', { name: 'Add vehicle' }).click();
   
   await page.locator('#personid').fill('190')
   await page.locator('#name').fill('Eden')
   await page.locator('#address').fill('London')
   await page.locator('#dob').fill('June 19th 2005')
   await page.locator('#license').fill('SD876ES')
   await page.locator('#expire').fill('2025-06-19')
   await page.getByRole('button', { name: 'Add owner' }).click();

   await expect(page.locator('#message')).toContainText('Date must be in YYYY-MM-DD format')
})


// Expiry not in YYYY-MM-DD format
test('Expiry in incorrect format', async ({page}) => {
   await page.getByRole('link', { name: 'Add a vehicle' }).click();
   await page.locator('#rego').fill('AIM37NG')
   await page.locator('#make').fill('Toyota')
   await page.locator('#model').fill('Yaris')
   await page.locator('#colour').fill('Red')
   await page.locator('#owner').fill('Nicolas')
   await page.getByRole('button', { name: 'Add vehicle' }).click();
   
   await page.locator('#personid').fill('205')
   await page.locator('#name').fill('Nicolas')
   await page.locator('#address').fill('London')
   await page.locator('#dob').fill('2025-06-19')
   await page.locator('#license').fill('SD876ES')
   await page.locator('#expire').fill('June 19th 2025')
   await page.getByRole('button', { name: 'Add owner' }).click();

   await expect(page.locator('#message')).toContainText('Date must be in YYYY-MM-DD format')
})