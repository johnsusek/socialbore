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

function finish() {
  db.saveDatabase();
}

function onFacebookPostCreate(post) {
  posts.insert(post);
}

function onFacebookPostUpdate(id, html, text) {
  let post = posts.findOne({ id });
  if (!post) return;

  post.html = html;
  post.text = text;

  posts.update(post);
}

module.exports = {
  init,
  finish,
  onFacebookPostCreate,
  onFacebookPostUpdate
};
