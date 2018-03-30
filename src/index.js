const puppeteer = require('puppeteer');
const borePage = require('./borePage');
const borePosts = require('./borePosts');

(async () => {
  await borePosts.init();
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // This script knows it is complete by watching network requests,
  // and exiting when there hasn't been any activity in a while
  // In order to do this, requests need to be interceptable
  await page.setRequestInterception(true);

  await borePage.prepare(page);
  await borePage.navigate(page);
  await borePage.bore(page, browser);
})();
