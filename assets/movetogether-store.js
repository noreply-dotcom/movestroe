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

  // Add to cart handled by AJAX cart system below

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

  // ===== MOBILE MENU with drill-down panels =====
  (function() {
    var mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    var mobileMenu = document.querySelector('.mobile-menu');
    if (!mobileMenuToggle || !mobileMenu) return;

    var panels = mobileMenu.querySelectorAll('.mobile-panel');
    var mainPanel = mobileMenu.querySelector('[data-panel="main"]');

    // Create overlay
    var menuOverlay = document.createElement('div');
    menuOverlay.className = 'mobile-menu-overlay';
    document.body.appendChild(menuOverlay);

    function openMobileMenu() {
      mobileMenu.classList.add('active');
      mobileMenuToggle.classList.add('active');
      menuOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
      // Always reset to main panel on open
      showPanel('main');
    }

    function closeMobileMenu() {
      mobileMenu.classList.remove('active');
      mobileMenuToggle.classList.remove('active');
      menuOverlay.classList.remove('active');
      document.body.style.overflow = '';
      // Reset panels after transition
      setTimeout(function() {
        showPanel('main');
      }, 350);
    }

    function showPanel(panelName) {
      panels.forEach(function(panel) {
        if (panel.getAttribute('data-panel') === panelName) {
          panel.classList.add('active');
        } else {
          panel.classList.remove('active');
        }
      });
    }

    // Hamburger toggle
    mobileMenuToggle.addEventListener('click', function() {
      if (mobileMenu.classList.contains('active')) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    // Overlay click closes menu
    menuOverlay.addEventListener('click', closeMobileMenu);

    // Drill-down: items with children navigate to sub-panels
    var navItemsWithChildren = mobileMenu.querySelectorAll('.mobile-nav-item.has-children');
    navItemsWithChildren.forEach(function(item) {
      item.addEventListener('click', function() {
        var targetPanel = this.getAttribute('data-target');
        if (targetPanel) {
          showPanel(targetPanel);
        }
      });
    });

    // Back buttons return to target panel
    var backButtons = mobileMenu.querySelectorAll('.mobile-back-btn');
    backButtons.forEach(function(btn) {
      btn.addEventListener('click', function() {
        var targetPanel = this.getAttribute('data-target');
        if (targetPanel) {
          showPanel(targetPanel);
        }
      });
    });

    // Close menu on Escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
        closeMobileMenu();
      }
    });

    // Close menu on resize to desktop
    window.addEventListener('resize', debounce(function() {
      if (window.innerWidth > 768 && mobileMenu.classList.contains('active')) {
        closeMobileMenu();
      }
    }, 150));
  })();

  // ===== AJAX CART SYSTEM =====
  (function() {
    var cartDrawer = document.getElementById('cart-drawer');
    var cartBody = document.getElementById('cart-drawer-body');
    var cartFooter = document.getElementById('cart-drawer-footer');
    var cartTotalEl = document.getElementById('cart-drawer-total');
    var cartCountEl = document.querySelector('.cart-drawer-count');
    var cartToggle = document.querySelector('.cart-toggle');
    var cartClose = document.querySelector('.cart-drawer-close');
    var headerCartCount = document.querySelector('.cart-count');
    if (!cartDrawer) return;

    // Create overlay
    var cartOverlay = document.createElement('div');
    cartOverlay.className = 'cart-overlay';
    document.body.appendChild(cartOverlay);

    // --- Drawer open/close ---
    function openCartDrawer() {
      cartDrawer.classList.add('active');
      cartOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeCartDrawer() {
      cartDrawer.classList.remove('active');
      cartOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }

    if (cartToggle) {
      cartToggle.addEventListener('click', function(e) {
        e.preventDefault();
        fetchAndRenderCart();
        openCartDrawer();
      });
    }

    if (cartClose) cartClose.addEventListener('click', closeCartDrawer);
    cartOverlay.addEventListener('click', closeCartDrawer);
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && cartDrawer.classList.contains('active')) closeCartDrawer();
    });

    // --- Format money (cents to dollar string) ---
    function formatMoney(cents) {
      return '$' + (cents / 100).toFixed(2);
    }

    // --- Update cart count badge in header ---
    function updateCartCount(count) {
      if (!headerCartCount) {
        // Create badge if not exists
        if (count > 0 && cartToggle) {
          headerCartCount = document.createElement('span');
          headerCartCount.className = 'cart-count';
          cartToggle.appendChild(headerCartCount);
        }
      }
      if (headerCartCount) {
        headerCartCount.textContent = count;
        headerCartCount.style.display = count > 0 ? 'flex' : 'none';
      }
      if (cartCountEl) {
        cartCountEl.textContent = count > 0 ? '(' + count + ')' : '';
      }
    }

    // --- Render cart drawer contents ---
    function renderCart(cart) {
      updateCartCount(cart.item_count);

      if (!cart.items || cart.items.length === 0) {
        cartBody.className = 'cart-drawer-body is-empty';
        cartBody.innerHTML =
          '<div class="cart-empty-state">' +
            '<h3>Your Cart is Empty</h3>' +
            '<p>There doesn\'t seem to be anything here.</p>' +
            '<a href="/collections/all" class="cart-start-shopping">Start Shopping</a>' +
          '</div>';
        if (cartFooter) cartFooter.style.display = 'none';
        return;
      }

      cartBody.className = 'cart-drawer-body';
      var html = '';
      cart.items.forEach(function(item) {
        var imgSrc = item.image ? item.image.replace(/(\.[^.]+)$/, '_200x$1') : '';
        var variantTitle = item.variant_title && item.variant_title !== 'Default Title' ? item.variant_title : '';
        html +=
          '<div class="cd-item" data-key="' + item.key + '">' +
            '<div class="cd-item-image">' +
              (imgSrc ? '<img src="' + imgSrc + '" alt="' + item.product_title + '" loading="lazy">' : '') +
            '</div>' +
            '<div class="cd-item-details">' +
              '<a href="' + item.url + '" class="cd-item-title">' + item.product_title + '</a>' +
              (variantTitle ? '<div class="cd-item-variant">' + variantTitle + '</div>' : '') +
              '<div class="cd-item-bottom">' +
                '<div class="cd-qty">' +
                  '<button type="button" data-action="minus" data-key="' + item.key + '" aria-label="Decrease">&minus;</button>' +
                  '<span>' + item.quantity + '</span>' +
                  '<button type="button" data-action="plus" data-key="' + item.key + '" aria-label="Increase">+</button>' +
                '</div>' +
                '<span class="cd-item-price">' + formatMoney(item.line_price) + '</span>' +
              '</div>' +
              '<button type="button" class="cd-item-remove" data-key="' + item.key + '">Remove</button>' +
            '</div>' +
          '</div>';
      });
      cartBody.innerHTML = html;

      // Show footer with totals
      if (cartFooter) {
        cartFooter.style.display = 'block';
        if (cartTotalEl) cartTotalEl.textContent = formatMoney(cart.total_price);
      }

      // Bind quantity and remove buttons
      cartBody.querySelectorAll('[data-action="minus"]').forEach(function(btn) {
        btn.addEventListener('click', function() {
          var key = this.getAttribute('data-key');
          var qtyEl = this.parentNode.querySelector('span');
          var qty = parseInt(qtyEl.textContent, 10) - 1;
          updateItem(key, Math.max(qty, 0));
        });
      });
      cartBody.querySelectorAll('[data-action="plus"]').forEach(function(btn) {
        btn.addEventListener('click', function() {
          var key = this.getAttribute('data-key');
          var qtyEl = this.parentNode.querySelector('span');
          var qty = parseInt(qtyEl.textContent, 10) + 1;
          updateItem(key, qty);
        });
      });
      cartBody.querySelectorAll('.cd-item-remove').forEach(function(btn) {
        btn.addEventListener('click', function() {
          updateItem(this.getAttribute('data-key'), 0);
        });
      });
    }

    // --- Fetch cart and render ---
    function fetchAndRenderCart() {
      fetch('/cart.js', { credentials: 'same-origin' })
        .then(function(r) { return r.json(); })
        .then(renderCart)
        .catch(function() {});
    }

    // --- Update item quantity ---
    function updateItem(key, qty) {
      fetch('/cart/change.js', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: key, quantity: qty })
      })
        .then(function(r) { return r.json(); })
        .then(renderCart)
        .catch(function() {});
    }

    // --- AJAX add to cart (intercept all add-to-cart forms) ---
    document.addEventListener('submit', function(e) {
      var form = e.target;
      if (form.action && form.action.indexOf('/cart/add') !== -1) {
        e.preventDefault();

        var btn = form.querySelector('[type="submit"]');
        var originalText = btn ? btn.innerHTML : '';
        if (btn) {
          btn.disabled = true;
          btn.innerHTML = '<span>Adding...</span>';
        }

        var formData = new FormData(form);
        var data = {};
        formData.forEach(function(value, key) { data[key] = value; });

        fetch('/cart/add.js', {
          method: 'POST',
          credentials: 'same-origin',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: data.id, quantity: data.quantity || 1 })
        })
          .then(function(r) {
            if (!r.ok) throw new Error('Add to cart failed');
            return r.json();
          })
          .then(function() {
            // Fetch updated cart and open drawer
            return fetch('/cart.js', { credentials: 'same-origin' });
          })
          .then(function(r) { return r.json(); })
          .then(function(cart) {
            renderCart(cart);
            openCartDrawer();
            if (btn) {
              btn.innerHTML = '<span>Added!</span>';
              setTimeout(function() {
                btn.innerHTML = originalText;
                btn.disabled = false;
              }, 1500);
            }
          })
          .catch(function() {
            if (btn) {
              btn.innerHTML = originalText;
              btn.disabled = false;
            }
          });
      }
    });

    // --- Load cart on page load (for badge count) ---
    fetchAndRenderCart();

    // Expose globally for other scripts
    window.CartDrawer = {
      open: function() { fetchAndRenderCart(); openCartDrawer(); },
      close: closeCartDrawer,
      refresh: fetchAndRenderCart
    };
  })();
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
