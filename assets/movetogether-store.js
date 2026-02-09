// MoveTogether Store JavaScript
document.addEventListener('DOMContentLoaded', function() {

  // Hero slider dots (Homepage)
  const heroDots = document.querySelectorAll('.hero-dots .dot');
  if (heroDots.length > 0) {
    heroDots.forEach((dot, index) => {
      dot.addEventListener('click', function() {
        heroDots.forEach(d => d.classList.remove('active'));
        dot.classList.add('active');
        // Add slide change logic here if multiple slides
      });
    });
  }

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

  // Sticky buy button visibility
  const stickyButton = document.querySelector('.sticky-buy-button');
  if (stickyButton) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 100) {
        stickyButton.classList.add('visible');
      } else {
        stickyButton.classList.remove('visible');
      }
    });
  }

  // Product card hover effects
  const productCards = document.querySelectorAll('.product-card');
  productCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-5px)';
    });
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
    });
  });

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

  // Mobile menu toggle (if you add a mobile menu)
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (mobileMenuToggle && mobileMenu) {
    mobileMenuToggle.addEventListener('click', function() {
      mobileMenu.classList.toggle('active');
      this.classList.toggle('active');
    });
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

// Utility function for debouncing
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
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
