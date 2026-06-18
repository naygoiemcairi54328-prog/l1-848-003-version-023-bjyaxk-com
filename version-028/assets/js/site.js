import { H as Hls } from './hls.js';

const body = document.body;
const basePath = body ? body.dataset.base || './' : './';

const searchToggle = document.querySelector('[data-search-toggle]');
const searchPanel = document.querySelector('[data-search-panel]');
const menuToggle = document.querySelector('[data-menu-toggle]');
const mobilePanel = document.querySelector('[data-mobile-panel]');

if (searchToggle && searchPanel) {
  searchToggle.addEventListener('click', () => {
    searchPanel.classList.toggle('is-open');
    if (mobilePanel) {
      mobilePanel.classList.remove('is-open');
    }
  });
}

if (menuToggle && mobilePanel) {
  menuToggle.addEventListener('click', () => {
    mobilePanel.classList.toggle('is-open');
    if (searchPanel) {
      searchPanel.classList.remove('is-open');
    }
  });
}

document.querySelectorAll('[data-header-search]').forEach((form) => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const input = form.querySelector('input[name="q"]');
    const query = input ? input.value.trim() : '';
    const target = `${basePath}search.html${query ? `?q=${encodeURIComponent(query)}` : ''}`;
    window.location.href = target;
  });
});

const hero = document.querySelector('[data-hero]');
if (hero) {
  const slides = Array.from(hero.querySelectorAll('[data-hero-slide]'));
  const dots = Array.from(hero.querySelectorAll('[data-hero-dot]'));
  let current = 0;

  const activate = (index) => {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle('is-active', slideIndex === current);
    });
    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle('is-active', dotIndex === current);
    });
  };

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => activate(index));
  });

  if (slides.length > 1) {
    window.setInterval(() => activate(current + 1), 5200);
  }
}

const normalize = (value) => String(value || '').trim().toLowerCase();

const filterCards = (cards, query, filters = {}) => {
  const keyword = normalize(query);
  let visibleCount = 0;

  cards.forEach((card) => {
    const searchText = normalize([
      card.dataset.title,
      card.dataset.year,
      card.dataset.region,
      card.dataset.type,
      card.dataset.category,
      card.dataset.tags,
      card.textContent,
    ].join(' '));

    const matchesKeyword = !keyword || searchText.includes(keyword);
    const matchesYear = !filters.year || card.dataset.year === filters.year;
    const matchesType = !filters.type || card.dataset.type === filters.type;
    const matchesRegion = !filters.region || card.dataset.region === filters.region;
    const matchesCategory = !filters.category || card.dataset.category === filters.category;
    const visible = matchesKeyword && matchesYear && matchesType && matchesRegion && matchesCategory;

    card.classList.toggle('is-hidden', !visible);
    if (visible) {
      visibleCount += 1;
    }
  });

  return visibleCount;
};

document.querySelectorAll('[data-filter-scope]').forEach((scope) => {
  const input = scope.querySelector('[data-local-filter]');
  const count = scope.querySelector('[data-filter-count]');
  const cards = Array.from(document.querySelectorAll('[data-card]'));

  const run = () => {
    const visible = filterCards(cards, input ? input.value : '');
    if (count) {
      count.textContent = `${visible} 部`;
    }
  };

  if (input) {
    input.addEventListener('input', run);
  }
});

const advancedSearch = document.querySelector('[data-advanced-search]');
if (advancedSearch) {
  const input = advancedSearch.querySelector('[data-search-input]');
  const year = advancedSearch.querySelector('[data-year-filter]');
  const type = advancedSearch.querySelector('[data-type-filter]');
  const region = advancedSearch.querySelector('[data-region-filter]');
  const category = advancedSearch.querySelector('[data-category-filter]');
  const count = advancedSearch.querySelector('[data-search-count]');
  const cards = Array.from(document.querySelectorAll('[data-card]'));
  const params = new URLSearchParams(window.location.search);
  const initialQuery = params.get('q') || '';

  if (input) {
    input.value = initialQuery;
  }

  const run = () => {
    const visible = filterCards(cards, input ? input.value : '', {
      year: year ? year.value : '',
      type: type ? type.value : '',
      region: region ? region.value : '',
      category: category ? category.value : '',
    });
    if (count) {
      count.textContent = `${visible} 部`;
    }
  };

  [input, year, type, region, category].forEach((control) => {
    if (control) {
      control.addEventListener('input', run);
      control.addEventListener('change', run);
    }
  });

  run();
}

document.querySelectorAll('[data-player]').forEach((player) => {
  const video = player.querySelector('video');
  const cover = player.querySelector('.player-cover');
  const url = player.dataset.videoSrc;
  let connected = false;
  let hls = null;

  const connect = () => {
    if (!video || !url || connected) {
      return;
    }

    connected = true;

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = url;
      return;
    }

    if (Hls && Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
      });
      hls.loadSource(url);
      hls.attachMedia(video);
      return;
    }

    video.src = url;
  };

  const play = () => {
    connect();
    if (cover) {
      cover.hidden = true;
    }
    if (video) {
      video.controls = true;
      const promise = video.play();
      if (promise && typeof promise.catch === 'function') {
        promise.catch(() => {});
      }
    }
  };

  if (cover) {
    cover.addEventListener('click', play);
  }

  if (video) {
    video.addEventListener('click', () => {
      if (!connected) {
        play();
      }
    });
  }

  window.addEventListener('beforeunload', () => {
    if (hls) {
      hls.destroy();
    }
  });
});
