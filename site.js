(function() {
  const page = document.body.dataset.page;
  const BASE = '/themusementarcade'; // change this to your repo name if different

  function inject(url, selector, position) {
    const candidates = [
      url,
      url.replace(/^\/+/, ''),          // relative no leading slash
      url.replace('/header.html', '/_header.html'),
      url.replace('/footer.html', '/_footer.html'),
      '/header.html', '/_header.html', '/footer.html', '/_footer.html',
      'header.html', '_header.html', 'footer.html', '_footer.html'
    ];

    function doInsert(html) {
      const target = document.querySelector(selector);
      if (!target) return;
      if (position === 'before') target.insertAdjacentHTML('beforebegin', html);
      else if (position === 'after') target.insertAdjacentHTML('afterend', html);

      // highlight active nav link
      if (page) {
        const link = document.querySelector(`.main-nav a[data-page="${page}"]`);
        if (link) link.classList.add('active');
      }
    }

    let tried = [];
    function tryNext() {
      if (!candidates.length) {
        console.warn('inject: no candidate partials found for', url, 'tried:', tried);
        return Promise.resolve();
      }
      const attempt = candidates.shift();
      tried.push(attempt);
      console.info('inject: trying', attempt);
      return fetch(attempt)
        .then(r => {
          if (!r.ok) throw new Error('status ' + r.status);
          return r.text();
        })
        .then(html => { doInsert(html); console.info('inject: succeeded for', attempt); })
        .catch(() => tryNext());
    }

    return tryNext();
  }

  // Use non-underscored partial names so static hosts (Github Pages/Jekyll) can serve them
  inject(BASE + '/header.html', 'main', 'before');
  inject(BASE + '/footer.html', 'main', 'after');
})();