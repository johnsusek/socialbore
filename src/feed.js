const RSS = require('rss');

let options = {
  title: 'Socialbore',
  feed_url: 'http://127.0.0.1:3000',
  site_url: 'https://www.facebook.com/'
};

function xmlFromPosts(posts) {
  let feed = new RSS(options);

  posts.forEach(post => {
    feed.item({
      title: post.permalink,
      description: post.html,
      url: post.permalink,
      guid: post.id,
      date: post.dataset.timestamp * 1000
    });
  });

  return feed.xml({ indent: true });
}

module.exports = {
  xmlFromPosts
};
