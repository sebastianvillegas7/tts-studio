(function ($) {
   "use strict";
    const $window = $(window);
    const CONFIG = { mobileBreakpoint: 768, formAction: "form-process.php" };

    // Preloader
    $window.on("load", () => setTimeout(() => $(".sis-preloader").fadeOut(1000), 700));

    // Sticky Header
    if ($('.sis-active-sticky-header').length) {

		const $window = $(window);
		const $mainHeader = $(".sis-main-header");
		const $stickyHeader = $('header .sis-header-sticky');

		function setHeaderHeight() {
			$mainHeader.css("height", $stickyHeader.outerHeight());
		}

		$window.on('resize', setHeaderHeight);

		$stickyHeader.removeClass("active hide");

		$window.on("scroll", function () {
			var fromTop = $window.scrollTop();
			setHeaderHeight();

			var siteHeaderHeight = $mainHeader.outerHeight();

			if (fromTop > siteHeaderHeight) {
				$stickyHeader.addClass("active").removeClass("hide");
			} else {
				$stickyHeader.removeClass("active hide");
			}
		});
	}

    // Mobile Menu
    const initialMenuItems = $('#menu > li').toArray();
    const initialMenu2Items = $('#menu2 > li').toArray();
    const handleMobileMenus = () => {
        const isMobile = $window.width() <= CONFIG.mobileBreakpoint;
        const hasSlickNav = $(".slicknav_nav").length;

        if (isMobile && !hasSlickNav && $.fn.slicknav) {
            $("#menu2").children().appendTo("#menu");
            $("#menu").slicknav({ label: "", prependTo: ".responsive-menu" });
        } else if (!isMobile && hasSlickNav) {
            $("#menu").slicknav("destroy");
            initialMenuItems.forEach(item => $("#menu").append(item));
            initialMenu2Items.forEach(item => $("#menu2").append(item));
        }
    };
    handleMobileMenus();
    let resizeTimer;
    $window.on("resize", () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(handleMobileMenus, 200); });

    // Active Navigation
    $(() => {
        let page = location.pathname.split("/").pop().toLowerCase() || "index.html";
        document.querySelectorAll("#sisf-page-header .nav-link").forEach(link => {
            const href = (link.getAttribute("href") || "").split("/").pop().toLowerCase() || "index.html";
            if (href === page) {
                link.classList.add("active");
                let parent = link.closest("li.submenu");
                while (parent) {
                    parent.querySelector(":scope > .nav-link")?.classList.add("active");
                    parent = parent.parentElement.closest("li.submenu");
                }
            }
        });
    });

    // Skills Progress Bar
    if ($.fn.waypoint && $('.sis-skills-progress-bar').length) {
        let animated = false;
        $('.sis-skills-progress-bar').waypoint(() => {
            if (animated) return;
            animated = true;
            $('.sis-skillbar').each(function () {
                const $this = $(this);
                const percent = parseInt($this.attr('data-percent'), 10) || 0;
                const $bar = $this.find('.sis-count-bar');
                const $text = $this.find('.sis-skill-no');

                $bar.css('width', '0%').animate({ width: percent + '%' }, 2000, 'swing');
                $({ value: 0 }).animate({ value: percent }, { duration: 2000, easing: 'swing', step: val => $text.text(Math.ceil(val) + '%') });
            });
        }, { offset: '50%' });
    }

     // GSAP Reveal & Text Animations
    if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
        gsap.registerPlugin(ScrollTrigger);

        document.querySelectorAll(".sis-reveal").forEach(container => {
            const image = container.querySelector("img"); if (!image) return;
            const tl = gsap.timeline({ scrollTrigger: { trigger: container, toggleActions: "play none none none" } });
            tl.set(container, { autoAlpha: 1 });
            tl.from(container, { xPercent: -100, duration: 1, ease: "power2.out" });
            tl.from(image, { xPercent: 100, duration: 1, delay: -1, scale: 1, ease: "power2.out" });
        });

        ['.sis-text-anime-style-1', '.sis-text-anime-style-3'].forEach(selector => {
            document.querySelectorAll(selector).forEach(element => {
                const split = new SplitText(element, { type: selector === '.sis-text-anime-style-1' ? "chars, words" : "chars, words" });
                gsap.from(selector === '.sis-text-anime-style-1' ? split.words : split.chars, {
                    duration: 1, delay: selector === '.sis-text-anime-style-1' ? 0.5 : 0.2, x: selector === '.sis-text-anime-style-1' ? 20 : 40,
                    autoAlpha: 0, stagger: selector === '.sis-text-anime-style-1' ? 0.05 : 0.03, ease: "power2.out",
                    scrollTrigger: { trigger: element, start: "top 85%" }
                });
            });
        });
    }

    // Animation On Scroll Js
    AOS.init();

    // Counter Up
    if ($.fn.counterUp && $('.sis-counter').length) $('.sis-counter').counterUp({ delay: 6, time: 3000 });

    // Back to Top
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        $window.on('scroll', () => backToTop.classList.toggle('show', window.scrollY > 300));
        backToTop.addEventListener('click', e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); });
    }

    // Forms
    if ($.fn.validator && $("#enquiryForm").length) {
        $("#enquiryForm").validator({ focus: false }).on("submit", e => {
            if (!e.isDefaultPrevented()) { e.preventDefault(); submitForm($(e.target)); }
        });
    }
    function submitForm($form) {
        $.post(CONFIG.formAction, $form.serialize(), response => {
            if (response?.trim() === "success") { $form[0].reset(); showMsg(true, "Booking email sent successfully!"); }
            else showMsg(false, response || "Something went wrong.");
        });
    }
    function showMsg(valid, msg) { $("#msgSubmit").removeClass().addClass(valid ? "text-success" : "text-danger").text(msg); }

    /* Initialize Swiper Sliders */
    const initSwiper = (selector, options) => {
        if ($(selector).length) {
            return new Swiper(selector, options);
        }
        return null;
    };

	const swiperOptions = {
        slidesPerView: 1,
        speed: 1000,
        loop: true,
        autoplay: { delay: 5000 },
    };

    // Three Slide Per View - Swiper Slider Js
    initSwiper(".comman-swiper-slider .swiper", {
        ...swiperOptions,
        spaceBetween: 20,
        navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" },
        breakpoints: { 0: { slidesPerView: 1 }, 768: { slidesPerView: 2, centeredSlides: false }, 1024: { slidesPerView: 3 } }
    });

    // Five Slide Per View - Swiper Slider Js
    initSwiper(".comman-swiper--slider .swiper", {
        ...swiperOptions,
        spaceBetween: 20,
        navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" },
        breakpoints: { 0: { slidesPerView: 2 }, 768: { slidesPerView: 2, centeredSlides: false }, 1024: { slidesPerView: 5 } }
    });

    // Hero Slider Start 
	function animateActiveSlideText() {
        gsap.set(".sis-text-anime-style-2", { clearProps: "all" });

        const activeSlide = document.querySelector(".swiper-slide-active");
        const animatedTextElements = activeSlide.querySelectorAll(".sis-text-anime-style-2");

        animatedTextElements.forEach((element) => {
            const animationSplitText = new SplitText(element, { type: "chars, words" });

            gsap.from(animationSplitText.chars, {
				opacity: 0,
                duration: 0.11,         
				delay: 0.14,
				x: 250,                 
				autoAlpha: 0,
				stagger: 0.09,         
				ease: "power5.out",
            });
        });
    }
    
	initSwiper(".hero-slider-layout .swiper", {
        ...swiperOptions,
        autoplay: { delay: 6000 },
        pagination: { el: ".hero-pagination", clickable: true },
        navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" },
		on: {
			init: function () {
				animateActiveSlideText(); 
			},
			slideChangeTransitionStart: function () {
				animateActiveSlideText(); 
			}
		}
    });
    // Hero Slider End

    // Magnific Popup - Gallery
    if ($.fn.magnificPopup && $('.sis-gallery-items').length) {
        $('.sis-gallery-items').magnificPopup({
            delegate: 'a', type: 'image', closeOnContentClick: false, closeBtnInside: false,
            mainClass: 'mfp-with-zoom', image: { verticalFit: true }, gallery: { enabled: true },
            zoom: { enabled: true, duration: 300, opener: el => el.find('img') }
        });
    }

    /* Comparision Slider JS */
        function initComparisons() {
    const overlays = document.getElementsByClassName("sis-img-comparition-overlay");

    for (let i = 0; i < overlays.length; i++) {
        compareImages(overlays[i]);
    }

    function compareImages(img) {
        let slider, clicked = false;
        let container = img.parentElement;
        let w = container.offsetWidth;
        let h = container.offsetHeight;

        // start 50%
        img.style.height = (h / 2) + "px";

        slider = document.createElement("DIV");
        slider.className = "img-comp-slider";
        container.insertBefore(slider, img);

        function setPosition(y) {
        img.style.height = y + "px";
        slider.style.top = (y - slider.offsetHeight / 2) + "px";
        slider.style.left = (w / 2 - slider.offsetWidth / 2) + "px";
        }

        setPosition(h / 2);

        slider.addEventListener("mousedown", slideReady);
        slider.addEventListener("touchstart", slideReady);
        window.addEventListener("mouseup", slideFinish);
        window.addEventListener("touchend", slideFinish);

        function slideReady(e) {
        e.preventDefault();
        clicked = true;
        window.addEventListener("mousemove", slideMove);
        window.addEventListener("touchmove", slideMove);
        }

        function slideFinish() {
        clicked = false;
        window.removeEventListener("mousemove", slideMove);
        window.removeEventListener("touchmove", slideMove);
        }

        function slideMove(e) {
        if (!clicked) return;
        let pos = getCursorPos(e);
        if (pos < 0) pos = 0;
        if (pos > h) pos = h;
        setPosition(pos);
        }

        function getCursorPos(e) {
        e = e.changedTouches ? e.changedTouches[0] : e;
        let rect = container.getBoundingClientRect();
        return e.clientY - rect.top;
        }

        // Responsive resize
        window.addEventListener("resize", function () {
        w = container.offsetWidth;
        h = container.offsetHeight;
        setPosition(h / 2);
        });
    }
    }

    window.addEventListener("load", initComparisons);

    // Magnific Popup - Video
    if ($.fn.magnificPopup && $('.popup-video').length) {
        $('.popup-video').magnificPopup({
            type: 'iframe', mainClass: 'mfp-fade', removalDelay: 160, preloader: false, fixedContentPos: true,
            callbacks: {
                open: function () {
                    const videoSrc = $.magnificPopup.instance.currItem.src;
                    setTimeout(() => {
                        const content = document.querySelector('.mfp-content'); if (!content) return;
                        const iframe = content.querySelector('iframe'); if (iframe) iframe.remove();
                        const video = document.createElement('video');
                        video.src = videoSrc; video.autoplay = true; video.muted = true;
                        video.controls = true; video.playsInline = true;
                        video.style.width = '100%'; video.style.height = 'auto';
                        video.addEventListener('click', e => e.stopPropagation());
                        content.appendChild(video); video.play().catch(() => {});
                    }, 50);
                },
                close: function () {
                    const video = document.querySelector('.mfp-content video');
                    if (video) { video.pause(); video.remove(); }
                }
            }
        });
    }

    /* Product Quantity Plus Minus JS */
	$(document).on("click", ".sisf-quantity-minus, .sisf-quantity-plus", function (e) {
        e.preventDefault();
        const $button = $(this);
        const $inputField = $button.siblings(".sisf-quantity-input");
        const step = parseFloat($inputField.data("step")) || 1;
        const max = parseFloat($inputField.data("max"));
        const min = parseFloat($inputField.data("min")) || 1;
        let inputValue = parseFloat($inputField.val()) || min;

        inputValue = $button.hasClass("sisf-quantity-minus") ? Math.max(min, inputValue - step) : (Number.isNaN(max) ? inputValue + step : Math.min(max, inputValue + step));
        $inputField.val(inputValue).trigger("change");
    });

})(jQuery);