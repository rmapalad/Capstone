// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    }
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Close mobile menu if open
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        }
    });
});

// Navbar Background Change on Scroll
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 15px rgba(0,0,0,0.1)';
        return;
    }
    
    if (currentScroll > lastScroll) {
        // Scrolling down
        navbar.style.transform = 'translateY(-100%)';
    } else {
        // Scrolling up
        navbar.style.transform = 'translateY(0)';
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 15px rgba(0,0,0,0.1)';
    }
    
    lastScroll = currentScroll;
});

// Form Submission with Animation
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = contactForm.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        
        // Add loading state
        submitBtn.textContent = 'Sending...';
        submitBtn.style.opacity = '0.7';
        submitBtn.disabled = true;
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Get form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            
            // Here you would typically send the data to a server
            console.log('Form submitted:', data);
            
            // Show success message with animation
            const successMessage = document.createElement('div');
            successMessage.className = 'success-message';
            successMessage.textContent = 'Thank you for your message! We will get back to you soon.';
            successMessage.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #4CAF50;
                color: white;
                padding: 1rem 2rem;
                border-radius: 5px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                transform: translateX(120%);
                transition: transform 0.3s ease;
                z-index: 1000;
            `;
            
            document.body.appendChild(successMessage);
            
            // Trigger animation
            setTimeout(() => {
                successMessage.style.transform = 'translateX(0)';
            }, 100);
            
            // Remove message after 3 seconds
            setTimeout(() => {
                successMessage.style.transform = 'translateX(120%)';
                setTimeout(() => {
                    successMessage.remove();
                }, 300);
            }, 3000);
            
            contactForm.reset();
        } catch (error) {
            console.error('Error submitting form:', error);
        } finally {
            // Reset button state
            submitBtn.textContent = originalText;
            submitBtn.style.opacity = '1';
            submitBtn.disabled = false;
        }
    });
}

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.feature, .offering-card, .about-text, .location-info').forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(element);
});

// Parallax Effect for Hero Section
const hero = document.querySelector('.hero');
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    hero.style.backgroundPositionY = `${scrolled * 0.5}px`;
});

// Dynamic Year Update in Footer
document.querySelector('.footer-bottom p').innerHTML = 
    `&copy; ${new Date().getFullYear()} Property Name. All rights reserved.`;

// Add loading animation to images
document.querySelectorAll('img').forEach(img => {
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.3s ease';
    
    img.onload = () => {
        img.style.opacity = '1';
    };
});

// FAQ Accordion
document.addEventListener('DOMContentLoaded', function() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
});

// Listings Page Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Filter functionality
    const filterBtn = document.querySelector('.filter-btn');
    if (filterBtn) {
        filterBtn.addEventListener('click', function() {
            const propertyType = document.getElementById('property-type').value;
            const priceRange = document.getElementById('price-range').value;
            const bedrooms = document.getElementById('bedrooms').value;
            
            // Here you would typically make an API call to filter the listings
            // For now, we'll just log the selected filters
            console.log('Filters:', { propertyType, priceRange, bedrooms });
            
            // Show loading state
            filterBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Filtering...';
            
            // Simulate API call
            setTimeout(() => {
                filterBtn.innerHTML = 'Apply Filters';
                // Add your filtering logic here
            }, 1000);
        });
    }

    // Listing item interactions
    const listingItems = document.querySelectorAll('.listing-item');
    listingItems.forEach(item => {
        // View Details button
        const viewDetailsBtn = item.querySelector('.view-details');
        if (viewDetailsBtn) {
            viewDetailsBtn.addEventListener('click', function(e) {
                e.preventDefault();
                // Here you would typically navigate to the listing details page
                console.log('View details clicked for:', item.querySelector('h3').textContent);
            });
        }

        // Contact Agent button
        const contactAgentBtn = item.querySelector('.contact-agent');
        if (contactAgentBtn) {
            contactAgentBtn.addEventListener('click', function(e) {
                e.preventDefault();
                // Here you would typically open a contact form or modal
                console.log('Contact agent clicked for:', item.querySelector('h3').textContent);
            });
        }
    });

    // Pagination
    const paginationLinks = document.querySelectorAll('.pagination a');
    paginationLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            // Remove active class from all links
            paginationLinks.forEach(l => l.classList.remove('active'));
            // Add active class to clicked link
            this.classList.add('active');
            // Here you would typically load the new page of listings
            console.log('Page changed to:', this.textContent);
        });
    });
}); 