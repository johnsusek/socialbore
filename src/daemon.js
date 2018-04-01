const puppeteer = require('puppeteer');
const borer = require('./borer');
const posts = require('./posts');
const { xmlFromPosts } = require('./feed');

(async () => {
  console.log('Starting daemon...');
  await posts.init();

  // Every 5 minutes, browse facebook
  (async function start() {
    console.log('Boring...');
    let browser = await puppeteer.launch({ headless: true });
    let page = await browser.newPage();

    // This knows it is complete by watching network requests,
    // and exiting when there hasn't been any activity in a while
    // In order to do this, requests need to be interceptable
    await page.setRequestInterception(true);

    await borer.prepare(page);
    await borer.navigate(page);

    let newPosts = await borer.bore(page);
    posts.add(newPosts);

    browser.close();

    setTimeout(start, 30000);
  }());
})();

function getFeedXml() {
  return xmlFromPosts(posts.recent());
}

function finish() {
  posts.finish();
  process.exit();
}

process.on('SIGINT', finish);

module.exports = {
  getFeedXml
};
