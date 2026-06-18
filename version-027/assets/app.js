(function () {
    var navToggle = document.querySelector('[data-nav-toggle]');
    var siteNav = document.querySelector('[data-site-nav]');

    if (navToggle && siteNav) {
        navToggle.addEventListener('click', function () {
            siteNav.classList.toggle('is-open');
        });
    }

    function normalize(value) {
        return String(value || '').toLowerCase().trim();
    }

    function applyFilters(targetSelector) {
        var target = document.querySelector(targetSelector);
        if (!target) {
            return;
        }

        var searchInput = document.querySelector('[data-card-search][data-target="' + targetSelector + '"]');
        var yearSelect = document.querySelector('[data-year-filter][data-target="' + targetSelector + '"]');
        var keyword = searchInput ? normalize(searchInput.value) : '';
        var year = yearSelect ? normalize(yearSelect.value) : '';
        var cards = target.querySelectorAll('[data-card]');

        cards.forEach(function (card) {
            var searchText = normalize(card.getAttribute('data-search'));
            var cardYear = normalize(card.getAttribute('data-year'));
            var keywordMatched = !keyword || searchText.indexOf(keyword) !== -1;
            var yearMatched = !year || cardYear.indexOf(year) !== -1;
            card.classList.toggle('is-hidden', !(keywordMatched && yearMatched));
        });
    }

    document.querySelectorAll('[data-card-search], [data-year-filter]').forEach(function (control) {
        var targetSelector = control.getAttribute('data-target');
        if (!targetSelector) {
            return;
        }

        control.addEventListener('input', function () {
            applyFilters(targetSelector);
        });

        control.addEventListener('change', function () {
            applyFilters(targetSelector);
        });
    });

    document.querySelectorAll('[data-hero-slider]').forEach(function (slider) {
        var slides = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-dot]'));
        var activeIndex = 0;

        function showSlide(index) {
            activeIndex = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === activeIndex);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === activeIndex);
            });
        }

        dots.forEach(function (dot, index) {
            dot.addEventListener('click', function () {
                showSlide(index);
            });
        });

        if (slides.length > 1) {
            window.setInterval(function () {
                showSlide(activeIndex + 1);
            }, 5600);
        }
    });

    window.initMoviePlayer = function (videoId, streamUrl, buttonId, coverId) {
        var video = document.getElementById(videoId);
        var button = document.getElementById(buttonId);
        var cover = document.getElementById(coverId);
        var ready = false;
        var hlsInstance = null;

        if (!video || !streamUrl) {
            return;
        }

        function attachStream() {
            if (ready) {
                return;
            }

            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = streamUrl;
            } else if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({ enableWorker: true });
                hlsInstance.loadSource(streamUrl);
                hlsInstance.attachMedia(video);
            } else {
                video.src = streamUrl;
            }

            ready = true;
        }

        function start() {
            attachStream();
            video.controls = true;
            if (cover) {
                cover.classList.add('hidden');
            }
            var playPromise = video.play();
            if (playPromise && typeof playPromise.catch === 'function') {
                playPromise.catch(function () {});
            }
        }

        if (button) {
            button.addEventListener('click', start);
        }

        if (cover) {
            cover.addEventListener('click', start);
        }

        video.addEventListener('click', function () {
            if (video.paused) {
                start();
            }
        });

        window.addEventListener('beforeunload', function () {
            if (hlsInstance && typeof hlsInstance.destroy === 'function') {
                hlsInstance.destroy();
            }
        });
    };
})();
