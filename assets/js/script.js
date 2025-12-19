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
