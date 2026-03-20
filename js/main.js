/* ==========================================================
   Emmanuel Dental & Orthodontics — Main JavaScript
   Vanilla JS + jQuery/Owl Carousel
   ========================================================== */

document.addEventListener('DOMContentLoaded', function () {

  /* --------------------------------------------------------
     1. Mobile Navigation Toggle
     -------------------------------------------------------- */
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileNavOverlay = document.querySelector('.mobile-nav__overlay');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav__link, .mobile-nav__sub-link, .mobile-nav__sub-sub-link, .mobile-nav__cta .btn');

  function openMobileNav() {
    if (!hamburger || !mobileNav) return;
    hamburger.classList.add('hamburger--active');
    mobileNav.classList.add('mobile-nav--open');
    if (mobileNavOverlay) mobileNavOverlay.classList.add('mobile-nav__overlay--visible');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileNav() {
    if (!hamburger || !mobileNav) return;
    hamburger.classList.remove('hamburger--active');
    mobileNav.classList.remove('mobile-nav--open');
    if (mobileNavOverlay) mobileNavOverlay.classList.remove('mobile-nav__overlay--visible');
    document.body.style.overflow = '';
  }

  if (hamburger) {
    hamburger.addEventListener('click', function () {
      if (mobileNav && mobileNav.classList.contains('mobile-nav--open')) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });
  }

  // Close on overlay tap
  if (mobileNavOverlay) {
    mobileNavOverlay.addEventListener('click', closeMobileNav);
  }

  // Close mobile menu when any link inside it is clicked
  mobileNavLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      closeMobileNav();
    });
  });

  /* --------------------------------------------------------
     2. Mobile Dropdown Toggles (sub-menus)
     -------------------------------------------------------- */
  const mobileDropdownToggles = document.querySelectorAll('.mobile-nav__link[data-dropdown]');

  mobileDropdownToggles.forEach(function (toggle) {
    toggle.addEventListener('click', function (e) {
      e.preventDefault();
      const submenu = this.nextElementSibling;
      if (submenu && submenu.classList.contains('mobile-nav__sub')) {
        submenu.classList.toggle('mobile-nav__sub--open');
        // Rotate chevron icon if present
        const icon = this.querySelector('i');
        if (icon) icon.classList.toggle('rotate-180');
      }
    });
  });

  /* Sub-sub-dropdown toggles (nested Services menus) */
  const mobileSubDropdownToggles = document.querySelectorAll('.mobile-nav__sub-link[data-sub-dropdown]');

  mobileSubDropdownToggles.forEach(function (toggle) {
    toggle.addEventListener('click', function (e) {
      e.preventDefault();
      const submenu = this.nextElementSibling;
      if (submenu && submenu.classList.contains('mobile-nav__sub-sub')) {
        submenu.classList.toggle('mobile-nav__sub-sub--open');
        this.classList.toggle('mobile-nav__sub-link--open');
      }
    });
  });

  /* --------------------------------------------------------
     3. Sticky Header / Shadow on Scroll
     -------------------------------------------------------- */
  const header = document.querySelector('.header');
  const infoBar = document.querySelector('.info-bar');

  function handleHeaderScroll() {
    if (!header) return;
    let triggerPoint = 0;
    if (infoBar) triggerPoint = infoBar.offsetHeight;

    if (window.scrollY > triggerPoint) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
  }

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll(); // set initial state

  /* --------------------------------------------------------
     4. Smooth Scroll for Anchor Links
     -------------------------------------------------------- */
  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (!targetEl) return;

      e.preventDefault();
      const headerOffset = (header ? header.offsetHeight : 0) + (infoBar ? infoBar.offsetHeight : 0);
      const targetPosition = targetEl.getBoundingClientRect().top + window.scrollY - headerOffset;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    });
  });

  /* --------------------------------------------------------
     5. Desktop Dropdown Menus (handled via CSS :hover, but
        adding keyboard accessibility + aria for a11y)
     -------------------------------------------------------- */
  const navItems = document.querySelectorAll('.nav__item');

  navItems.forEach(function (item) {
    const link = item.querySelector('.nav__link');
    const dropdown = item.querySelector('.nav__dropdown');
    if (!link || !dropdown) return;

    // Keyboard: open on Enter/Space, close on Escape
    link.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        dropdown.classList.add('nav__dropdown--open');
      }
    });

    item.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        dropdown.classList.remove('nav__dropdown--open');
        link.focus();
      }
    });

    // Remove open class when mouse leaves so CSS :hover rules take over
    item.addEventListener('mouseleave', function () {
      dropdown.classList.remove('nav__dropdown--open');
    });
  });

  /* --------------------------------------------------------
     6. Statistics Counter Animation
     -------------------------------------------------------- */
  let counterAnimated = false;

  function animateCounters() {
    const counters = document.querySelectorAll('.stat-item__number');
    if (!counters.length) return;

    counters.forEach(function (counter) {
      const target = parseInt(counter.getAttribute('data-target'), 10);
      if (isNaN(target)) return;

      let current = 0;
      // Scale duration so small numbers don't feel sluggish
      const duration = 2000; // ms
      const stepTime = 16;   // ~60 fps
      const totalSteps = Math.ceil(duration / stepTime);
      const increment = target / totalSteps;

      const suffix = counter.querySelector('.stat-item__suffix');

      function updateCounter() {
        current += increment;
        if (current >= target) {
          current = target;
          counter.childNodes[0].textContent = target.toLocaleString();
          return;
        }
        counter.childNodes[0].textContent = Math.floor(current).toLocaleString();
        requestAnimationFrame(updateCounter);
      }

      // Set initial value to 0 (preserve the suffix span)
      counter.childNodes[0].textContent = '0';
      requestAnimationFrame(updateCounter);
    });
  }

  // Trigger when stats section scrolls into view
  const statsSection = document.querySelector('.stats');

  if (statsSection && 'IntersectionObserver' in window) {
    const statsObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !counterAnimated) {
          counterAnimated = true;
          animateCounters();
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    statsObserver.observe(statsSection);
  }

  /* --------------------------------------------------------
     7. Scroll Reveal Animations (IntersectionObserver)
     -------------------------------------------------------- */
  const revealElements = document.querySelectorAll('.animate-on-scroll');

  if (revealElements.length && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-on-scroll--visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });
  }

  // Also support generic 'reveal' class for flexibility
  const revealGeneric = document.querySelectorAll('.reveal');

  if (revealGeneric.length && 'IntersectionObserver' in window) {
    const genericObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          genericObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealGeneric.forEach(function (el) {
      genericObserver.observe(el);
    });
  }

  /* --------------------------------------------------------
     8. Before / After Slider
     -------------------------------------------------------- */
  const baSliders = document.querySelectorAll('.ba-slider');
  let activeSlider = null;  // tracks which slider is being dragged
  let activeSliderRect = null;

  function getPositionPercent(clientX) {
    if (!activeSliderRect) return 50;
    let percent = ((clientX - activeSliderRect.left) / activeSliderRect.width) * 100;
    if (percent < 0) percent = 0;
    if (percent > 100) percent = 100;
    return percent;
  }

  function updateSlider(slider, percent) {
    const beforePane = slider.querySelector('.ba-slider__before');
    const handle = slider.querySelector('.ba-slider__handle');
    if (beforePane) beforePane.style.clipPath = 'inset(0 ' + (100 - percent) + '% 0 0)';
    if (handle) handle.style.left = percent + '%';
  }

  baSliders.forEach(function (slider) {
    const beforePane = slider.querySelector('.ba-slider__before');
    const handle = slider.querySelector('.ba-slider__handle');
    if (!beforePane || !handle) return;

    slider.addEventListener('mousedown', function (e) {
      e.preventDefault();
      activeSlider = slider;
      activeSliderRect = slider.getBoundingClientRect();
      updateSlider(slider, getPositionPercent(e.clientX));
    });

    slider.addEventListener('touchstart', function (e) {
      activeSlider = slider;
      activeSliderRect = slider.getBoundingClientRect();
      updateSlider(slider, getPositionPercent(e.touches[0].clientX));
    }, { passive: true });
  });

  // Single set of global move/end listeners
  document.addEventListener('mousemove', function (e) {
    if (!activeSlider) return;
    updateSlider(activeSlider, getPositionPercent(e.clientX));
  });

  document.addEventListener('mouseup', function () {
    activeSlider = null;
    activeSliderRect = null;
  });

  document.addEventListener('touchmove', function (e) {
    if (!activeSlider) return;
    updateSlider(activeSlider, getPositionPercent(e.touches[0].clientX));
  }, { passive: true });

  document.addEventListener('touchend', function () {
    activeSlider = null;
    activeSliderRect = null;
  });

  /* --------------------------------------------------------
     9. Service Card "Read More" Toggle (event delegation for
        Owl Carousel clones)
     -------------------------------------------------------- */
  document.addEventListener('click', function (e) {
    var toggle = e.target.closest('.service-card__toggle');
    if (!toggle) return;
    e.preventDefault();
    var extraContent = toggle.nextElementSibling;
    if (extraContent && extraContent.classList.contains('service-card__extra')) {
      extraContent.classList.toggle('service-card__extra--open');
      toggle.classList.toggle('active');
    }
  });

  /* --------------------------------------------------------
     10. Back to Top Button
     -------------------------------------------------------- */
  const backToTopBtn = document.querySelector('.back-to-top');

  if (backToTopBtn) {
    function toggleBackToTop() {
      if (window.scrollY > 400) {
        backToTopBtn.classList.add('back-to-top--visible');
      } else {
        backToTopBtn.classList.remove('back-to-top--visible');
      }
    }

    window.addEventListener('scroll', toggleBackToTop, { passive: true });
    toggleBackToTop(); // set initial state

    backToTopBtn.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* --------------------------------------------------------
     11. NexHealth Widget Integration
     -------------------------------------------------------- */
  function openNexHealthScheduler() {
    if (typeof NexHealth !== 'undefined' && NexHealth.open) {
      NexHealth.open();
    } else if (window.nexhealthScheduleUrl) {
      window.open(window.nexhealthScheduleUrl, '_blank', 'noopener');
    }
  }

  const scheduleBtns = document.querySelectorAll('[data-schedule], .btn--schedule');

  scheduleBtns.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      openNexHealthScheduler();
    });
  });

  // Expose globally so inline onclick handlers can also use it
  window.openNexHealthScheduler = openNexHealthScheduler;

  /* --------------------------------------------------------
     12. Active Nav Link Highlighting on Scroll
     -------------------------------------------------------- */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link');

  function highlightActiveNav() {
    if (!sections.length || !navLinks.length) return;

    const scrollY = window.scrollY;
    const headerHeight = (header ? header.offsetHeight : 0) + (infoBar ? infoBar.offsetHeight : 0);

    sections.forEach(function (section) {
      const sectionTop = section.offsetTop - headerHeight - 100;
      const sectionBottom = sectionTop + section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionBottom) {
        navLinks.forEach(function (link) {
          link.classList.remove('nav__link--active');
          const href = link.getAttribute('href');
          if (href === '#' + sectionId) {
            link.classList.add('nav__link--active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', highlightActiveNav, { passive: true });
  highlightActiveNav(); // set initial state

  /* --------------------------------------------------------
     13. Owl Carousel Initialization (jQuery)
     -------------------------------------------------------- */
  if (typeof jQuery !== 'undefined') {
    jQuery(document).ready(function ($) {

      // Services Carousel
      if ($('.services-carousel').length) {
        $('.services-carousel').owlCarousel({
          loop: true,
          margin: 20,
          nav: true,
          dots: true,
          autoplay: true,
          autoplayTimeout: 4000,
          autoplayHoverPause: true,
          navText: ['<i class="fas fa-chevron-left"></i>', '<i class="fas fa-chevron-right"></i>'],
          responsive: {
            0: { items: 1 },
            768: { items: 2 },
            992: { items: 3 }
          }
        });
      }

      // Testimonials Carousel
      if ($('.testimonials-carousel').length) {
        $('.testimonials-carousel').owlCarousel({
          loop: true,
          margin: 20,
          nav: true,
          dots: true,
          autoplay: true,
          autoplayTimeout: 5000,
          autoplayHoverPause: true,
          navText: ['<i class="fas fa-chevron-left"></i>', '<i class="fas fa-chevron-right"></i>'],
          responsive: {
            0: { items: 1 },
            768: { items: 2 },
            992: { items: 3 }
          }
        });
      }

      // Footer Team Carousel
      if ($('.footer-team-carousel').length) {
        $('.footer-team-carousel').owlCarousel({
          loop: true,
          margin: 15,
          nav: false,
          dots: true,
          autoplay: true,
          autoplayTimeout: 5000,
          smartSpeed: 1500,
          autoplayHoverPause: true,
          responsive: {
            0: { items: 1 },
            768: { items: 2 },
            992: { items: 4 }
          }
        });
      }

      // Instagram Feed Carousel (auto-slide)
      if ($('.instagram-carousel').length) {
        $('.instagram-carousel').owlCarousel({
          loop: true,
          margin: 10,
          nav: true,
          dots: true,
          autoplay: true,
          autoplayTimeout: 3000,
          autoplayHoverPause: true,
          smartSpeed: 800,
          navText: ['<i class="fas fa-chevron-left"></i>', '<i class="fas fa-chevron-right"></i>'],
          responsive: {
            0: { items: 1 },
            576: { items: 2 },
            768: { items: 3 },
            992: { items: 4 }
          }
        });
      }

      // TikTok Feed Carousel (auto-slide)
      if ($('.tiktok-carousel').length) {
        $('.tiktok-carousel').owlCarousel({
          loop: true,
          margin: 15,
          nav: true,
          dots: true,
          autoplay: true,
          autoplayTimeout: 4000,
          autoplayHoverPause: true,
          smartSpeed: 800,
          navText: ['<i class="fas fa-chevron-left"></i>', '<i class="fas fa-chevron-right"></i>'],
          responsive: {
            0: { items: 1 },
            768: { items: 2 },
            992: { items: 3 }
          }
        });
      }

      // Photo Gallery Carousel (auto-slide)
      if ($('.photo-gallery__carousel').length) {
        $('.photo-gallery__carousel').owlCarousel({
          loop: true,
          margin: 15,
          nav: true,
          dots: true,
          autoplay: true,
          autoplayTimeout: 3000,
          autoplayHoverPause: true,
          smartSpeed: 800,
          navText: ['<i class="fas fa-chevron-left"></i>', '<i class="fas fa-chevron-right"></i>'],
          responsive: {
            0: { items: 1 },
            576: { items: 2 },
            992: { items: 3 }
          }
        });
      }


    });
  }

  /* --------------------------------------------------------
     14. Welcome "Read More" Toggle
     -------------------------------------------------------- */
  const readMoreBtn = document.getElementById('welcome-read-more-btn');
  const readMoreContent = document.getElementById('welcome-read-more-content');

  if (readMoreBtn && readMoreContent) {
    readMoreBtn.addEventListener('click', function () {
      const isOpen = readMoreContent.classList.toggle('welcome__extra--open');
      if (isOpen) {
        readMoreBtn.innerHTML = '<i class="fas fa-minus-circle"></i> Read Less';
      } else {
        readMoreBtn.innerHTML = '<i class="fas fa-plus-circle"></i> Read More';
      }
    });
  }

  /* --------------------------------------------------------
     15. Photo Gallery Lightbox
     -------------------------------------------------------- */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxVideo = document.getElementById('lightbox-video');
  const lightboxClose = document.querySelector('.lightbox__close');
  const lightboxPrev = document.querySelector('.lightbox__prev');
  const lightboxNext = document.querySelector('.lightbox__next');
  const galleryItems = document.querySelectorAll('[data-lightbox]');
  let currentLightboxIndex = 0;
  let lightboxMode = 'gallery'; // 'gallery', 'footer', or 'video'

  function openLightbox(index) {
    if (!lightbox || !lightboxImg || !galleryItems.length) return;
    lightboxMode = 'gallery';
    currentLightboxIndex = index;
    lightboxImg.src = galleryItems[index].href;
    lightbox.classList.add('lightbox--open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('lightbox--open', 'lightbox--video');
    document.body.style.overflow = '';
    if (lightboxVideo) {
      lightboxVideo.pause();
      lightboxVideo.removeAttribute('src');
    }
  }

  function showPrevImage() {
    if (lightboxMode === 'footer') {
      var sources = getFooterSliderSources();
      currentFooterLightboxIndex = (currentFooterLightboxIndex - 1 + sources.length) % sources.length;
      lightboxImg.src = sources[currentFooterLightboxIndex];
    } else {
      currentLightboxIndex = (currentLightboxIndex - 1 + galleryItems.length) % galleryItems.length;
      lightboxImg.src = galleryItems[currentLightboxIndex].href;
    }
  }

  function showNextImage() {
    if (lightboxMode === 'footer') {
      var sources = getFooterSliderSources();
      currentFooterLightboxIndex = (currentFooterLightboxIndex + 1) % sources.length;
      lightboxImg.src = sources[currentFooterLightboxIndex];
    } else {
      currentLightboxIndex = (currentLightboxIndex + 1) % galleryItems.length;
      lightboxImg.src = galleryItems[currentLightboxIndex].href;
    }
  }

  galleryItems.forEach(function (item, index) {
    item.addEventListener('click', function (e) {
      e.preventDefault();
      openLightbox(index);
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', showPrevImage);
  if (lightboxNext) lightboxNext.addEventListener('click', showNextImage);

  if (lightbox) {
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('lightbox--open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showPrevImage();
      if (e.key === 'ArrowRight') showNextImage();
    });
  }

  /* --------------------------------------------------------
     16. Footer Slider Lightbox (event delegation for Owl clones)
     -------------------------------------------------------- */
  var footerSliderSources = [];
  var currentFooterLightboxIndex = 0;

  function getFooterSliderSources() {
    var els = document.querySelectorAll('.footer-team-carousel .owl-item:not(.cloned) [data-lightbox-footer]');
    if (els.length) {
      footerSliderSources = Array.from(els).map(function (el) { return el.getAttribute('href'); });
    }
    return footerSliderSources;
  }

  function openFooterLightbox(src) {
    if (!lightbox || !lightboxImg) return;
    lightboxMode = 'footer';
    var sources = getFooterSliderSources();
    currentFooterLightboxIndex = sources.indexOf(src);
    if (currentFooterLightboxIndex === -1) currentFooterLightboxIndex = 0;
    lightboxImg.src = src;
    lightbox.classList.add('lightbox--open');
    document.body.style.overflow = 'hidden';
  }

  document.addEventListener('click', function (e) {
    var link = e.target.closest('[data-lightbox-footer]');
    if (link) {
      e.preventDefault();
      openFooterLightbox(link.getAttribute('href'));
    }
  });

  /* --------------------------------------------------------
     17. TikTok Video Lightbox
     -------------------------------------------------------- */
  document.addEventListener('click', function (e) {
    var card = e.target.closest('[data-lightbox-video]');
    if (card && lightbox && lightboxVideo) {
      e.preventDefault();
      var videoSrc = card.getAttribute('data-lightbox-video');
      lightboxMode = 'video';
      lightboxVideo.src = videoSrc;
      lightbox.classList.add('lightbox--open', 'lightbox--video');
      lightboxVideo.play();
      document.body.style.overflow = 'hidden';
    }
  });

}); // end DOMContentLoaded
