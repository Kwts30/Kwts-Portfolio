// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Get all navigation links
    const navLinks = document.querySelectorAll('.main-nav a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.sticky-header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Contact button: smooth-scroll to Contact section
    const contactButtons = document.querySelectorAll('.contact-btn, .hero-contact-btn');
    const contactSection = document.querySelector('#contact');
    contactButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            if (!contactSection) return;
            const headerHeight = document.querySelector('.sticky-header')?.offsetHeight || 0;
            const targetTop = contactSection.offsetTop - headerHeight;
            window.scrollTo({ top: targetTop, behavior: 'smooth' });
        });
    });
    
    // Liquid glass header on scroll (keeps header position unchanged)
    (() => {
        const header = document.querySelector('.sticky-header');
        if (!header) return;

        // Smooth transitions without shifting layout
        header.style.transition = 'background 200ms ease, box-shadow 200ms ease, -webkit-backdrop-filter 200ms ease, backdrop-filter 200ms ease';
        header.style.willChange = 'background, box-shadow, backdrop-filter';

        let lastY = window.scrollY;
        let ticking = false;

        const applyState = (y) => {
            if (y > 10) {
                // Apple-like liquid glass: translucent + blur + subtle edge + soft shadow
                header.style.background = 'rgba(255, 255, 255, 0.55)';
                header.style.setProperty('-webkit-backdrop-filter', 'saturate(180%) blur(20px)');
                header.style.setProperty('backdrop-filter', 'saturate(180%) blur(20px)');
                header.style.boxShadow = 'inset 0 0 0 1px rgba(255,255,255,0.3), 0 8px 24px rgba(0,0,0,0.08)';
            } else {
                // Original (no glass)
                header.style.background = '#ffffff';
                header.style.setProperty('-webkit-backdrop-filter', 'none');
                header.style.setProperty('backdrop-filter', 'none');
                header.style.boxShadow = 'none';
            }
        };

        applyState(lastY);

        window.addEventListener('scroll', () => {
            lastY = window.scrollY;
            if (!ticking) {
                requestAnimationFrame(() => {
                    applyState(lastY);
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    })();
    
    // Gallery image lazy loading effect
    const galleryImages = document.querySelectorAll('.gallery-item img');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'scale(1)';
                observer.unobserve(entry.target);
            }
        });
    });
    
    galleryImages.forEach(img => {
        img.style.opacity = '0';
        img.style.transform = 'scale(0.8)';
        img.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        imageObserver.observe(img);
    });

    // About section reveal on scroll
    const aboutWrap = document.querySelector('.about-wrap.reveal');
    if (aboutWrap) {
        const aboutObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.classList.add('revealed');
                    obs.unobserve(e.target);
                }
            });
        }, { root: null, rootMargin: '0px 0px -10% 0px', threshold: 0.2 });
        aboutObserver.observe(aboutWrap);
    }

    // Education items reveal on scroll
    const eduItems = document.querySelectorAll('.edu-item.reveal');
    if (eduItems.length) {
        const eduObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.classList.add('revealed');
                    obs.unobserve(e.target);
                }
            });
        }, { root: null, rootMargin: '0px 0px -10% 0px', threshold: 0.2 });

        eduItems.forEach(el => eduObserver.observe(el));
    }

    // Experience items reveal on scroll
    const expItems = document.querySelectorAll('.exp-item.reveal');
    if (expItems.length) {
        const expObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.classList.add('revealed');
                    obs.unobserve(e.target);
                }
            });
        }, { root: null, rootMargin: '0px 0px -10% 0px', threshold: 0.2 });
        expItems.forEach(el => expObserver.observe(el));
    }

    // Project cards reveal on scroll
    const projCards = document.querySelectorAll('.project-card.reveal');
    if (projCards.length) {
        const projObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.classList.add('revealed');
                    obs.unobserve(e.target);
                }
            });
        }, { root: null, rootMargin: '0px 0px -10% 0px', threshold: 0.2 });
        projCards.forEach(el => projObserver.observe(el));
    }
});