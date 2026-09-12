// Shared JavaScript for Portfolio Website

class PortfolioApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupMobileMenu();
        this.setupSmoothScrolling();
        this.setupThemeToggle();
        this.setupIntersectionObserver();
        this.setupKeyboardNavigation();
        this.setupPerformanceOptimizations();
    }

    // Mobile menu functionality
    setupMobileMenu() {
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const mobileMenu = document.getElementById('mobileMenu');

        if (mobileMenuToggle && mobileMenu) {
            mobileMenuToggle.addEventListener('click', () => {
                mobileMenuToggle.classList.toggle('active');
                mobileMenu.classList.toggle('active');
                document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
            });

            // Close mobile menu when clicking on a link
            mobileMenu.addEventListener('click', (e) => {
                if (e.target.tagName === 'A') {
                    mobileMenuToggle.classList.remove('active');
                    mobileMenu.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        }
    }

    // Smooth scrolling for anchor links
    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // Theme toggle functionality
    setupThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        let isDarkMode = true;

        if (themeToggle) {
            // Load saved theme preference
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme) {
                isDarkMode = savedTheme === 'dark';
                this.applyTheme(isDarkMode, themeToggle);
            }

            themeToggle.addEventListener('click', () => {
                isDarkMode = !isDarkMode;
                this.applyTheme(isDarkMode, themeToggle);
                localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
            });
        }
    }

    applyTheme(isDarkMode, themeToggle) {
        if (isDarkMode) {
            themeToggle.innerHTML = '<span>🌙</span> Tema';
            document.documentElement.style.setProperty('--dark', '#0f172a');
            document.documentElement.style.setProperty('--light', '#f8fafc');
        } else {
            themeToggle.innerHTML = '<span>☀️</span> Tema';
            document.documentElement.style.setProperty('--dark', '#f8fafc');
            document.documentElement.style.setProperty('--light', '#0f172a');
        }
    }

    // Intersection Observer for animations
    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('loaded');
                    
                    // Animate counters if present
                    if (entry.target.classList.contains('stats')) {
                        this.animateCounters(entry.target);
                    }
                    
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe all loading elements
        document.querySelectorAll('.loading').forEach(el => {
            observer.observe(el);
        });
    }

    // Counter animation
    animateCounters(statsContainer) {
        const numbers = statsContainer.querySelectorAll('.stat-number');
        numbers.forEach(number => {
            const target = parseInt(number.getAttribute('data-target'));
            this.animateCounter(number, target);
        });
    }

    animateCounter(element, target) {
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                const suffix = element.textContent.includes('+') ? '+' : 
                              element.textContent.includes('%') ? '%' : '';
                element.textContent = target + suffix;
                clearInterval(timer);
            } else {
                const suffix = element.textContent.includes('+') ? '+' : 
                              element.textContent.includes('%') ? '%' : '';
                element.textContent = Math.floor(current) + suffix;
            }
        }, 30);
    }

    // Keyboard navigation support
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            const mobileMenu = document.getElementById('mobileMenu');
            const mobileMenuToggle = document.getElementById('mobileMenuToggle');

            if (e.key === 'Escape' && mobileMenu && mobileMenu.classList.contains('active')) {
                mobileMenuToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // Performance optimizations
    setupPerformanceOptimizations() {
        // Debounce scroll events
        const debouncedScrollHandler = this.debounce(() => {
            this.handleScroll();
        }, 10);

        window.addEventListener('scroll', debouncedScrollHandler);

        // Setup 3D tilt effect only on desktop
        if (window.innerWidth > 768) {
            this.setup3DTiltEffect();
            this.setupCursorTrail();
        }
    }

    handleScroll() {
        const navbar = document.getElementById('navbar');
        const scrollY = window.scrollY;
        
        if (navbar) {
            if (scrollY > 100) {
                navbar.style.background = 'rgba(15, 23, 42, 0.95)';
            } else {
                navbar.style.background = 'rgba(15, 23, 42, 0.8)';
            }
        }

        this.updateActiveNavLink();
    }

    updateActiveNavLink() {
        const navLinks = document.querySelectorAll('.nav-link');
        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // 3D tilt effect for cards
    setup3DTiltEffect() {
        document.querySelectorAll('.project-card, .card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-15px)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
            });
        });
    }

    // Cursor trail effect
    setupCursorTrail() {
        const createCursorTrail = () => {
            const trail = document.createElement('div');
            trail.style.cssText = `
                position: fixed;
                width: 10px;
                height: 10px;
                border-radius: 50%;
                background: radial-gradient(circle, rgba(99, 102, 241, 0.8), transparent);
                pointer-events: none;
                z-index: 9999;
                animation: fadeOut 1s forwards;
            `;
            document.body.appendChild(trail);
            setTimeout(() => trail.remove(), 1000);
            return trail;
        };

        let lastTrailTime = 0;
        document.addEventListener('mousemove', (e) => {
            const now = Date.now();
            if (now - lastTrailTime > 50) {
                const trail = createCursorTrail();
                trail.style.left = e.clientX + 'px';
                trail.style.top = e.clientY + 'px';
                lastTrailTime = now;
            }
        });

        // Add fadeOut animation
        if (!document.getElementById('cursor-trail-styles')) {
            const style = document.createElement('style');
            style.id = 'cursor-trail-styles';
            style.textContent = `
                @keyframes fadeOut {
                    to {
                        opacity: 0;
                        transform: scale(0);
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Utility function for debouncing
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Form validation
    validateForm(form) {
        const inputs = form.querySelectorAll('input[required], textarea[required]');
        let isValid = true;

        inputs.forEach(input => {
            const errorElement = input.parentNode.querySelector('.error-message');
            
            if (!input.value.trim()) {
                this.showFieldError(input, 'Este campo é obrigatório');
                isValid = false;
            } else if (input.type === 'email' && !this.isValidEmail(input.value)) {
                this.showFieldError(input, 'Por favor, insira um email válido');
                isValid = false;
            } else {
                this.hideFieldError(input);
            }
        });

        return isValid;
    }

    showFieldError(input, message) {
        input.style.borderColor = 'var(--danger)';
        
        let errorElement = input.parentNode.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            errorElement.style.cssText = `
                color: var(--danger);
                font-size: 0.9rem;
                margin-top: 5px;
                opacity: 0;
                transition: opacity 0.3s ease;
            `;
            input.parentNode.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
        setTimeout(() => errorElement.style.opacity = '1', 10);
    }

    hideFieldError(input) {
        input.style.borderColor = 'rgba(99, 102, 241, 0.3)';
        
        const errorElement = input.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.style.opacity = '0';
            setTimeout(() => errorElement.remove(), 300);
        }
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Show notification
    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            background: ${type === 'success' ? 'var(--success)' : 'var(--danger)'};
            color: white;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            z-index: 10000;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
            font-weight: 500;
        `;
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        // Animate out and remove
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Loading state management
    showLoading(element) {
        const loader = document.createElement('div');
        loader.className = 'loading-spinner';
        loader.style.cssText = `
            display: inline-block;
            width: 20px;
            height: 20px;
            border: 2px solid rgba(255,255,255,0.3);
            border-radius: 50%;
            border-top-color: white;
            animation: spin 1s ease-in-out infinite;
            margin-left: 10px;
        `;
        
        element.appendChild(loader);
        element.disabled = true;
        
        // Add spin animation if not exists
        if (!document.getElementById('loading-styles')) {
            const style = document.createElement('style');
            style.id = 'loading-styles';
            style.textContent = `
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }
    }

    hideLoading(element) {
        const loader = element.querySelector('.loading-spinner');
        if (loader) {
            loader.remove();
        }
        element.disabled = false;
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioApp();
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PortfolioApp;
}
