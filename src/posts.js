const loki = require('lokijs');

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
    .data();
}

function add(newPosts) {
  newPosts.forEach(newPost => {
    let existingPost = posts.findOne({ id: newPost.id });

    if (existingPost) {
      console.log('Updating post', newPost.id);
      posts.update(newPost);
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
