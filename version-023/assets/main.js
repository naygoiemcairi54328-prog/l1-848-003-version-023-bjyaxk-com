(function () {
    var menuToggle = document.querySelector("[data-menu-toggle]");
    var mobileNav = document.querySelector("[data-mobile-nav]");
    if (menuToggle && mobileNav) {
        menuToggle.addEventListener("click", function () {
            mobileNav.classList.toggle("open");
        });
    }

    document.querySelectorAll("img[data-cover]").forEach(function (image) {
        image.addEventListener("error", function () {
            image.classList.add("cover-missing");
        });
    });

    var hero = document.querySelector("[data-hero]");
    if (hero) {
        var slides = Array.from(hero.querySelectorAll("[data-hero-slide]"));
        var dots = Array.from(hero.querySelectorAll("[data-hero-dot]"));
        var index = 0;
        var changeSlide = function (nextIndex) {
            index = nextIndex % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("active", slideIndex === index);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("active", dotIndex === index);
            });
        };
        dots.forEach(function (dot) {
            dot.addEventListener("click", function () {
                changeSlide(Number(dot.getAttribute("data-hero-dot")) || 0);
            });
        });
        if (slides.length > 1) {
            window.setInterval(function () {
                changeSlide(index + 1);
            }, 5200);
        }
    }

    var grid = document.querySelector("[data-filter-grid]");
    var input = document.querySelector("[data-page-search]");
    var year = document.querySelector("[data-filter-year]");
    if (grid) {
        var cards = Array.from(grid.querySelectorAll(".movie-card"));
        var params = new URLSearchParams(window.location.search);
        var query = params.get("q") || "";
        if (input && query) {
            input.value = query;
        }
        var applyFilter = function () {
            var text = input ? input.value.trim().toLowerCase() : "";
            var selectedYear = year ? year.value : "";
            cards.forEach(function (card) {
                var haystack = (card.getAttribute("data-search") || "").toLowerCase();
                var cardYear = card.getAttribute("data-year") || "";
                var visible = true;
                if (text && haystack.indexOf(text) === -1) {
                    visible = false;
                }
                if (selectedYear && cardYear !== selectedYear) {
                    visible = false;
                }
                card.classList.toggle("is-hidden-card", !visible);
            });
        };
        if (input) {
            input.addEventListener("input", applyFilter);
        }
        if (year) {
            year.addEventListener("change", applyFilter);
        }
        applyFilter();
    }
})();
