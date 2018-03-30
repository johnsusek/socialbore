function postObserver(page) {
  page.evaluateOnNewDocument(() => {
    let postCreateObserver = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (
          mutation.target.dataset &&
          mutation.target.dataset.dedupekey &&
          mutation.oldValue &&
          mutation.oldValue.startsWith('{')
        ) {
          let post = {
            id: mutation.target.dataset.dedupekey,
            dataset: Object.assign({}, mutation.target.dataset),
            meta: JSON.parse(mutation.oldValue),
            html: mutation.target.innerHTML,
            text: mutation.target.innerText
          };

          // This function is how the data gets sent from this script, which is run
          // in the context of the page, to the socialbore node script.
          // onFacebookPostCreate is exposed to the page from the node script.
          window.onFacebookPostCreate(post);
        }
      });
    });

    postCreateObserver.observe(document, {
      attributeFilter: ['data-ft'],
      attributeOldValue: true,
      attributes: true,
      subtree: true
    });

    let postUpdateObserver = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.target.dataset && mutation.target.dataset.dedupekey) {
          // This function is how the data gets sent from this script, which is run
          // in the context of the page, to the socialbore node script.
          window.onFacebookPostUpdate(
            mutation.target.dataset.dedupekey,
            mutation.target.innerHTML,
            mutation.target.innerText
          );
        }
      });
    });

    postUpdateObserver.observe(document, {
      subtree: true,
      childList: true
    });
  });
}

module.exports = {
  postObserver
};
