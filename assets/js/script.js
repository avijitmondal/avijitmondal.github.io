/**
 * Copyright (c) 2025 Avijit Mondal
 * Licensed under the MIT License
 * See LICENSE file in the project root for full license information
 */

// Mobile Menu Toggle
const mobileMenu = document.getElementById('mobileMenu');
const navLinks = document.getElementById('navLinks');

mobileMenu.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    const icon = mobileMenu.querySelector('i');
    icon.classList.toggle('fa-bars');
    icon.classList.toggle('fa-times');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const icon = mobileMenu.querySelector('i');
        icon.classList.add('fa-bars');
        icon.classList.remove('fa-times');
    });
});

// Navbar scroll effect
const navbar = document.getElementById('navbar');
const navProfilePhoto = document.getElementById('navProfilePhoto');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
        navProfilePhoto.classList.add('visible');
    } else {
        navbar.classList.remove('scrolled');
        navProfilePhoto.classList.remove('visible');
    }
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});

// Contact Form Handling
const contactForm = document.getElementById('contactForm');
const successModal = document.getElementById('successModal');
const closeModalBtn = document.getElementById('closeModal');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value
    };

    // Create mailto link
    const subject = `Portfolio Contact from ${formData.name}`;
    const body = `Name: ${formData.name}%0D%0AEmail: ${formData.email}%0D%0A%0D%0AMessage:%0D%0A${formData.message}`;
    window.location.href = `mailto:admin@avijitmondal.com?subject=${subject}&body=${body}`;

    // Reset form
    contactForm.reset();
    
    // Show custom modal
    successModal.classList.add('show');
});

// Close modal when clicking the button
closeModalBtn.addEventListener('click', () => {
    successModal.classList.remove('show');
});

// Close modal when clicking outside of it
window.addEventListener('click', (e) => {
    if (e.target === successModal) {
        successModal.classList.remove('show');
    }
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 70;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Reusable Carousel Controller with Height Equalization
function setupCarousel({ trackId, prevBtnId, nextBtnId, dotsId }) {
    const track = document.getElementById(trackId);
    const prevBtn = document.getElementById(prevBtnId);
    const nextBtn = document.getElementById(nextBtnId);
    const dotsContainer = document.getElementById(dotsId);

    if (!track || !prevBtn || !nextBtn || !dotsContainer) return;

    const cards = Array.from(track.children);
    let currentIndex = 0;

    function getVisibleCards() {
        if (window.innerWidth <= 768) return 1;
        if (window.innerWidth <= 1024) return 2;
        return 3;
    }

    function getMaxIndex() {
        const visibleCards = getVisibleCards();
        return Math.max(0, cards.length - visibleCards);
    }

    function equalizeHeights() {
        cards.forEach(card => {
            card.style.height = '';
        });
        let maxHeight = 0;
        cards.forEach(card => {
            const h = card.offsetHeight;
            if (h > maxHeight) maxHeight = h;
        });
        if (maxHeight > 0) {
            cards.forEach(card => {
                card.style.height = `${maxHeight}px`;
            });
        }
    }

    function updateCarousel() {
        equalizeHeights();

        const maxIdx = getMaxIndex();
        if (currentIndex > maxIdx) currentIndex = maxIdx;
        if (currentIndex < 0) currentIndex = 0;

        const card = cards[0];
        if (card) {
            const style = window.getComputedStyle(track);
            const gap = parseFloat(style.gap) || 32;
            const cardWidth = card.offsetWidth;
            const shift = currentIndex * (cardWidth + gap);
            track.style.transform = `translateX(-${shift}px)`;
        }

        // Render Dots
        const totalDots = maxIdx + 1;
        dotsContainer.innerHTML = '';
        for (let i = 0; i < totalDots; i++) {
            const dot = document.createElement('button');
            dot.className = `carousel-dot ${i === currentIndex ? 'active' : ''}`;
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            dot.addEventListener('click', () => {
                currentIndex = i;
                updateCarousel();
            });
            dotsContainer.appendChild(dot);
        }

        // Button States
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex >= maxIdx;
    }

    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentIndex < getMaxIndex()) {
            currentIndex++;
            updateCarousel();
        }
    });

    // Touch Swipe Navigation
    let startX = 0;
    let currentX = 0;
    let isSwiping = false;

    track.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        currentX = startX;
        isSwiping = true;
    }, { passive: true });

    track.addEventListener('touchmove', (e) => {
        if (!isSwiping) return;
        currentX = e.touches[0].clientX;
    }, { passive: true });

    track.addEventListener('touchend', () => {
        if (!isSwiping) return;
        const diffX = startX - currentX;
        if (Math.abs(diffX) > 40) {
            if (diffX > 0 && currentIndex < getMaxIndex()) {
                currentIndex++;
            } else if (diffX < 0 && currentIndex > 0) {
                currentIndex--;
            }
            updateCarousel();
        }
        isSwiping = false;
    });

    // Recalculate on window resize & image/font load
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(updateCarousel, 100);
    });

    window.addEventListener('load', updateCarousel);

    // Initial positioning
    updateCarousel();
}

// Initialize Projects Carousel
setupCarousel({
    trackId: 'projectsTrack',
    prevBtnId: 'prevProjectBtn',
    nextBtnId: 'nextProjectBtn',
    dotsId: 'carouselDots'
});

// Initialize Skills Carousel
setupCarousel({
    trackId: 'skillsTrack',
    prevBtnId: 'prevSkillBtn',
    nextBtnId: 'nextSkillBtn',
    dotsId: 'skillsCarouselDots'
});
