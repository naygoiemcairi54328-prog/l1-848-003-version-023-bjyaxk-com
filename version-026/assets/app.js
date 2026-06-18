(function () {
  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  ready(function () {
    initNavigation();
    initHeroCarousel();
    initSearchForms();
    initSearchPage();
    initPlayers();
  });

  function initNavigation() {
    var toggle = document.querySelector('[data-nav-toggle]');
    var menu = document.querySelector('[data-nav-menu]');
    if (!toggle || !menu) {
      return;
    }
    toggle.addEventListener('click', function () {
      menu.classList.toggle('is-open');
    });
  }

  function initHeroCarousel() {
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-hero-card]'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
    if (!cards.length) {
      return;
    }
    var current = 0;
    var timer = null;

    function show(index) {
      current = (index + cards.length) % cards.length;
      cards.forEach(function (card, cardIndex) {
        card.classList.toggle('is-active', cardIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    }

    function play() {
      clearInterval(timer);
      timer = setInterval(function () {
        show(current + 1);
      }, 5200);
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        show(index);
        play();
      });
    });

    show(0);
    play();
  }

  function initSearchForms() {
    var forms = Array.prototype.slice.call(document.querySelectorAll('[data-search-form]'));
    forms.forEach(function (form) {
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        var input = form.querySelector('input[name="q"]');
        var query = input ? input.value.trim() : '';
        var base = form.getAttribute('data-search-target') || 'search.html';
        window.location.href = base + (query ? '?q=' + encodeURIComponent(query) : '');
      });
    });
  }

  function initSearchPage() {
    var resultBox = document.querySelector('[data-search-results]');
    if (!resultBox || !window.MOVIE_INDEX) {
      return;
    }
    var input = document.querySelector('[data-search-input]');
    var yearSelect = document.querySelector('[data-search-year]');
    var typeSelect = document.querySelector('[data-search-type]');
    var note = document.querySelector('[data-search-note]');
    var params = new URLSearchParams(window.location.search);
    var initialQuery = params.get('q') || '';
    if (input) {
      input.value = initialQuery;
    }

    function card(movie) {
      return [
        '<article class="movie-card">',
        '  <a class="card-cover" href="' + movie.href + '">',
        '    <div class="poster poster-card">',
        '      <img src="' + movie.cover + '" alt="' + escapeHtml(movie.title) + '" loading="lazy" onerror="this.remove();">',
        '      <div class="poster-fallback"><span>' + escapeHtml(movie.title) + '</span></div>',
        '    </div>',
        '    <span class="score-badge">' + movie.hotScore + '</span>',
        '  </a>',
        '  <div class="card-body">',
        '    <h3><a href="' + movie.href + '">' + escapeHtml(movie.title) + '</a></h3>',
        '    <div class="meta-line"><span>' + escapeHtml(movie.year) + '</span><span>' + escapeHtml(movie.region) + '</span><span>' + escapeHtml(movie.type) + '</span></div>',
        '    <p>' + escapeHtml(movie.oneLine || movie.genre) + '</p>',
        '    <a class="text-link" href="' + movie.href + '">查看详情</a>',
        '  </div>',
        '</article>'
      ].join('');
    }

    function runSearch() {
      var query = input ? input.value.trim().toLowerCase() : '';
      var year = yearSelect ? yearSelect.value : '';
      var type = typeSelect ? typeSelect.value : '';
      var list = window.MOVIE_INDEX.filter(function (movie) {
        var haystack = [movie.title, movie.region, movie.type, movie.year, movie.genre, movie.tags, movie.oneLine].join(' ').toLowerCase();
        var matchesQuery = !query || haystack.indexOf(query) >= 0;
        var matchesYear = !year || String(movie.year) === year;
        var matchesType = !type || movie.type.indexOf(type) >= 0;
        return matchesQuery && matchesYear && matchesType;
      }).slice(0, 120);

      if (note) {
        note.textContent = '共找到 ' + list.length + ' 条匹配结果，最多展示前 120 条。';
      }
      resultBox.innerHTML = list.length ? list.map(card).join('') : '<div class="empty-state">没有找到匹配内容，请换一个关键词。</div>';
    }

    [input, yearSelect, typeSelect].forEach(function (element) {
      if (element) {
        element.addEventListener('input', runSearch);
        element.addEventListener('change', runSearch);
      }
    });
    runSearch();
  }

  function initPlayers() {
    var players = Array.prototype.slice.call(document.querySelectorAll('[data-player]'));
    players.forEach(function (wrap) {
      var video = wrap.querySelector('video');
      var button = wrap.querySelector('[data-play-button]');
      if (!video) {
        return;
      }
      var source = video.getAttribute('data-src');

      function load() {
        if (!source || video.getAttribute('data-loaded') === 'true') {
          return;
        }
        if (window.Hls && window.Hls.isSupported()) {
          var hls = new window.Hls();
          hls.loadSource(source);
          hls.attachMedia(video);
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = source;
        } else {
          video.src = source;
        }
        video.setAttribute('data-loaded', 'true');
      }

      if (button) {
        button.addEventListener('click', function () {
          load();
          button.classList.add('is-hidden');
          var promise = video.play();
          if (promise && typeof promise.catch === 'function') {
            promise.catch(function () {
              button.classList.remove('is-hidden');
            });
          }
        });
      }

      video.addEventListener('play', function () {
        if (button) {
          button.classList.add('is-hidden');
        }
      });
    });
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
})();
