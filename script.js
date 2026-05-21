/* ==========================================================================
   PREMIUM INTERACTIONS - GASTROENTEROLOGY INSTITUTE OF SOUTHERN CALIFORNIA
   ========================================================================== */

// Add js-loaded immediately so CSS animations activate (prevents blank pages without JS)
document.documentElement.classList.add('js-loading');
document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('js-loaded');

  /* -----------------------------------------
     1. Sticky Glassmorphic Header
     ----------------------------------------- */
  const header = document.getElementById('mainHeader');
  
  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Trigger immediately in case page is refreshed scrolled down


  /* -----------------------------------------
     2. Mobile Drawer Navigation Menu
     ----------------------------------------- */
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  mobileMenuBtn.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    // Rotate hamburger icon slightly if needed, or simple visual toggle
    const isExpanded = navMenu.classList.contains('active');
    mobileMenuBtn.setAttribute('aria-expanded', isExpanded);
  });

  // Close drawer when any nav-link is clicked (for single page smooth scrolling)
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
      
      // Update active state class
      navLinks.forEach(item => item.classList.remove('active'));
      link.classList.add('active');
    });
  });


  /* -----------------------------------------
     3. Active Nav Link on Scroll Indicator
     ----------------------------------------- */
  const sections = document.querySelectorAll('section');
  
  const activeScrollIndicator = () => {
    let currentSectionId = 'home';
    const scrollPosition = window.scrollY + 200; // Offset for header height
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', activeScrollIndicator);


  /* -----------------------------------------
     4. Interactive Testimonial Slider
     ----------------------------------------- */
  const track = document.getElementById('testimonialTrack');
  const dots = document.querySelectorAll('.slider-dot');
  let currentSlide = 0;
  let autoplayInterval;

  const updateSlider = (index) => {
    currentSlide = index;
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    // Update dots active class
    dots.forEach((dot, idx) => {
      if (idx === currentSlide) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  };

  // Add click events to dots
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      updateSlider(index);
      resetAutoplay();
    });
  });

  // Autoplay functionality
  const startAutoplay = () => {
    autoplayInterval = setInterval(() => {
      let nextSlide = (currentSlide + 1) % dots.length;
      updateSlider(nextSlide);
    }, 6000); // 6 seconds slide duration
  };

  const resetAutoplay = () => {
    clearInterval(autoplayInterval);
    startAutoplay();
  };

  if (track && dots.length > 0) {
    startAutoplay();
  }


  /* -----------------------------------------
     5. Conditions Accordion Toggle Interaction
     ----------------------------------------- */
  const accordionItems = document.querySelectorAll('.condition-accordion-item');

  accordionItems.forEach(item => {
    const headerElement = item.querySelector('.condition-header');
    const contentElement = item.querySelector('.condition-content');

    headerElement.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close all other items
      accordionItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          otherItem.querySelector('.condition-content').style.maxHeight = '0';
        }
      });

      // Toggle current item
      if (isActive) {
        item.classList.remove('active');
        contentElement.style.maxHeight = '0';
      } else {
        item.classList.add('active');
        // Calculate exact scrollHeight of the inner content for fluid CSS animation
        const contentHeight = contentElement.querySelector('.condition-content-inner').scrollHeight;
        contentElement.style.maxHeight = `${contentHeight + 40}px`; // Add padding offset
      }
    });
  });


  /* -----------------------------------------
     6. Custom Form Floating-Labels & Validation
     ----------------------------------------- */
  const form = document.getElementById('bookingForm');
  const successOverlay = document.getElementById('successOverlay');

  if (form) {
    const nameInput = document.getElementById('formName');
    const emailInput = document.getElementById('formEmail');
    const phoneInput = document.getElementById('formPhone');
    const messageInput = document.getElementById('formMessage');

    // Simple validation helpers
    const validateEmail = (email) => {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(String(email).toLowerCase());
    };

    const validatePhone = (phone) => {
      // Basic phone validation (at least 10 digits)
      const cleaned = phone.replace(/\D/g, '');
      return cleaned.length >= 10;
    };

    const setError = (element, isError) => {
      const group = element.closest('.form-group');
      if (group) {
        if (isError) {
          group.classList.add('error');
        } else {
          group.classList.remove('error');
        }
      }
    };

    // Live validation on blur
    const setupLiveValidation = (input, validationFn) => {
      if (!input) return;

      input.addEventListener('blur', () => {
        let isInvalid = false;
        if (input.value.trim() === '') {
          isInvalid = true;
        } else if (validationFn) {
          isInvalid = !validationFn(input.value);
        }
        setError(input, isInvalid);
      });

      input.addEventListener('input', () => {
        // Clear error as user types
        setError(input, false);
      });
    };

    setupLiveValidation(nameInput);
    setupLiveValidation(emailInput, validateEmail);
    setupLiveValidation(phoneInput, validatePhone);
    setupLiveValidation(messageInput);

    // Form submit handler
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      let hasErrors = false;

      // Final check for all inputs
      if (!nameInput || nameInput.value.trim() === '') {
        setError(nameInput, true);
        hasErrors = true;
      }
      
      if (!emailInput || !validateEmail(emailInput.value)) {
        setError(emailInput, true);
        hasErrors = true;
      }

      if (!phoneInput || !validatePhone(phoneInput.value)) {
        setError(phoneInput, true);
        hasErrors = true;
      }

      if (!messageInput || messageInput.value.trim() === '') {
        setError(messageInput, true);
        hasErrors = true;
      }

      if (!hasErrors && successOverlay) {
        successOverlay.classList.add('active');
        
        form.reset();
        
        setTimeout(() => {
          successOverlay.classList.remove('active');
        }, 7000);
      } else if (hasErrors) {
        const firstError = form.querySelector('.form-group.error .form-input');
        if (firstError) {
          firstError.focus();
        }
      }
    });
  }


  /* -----------------------------------------
     7. Scroll-Entrance Animations (IntersectionObserver)
     ----------------------------------------- */
  const animatedElements = document.querySelectorAll('.fade-up-element');

  if ('IntersectionObserver' in window) {
    const elementObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // Unobserve so it only animates once
        }
      });
    }, {
      root: null, // Viewport
      threshold: 0.1, // Trigger when 10% of element is visible
      rootMargin: '0px 0px -50px 0px' // Trigger slightly before it fully appears
    });

    animatedElements.forEach(el => {
      elementObserver.observe(el);
    });
  } else {
    animatedElements.forEach(el => {
      el.classList.add('visible');
    });
  }

});
