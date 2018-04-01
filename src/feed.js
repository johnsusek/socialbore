let RSS = require('rss');

let options = {
  title: 'Socialbore',
  description: 'An RSS feed generated from your social media by Socialbore',
  generator: 'Socialbore',
  docs: 'https://github.com/johnsusek/socialbore',
  ttl: 5,
  feed_url: 'http://127.0.0.1:3000',
  site_url: 'https://www.facebook.com/'
};

function xmlFromPosts(posts) {
  let feed = new RSS(options);

  posts.forEach(post => {
    feed.item({
      title: post.title,
      description: post.html,
      url: post.permalink,
      guid: post.id,
      author: post.hovercards ? post.hovercards[0] : '',
      date: post.dataset.timestamp * 1000
    });
  });

  return feed.xml({ indent: true });
}

module.exports = {
  xmlFromPosts
};
