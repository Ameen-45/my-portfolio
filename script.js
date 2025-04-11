document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navList = document.querySelector('.nav-list');
    const navbar = document.querySelector('.navbar');
    const heroSection = document.querySelector('.hero');
    
    // Initialize last scroll position
    let lastScrollPosition = window.scrollY;
    let ticking = false;

    menuToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        navList.classList.toggle('active');
        document.body.style.overflow = navList.classList.contains('active') ? 'hidden' : '';
        
        // Add/remove scrolled class based on menu state
        if (navList.classList.contains('active')) {
            navbar.classList.add('scrolled');
        } else if (window.scrollY <= 50) {
            navbar.classList.remove('scrolled');
        }
    });

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-list a').forEach(link => {
        link.addEventListener('click', () => {
            if (navList.classList.contains('active')) {
                menuToggle.classList.remove('active');
                navList.classList.remove('active');
                document.body.style.overflow = '';
                
                // Remove scrolled class if at top of page
                if (window.scrollY <= 50) {
                    navbar.classList.remove('scrolled');
                }
            }
        });
    });

    // Handle scroll events with debouncing
    window.addEventListener('scroll', function() {
        lastScrollPosition = window.scrollY;
        
        if (!ticking) {
            window.requestAnimationFrame(function() {
                handleScroll(lastScrollPosition);
                ticking = false;
            });
            ticking = true;
        }
    });

    function handleScroll(currentScroll) {
        const scrollDirection = currentScroll > lastScrollPosition ? 'down' : 'up';
        const isMobile = window.innerWidth <= 768;
        
        // Navbar scroll effects
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
            
            // On mobile, hide navbar when scrolling down, show when scrolling up
            if (isMobile) {
                if (scrollDirection === 'down' && !navList.classList.contains('active')) {
                    navbar.style.transform = 'translateY(-100%)';
                } else {
                    navbar.style.transform = 'translateY(0)';
                }
            }
        } else {
            navbar.classList.remove('scrolled');
            navbar.style.transform = 'translateY(0)';
        }
        
        // Auto-close mobile menu when scrolling up
        if (scrollDirection === 'up' && navList.classList.contains('active')) {
            menuToggle.classList.remove('active');
            navList.classList.remove('active');
            document.body.style.overflow = '';
        }
        
        // Adjust hero section padding to account for navbar height
        if (heroSection) {
            const navbarHeight = navbar.offsetHeight;
            heroSection.style.paddingTop = `${navbarHeight}px`;
        }
        
        lastScrollPosition = currentScroll;
    }

    // Close mobile menu by touching outside
    document.addEventListener('touchstart', function(e) {
        if (navList.classList.contains('active') &&
            !e.target.closest('.nav-list') &&
            !e.target.closest('.menu-toggle')) {
            menuToggle.classList.remove('active');
            navList.classList.remove('active');
            document.body.style.overflow = '';
            
            // Remove scrolled class if at top of page
            if (window.scrollY <= 50) {
                navbar.classList.remove('scrolled');
            }
        }
    });

    // Service Tabs
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            document.getElementById(this.getAttribute('data-tab')).classList.add('active');
        });
    });

    // Default tab
    document.querySelector('.tab-btn[data-tab="career"]').classList.add('active');
    document.getElementById('career').classList.add('active');

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (!target) return;
            const offset = 80;
            const top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        });
    });

    // Contact Modal Button Setup
    document.querySelectorAll('.contact-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            showContactOptions(this.getAttribute('data-service'));
        });
    });

    // Initialize
    handleScroll(window.scrollY);
});

// Show Contact Options
function showContactOptions(serviceName) {
    const modal = document.createElement('div');
    modal.className = 'contact-modal';
    modal.innerHTML = `
        <div class="contact-modal-content">
            <span class="close-btn">&times;</span>
            <h3>Contact About ${serviceName}</h3>
            <p>How would you like to contact Me?</p>
            <button class="whatsapp-btn">
                <i class="fab fa-whatsapp"></i> WhatsApp
            </button>
            <button class="email-btn">
                <i class="fas fa-envelope"></i> Email
            </button>
        </div>
    `;
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';

    modal.querySelector('.close-btn').addEventListener('click', closeModal);
    modal.querySelector('.whatsapp-btn').addEventListener('click', () => contactViaWhatsapp(serviceName));
    modal.querySelector('.email-btn').addEventListener('click', () => contactViaEmail(serviceName));
    modal.addEventListener('click', e => {
        if (e.target === modal) closeModal();
    });
    window.addEventListener('scroll', closeModalOnScroll);

    setTimeout(() => modal.classList.add('active'), 10);
}

// Close Modal
function closeModal() {
    const modal = document.querySelector('.contact-modal');
    if (modal) {
        modal.classList.remove('active');
        window.removeEventListener('scroll', closeModalOnScroll);
        setTimeout(() => {
            modal.remove();
            document.body.style.overflow = '';
        }, 300);
    }
}

// Scroll Close Handler
function closeModalOnScroll() {
    closeModal();
}

// WhatsApp Contact
function contactViaWhatsapp(serviceName) {
    const message = `Hi, I'm interested in your ${serviceName} service. Could you please provide more information?`;
    const link = `https://wa.me/19702994546?text=${encodeURIComponent(message)}`;
    window.open(link, "_blank");
    closeModal();
}

// Email Contact
function contactViaEmail(serviceName) {
    const subject = `Inquiry About ${serviceName} Service`;
    const link = `mailto:ameenmujahid45@gmail.com?subject=${encodeURIComponent(subject)}`;
    window.open(link, "_blank");
    closeModal();
}