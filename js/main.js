/* ==========================================================
   Emmanuel Dental & Orthodontics — Main JavaScript
   Vanilla JS · No dependencies
   ========================================================== */

document.addEventListener('DOMContentLoaded', function () {

  /* --------------------------------------------------------
     1. Mobile Navigation Toggle
     -------------------------------------------------------- */
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileNavOverlay = document.querySelector('.mobile-nav__overlay');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav__link, .mobile-nav__sub-link, .mobile-nav__cta .btn');

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
      const headerOffset = header ? header.offsetHeight : 0;
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
        dropdown.style.opacity = '1';
        dropdown.style.visibility = 'visible';
        dropdown.style.transform = 'translateY(0)';
      }
    });

    item.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        dropdown.style.opacity = '';
        dropdown.style.visibility = '';
        dropdown.style.transform = '';
        link.focus();
      }
    });

    // Reset inline styles when mouse leaves so CSS :hover rules take over
    item.addEventListener('mouseleave', function () {
      dropdown.style.opacity = '';
      dropdown.style.visibility = '';
      dropdown.style.transform = '';
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

  baSliders.forEach(function (slider) {
    const beforePane = slider.querySelector('.ba-slider__before');
    const handle = slider.querySelector('.ba-slider__handle');
    if (!beforePane || !handle) return;

    let isDragging = false;

    function getPositionPercent(clientX) {
      const rect = slider.getBoundingClientRect();
      let percent = ((clientX - rect.left) / rect.width) * 100;
      // Clamp between 0 and 100
      if (percent < 0) percent = 0;
      if (percent > 100) percent = 100;
      return percent;
    }

    function updateSlider(percent) {
      beforePane.style.clipPath = 'inset(0 ' + (100 - percent) + '% 0 0)';
      handle.style.left = percent + '%';
    }

    // Mouse events
    slider.addEventListener('mousedown', function (e) {
      e.preventDefault();
      isDragging = true;
      updateSlider(getPositionPercent(e.clientX));
    });

    document.addEventListener('mousemove', function (e) {
      if (!isDragging) return;
      e.preventDefault();
      updateSlider(getPositionPercent(e.clientX));
    });

    document.addEventListener('mouseup', function () {
      isDragging = false;
    });

    // Touch events
    slider.addEventListener('touchstart', function (e) {
      isDragging = true;
      updateSlider(getPositionPercent(e.touches[0].clientX));
    }, { passive: true });

    document.addEventListener('touchmove', function (e) {
      if (!isDragging) return;
      updateSlider(getPositionPercent(e.touches[0].clientX));
    }, { passive: true });

    document.addEventListener('touchend', function () {
      isDragging = false;
    });
  });

  /* --------------------------------------------------------
     9. Testimonial Slider / Carousel
     -------------------------------------------------------- */
  const testimonialTrack = document.querySelector('.testimonial-slider__track');
  const testimonialSlides = document.querySelectorAll('.testimonial-slide');
  const testimonialDots = document.querySelector('.testimonial-slider__dots');

  if (testimonialSlides.length > 0) {
    let currentSlide = 0;
    let autoplayTimer = null;
    const autoplayDelay = 5000;

    // Build dots dynamically
    if (testimonialDots) {
      testimonialSlides.forEach(function (_slide, index) {
        const dot = document.createElement('button');
        dot.classList.add('testimonial-slider__dot');
        dot.setAttribute('aria-label', 'Go to testimonial ' + (index + 1));
        if (index === 0) dot.classList.add('testimonial-slider__dot--active');
        dot.addEventListener('click', function () {
          goToSlide(index);
          resetAutoplay();
        });
        testimonialDots.appendChild(dot);
      });
    }

    const dots = document.querySelectorAll('.testimonial-slider__dot');

    function goToSlide(index) {
      testimonialSlides.forEach(function (slide) {
        slide.classList.remove('testimonial-slide--active');
        slide.style.opacity = '0';
        slide.style.position = 'absolute';
      });

      testimonialSlides[index].classList.add('testimonial-slide--active');
      testimonialSlides[index].style.opacity = '1';
      testimonialSlides[index].style.position = 'relative';

      dots.forEach(function (dot) {
        dot.classList.remove('testimonial-slider__dot--active');
      });
      if (dots[index]) dots[index].classList.add('testimonial-slider__dot--active');

      currentSlide = index;
    }

    function nextSlide() {
      let next = currentSlide + 1;
      if (next >= testimonialSlides.length) next = 0;
      goToSlide(next);
    }

    function resetAutoplay() {
      if (autoplayTimer) clearInterval(autoplayTimer);
      autoplayTimer = setInterval(nextSlide, autoplayDelay);
    }

    // Initialize first slide
    goToSlide(0);
    resetAutoplay();
  }

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
    const headerHeight = header ? header.offsetHeight : 0;

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

}); // end DOMContentLoaded
