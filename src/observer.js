function observe(page) {
  page.evaluateOnNewDocument(() => {
    let postCreateObserver = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (
          mutation.target.dataset &&
          mutation.target.dataset.dedupekey &&
          mutation.oldValue &&
          mutation.oldValue.startsWith('{')
        ) {
          window.onFacebookPostCreate(
            mutation.target.innerHTML,
            mutation.target.dataset,
            mutation.oldValue
          );
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
          window.onFacebookPostUpdate(
            mutation.target.dataset.dedupekey,
            mutation.target.innerHTML,
            mutation.target.dataset
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
  observe
};
