/* ═══════════════════════════════════════════════════════════════════════════ */
/* PORTFOLIO MODERNO - JAVASCRIPT AVANÇADO COM EFEITOS CONTEMPORÂNEOS */
/* ═══════════════════════════════════════════════════════════════════════════ */

class ModernPortfolioApp {
    constructor() {
        // Elementos DOM principais
        this.navbar = document.getElementById('modernNavbar');
        this.mobileMenuBtn = document.getElementById('mobileMenuModern');
        this.mobileOverlay = document.getElementById('mobileOverlay');
        this.mobileClose = document.getElementById('mobileClose');
        this.themeToggle = document.getElementById('themeToggleModern');
        this.scrollProgress = document.getElementById('scrollProgress');
        
        // Estados da aplicação
        this.isMenuOpen = false;
        this.currentTheme = 'dark';
        this.scrollPosition = 0;
        this.isScrolling = false;
        
        // Configurações
        this.scrollThrottle = 16; // ~60fps
        this.animationDuration = 300;
        
        // Inicializar aplicação
        this.init();
    }
    
    /* ─────────────────────────────────────────────────────────────────────── */
    /* INICIALIZAÇÃO */
    /* ─────────────────────────────────────────────────────────────────────── */
    
    init() {
        this.setupEventListeners();
        this.setupScrollEffects();
        this.setupTypingEffect();
        this.setupAnimations();
        this.setupTheme();
        this.setupNavbarEffects();
        this.setupParallaxEffects();
        
        console.log('🚀 Portfolio Moderno inicializado com sucesso!');
    }
    
    /* ─────────────────────────────────────────────────────────────────────── */
    /* EVENT LISTENERS */
    /* ─────────────────────────────────────────────────────────────────────── */
    
    setupEventListeners() {
        // Menu Mobile
        this.mobileMenuBtn?.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleMobileMenu();
        });
        
        this.mobileClose?.addEventListener('click', (e) => {
            e.preventDefault();
            this.closeMobileMenu();
        });
        
        // Fechar menu ao clicar em link
        document.querySelectorAll('.mobile-nav-link').forEach(link => {
            link.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        });
        
        // Theme Toggle
        this.themeToggle?.addEventListener('click', () => {
            this.toggleTheme();
        });
        
        // Scroll Events
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (!scrollTimeout) {
                scrollTimeout = setTimeout(() => {
                    this.handleScroll();
                    scrollTimeout = null;
                }, this.scrollThrottle);
            }
        });
        
        // Keyboard Events
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMenuOpen) {
                this.closeMobileMenu();
            }
        });
        
        // Resize Events
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && this.isMenuOpen) {
                this.closeMobileMenu();
            }
        });
        
        // Smooth Scroll para links âncora
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href !== '#' && href.length > 1) {
                    e.preventDefault();
                    this.smoothScrollTo(href);
                }
            });
        });
        
        // Hover effects para nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('mouseenter', () => {
                this.animateNavLink(link, true);
            });
            
            link.addEventListener('mouseleave', () => {
                this.animateNavLink(link, false);
            });
        });
    }
    
    /* ─────────────────────────────────────────────────────────────────────── */
    /* MENU MOBILE MODERNO */
    /* ─────────────────────────────────────────────────────────────────────── */
    
    toggleMobileMenu() {
        if (this.isMenuOpen) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }
    
    openMobileMenu() {
        this.isMenuOpen = true;
        
        // Atualizar classes
        this.mobileMenuBtn.classList.add('active');
        this.mobileOverlay.classList.add('active');
        
        // Prevenir scroll do body
        this.scrollPosition = window.pageYOffset;
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.top = `-${this.scrollPosition}px`;
        document.body.style.width = '100%';
        
        // Animar links do menu
        this.animateMobileLinks();
        
        // Efeito sonoro (opcional)
        this.playMenuSound();
    }
    
    closeMobileMenu() {
        this.isMenuOpen = false;
        
        // Atualizar classes
        this.mobileMenuBtn.classList.remove('active');
        this.mobileOverlay.classList.remove('active');
        
        // Restaurar scroll do body
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        window.scrollTo(0, this.scrollPosition);
    }
    
    animateMobileLinks() {
        const links = document.querySelectorAll('.mobile-nav-link');
        
        links.forEach((link, index) => {
            // Reset inicial
            link.style.transform = 'translateX(-100px)';
            link.style.opacity = '0';
            
            // Animação escalonada
            setTimeout(() => {
                link.style.transition = 'all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
                link.style.transform = 'translateX(0)';
                link.style.opacity = '1';
            }, index * 100 + 200);
        });
    }
    
    /* ─────────────────────────────────────────────────────────────────────── */
    /* SISTEMA DE TEMA AVANÇADO */
    /* ─────────────────────────────────────────────────────────────────────── */
    
    setupTheme() {
        // Carregar tema salvo
        const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
        this.currentTheme = savedTheme;
        this.applyTheme(savedTheme);
    }
    
    toggleTheme() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.currentTheme = newTheme;
        
        // Animação de transição
        this.animateThemeTransition();
        
        // Aplicar novo tema
        setTimeout(() => {
            this.applyTheme(newTheme);
        }, 150);
        
        // Salvar preferência
        localStorage.setItem('portfolio-theme', newTheme);
    }
    
    applyTheme(theme) {
        document.body.setAttribute('data-theme', theme);
        
        // Atualizar toggle button
        if (this.themeToggle) {
            if (theme === 'light') {
                this.themeToggle.classList.add('light');
            } else {
                this.themeToggle.classList.remove('light');
            }
        }
        
        // Atualizar cores CSS customizadas
        this.updateThemeColors(theme);
    }
    
    updateThemeColors(theme) {
        const root = document.documentElement;
        
        if (theme === 'light') {
            root.style.setProperty('--dark', '#f8fafc');
            root.style.setProperty('--darker', '#ffffff');
            root.style.setProperty('--light', '#0f172a');
            root.style.setProperty('--gray', '#475569');
        } else {
            root.style.setProperty('--dark', '#0f172a');
            root.style.setProperty('--darker', '#020617');
            root.style.setProperty('--light', '#f8fafc');
            root.style.setProperty('--gray', '#64748b');
        }
    }
    
    animateThemeTransition() {
        // Criar overlay de transição
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: ${this.currentTheme === 'dark' ? '#f8fafc' : '#0f172a'};
            z-index: 9999;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s ease;
        `;
        
        document.body.appendChild(overlay);
        
        // Animar overlay
        requestAnimationFrame(() => {
            overlay.style.opacity = '1';
        });
        
        // Remover overlay
        setTimeout(() => {
            overlay.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(overlay);
            }, 300);
        }, 150);
    }
    
    /* ─────────────────────────────────────────────────────────────────────── */
    /* EFEITOS DE SCROLL AVANÇADOS */
    /* ─────────────────────────────────────────────────────────────────────── */
    
    handleScroll() {
        const scrollY = window.pageYOffset;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        
        // Atualizar barra de progresso
        this.updateScrollProgress(scrollY, documentHeight, windowHeight);
        
        // Efeitos da navbar
        this.updateNavbarOnScroll(scrollY);
        
        // Parallax effects
        this.updateParallaxEffects(scrollY);
        
        // Revelar elementos
        this.revealElementsOnScroll();
    }
    
    updateScrollProgress(scrollY, documentHeight, windowHeight) {
        const scrollPercent = (scrollY / (documentHeight - windowHeight)) * 100;
        
        if (this.scrollProgress) {
            this.scrollProgress.style.width = `${Math.min(scrollPercent, 100)}%`;
        }
    }
    
    updateNavbarOnScroll(scrollY) {
        if (!this.navbar) return;
        
        if (scrollY > 50) {
            this.navbar.classList.add('scrolled');
        } else {
            this.navbar.classList.remove('scrolled');
        }
        
        // Efeito de hide/show navbar
        if (scrollY > this.scrollPosition && scrollY > 100) {
            // Scrolling down
            this.navbar.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            this.navbar.style.transform = 'translateY(0)';
        }
        
        this.scrollPosition = scrollY;
    }
    
    setupNavbarEffects() {
        if (this.navbar) {
            this.navbar.style.transition = 'transform 0.3s ease, background 0.3s ease';
        }
    }
    
    /* ─────────────────────────────────────────────────────────────────────── */
    /* EFEITOS PARALLAX */
    /* ─────────────────────────────────────────────────────────────────────── */
    
    setupParallaxEffects() {
        // Configurar elementos parallax
        this.parallaxElements = document.querySelectorAll('.mobile-circle');
    }
    
    updateParallaxEffects(scrollY) {
        if (this.parallaxElements) {
            this.parallaxElements.forEach((element, index) => {
                const speed = 0.5 + (index * 0.2);
                const yPos = -(scrollY * speed);
                element.style.transform = `translateY(${yPos}px) rotate(${scrollY * 0.1}deg)`;
            });
        }
    }
    
    /* ─────────────────────────────────────────────────────────────────────── */
    /* ANIMAÇÕES DE ELEMENTOS */
    /* ─────────────────────────────────────────────────────────────────────── */
    
    setupAnimations() {
        // Intersection Observer para animações
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                    this.observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        // Observar seções
        document.querySelectorAll('section').forEach(section => {
            this.observer.observe(section);
        });
    }
    
    animateElement(element) {
        element.classList.add('animate-in');
        
        // Animações específicas por seção
        if (element.classList.contains('stats')) {
            this.animateCounters();
        }
        
        if (element.classList.contains('skills')) {
            this.animateSkillBars();
        }
        
        if (element.classList.contains('projects')) {
            this.animateProjectCards();
        }
    }
    
    revealElementsOnScroll() {
        const elements = document.querySelectorAll('.project-card, .skill-category, .stat-item');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('animate-in');
            }
        });
    }
    
    /* ─────────────────────────────────────────────────────────────────────── */
    /* ANIMAÇÃO DE CONTADORES */
    /* ─────────────────────────────────────────────────────────────────────── */
    
    animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000; // 2 segundos
            const increment = target / (duration / 16); // 60fps
            let current = 0;
            
            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    counter.textContent = Math.ceil(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                    
                    // Efeito de pulse no final
                    counter.style.transform = 'scale(1.1)';
                    setTimeout(() => {
                        counter.style.transform = 'scale(1)';
                    }, 200);
                }
            };
            
            updateCounter();
        });
    }
    
    /* ─────────────────────────────────────────────────────────────────────── */
    /* ANIMAÇÃO DE SKILL BARS */
    /* ─────────────────────────────────────────────────────────────────────── */
    
    animateSkillBars() {
        const skillBars = document.querySelectorAll('.skill-progress');
        
        skillBars.forEach((bar, index) => {
            const width = bar.getAttribute('data-width');
            
            setTimeout(() => {
                bar.style.width = width + '%';
                
                // Efeito de glow durante a animação
                bar.style.boxShadow = '0 0 10px rgba(99, 102, 241, 0.5)';
                setTimeout(() => {
                    bar.style.boxShadow = 'none';
                }, 1000);
                
            }, index * 200);
        });
    }
    
    /* ─────────────────────────────────────────────────────────────────────── */
    /* ANIMAÇÃO DE PROJECT CARDS */
    /* ─────────────────────────────────────────────────────────────────────── */
    
    animateProjectCards() {
        const cards = document.querySelectorAll('.project-card');
        
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.style.transform = 'translateY(0)';
                card.style.opacity = '1';
            }, index * 150);
        });
    }
    
    /* ─────────────────────────────────────────────────────────────────────── */
    /* EFEITO DE DIGITAÇÃO AVANÇADO */
    /* ─────────────────────────────────────────────────────────────────────── */
    
    setupTypingEffect() {
        const typingElement = document.getElementById('typingText');
        if (!typingElement) return;
        
        const texts = [
            'Desenvolvedor Full Stack',
            'Criador de Experiências',
            'Inovador Digital',
            'Solucionador de Problemas'
        ];
        
        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typeSpeed = 100;
        
        const type = () => {
            const currentText = texts[textIndex];
            
            if (isDeleting) {
                typingElement.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;
                typeSpeed = 50;
            } else {
                typingElement.textContent = currentText.substring(0, charIndex + 1);
                charIndex++;
                typeSpeed = 100;
            }
            
            // Efeito de cursor piscando
            typingElement.style.borderRight = '2px solid var(--primary)';
            
            if (!isDeleting && charIndex === currentText.length) {
                typeSpeed = 2000;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
                typeSpeed = 500;
            }
            
            setTimeout(type, typeSpeed);
        };
        
        type();
    }
    
    /* ─────────────────────────────────────────────────────────────────────── */
    /* NAVEGAÇÃO SUAVE */
    /* ─────────────────────────────────────────────────────────────────────── */
    
    smoothScrollTo(target) {
        const element = document.querySelector(target);
        if (!element) return;
        
        const offsetTop = element.offsetTop - 80; // Altura da navbar
        const startPosition = window.pageYOffset;
        const distance = offsetTop - startPosition;
        const duration = 800;
        let start = null;
        
        const animation = (currentTime) => {
            if (start === null) start = currentTime;
            const timeElapsed = currentTime - start;
            const run = this.easeInOutQuad(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            
            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        };
        
        requestAnimationFrame(animation);
    }
    
    easeInOutQuad(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }
    
    /* ─────────────────────────────────────────────────────────────────────── */
    /* EFEITOS DE HOVER AVANÇADOS */
    /* ─────────────────────────────────────────────────────────────────────── */
    
    animateNavLink(link, isHover) {
        const icon = link.querySelector('.nav-icon');
        const text = link.querySelector('.nav-text');
        
        if (isHover) {
            if (icon) {
                icon.style.transform = 'scale(1.2) rotate(10deg)';
            }
            if (text) {
                text.style.transform = 'translateX(2px)';
            }
        } else {
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
            if (text) {
                text.style.transform = 'translateX(0)';
            }
        }
    }
    
    /* ─────────────────────────────────────────────────────────────────────── */
    /* EFEITOS SONOROS (OPCIONAL) */
    /* ─────────────────────────────────────────────────────────────────────── */
    
    playMenuSound() {
        // Criar contexto de áudio para feedback sonoro
        if (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined') {
            const audioContext = new (AudioContext || webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
        }
    }
    
    /* ─────────────────────────────────────────────────────────────────────── */
    /* UTILITÁRIOS */
    /* ─────────────────────────────────────────────────────────────────────── */
    
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
    
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/* INICIALIZAÇÃO DA APLICAÇÃO */
/* ═══════════════════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar aplicação moderna
    window.portfolioApp = new ModernPortfolioApp();
    
    // Easter egg - Konami Code
    let konamiCode = [];
    const konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // ↑↑↓↓←→←→BA
    
    document.addEventListener('keydown', (e) => {
        konamiCode.push(e.keyCode);
        if (konamiCode.length > konamiSequence.length) {
            konamiCode.shift();
        }
        
        if (konamiCode.join(',') === konamiSequence.join(',')) {
            // Easter egg ativado!
            document.body.style.animation = 'rainbow 2s infinite';
            setTimeout(() => {
                document.body.style.animation = '';
            }, 5000);
        }
    });
});

/* ═══════════════════════════════════════════════════════════════════════════ */
/* CSS ANIMATIONS ADICIONAIS VIA JAVASCRIPT */
/* ═══════════════════════════════════════════════════════════════════════════ */

// Adicionar keyframes dinamicamente
const style = document.createElement('style');
style.textContent = `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
    
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);

/* ═══════════════════════════════════════════════════════════════════════════ */
/* PERFORMANCE MONITORING */
/* ═══════════════════════════════════════════════════════════════════════════ */

// Monitor de performance (desenvolvimento)
if (typeof performance !== 'undefined' && performance.mark) {
    performance.mark('portfolio-start');
    
    window.addEventListener('load', () => {
        performance.mark('portfolio-end');
        performance.measure('portfolio-load', 'portfolio-start', 'portfolio-end');
        
        const measure = performance.getEntriesByName('portfolio-load')[0];
        console.log(`⚡ Portfolio carregado em ${measure.duration.toFixed(2)}ms`);
    });
}
