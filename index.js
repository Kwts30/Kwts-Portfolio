document.addEventListener('DOMContentLoaded', function() {
    // 1. Mobile Menu Toggle
    const mobileToggleBtn = document.getElementById('mobileToggleBtn');
    const mainNav = document.getElementById('mainNav');

    if (mobileToggleBtn && mainNav) {
        mobileToggleBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            mainNav.classList.toggle('mobile-active');
            mobileToggleBtn.classList.toggle('open');
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!mainNav.contains(e.target) && !mobileToggleBtn.contains(e.target)) {
                mainNav.classList.remove('mobile-active');
                mobileToggleBtn.classList.remove('open');
            }
        });
    }

    // 2. Smooth Scrolling & Auto-close Mobile Menu
    const navLinks = document.querySelectorAll('.main-nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    if (mainNav) mainNav.classList.remove('mobile-active');
                    const headerHeight = document.querySelector('.sticky-header')?.offsetHeight || 60;
                    const targetPosition = targetSection.offsetTop - headerHeight - 10;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Contact button scroll trigger
    const contactSection = document.querySelector('#contact');
    document.querySelectorAll('.contact-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            if (!contactSection) return;
            if (mainNav) mainNav.classList.remove('mobile-active');
            const headerHeight = document.querySelector('.sticky-header')?.offsetHeight || 60;
            const targetTop = contactSection.offsetTop - headerHeight - 10;
            window.scrollTo({ top: targetTop, behavior: 'smooth' });
        });
    });

    // 3. Floating Glass Header Scroll Effect (Translucent Blending)
    const header = document.querySelector('.sticky-header');
    if (header) {
        let lastY = window.scrollY;
        let ticking = false;

        const updateHeaderStyle = (y) => {
            if (y > 20) {
                header.style.background = 'rgba(255, 255, 255, 0.45)';
                header.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.06), inset 0 0 0 1px rgba(255, 255, 255, 0.5)';
            } else {
                header.style.background = 'rgba(255, 255, 255, 0.25)';
                header.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.04), inset 0 0 0 1px rgba(255, 255, 255, 0.3)';
            }
        };

        updateHeaderStyle(lastY);

        window.addEventListener('scroll', () => {
            lastY = window.scrollY;
            if (!ticking) {
                requestAnimationFrame(() => {
                    updateHeaderStyle(lastY);
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    // 4. Sliding Nav Indicator & Scrollspy Active Link Highlighting
    const navIndicator = document.querySelector('.nav-indicator');
    const sections = Array.from(document.querySelectorAll('main section[id]'));
    
    function moveIndicator(el) {
        if (!el || !navIndicator || !mainNav) return;
        const navRect = mainNav.getBoundingClientRect();
        const elRect = el.getBoundingClientRect();
        
        // Calculate offset relative to mainNav
        const leftOffset = elRect.left - navRect.left;
        const topOffset = elRect.top - navRect.top;
        
        navIndicator.style.width = `${elRect.width}px`;
        navIndicator.style.height = `${elRect.height}px`;
        navIndicator.style.left = `${leftOffset}px`;
        navIndicator.style.top = `${topOffset}px`;
        navIndicator.style.opacity = '1';
    }

    function updateActiveIndicator() {
        const activeLink = document.querySelector('.main-nav a.active');
        if (activeLink) {
            moveIndicator(activeLink);
        } else {
            if (navIndicator) navIndicator.style.opacity = '0';
        }
    }

    // Bulletproof Scrollspy Detection
    function onScrollSpy() {
        const headerHeight = document.querySelector('.sticky-header')?.offsetHeight || 70;
        const windowHeight = window.innerHeight;
        const bodyHeight = document.documentElement.scrollHeight;
        const scrollY = window.scrollY;

        let currentSectionId = '';

        // At top of page -> Home
        if (scrollY < 120) {
            currentSectionId = 'home';
        } 
        // At bottom of page -> Contact
        else if (scrollY + windowHeight >= bodyHeight - 40) {
            currentSectionId = 'contact';
        } 
        else {
            // Check sections from bottom to top
            for (let i = sections.length - 1; i >= 0; i--) {
                const section = sections[i];
                const sectionTop = section.offsetTop;
                if (scrollY >= sectionTop - headerHeight - 120) {
                    currentSectionId = section.getAttribute('id');
                    break;
                }
            }
        }

        if (currentSectionId) {
            navLinks.forEach(link => {
                const href = link.getAttribute('href');
                if (href === `#${currentSectionId}`) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
            updateActiveIndicator();
        }
    }

    let scrollTicking = false;
    window.addEventListener('scroll', () => {
        if (!scrollTicking) {
            requestAnimationFrame(() => {
                onScrollSpy();
                scrollTicking = false;
            });
            scrollTicking = true;
        }
    }, { passive: true });

    navLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            moveIndicator(this);
        });
    });

    if (mainNav) {
        mainNav.addEventListener('mouseleave', function() {
            updateActiveIndicator();
        });
    }

    // Initial position on page load
    setTimeout(onScrollSpy, 150);
    window.addEventListener('resize', onScrollSpy);

    // 5. Scroll Reveal Animations (Gallery, Skills, About, Education, Experience, Projects)
    const gallerySection = document.querySelector('.gallery-section');
    const galleryImages = document.querySelectorAll('.gallery-item img');
    if (gallerySection && galleryImages.length) {
        galleryImages.forEach(img => {
            img.style.opacity = '0';
            img.style.transform = 'scale(0.95)';
            img.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        });

        const galleryObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    galleryImages.forEach(img => {
                        img.style.opacity = '1';
                        img.style.transform = 'scale(1)';
                    });
                    obs.unobserve(entry.target);
                }
            });
        }, { rootMargin: '100px' });

        galleryObserver.observe(gallerySection);
    }

    // General reveal observer
    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length) {
        const revealObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.classList.add('revealed');
                    obs.unobserve(e.target);
                }
            });
        }, { rootMargin: '0px 0px -10% 0px', threshold: 0.15 });

        revealElements.forEach(el => revealObserver.observe(el));
    }

    // 6. Contact Form Toast Notification Feedback
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show toast feedback
            showToast('Thank you! Your message has been sent successfully.');
            contactForm.reset();
        });
    }

    function showToast(message) {
        let toast = document.querySelector('.toast-notification');
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'toast-notification';
            document.body.appendChild(toast);
        }
        toast.textContent = message;
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, 4000);
    }

    // 7. Footer Year Dynamic Setting
    const yearEl = document.getElementById('year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
});