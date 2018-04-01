const cheerio = require('cheerio');
const url = require('url');

function getPermalink($) {
  return $('abbr.timestamp')
    .closest('a')
    .attr('href');
}

function getHasExternalLinks($) {
  let hasExternalLinks = false;

  let externalLinks = $('a[href^="https://l.facebook.com/l.php"]');

  externalLinks.each((i, externalLink) => {
    // There is an external (link-shortened) url...
    let urlParsed = url.parse($(externalLink).attr('href'));
    let actualUrl = urlParsed.query.u;
    if (actualUrl && !actualUrl.match(/(jpg|jpeg|gif|png|gifv|mp4)$/)) {
      // ...and it isn't a link to an image/video, so mark the post
      hasExternalLinks = true;
    }
  });

  return hasExternalLinks;
}

function getProfiles($) {
  let profiles = [];
  $('a.profileLink').each((i, a) => {
    if ($(a).text() && !profiles.includes($(a).text())) {
      profiles.push($(a).text());
    }
  });
  return profiles;
}

function getHovercards($) {
  let hovercards = [];
  $('a[data-hovercard]').each((i, a) => {
    if ($(a).text() && !hovercards.includes($(a).text())) {
      hovercards.push($(a).text());
    }
  });

  return hovercards;
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
  post.html = html;

  let $ = cheerio.load(post.html);

  post.profiles = getProfiles($);
  post.hovercards = getHovercards($);
  post.external_links = getHasExternalLinks($);
  post.permalink = getPermalink($);
  post.text = $.text();

  // console.log(JSON.stringify(post.hovercards));

  return post;
}

module.exports = {
  createPost,
  updatePost
};
