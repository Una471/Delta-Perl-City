document.addEventListener('DOMContentLoaded', function() {
    console.log('Maun Smart City website loaded');
    
    // ============================================
    // MOBILE NAVIGATION TOGGLE
    // ============================================
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            navLinks.classList.toggle('active');
            
            // Toggle menu icon
            const icon = this.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
                navLinks.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
        
        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                navLinks.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });
        
        // Responsive menu behavior
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                navLinks.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
    
    // ============================================
    // SMOOTH SCROLLING FOR ANCHOR LINKS
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just "#"
            if (href === '#') return;
            
            // Check if it's an internal link
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(href);
                
                if (targetElement) {
                    // Calculate offset for fixed header
                    const headerHeight = document.querySelector('header').offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight;
                    
                    // Smooth scroll to target
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Update URL without page jump
                    history.pushState(null, null, href);
                }
            }
        });
    });
    
    // ============================================
    // ACTIVE NAV LINK ON SCROLL
    // ============================================
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-links a');
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // Remove active class from all links
                navLinks.forEach(link => {
                    link.classList.remove('active');
                });
                
                // Add active class to corresponding link
                const activeLink = document.querySelector(`.nav-links a[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }
    
    // Run on scroll and on load
    window.addEventListener('scroll', updateActiveNavLink);
    updateActiveNavLink(); // Initial call
    
    // ============================================
    // CONTACT FORM HANDLING
    // ============================================
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        // Form validation
        function validateForm() {
            let isValid = true;
            const requiredFields = contactForm.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                field.style.borderColor = '#ddd'; // Reset border
                
                if (!field.value.trim()) {
                    field.style.borderColor = '#ff6b6b';
                    isValid = false;
                    
                    // Add error message if not exists
                    if (!field.nextElementSibling || !field.nextElementSibling.classList.contains('error-message')) {
                        const errorMsg = document.createElement('div');
                        errorMsg.className = 'error-message';
                        errorMsg.style.color = '#ff6b6b';
                        errorMsg.style.fontSize = '0.8rem';
                        errorMsg.style.marginTop = '0.3rem';
                        errorMsg.textContent = 'This field is required';
                        field.parentNode.appendChild(errorMsg);
                    }
                } else {
                    // Remove error message if exists
                    const errorMsg = field.parentNode.querySelector('.error-message');
                    if (errorMsg) {
                        errorMsg.remove();
                    }
                }
                
                // Email validation
                if (field.type === 'email' && field.value.trim()) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(field.value.trim())) {
                        field.style.borderColor = '#ff6b6b';
                        isValid = false;
                        
                        if (!field.nextElementSibling || !field.nextElementSibling.classList.contains('error-message')) {
                            const errorMsg = document.createElement('div');
                            errorMsg.className = 'error-message';
                            errorMsg.style.color = '#ff6b6b';
                            errorMsg.style.fontSize = '0.8rem';
                            errorMsg.style.marginTop = '0.3rem';
                            errorMsg.textContent = 'Please enter a valid email address';
                            field.parentNode.appendChild(errorMsg);
                        }
                    }
                }
            });
            
            return isValid;
        }
        
        // Form submission
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Validate form
            if (!validateForm()) {
                return;
            }
            
            // Get form data
            const formData = new FormData(this);
            const submitBtn = this.querySelector('.submit-btn');
            const originalText = submitBtn.innerHTML;
            
            // Show loading state
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            try {
                // Simulate API call (replace with actual Formspree or backend)
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                // Show success message
                showNotification('Thank you for your inquiry! We will contact you shortly.', 'success');
                
                // Reset form
                this.reset();
                
            } catch (error) {
                console.error('Form submission error:', error);
                showNotification('There was an error sending your message. Please try again.', 'error');
                
            } finally {
                // Reset button state
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
        
        // Real-time validation
        contactForm.querySelectorAll('input, textarea').forEach(field => {
            field.addEventListener('input', function() {
                this.style.borderColor = '#ddd';
                
                // Remove error message
                const errorMsg = this.parentNode.querySelector('.error-message');
                if (errorMsg) {
                    errorMsg.remove();
                }
                
                // Email validation on input
                if (this.type === 'email' && this.value.trim()) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(this.value.trim())) {
                        this.style.borderColor = '#ffa8a8';
                    } else {
                        this.style.borderColor = '#51cf66';
                    }
                }
            });
            
            field.addEventListener('blur', function() {
                if (this.value.trim()) {
                    this.style.borderColor = '#51cf66';
                }
            });
        });
    }
    
    // ============================================
    // GALLERY LIGHTBOX FUNCTIONALITY
    // ============================================
    function initGalleryLightbox() {
        const galleryItems = document.querySelectorAll('.gallery-item');
        if (galleryItems.length === 0) return;
        
        // Create modal element
        const modal = document.createElement('div');
        modal.className = 'gallery-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <img src="" alt="" class="modal-img">
                <div class="modal-caption"></div>
                <button class="modal-close">&times;</button>
                <button class="modal-prev">&larr;</button>
                <button class="modal-next">&rarr;</button>
            </div>
        `;
        document.body.appendChild(modal);
        
        // Add modal styles
        const modalStyles = document.createElement('style');
        modalStyles.textContent = `
            .gallery-modal {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.95);
                z-index: 10000;
                justify-content: center;
                align-items: center;
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            
            .gallery-modal.active {
                display: flex;
                opacity: 1;
            }
            
            .modal-content {
                position: relative;
                max-width: 90%;
                max-height: 90%;
            }
            
            .modal-img {
                max-width: 100%;
                max-height: 80vh;
                border-radius: 10px;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            }
            
            .modal-caption {
                color: white;
                text-align: center;
                margin-top: 1rem;
                font-size: 1.2rem;
            }
            
            .modal-close, .modal-prev, .modal-next {
                position: absolute;
                background: rgba(255, 255, 255, 0.2);
                border: none;
                color: white;
                font-size: 2rem;
                cursor: pointer;
                padding: 0.5rem 1rem;
                border-radius: 50%;
                transition: all 0.3s ease;
            }
            
            .modal-close:hover, .modal-prev:hover, .modal-next:hover {
                background: rgba(255, 255, 255, 0.3);
            }
            
            .modal-close {
                top: -50px;
                right: 0;
            }
            
            .modal-prev {
                top: 50%;
                left: -60px;
                transform: translateY(-50%);
            }
            
            .modal-next {
                top: 50%;
                right: -60px;
                transform: translateY(-50%);
            }
            
            @media (max-width: 768px) {
                .modal-prev, .modal-next {
                    position: fixed;
                    top: auto;
                    bottom: 20px;
                }
                
                .modal-prev {
                    left: 20px;
                }
                
                .modal-next {
                    right: 20px;
                }
                
                .modal-close {
                    top: 20px;
                    right: 20px;
                }
            }
        `;
        document.head.appendChild(modalStyles);
        
        let currentIndex = 0;
        const images = Array.from(galleryItems).map(item => ({
            src: item.querySelector('img').src,
            alt: item.querySelector('img').alt,
            caption: item.querySelector('.gallery-caption').textContent
        }));
        
        // Open modal on gallery item click
        galleryItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                currentIndex = index;
                updateModal();
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });
        
        // Modal functions
        function updateModal() {
            const modalImg = modal.querySelector('.modal-img');
            const modalCaption = modal.querySelector('.modal-caption');
            
            modalImg.src = images[currentIndex].src;
            modalImg.alt = images[currentIndex].alt;
            modalCaption.textContent = images[currentIndex].caption;
        }
        
        // Close modal
        modal.querySelector('.modal-close').addEventListener('click', () => {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
        
        // Close modal on background click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
        
        // Close modal on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                modal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
            
            // Navigation with arrow keys
            if (modal.classList.contains('active')) {
                if (e.key === 'ArrowLeft') {
                    currentIndex = (currentIndex - 1 + images.length) % images.length;
                    updateModal();
                } else if (e.key === 'ArrowRight') {
                    currentIndex = (currentIndex + 1) % images.length;
                    updateModal();
                }
            }
        });
        
        // Previous/Next buttons
        modal.querySelector('.modal-prev').addEventListener('click', (e) => {
            e.stopPropagation();
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            updateModal();
        });
        
        modal.querySelector('.modal-next').addEventListener('click', (e) => {
            e.stopPropagation();
            currentIndex = (currentIndex + 1) % images.length;
            updateModal();
        });
    }
    
    // Initialize gallery if gallery section exists
    if (document.querySelector('#gallery')) {
        initGalleryLightbox();
    }
    
    // ============================================
    // NOTIFICATION SYSTEM
    // ============================================
    function showNotification(message, type = 'info') {
        // Remove existing notification
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">&times;</button>
        `;
        
        // Add styles
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.right = '20px';
        notification.style.padding = '1rem 1.5rem';
        notification.style.borderRadius = '8px';
        notification.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)';
        notification.style.zIndex = '9999';
        notification.style.display = 'flex';
        notification.style.alignItems = 'center';
        notification.style.justifyContent = 'space-between';
        notification.style.gap = '1rem';
        notification.style.maxWidth = '400px';
        notification.style.animation = 'fadeIn 0.3s ease-out';
        
        // Set colors based on type
        if (type === 'success') {
            notification.style.backgroundColor = '#ebfbee';
            notification.style.color = '#2b8a3e';
            notification.style.border = '1px solid #69db7c';
        } else {
            notification.style.backgroundColor = '#fff5f5';
            notification.style.color = '#c92a2a';
            notification.style.border = '1px solid #ffa8a8';
        }
        
        // Close button styles
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.style.background = 'none';
        closeBtn.style.border = 'none';
        closeBtn.style.fontSize = '1.5rem';
        closeBtn.style.cursor = 'pointer';
        closeBtn.style.color = 'inherit';
        closeBtn.style.padding = '0';
        closeBtn.style.margin = '0';
        
        // Close functionality
        closeBtn.addEventListener('click', () => {
            notification.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        });
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'fadeOut 0.3s ease-out';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
        
        // Add to document
        document.body.appendChild(notification);
        
        // Add fadeOut animation
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes fadeOut {
                    from { opacity: 1; transform: translateY(0); }
                    to { opacity: 0; transform: translateY(-20px); }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // ============================================
    // IMAGE LAZY LOADING
    // ============================================
    const images = document.querySelectorAll('img');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px'
    });
    
    images.forEach(img => {
        // Store original src in data-src
        if (!img.dataset.src) {
            img.dataset.src = img.src;
        }
        // Set initial placeholder or low-quality image
        if (img.classList.contains('lazy')) {
            img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="' + img.width + '" height="' + img.height + '" viewBox="0 0 ' + img.width + ' ' + img.height + '"%3E%3Crect width="100%" height="100%" fill="%23f0f0f0"/%3E%3C/svg%3E';
            imageObserver.observe(img);
        }
    });
    
    // ============================================
    // UPDATE COPYRIGHT YEAR
    // ============================================
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
    
    // ============================================
    // STICKY HEADER
    // ============================================
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        if (window.scrollY > 100) {
            header.style.backgroundColor = 'rgba(0, 59, 92, 0.98)';
            header.style.padding = '0.7rem 0';
            header.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.backgroundColor = 'rgba(0, 59, 92, 0.95)';
            header.style.padding = '0.8rem 0';
            header.style.boxShadow = '0 2px 15px rgba(0, 0, 0, 0.1)';
        }
    });
    
    // ============================================
    // COUNTER ANIMATION FOR STATS
    // ============================================
    function animateCounter(element, target, duration = 2000) {
        const start = 0;
        const increment = target / (duration / 16); // 60fps
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target.toLocaleString();
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current).toLocaleString();
            }
        }, 16);
    }
    
    // Animate stats when in viewport
    const statObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumber = entry.target.querySelector('.impact-number');
                if (statNumber) {
                    const target = parseInt(statNumber.textContent.replace(/,/g, ''));
                    if (!isNaN(target)) {
                        animateCounter(statNumber, target);
                    }
                }
                statObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    // Observe impact stats
    document.querySelectorAll('.impact-stat').forEach(stat => {
        statObserver.observe(stat);
    });
    
    console.log('All JavaScript functionality loaded successfully');
});