const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const isOpen = navLinks.classList.contains('active');
        menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navLinks.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
        });
    });
}

const animateSkills = () => {
    document.querySelectorAll('.skill-level').forEach((skill) => {
        const level = skill.getAttribute('data-level');
        if (level) {
            skill.style.width = `${level}%`;
        }
    });
};

const skillObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            animateSkills();
            observer.disconnect();
        }
    });
}, { threshold: 0.4 });

const skillsSection = document.querySelector('.skills');
if (skillsSection) {
    skillObserver.observe(skillsSection);
}

const statNumbers = document.querySelectorAll('.stat-number[data-count]');

const animateCounter = (element) => {
    const target = parseInt(element.getAttribute('data-count'), 10);
    if (Number.isNaN(target)) {
        return;
    }

    const duration = 1800;
    const step = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
};

const statsSection = document.querySelector('.stats');
if (statsSection) {
    const observerStats = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                statNumbers.forEach(animateCounter);
                observer.disconnect();
            }
        });
    }, { threshold: 0.4 });

    observerStats.observe(statsSection);
}

const filterButtons = document.querySelectorAll('.filter-btn');
const allProjects = document.querySelectorAll('.project-card');

filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
        filterButtons.forEach((btn) => btn.classList.remove('active'));
        button.classList.add('active');

        const filter = button.getAttribute('data-filter');

        allProjects.forEach((project) => {
            const category = project.getAttribute('data-category');
            const shouldShow = filter === 'all' || category === filter;

            if (shouldShow) {
                project.classList.remove('is-hidden');
                requestAnimationFrame(() => {
                    project.classList.remove('is-fading');
                });
            } else {
                project.classList.add('is-fading');
                setTimeout(() => {
                    project.classList.add('is-hidden');
                }, 200);
            }
        });
    });
});

const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        console.log('Message envoye:', data);

        alert('Message envoye avec succes ! Je vous repondrai rapidement.');
        contactForm.reset();
    });
}

const revealGroups = [
    '.hero-text > *',
    '.hero-image',
    '.stat-item',
    '.about-text > *',
    '.info-item',
    '.tag',
    '.skill-category',
    '.project-card',
    '.category',
    '.timeline-item',
    '.contact-item',
    '.contact-form'
];

const revealElements = document.querySelectorAll(revealGroups.join(', '));
revealElements.forEach((element, index) => {
    element.classList.add('reveal');
    const delay = (index % 8) * 70;
    element.style.transitionDelay = `${delay}ms`;
});

const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.2 });

revealElements.forEach((element) => revealObserver.observe(element));

const floatingElements = document.querySelectorAll('.floating-element');
floatingElements.forEach((element, index) => {
    element.style.animationDelay = `${index * 2}s`;
});

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const scrollProgress = document.querySelector('.scroll-progress');

const updateScrollProgress = () => {
    if (!scrollProgress) {
        return;
    }

    const max = document.documentElement.scrollHeight - window.innerHeight;
    const progress = max > 0 ? (window.scrollY / max) * 100 : 0;
    scrollProgress.style.width = `${Math.min(100, Math.max(0, progress))}%`;
};

updateScrollProgress();

window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (!navbar) {
        return;
    }
    if (window.scrollY > 80) {
        navbar.classList.add('is-scrolled');
    } else {
        navbar.classList.remove('is-scrolled');
    }

    updateScrollProgress();
});

document.querySelectorAll('a[href="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        link.classList.add('is-placeholder');
        const original = link.textContent;
        link.textContent = 'A configurer';
        setTimeout(() => {
            link.textContent = original;
            link.classList.remove('is-placeholder');
        }, 1000);
    });
});

if (!prefersReducedMotion) {
    const hero = document.querySelector('.hero');
    const parallaxTargets = document.querySelectorAll('.orb, .floating-element');

    if (hero && parallaxTargets.length) {
        hero.addEventListener('mousemove', (event) => {
            const rect = hero.getBoundingClientRect();
            const x = (event.clientX - rect.left) / rect.width - 0.5;
            const y = (event.clientY - rect.top) / rect.height - 0.5;

            parallaxTargets.forEach((node, index) => {
                const depth = (index % 3 + 1) * 4;
                node.style.transform = `translate(${x * depth}px, ${y * depth}px)`;
            });
        });

        hero.addEventListener('mouseleave', () => {
            parallaxTargets.forEach((node) => {
                node.style.transform = '';
            });
        });
    }
}
