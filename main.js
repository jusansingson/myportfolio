document.addEventListener('DOMContentLoaded', () => {

    // --- Profile Image Dynamic Loading & Fallback ---
    const profileAvatar = document.getElementById('profile-avatar');
    const avatarFallback = document.getElementById('avatar-fallback');
    
    // We try to load 'profile.png'
    const imgTest = new Image();
    imgTest.src = 'profile.png';
    imgTest.onload = () => {
        profileAvatar.src = 'profile.png';
        profileAvatar.classList.add('loaded');
        // Hide fallback background when image loads
        setTimeout(() => {
            avatarFallback.style.display = 'none';
        }, 500);
    };
    imgTest.onerror = () => {
        // Log that we are using the fallback initials
        console.log('No profile.png found or failed to load. Displaying initials badge fallback.');
        profileAvatar.style.display = 'none';
    };


    // --- Mobile Menu Navigation Toggle ---
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navMenu.classList.toggle('active');
            
            // Toggle hamburger icon between menu and close
            const isOpened = navMenu.classList.contains('active');
            navToggle.innerHTML = isOpened 
                ? `<svg viewBox="0 0 24 24" width="24" height="24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor"/></svg>`
                : `<svg viewBox="0 0 24 24" width="24" height="24"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" fill="currentColor"/></svg>`;
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (navMenu.classList.contains('active') && !navMenu.contains(e.target) && e.target !== navToggle) {
                navMenu.classList.remove('active');
                navToggle.innerHTML = `<svg viewBox="0 0 24 24" width="24" height="24"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" fill="currentColor"/></svg>`;
            }
        });

        // Close menu on link click
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.innerHTML = `<svg viewBox="0 0 24 24" width="24" height="24"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" fill="currentColor"/></svg>`;
            });
        });
    }


    // --- Header Scrolled Effect ---
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });


    // --- Active Link Highlight on Scroll ---
    const sections = document.querySelectorAll('section');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - 120)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });


    // --- Typing Animation in Hero Section ---
    const typingSpan = document.querySelector('#hero-title-typing .typing-text');
    const professions = [
        "IT Professional",
        "Systems Administrator",
        "WordPress & Web Specialist",
        "Network Operations Tech",
        "Desktop Engineer"
    ];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
        const currentWord = professions[wordIndex];
        
        if (isDeleting) {
            typingSpan.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50; // faster deleting
        } else {
            typingSpan.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 120; // normal typing
        }

        if (!isDeleting && charIndex === currentWord.length) {
            typingSpeed = 1800; // pause at end of word
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % professions.length;
            typingSpeed = 500; // pause before next word
        }

        setTimeout(type, typingSpeed);
    }
    
    if (typingSpan) {
        type();
    }


    // --- Experience Detail Expander ---
    const expCards = document.querySelectorAll('.experience-card');
    expCards.forEach(card => {
        const toggleBtn = card.querySelector('.experience-details-toggle');
        const timelineItem = card.closest('.timeline-item');

        const toggleDetails = (e) => {
            e.stopPropagation();
            
            // Check if this card is already expanded
            const isExpanded = card.classList.contains('expanded');
            
            // Unexpand all other cards
            expCards.forEach(otherCard => {
                otherCard.classList.remove('expanded');
                const otherTimeline = otherCard.closest('.timeline-item');
                if (otherTimeline) otherTimeline.classList.remove('active');
            });
            
            // Toggle current card
            if (!isExpanded) {
                card.classList.add('expanded');
                if (timelineItem) timelineItem.classList.add('active');
            } else {
                card.classList.remove('expanded');
                if (timelineItem) timelineItem.classList.remove('active');
            }
        };

        if (toggleBtn) {
            toggleBtn.addEventListener('click', toggleDetails);
        }
        card.addEventListener('click', toggleDetails);
    });


    // --- References/Testimonials Slider ---
    const slidesContainer = document.getElementById('slides-container');
    const slides = document.querySelectorAll('.ref-slide');
    const btnPrev = document.getElementById('slider-prev');
    const btnNext = document.getElementById('slider-next');
    const dotsContainer = document.getElementById('slider-dots');

    if (slidesContainer && slides.length > 0) {
        let currentSlide = 0;
        
        // Generate dot controls
        slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('slider-dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                goToSlide(index);
            });
            dotsContainer.appendChild(dot);
        });
        
        const dots = document.querySelectorAll('.slider-dot');

        function updateSliderState() {
            slidesContainer.style.transform = `translateX(-${currentSlide * 100}%)`;
            dots.forEach((dot, idx) => {
                dot.classList.toggle('active', idx === currentSlide);
            });
        }

        function goToSlide(index) {
            currentSlide = index;
            updateSliderState();
        }

        function nextSlide() {
            currentSlide = (currentSlide + 1) % slides.length;
            updateSliderState();
        }

        function prevSlide() {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            updateSliderState();
        }

        if (btnNext) btnNext.addEventListener('click', nextSlide);
        if (btnPrev) btnPrev.addEventListener('click', prevSlide);

        // Auto slide every 8 seconds
        let autoSlideTimer = setInterval(nextSlide, 8000);
        
        // Reset timer on manual navigation
        const resetAutoSlide = () => {
            clearInterval(autoSlideTimer);
            autoSlideTimer = setInterval(nextSlide, 8000);
        };

        [btnNext, btnPrev, dotsContainer].forEach(element => {
            if (element) element.addEventListener('click', resetAutoSlide);
        });
    }


    // --- Reveal Sections on Scroll (Intersection Observer) ---
    const reveals = document.querySelectorAll('.reveal');
    const revealOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // If it contains skill cards, trigger skill bar animation
                const skillBars = entry.target.querySelectorAll('.skill-bar-fill');
                if (skillBars.length > 0) {
                    skillBars.forEach(bar => {
                        const targetWidth = bar.getAttribute('data-width');
                        bar.style.width = targetWidth;
                    });
                }
                
                // Once revealed, we don't need to observe it anymore
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12, // trigger when 12% is visible
        rootMargin: "0px 0px -40px 0px"
    });

    reveals.forEach(reveal => {
        revealOnScroll.observe(reveal);
    });


    // --- Clipboard Copying Functionality ---
    const copyBtns = document.querySelectorAll('.copy-btn');
    copyBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const textToCopy = btn.getAttribute('data-clipboard');
            
            navigator.clipboard.writeText(textToCopy).then(() => {
                // Temporary feedback icon change
                const originalHTML = btn.innerHTML;
                btn.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#00f2fe" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
                btn.title = "Copied!";
                
                setTimeout(() => {
                    btn.innerHTML = originalHTML;
                    btn.title = "";
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy text: ', err);
            });
        });
    });


    // --- Back to Top Button ---
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                backToTopBtn.style.opacity = '1';
                backToTopBtn.style.pointerEvents = 'auto';
            } else {
                backToTopBtn.style.opacity = '0';
                backToTopBtn.style.pointerEvents = 'none';
            }
        });

        // Initialize state
        backToTopBtn.style.opacity = '0';
        backToTopBtn.style.pointerEvents = 'none';
        backToTopBtn.style.transition = 'opacity 0.3s ease';

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }


    // --- Mock Contact Form Submission ---
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    const formSubmit = document.getElementById('form-submit');

    if (contactForm && formStatus) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Change button state to sending
            const originalBtnHTML = formSubmit.innerHTML;
            formSubmit.disabled = true;
            formSubmit.innerHTML = `<span>Sending Message...</span>`;
            
            // Mock server timeout (1.5 seconds)
            setTimeout(() => {
                // Clear status
                formStatus.className = 'form-status';
                
                // Show success
                formStatus.textContent = "Thank you! Your message has been sent successfully. Jusan will get back to you shortly.";
                formStatus.classList.add('success');
                
                // Reset form fields
                contactForm.reset();
                
                // Restore button
                formSubmit.disabled = false;
                formSubmit.innerHTML = originalBtnHTML;
                
                // Hide message after 5 seconds
                setTimeout(() => {
                    formStatus.style.opacity = '0';
                }, 5000);
                
            }, 1500);
        });
    }


    // --- Project Gallery Lightbox ---
    // --- Portfolio Filter Controls ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryGrids = document.querySelectorAll('.gallery-grid');

    if (filterBtns.length && galleryGrids.length) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const filter = btn.getAttribute('data-filter');

                // Toggle active state
                filterBtns.forEach(b => b.classList.toggle('active', b === btn));

                // Show/hide gallery sections based on data-category on the grid
                galleryGrids.forEach(grid => {
                    const category = grid.getAttribute('data-category') || '';
                    const section = grid.closest('section');
                    if (!section) return;

                    if (filter === 'all' || category === filter) {
                        section.style.display = '';
                    } else {
                        section.style.display = 'none';
                    }
                });

                // Smoothly scroll to first visible gallery
                const firstVisible = document.querySelector('.gallery-grid[data-category]:not([style*="display: none"])');
                if (firstVisible) {
                    const top = firstVisible.closest('section').offsetTop - 90;
                    window.scrollTo({ top, behavior: 'smooth' });
                }
            });
        });
    }
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close');

    if (galleryItems.length && lightbox) {
        galleryItems.forEach(item => {
            // Provide a fallback if the thumbnail image fails to load
            const imgEl = item.querySelector('img');
            if (imgEl) {
                imgEl.addEventListener('error', () => {
                    const title = imgEl.alt || 'Project';
                    const placeholder = document.createElement('div');
                    placeholder.className = 'gallery-fallback';
                    placeholder.textContent = title;
                    item.innerHTML = '';
                    item.appendChild(placeholder);
                });
            }

            item.addEventListener('click', (e) => {
                e.preventDefault();
                const href = item.getAttribute('href');
                const currentImg = item.querySelector('img');
                const alt = currentImg ? currentImg.alt : (item.textContent || '').trim();
                // If href is a valid image URL, open in lightbox; otherwise do nothing
                if (href) {
                    lightboxImg.src = href;
                    lightboxImg.alt = alt;
                    lightboxCaption.textContent = alt;
                    lightbox.classList.add('active');
                    lightbox.setAttribute('aria-hidden', 'false');
                }
            });
        });

        const closeLightbox = () => {
            lightbox.classList.remove('active');
            lightboxImg.src = '';
            lightboxCaption.textContent = '';
            lightbox.setAttribute('aria-hidden', 'true');
        };

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target === lightboxClose) closeLightbox();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                closeLightbox();
            }
        });
    }

});
