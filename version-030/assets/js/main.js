(function () {
    const body = document.body;
    const menuToggle = document.querySelector('.menu-toggle');

    if (menuToggle) {
        menuToggle.addEventListener('click', function () {
            const opened = body.classList.toggle('nav-open');
            menuToggle.setAttribute('aria-expanded', opened ? 'true' : 'false');
        });
    }

    const slides = Array.from(document.querySelectorAll('.hero-slide'));
    const thumbs = Array.from(document.querySelectorAll('.hero-thumb'));
    let activeSlide = 0;
    let carouselTimer = null;

    function showSlide(index) {
        if (!slides.length) {
            return;
        }
        activeSlide = (index + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
            slide.classList.toggle('active', slideIndex === activeSlide);
        });
        thumbs.forEach(function (thumb, thumbIndex) {
            thumb.classList.toggle('active', thumbIndex === activeSlide);
        });
    }

    function startCarousel() {
        if (carouselTimer || slides.length < 2) {
            return;
        }
        carouselTimer = window.setInterval(function () {
            showSlide(activeSlide + 1);
        }, 5200);
    }

    thumbs.forEach(function (thumb, index) {
        thumb.addEventListener('click', function () {
            showSlide(index);
            if (carouselTimer) {
                window.clearInterval(carouselTimer);
                carouselTimer = null;
            }
            startCarousel();
        });
    });

    showSlide(0);
    startCarousel();

    const filterForm = document.querySelector('[data-filter-form]');
    if (filterForm) {
        const searchInput = filterForm.querySelector('[data-filter-search]');
        const yearSelect = filterForm.querySelector('[data-filter-year]');
        const categorySelect = filterForm.querySelector('[data-filter-category]');
        const regionSelect = filterForm.querySelector('[data-filter-region]');
        const cards = Array.from(document.querySelectorAll('[data-card]'));
        const noResult = document.querySelector('[data-no-result]');

        function normalize(value) {
            return String(value || '').trim().toLowerCase();
        }

        function applyFilters() {
            const keyword = normalize(searchInput && searchInput.value);
            const year = normalize(yearSelect && yearSelect.value);
            const category = normalize(categorySelect && categorySelect.value);
            const region = normalize(regionSelect && regionSelect.value);
            let visible = 0;

            cards.forEach(function (card) {
                const text = normalize(card.textContent + ' ' + card.dataset.title + ' ' + card.dataset.genre);
                const matchesKeyword = !keyword || text.includes(keyword);
                const matchesYear = !year || normalize(card.dataset.year) === year;
                const matchesCategory = !category || normalize(card.dataset.category) === category;
                const matchesRegion = !region || normalize(card.dataset.region).includes(region);
                const show = matchesKeyword && matchesYear && matchesCategory && matchesRegion;
                card.style.display = show ? '' : 'none';
                if (show) {
                    visible += 1;
                }
            });

            if (noResult) {
                noResult.style.display = visible ? 'none' : 'block';
            }
        }

        [searchInput, yearSelect, categorySelect, regionSelect].forEach(function (control) {
            if (control) {
                control.addEventListener('input', applyFilters);
                control.addEventListener('change', applyFilters);
            }
        });

        applyFilters();
    }
})();
