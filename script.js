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

    // Form submission handling
    const form = document.querySelector('.contact-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitButton = form.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';
            
            // Simulate form submission
            setTimeout(() => {
                submitButton.textContent = 'Sent!';
                setTimeout(() => {
                    submitButton.disabled = false;
                    submitButton.textContent = originalText;
                    form.reset();
                }, 2000);
            }, 1500);
        });
    }

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
    if (menu && toggle) {
        menu.classList.toggle('active');
        toggle.classList.toggle('active'); // <-- This triggers the "X" animation
    }
}

function closeMenu() {
    const menu = document.getElementById('mobileMenu');
    const toggle = document.getElementById('menuToggle');
    if (menu && toggle) {
        menu.classList.remove('active');
        toggle.classList.remove('active');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const mobileLinks = document.querySelectorAll('#mobileMenu a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });
});




