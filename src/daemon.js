let puppeteer = require('puppeteer');
let borer = require('./borer');
let posts = require('./posts');
let { xmlFromPosts } = require('./feed');

let browser;

(async () => {
  await posts.init();

  browser = await puppeteer.launch({ headless: true });

  // Every 5 minutes, browse facebook
  (async function start() {
    console.log('Boring...');

    let page = await browser.newPage();

    // This knows it is complete by watching network requests,
    // and exiting when there hasn't been any activity in a while
    // In order to do this, requests need to be interceptable
    await page.setRequestInterception(true);

    await borer.prepare(page);
    await borer.navigate(page);

    let newPosts = await borer.bore(page);
    posts.add(newPosts);

    page.close();

    console.log('Sleeping...');

    setTimeout(start, 300000);
  }());
})();

function getFeedXml() {
  return xmlFromPosts(posts.recent());
}

function finish() {
  browser.close();
  posts.finish();
  process.exit();
}

process.on('SIGINT', finish);

module.exports = {
  getFeedXml
};
