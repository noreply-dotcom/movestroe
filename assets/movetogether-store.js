// MoveTogether Store JavaScript

// Utility function for debouncing (defined first so it's available everywhere)
function debounce(func, wait) {
  var timeout;
  return function executedFunction() {
    var context = this;
    var args = arguments;
    var later = function() {
      clearTimeout(timeout);
      func.apply(context, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

document.addEventListener('DOMContentLoaded', function() {

  // Hero Crossfade Slider
  (function() {
    var heroSection = document.querySelector('.hero-section');
    if (!heroSection) return;

    var slides = heroSection.querySelectorAll('.hero-slide');
    var dots = heroSection.querySelectorAll('.hero-dots .dot');
    var prevBtn = heroSection.querySelector('.hero-arrow--prev');
    var nextBtn = heroSection.querySelector('.hero-arrow--next');
    var currentSlide = 0;
    var slideCount = slides.length;
    var autoplayInterval = null;
    var autoplayDelay = 6000;
    var isTransitioning = false;

    function goToSlide(index) {
      if (isTransitioning || index === currentSlide) return;
      isTransitioning = true;

      slides[currentSlide].classList.remove('active');
      dots[currentSlide].classList.remove('active');

      currentSlide = (index + slideCount) % slideCount;

      slides[currentSlide].classList.add('active');
      dots[currentSlide].classList.add('active');

      setTimeout(function() {
        isTransitioning = false;
      }, 800);
    }

    function nextSlide() {
      goToSlide(currentSlide + 1);
    }

    function prevSlide() {
      goToSlide(currentSlide - 1);
    }

    function startAutoplay() {
      stopAutoplay();
      autoplayInterval = setInterval(nextSlide, autoplayDelay);
    }

    function stopAutoplay() {
      if (autoplayInterval) {
        clearInterval(autoplayInterval);
        autoplayInterval = null;
      }
    }

    // Arrow navigation
    if (prevBtn) {
      prevBtn.addEventListener('click', function() {
        prevSlide();
        startAutoplay();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function() {
        nextSlide();
        startAutoplay();
      });
    }

    // Dot navigation
    dots.forEach(function(dot, index) {
      dot.addEventListener('click', function() {
        goToSlide(index);
        startAutoplay();
      });
    });

    // Touch/swipe support
    var touchStartX = 0;
    var touchEndX = 0;

    heroSection.addEventListener('touchstart', function(e) {
      touchStartX = e.changedTouches[0].screenX;
      stopAutoplay();
    }, { passive: true });

    heroSection.addEventListener('touchend', function(e) {
      touchEndX = e.changedTouches[0].screenX;
      var diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      }
      startAutoplay();
    }, { passive: true });

    // Pause autoplay on hover (desktop only)
    if (window.matchMedia('(hover: hover)').matches) {
      heroSection.addEventListener('mouseenter', stopAutoplay);
      heroSection.addEventListener('mouseleave', startAutoplay);
    }

    // Keyboard navigation
    heroSection.setAttribute('tabindex', '0');
    heroSection.addEventListener('keydown', function(e) {
      if (e.key === 'ArrowLeft') {
        prevSlide();
        startAutoplay();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
        startAutoplay();
      }
    });

    // Start autoplay
    if (slideCount > 1) {
      startAutoplay();
    }
  })();

  // Color selector (Product Page)
  const colorOptions = document.querySelectorAll('.color-option');
  if (colorOptions.length > 0) {
    colorOptions.forEach(option => {
      option.addEventListener('click', function() {
        // Remove active from all color options in the same container
        const container = this.parentElement;
        container.querySelectorAll('.color-option').forEach(opt => {
          opt.classList.remove('active');
        });
        this.classList.add('active');

        // Update main product image based on color selection (if needed)
        const color = this.dataset.color;
        console.log('Selected color:', color);
        // Add logic to change product image based on color
      });
    });
  }

  // Sticky buy button visibility (debounced)
  const stickyButton = document.querySelector('.sticky-buy-button');
  if (stickyButton) {
    var stickyVisible = false;
    window.addEventListener('scroll', debounce(function() {
      var shouldShow = window.scrollY > 100;
      if (shouldShow !== stickyVisible) {
        stickyVisible = shouldShow;
        if (shouldShow) {
          stickyButton.classList.add('visible');
        } else {
          stickyButton.classList.remove('visible');
        }
      }
    }, 50));
  }

  // Product card hover effects (only on non-touch devices)
  if (window.matchMedia('(hover: hover)').matches) {
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
      card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px)';
      });
      card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
      });
    });
  }

  // FAQ accordion is handled by HTML5 details/summary elements

  // Newsletter form submission
  const newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const email = this.querySelector('input[type="email"]').value;
      console.log('Newsletter signup:', email);
      // Add newsletter signup logic here
      alert('Thank you for subscribing!');
      this.reset();
    });
  }

  // Add to cart functionality (basic)
  const buyButtons = document.querySelectorAll('.buy-now-btn');
  buyButtons.forEach(btn => {
    btn.addEventListener('click', function(e) {
      // If it's not in a form, handle as JS action
      if (!this.closest('form')) {
        e.preventDefault();
        console.log('Adding to cart...');
        // Add your cart logic here
        alert('Added to cart!');
      }
    });
  });

  // Image gallery functionality (if multiple images)
  const galleryThumbs = document.querySelectorAll('.gallery-thumb');
  const mainImage = document.getElementById('mainImage');

  if (galleryThumbs.length > 0 && mainImage) {
    galleryThumbs.forEach(thumb => {
      thumb.addEventListener('click', function() {
        mainImage.src = this.dataset.fullsize || this.src;
        galleryThumbs.forEach(t => t.classList.remove('active'));
        this.classList.add('active');
      });
    });
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Initialize any sliders/carousels
  initializeSliders();

  // Mobile menu toggle
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (mobileMenuToggle && mobileMenu) {
    // Create overlay element for closing menu by tapping outside
    var overlay = document.createElement('div');
    overlay.className = 'mobile-menu-overlay';
    document.body.appendChild(overlay);

    function openMobileMenu() {
      mobileMenu.classList.add('active');
      mobileMenuToggle.classList.add('active');
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeMobileMenu() {
      mobileMenu.classList.remove('active');
      mobileMenuToggle.classList.remove('active');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }

    mobileMenuToggle.addEventListener('click', function() {
      if (mobileMenu.classList.contains('active')) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    overlay.addEventListener('click', closeMobileMenu);

    // Close menu on window resize to desktop
    window.addEventListener('resize', debounce(function() {
      if (window.innerWidth > 768 && mobileMenu.classList.contains('active')) {
        closeMobileMenu();
      }
    }, 150));
  }
});

// Slider initialization function
function initializeSliders() {
  const sliders = document.querySelectorAll('.slider');

  sliders.forEach(slider => {
    const slides = slider.querySelectorAll('.slide');
    const dots = slider.querySelectorAll('.dot');
    let currentSlide = 0;

    function showSlide(n) {
      slides.forEach((slide, index) => {
        slide.style.display = index === n ? 'block' : 'none';
      });

      if (dots.length > 0) {
        dots.forEach((dot, index) => {
          dot.classList.toggle('active', index === n);
        });
      }
    }

    // Auto-advance slider
    if (slides.length > 1) {
      setInterval(() => {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
      }, 5000);
    }

    // Initialize first slide
    if (slides.length > 0) {
      showSlide(0);
    }
  });
}

// Product variant selector (for Shopify integration)
function updateProductVariant(variantId) {
  // Update hidden input for variant ID
  const variantInput = document.querySelector('input[name="id"]');
  if (variantInput) {
    variantInput.value = variantId;
  }

  // Update price display
  // This would integrate with Shopify's variant pricing
  console.log('Updated variant:', variantId);
}

// Lazy loading images
if ('IntersectionObserver' in window) {
  const lazyImages = document.querySelectorAll('img[data-lazy]');

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.lazy;
        img.removeAttribute('data-lazy');
        observer.unobserve(img);
      }
    });
  });

  lazyImages.forEach(img => imageObserver.observe(img));
}
