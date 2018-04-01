let cheerio = require('cheerio');

function getPermalink($) {
  return $('abbr.timestamp')
    .closest('a')
    .attr('href');
}

function getProfiles($) {
  let profiles = [];

  $('a.profileLink').each((i, a) => {
    let text = $(a).text();

    if (text && !profiles.includes(text)) {
      profiles.push(text);
    }
  });

  return profiles;
}

function getHovercards($) {
  let hovercards = [];

  $('a[data-hovercard]').each((i, a) => {
    let text = $(a).text();

    if (text && !hovercards.includes(text)) {
      hovercards.push(text);
    }
  });

  return hovercards;
}

function getHtml($) {
  // Remove the comments
  $('form').remove();

  // Remove the h5 post title - since we have extracted
  // it already and using it for feed item title
  $('h5').remove();

  // Remove the subtitle - we've already extracted the
  // permalink from the timestamp
  $('[id^="feed_subtitle"]').remove();

  return $.html();
}

function getTitle($) {
  return $('h5')
    .text()
    .trim();
}

function createPost(html, dataset, meta) {
  let post = {
    id: dataset.dedupekey,
    dataset,
    meta: JSON.parse(meta),
    html
  };

  return post;
}

function updatePost(post, html, dataset) {
  post.dataset = dataset;

  let $ = cheerio.load(html);

  post.profiles = getProfiles($);
  post.hovercards = getHovercards($);
  post.permalink = getPermalink($);
  post.title = getTitle($);

  post.html = getHtml($);

  return post;
}

module.exports = {
  createPost,
  updatePost
};
