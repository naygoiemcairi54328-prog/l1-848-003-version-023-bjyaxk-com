(function() {
    function runWhenReady(fn) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', fn);
            return;
        }
        fn();
    }

    runWhenReady(function() {
        var toggle = document.querySelector('[data-menu-toggle]');
        var mobileNav = document.querySelector('[data-mobile-nav]');
        if (toggle && mobileNav) {
            toggle.addEventListener('click', function() {
                mobileNav.classList.toggle('is-open');
            });
        }

        var sliders = document.querySelectorAll('[data-hero-slider]');
        sliders.forEach(function(slider) {
            var slides = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-slide]'));
            var dots = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-dot]'));
            if (!slides.length) {
                return;
            }
            var index = 0;
            function show(nextIndex) {
                index = (nextIndex + slides.length) % slides.length;
                slides.forEach(function(slide, i) {
                    slide.classList.toggle('is-active', i === index);
                });
                dots.forEach(function(dot, i) {
                    dot.classList.toggle('is-active', i === index);
                });
            }
            dots.forEach(function(dot, i) {
                dot.addEventListener('click', function() {
                    show(i);
                });
            });
            setInterval(function() {
                show(index + 1);
            }, 5000);
        });

        var filterLists = document.querySelectorAll('[data-filter-list]');
        filterLists.forEach(function(list) {
            var root = list.closest('main') || document;
            var input = root.querySelector('[data-filter-input]');
            var year = root.querySelector('[data-year-filter]');
            var type = root.querySelector('[data-type-filter]');
            var cards = Array.prototype.slice.call(list.querySelectorAll('[data-card]'));
            function applyFilter() {
                var query = input ? input.value.trim().toLowerCase() : '';
                var yearValue = year ? year.value : '';
                var typeValue = type ? type.value : '';
                cards.forEach(function(card) {
                    var haystack = [
                        card.getAttribute('data-title') || '',
                        card.getAttribute('data-year') || '',
                        card.getAttribute('data-genre') || '',
                        card.getAttribute('data-region') || '',
                        card.getAttribute('data-type') || '',
                        card.textContent || ''
                    ].join(' ').toLowerCase();
                    var matchQuery = !query || haystack.indexOf(query) !== -1;
                    var matchYear = !yearValue || (card.getAttribute('data-year') || '').indexOf(yearValue) !== -1;
                    var matchType = !typeValue || (card.getAttribute('data-type') || '') === typeValue;
                    card.classList.toggle('hidden-card', !(matchQuery && matchYear && matchType));
                });
            }
            if (input) {
                input.addEventListener('input', applyFilter);
            }
            if (year) {
                year.addEventListener('change', applyFilter);
            }
            if (type) {
                type.addEventListener('change', applyFilter);
            }
        });
    });
}());
