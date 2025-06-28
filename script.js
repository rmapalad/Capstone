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
        const answer = item.querySelector('.faq-answer');
        const icon = question.querySelector('i');
        
        question.addEventListener('click', () => {
            const isOpen = answer.style.display === 'block';
            answer.style.display = isOpen ? 'none' : 'block';
            icon.classList.toggle('fa-chevron-down');
            icon.classList.toggle('fa-chevron-up');
        });
    });

    // Online status indicator
    const onlineStatusIndicator = document.getElementById('online-status');
    
    function updateOnlineStatus() {
        if (navigator.onLine) {
            onlineStatusIndicator.classList.remove('offline');
            onlineStatusIndicator.classList.add('online');
            onlineStatusIndicator.title = 'Online';
        } else {
            onlineStatusIndicator.classList.remove('online');
            onlineStatusIndicator.classList.add('offline');
            onlineStatusIndicator.title = 'Offline';
        }
    }

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    updateOnlineStatus(); // Initial check

    // Firebase DB status indicator (placeholder - requires Firebase SDK integration)
    const dbStatusIndicator = document.getElementById('db-status');

    // This is a simplified example. You'll need to integrate with Firebase SDK's
    // connection status or data synchronization events for a real implementation.
    function updateDbStatus(status) { // status can be 'synced', 'pending', 'error'
        dbStatusIndicator.classList.remove('synced', 'pending', 'error', 'offline'); // Remove all possible states
        dbStatusIndicator.classList.add(status);
        dbStatusIndicator.title = `DB: ${status.charAt(0).toUpperCase() + status.slice(1)}`;
    }

    // Placeholder: Assume synced initially. 
    // Replace this with actual Firebase connection/sync logic.
    updateDbStatus('pending'); // Initial state, will be updated by Firebase

    // You'll need to import and initialize Firebase if you haven't already
    // For example, in your firebase-config.js or here:
    // import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
    // import { getFirestore, onSnapshot, collection } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';
    // import { getDatabase, ref, onValue } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js';
    
    // Example for Firestore (make sure db is initialized from firebase-config.js or init-sync.js)
    // This requires `db` to be an initialized Firestore instance.
    // You might need to export `db` from firebase-config.js and import it here.
    // For this example, I'll assume `window.db` might be available if initialized globally from init-sync.js
    
    // Check if Firebase services are available (loaded via module scripts)
    // We'll wait for a bit to ensure firebase-config and init-sync have run.
    setTimeout(() => {
        console.log('DB Status Check: Attempting to find window.db. Current value:', window.db); // Enhanced log
        if (window.db) { // Assuming 'db' is your Firestore instance, made global by init-sync.js or firebase-config.js
            try {
                // A simple way to check connectivity is to try to listen to a non-critical path
                // or use Firebase's built-in connection status if available in the version you are using.
                // For Firestore, there isn't a direct 'connection state' event like Realtime Database.
                // Instead, you can monitor a specific document or collection for changes or errors.
                // Here's a very basic check: try to get server timestamp (which requires connection)
                const { serverTimestamp, doc, getDoc, onSnapshot, collection } = window.firebaseFirestore; // Assuming these are exposed or imported

                if (!serverTimestamp || !doc || !getDoc || !onSnapshot || !collection) {
                    console.warn('Firebase Firestore functions not available on window.firebaseFirestore. DB status check might be limited.');
                    updateDbStatus('error'); // Indicate an issue with Firebase setup
                    return;
                }

                updateDbStatus('pending'); // Set to pending while we check

                // For a more robust check, you might listen to metadata changes on a query
                // or use the .info/connected path if using Realtime Database.
                // For Firestore, a common pattern is to assume connected and handle errors.
                // Here, we'll try a simple health check by listening to a dummy document or a known collection.
                // Let's try to listen to metadata of a dummy collection to infer connectivity.
                const healthCheckCol = collection(window.db, '_healthcheck');
                const unsubscribe = onSnapshot(healthCheckCol, 
                    (snapshot) => {
                        // If we get a snapshot (even if empty), we are likely connected and synced.
                        // You might want more sophisticated logic based on `snapshot.metadata.fromCache`
                        // or `snapshot.metadata.hasPendingWrites`.
                        if (!snapshot.metadata.fromCache) {
                            updateDbStatus('synced');
                        } else {
                            // It's from cache, could mean offline or just fast local serving
                            // For simplicity, we'll assume synced if we get any callback without error.
                            // A better check would be to try a small write or use serverTimestamp.
                            updateDbStatus('synced'); // Simplified
                        }
                    }, 
                    (error) => {
                        console.error("Firebase connection error:", error);
                        updateDbStatus('error');
                    }
                );
                // Note: Remember to unsubscribe when the component/page unloads if necessary.
            } catch (e) {
                console.error('Error setting up Firebase DB status listener:', e);
                updateDbStatus('error');
            }
        } else {
            console.warn('DB Status Check: Firebase db instance (window.db) was NOT found after timeout. DB status will remain Offline. Please check browser console for errors related to Firebase SDKs or the execution of js/firebase-config.js.'); // Enhanced log
            updateDbStatus('offline'); // Or 'error' or 'pending' depending on how you want to represent this
        }
    }, 4000); // Wait 4 seconds for Firebase scripts to load and initialize

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