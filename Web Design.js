document.addEventListener('DOMContentLoaded', () => {
    // Intersection Observer for section fade-in
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll('.section').forEach(section => {
        observer.observe(section);
    });

    // File upload preview
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            const label = fileInput.previousElementSibling;
            if (e.target.files.length > 0) {
                label.textContent = `${e.target.files.length} file(s) selected`;
            } else {
                label.innerHTML = '<i class="fas fa-cloud-upload-alt"></i> Upload Photos';
            }
        });
    }

    // Add animation classes when elements come into view
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.fade-in');
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementBottom = element.getBoundingClientRect().bottom;
            
            if (elementTop < window.innerHeight && elementBottom > 0) {
                element.classList.add('visible');
            }
        });
    };

    // Remove parallax effect
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Initial check

    // Add hover effect to buttons
    const buttons = document.querySelectorAll('.primary-cta, .secondary-cta');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-2px)';
        });
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0)';
        });
        button.addEventListener('mousedown', () => {
            button.style.transform = 'translateY(1px)';
        });
        button.addEventListener('mouseup', () => {
            button.style.transform = 'translateY(-2px)';
        });
    });
}); 

function toggleMenu() {
    const menu = document.getElementById('mobileMenu');
    const toggle = document.getElementById('menuToggle');
    const body = document.body;
    
    if (menu && toggle) {
        menu.classList.toggle('active');
        toggle.classList.toggle('active');
        
        // Prevent scrolling when menu is open
        if (menu.classList.contains('active')) {
            body.style.overflow = 'hidden';
        } else {
            body.style.overflow = '';
        }
    }
}

function closeMenu() {
    const menu = document.getElementById('mobileMenu');
    const toggle = document.getElementById('menuToggle');
    const body = document.body;
    
    if (menu && toggle) {
        menu.classList.remove('active');
        toggle.classList.remove('active');
        body.style.overflow = '';
    }
}

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    const menu = document.getElementById('mobileMenu');
    const toggle = document.getElementById('menuToggle');
    
    if (menu && toggle && menu.classList.contains('active')) {
        if (!menu.contains(e.target) && !toggle.contains(e.target)) {
            closeMenu();
        }
    }
});

// Close menu on window resize if it's open
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        closeMenu();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const mobileLinks = document.querySelectorAll('#mobileMenu a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });
});

// Minimal horizontal drag-to-scroll for .results-content (keeps all 5 containers)
(function() {
  const el = document.querySelector('.results-content');
  if (!el) return;
  let isDown = false;
  let startX;
  let scrollLeft;

  // Mouse events
  el.addEventListener('mousedown', function(e) {
    isDown = true;
    el.classList.add('dragging');
    startX = e.pageX - el.offsetLeft;
    scrollLeft = el.scrollLeft;
  });
  el.addEventListener('mouseleave', function() {
    isDown = false;
    el.classList.remove('dragging');
  });
  el.addEventListener('mouseup', function() {
    isDown = false;
    el.classList.remove('dragging');
  });
  el.addEventListener('mousemove', function(e) {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const walk = x - startX;
    el.scrollLeft = scrollLeft - walk;
  });

  // Touch events for mobile
  let touchStartX = 0;
  let touchScrollLeft = 0;
  el.addEventListener('touchstart', function(e) {
    isDown = true;
    touchStartX = e.touches[0].pageX - el.offsetLeft;
    touchScrollLeft = el.scrollLeft;
  });
  el.addEventListener('touchend', function() {
    isDown = false;
  });
  el.addEventListener('touchmove', function(e) {
    if (!isDown) return;
    const x = e.touches[0].pageX - el.offsetLeft;
    const walk = x - touchStartX;
    el.scrollLeft = touchScrollLeft - walk;
  });
})();

// 3D Circular Carousel for .results-content with arrows and smooth rotation
// (SVG arrows for glassmorphic, purple-glow style)
document.addEventListener('DOMContentLoaded', function() {
  // Only initialize carousel on services page
  if (document.body.getAttribute('data-page') !== 'services') return;
  
  const carousel = document.querySelector('.results-content');
  if (!carousel) return;
  const cards = Array.from(carousel.children);
  const cardCount = cards.length;
  if (cardCount < 2) return;

  // Place all cards absolutely for 3D effect
  cards.forEach(card => card.style.position = 'absolute');

  let angle = 0; // Current rotation angle
  let dragging = false, startX = 0, lastAngle = 0;
  const radius = 320; // Distance from center (adjust for spacing)
  const theta = 360 / cardCount;

  // Position cards in a circle
  function render() {
    cards.forEach((card, i) => {
      const cardAngle = theta * i + angle;
      card.style.transform =
        `translate(-50%, -50%) rotateY(${cardAngle}deg) translateZ(${radius}px)`;
      card.classList.toggle('active', Math.abs((cardAngle % 360 + 360) % 360) < theta/2);
    });
  }
  render();

  // Drag/Touch logic
  function onDragStart(e) {
    dragging = true;
    startX = (e.touches ? e.touches[0].pageX : e.pageX);
    carousel.classList.add('dragging');
  }
  function onDragMove(e) {
    if (!dragging) return;
    const x = (e.touches ? e.touches[0].pageX : e.pageX);
    const delta = x - startX;
    angle = lastAngle + delta / 2; // Adjust divisor for sensitivity
    render();
  }
  function onDragEnd() {
    dragging = false;
    lastAngle = angle;
    carousel.classList.remove('dragging');
  }
  carousel.addEventListener('mousedown', onDragStart);
  window.addEventListener('mousemove', onDragMove);
  window.addEventListener('mouseup', onDragEnd);
  carousel.addEventListener('touchstart', onDragStart, {passive: false});
  window.addEventListener('touchmove', onDragMove, {passive: false});
  window.addEventListener('touchend', onDragEnd);

  // Snap to nearest card on drag end
  function snapToNearest() {
    const snapped = Math.round(angle / theta) * theta;
    angle = snapped;
    lastAngle = angle;
    render();
  }
  window.addEventListener('mouseup', snapToNearest);
  window.addEventListener('touchend', snapToNearest);

  // Mouse wheel rotates carousel
  carousel.addEventListener('wheel', function(e) {
    carousel.classList.add('dragging');
    angle += e.deltaY / 2; // Adjust divisor for sensitivity
    lastAngle = angle;
    render();
    e.preventDefault();
    setTimeout(() => {
      carousel.classList.remove('dragging');
      snapToNearest();
    }, 300);
  }, {passive: false});

  // Keyboard accessibility: left/right arrow keys
  document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      carousel.classList.add('dragging');
      if (e.key === 'ArrowLeft') {
        angle -= theta;
      } else {
        angle += theta;
      }
      lastAngle = angle;
      render();
      setTimeout(() => {
        carousel.classList.remove('dragging');
        snapToNearest();
      }, 300);
    }
  });

  // Responsive: re-render on resize
  window.addEventListener('resize', render);

  // --- Arrow Buttons (SVG) ---
  function createArrow(direction) {
    const btn = document.createElement('button');
    btn.className = 'carousel-arrow ' + direction;
    btn.setAttribute('aria-label', direction === 'left' ? 'Previous' : 'Next');
    btn.innerHTML = direction === 'left'
      ? `<svg viewBox="0 0 32 32"><polyline points="20 8 12 16 20 24" stroke="#c18aff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>`
      : `<svg viewBox="0 0 32 32"><polyline points="12 8 20 16 12 24" stroke="#c18aff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>`;
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      carousel.classList.add('dragging');
      if (direction === 'left') {
        angle -= theta;
      } else {
        angle += theta;
      }
      lastAngle = angle;
      render();
      setTimeout(() => {
        carousel.classList.remove('dragging');
        snapToNearest();
      }, 300);
    });
    return btn;
  }
  // Only add arrows if not already present
  const wrapper = carousel.parentElement;
  if (wrapper && !wrapper.querySelector('.carousel-arrow')) {
    const leftArrow = createArrow('left');
    const rightArrow = createArrow('right');
    wrapper.appendChild(leftArrow);
    wrapper.appendChild(rightArrow);
  }
});

// Responsive equal height for all .metric cards in 3D carousel
function setEqualCardHeights() {
  const cards = document.querySelectorAll('.results-content .metric');
  if (!cards.length) return;
  // Reset heights to auto to measure natural height
  cards.forEach(card => card.style.minHeight = 'auto');
  // Find tallest card
  let maxHeight = 0;
  cards.forEach(card => {
    maxHeight = Math.max(maxHeight, card.offsetHeight);
  });
  // Set all cards to tallest height
  cards.forEach(card => card.style.minHeight = maxHeight + 'px');
}
window.addEventListener('DOMContentLoaded', setEqualCardHeights);
window.addEventListener('resize', setEqualCardHeights);
window.addEventListener('orientationchange', setEqualCardHeights);




