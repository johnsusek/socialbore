let loki = require('lokijs');

let db;
let posts;

function init() {
  return new Promise(resolve => {
    db = new loki('loki.json', {
      autosave: true,
      autosaveInterval: 4000,
      autoload: true,
      autoloadCallback: () => {
        posts = db.getCollection('posts');
        if (posts === null) {
          posts = db.addCollection('posts', { indices: ['id'] });
        }
        resolve(db);
      }
    });
  });
}

// This gets called by the daemon, when it closes
function finish() {
  db.saveDatabase();
  db.close();
}

function recent() {
  return posts
    .chain()
    .simplesort('dataset.timestamp')
    .limit(50)
    .data();
}

function add(newPosts) {
  newPosts.forEach(newPost => {
    if (!newPost.permalink) return;

    let existingPost = posts.findOne({ id: newPost.id });

    if (existingPost) {
      existingPost.profiles = newPost.profiles;
      existingPost.hovercards = newPost.hovercards;
      existingPost.permalink = newPost.permalink;
      existingPost.html = newPost.html;
      existingPost.title = newPost.title;
      posts.update(existingPost);
    } else {
      console.log('Adding post', newPost.id);
      posts.add(newPost);
    }
  });
}

module.exports = {
  add,
  recent,
  init,
  finish
};
