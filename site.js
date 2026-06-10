(function() {
  const page = document.body.dataset.page;

  function inject(url, selector, position) {
    fetch(url)
      .then(r => r.text())
      .then(html => {
        const target = document.querySelector(selector);
        if (position === 'before') target.insertAdjacentHTML('beforebegin', html);
        if (position === 'after')  target.insertAdjacentHTML('afterend', html);

        // highlight active nav link
        if (page) {
          const link = document.querySelector(`.main-nav a[data-page="${page}"]`);
          if (link) link.classList.add('active');
        }
      });
  }

  inject('/_header.html', 'main', 'before');
  inject('/_footer.html', 'main', 'after');
})();