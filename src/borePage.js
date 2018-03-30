const fs = require('fs');
const postObserver = require('./postObserver');
const borePosts = require('./borePosts');

const username = process.env.SOCIALBORE_USERNAME;
const password = process.env.SOCIALBORE_PASSWORD;

let lastRequest;

async function prepare(page) {
  page.on('request', req => {
    // Keep track of the time of the last network request, which we use to decide
    // when we are done
    lastRequest = +new Date();
    // Abort any requests for images, as we are just gathering data from the html
    if (req.resourceType() === 'image') req.abort();
    else req.continue();
  });

  // Uncomment this to see the console output of the embedded Chromium
  // page.on('console', msg => console.log('PAGE LOG:', msg.text()));

  // When the injected script starts noticing changes in the DOM with posts,
  // it calls these functions, which is how these scripts communicate
  page.exposeFunction('onFacebookPostCreate', borePosts.onFacebookPostCreate);
  page.exposeFunction('onFacebookPostUpdate', borePosts.onFacebookPostUpdate);

  // Start watching the DOM for changes, so we can extract data- attributes
  // and text/html to build our post objects
  postObserver.postObserver(page);

  // If there are saved cookies on the filesystem,
  // load them in so we don't have to login again
  if (fs.existsSync('cookies.json')) {
    let cookiesFile = fs.readFileSync('cookies.json');
    let savedCookies = JSON.parse(cookiesFile);
    savedCookies.forEach(async cookie => {
      await page.setCookie(cookie);
    });
  }
}

async function navigate(page) {
  await page.goto('https://facebook.com/');

  // If the login form is on the page, fill it out
  if (
    (await page.$('#email')) &&
    (await page.$('#pass')) &&
    (await page.$('#loginbutton'))
  ) {
    await page.type('#email', username);
    await page.type('#pass', password);

    await Promise.all([
      page.waitForNavigation(),
      page.click('#loginbutton input')
    ]);
  }

  // We are now logged in, either from previous cookies, or
  // we have filled out the login form. Save our cookies for next session
  let cookies = await page.cookies();
  fs.writeFileSync('cookies.json', JSON.stringify(cookies));
}

async function bore(page, browser) {
  // Poll to see if there has been any network activity in the last 10 seconds,
  // and if not, close this session
  setInterval(async () => {
    let timestamp = +new Date();
    if (timestamp - lastRequest > 10000) {
      borePosts.finish();
      browser.close();
      process.exit();
    }
  }, 1000);

  // Begin scrolling down the page, which will trigger new posts to load
  await page.evaluate(() => {
    setInterval(() => window.scrollBy(0, 10000), 100);
  });
}

module.exports = {
  prepare,
  navigate,
  bore
};
