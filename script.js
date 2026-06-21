document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initNavigation();
    initScrollState();
    initRevealAnimations();
    initCounters();
    initProjectFilters();
    initProjectModal();
    initServiceButtons();
    initTestimonials();
    initContactForm();
    initCopyEmail();
});

function initTheme() {
    const toggle = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('theme');
    const preferredTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const theme = savedTheme || preferredTheme;

    document.documentElement.setAttribute('data-theme', theme);

    toggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
    });
}

function initNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    hamburger.addEventListener('click', () => {
        const isOpen = navMenu.classList.toggle('active');
        hamburger.setAttribute('aria-expanded', String(isOpen));
        document.body.classList.toggle('menu-open', isOpen);
    });

    navLinks.forEach((link) => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('menu-open');
        });
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            navMenu.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('menu-open');
        }
    });
}

function initScrollState() {
    const progress = document.getElementById('pageProgress');
    const backToTop = document.getElementById('backToTop');
    const sections = document.querySelectorAll('main section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const update = () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progressWidth = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        progress.style.width = `${progressWidth}%`;
        backToTop.classList.toggle('visible', scrollTop > 650);

        let current = 'home';
        sections.forEach((section) => {
            if (scrollTop >= section.offsetTop - 140) {
                current = section.id;
            }
        });

        navLinks.forEach((link) => {
            link.classList.toggle('active', link.dataset.section === current);
        });
    };

    window.addEventListener('scroll', update, { passive: true });
    update();

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

function initRevealAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.14 });

    document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                skillObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.45 });

    document.querySelectorAll('.skill-row').forEach((row) => skillObserver.observe(row));
}

function initCounters() {
    const counters = document.querySelectorAll('[data-count]');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            const counter = entry.target;
            const target = Number(counter.dataset.count);
            const duration = 900;
            const start = performance.now();

            const tick = (now) => {
                const progress = Math.min((now - start) / duration, 1);
                counter.textContent = `${Math.floor(progress * target)}+`;
                if (progress < 1) requestAnimationFrame(tick);
            };

            requestAnimationFrame(tick);
            observer.unobserve(counter);
        });
    }, { threshold: 1 });

    counters.forEach((counter) => observer.observe(counter));
}

function initProjectFilters() {
    const buttons = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.project-card');

    buttons.forEach((button) => {
        button.addEventListener('click', () => {
            buttons.forEach((item) => item.classList.remove('active'));
            button.classList.add('active');

            const filter = button.dataset.filter;
            cards.forEach((card) => {
                const shouldShow = filter === 'all' || card.dataset.category === filter;
                card.classList.toggle('hidden', !shouldShow);
            });
        });
    });
}

function initProjectModal() {
    const modal = document.getElementById('projectModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const close = document.getElementById('modalClose');

    document.querySelectorAll('.project-link').forEach((button) => {
        button.addEventListener('click', () => {
            const card = button.closest('.project-card');
            modalTitle.textContent = card.dataset.title;
            modalDescription.textContent = card.dataset.description;

            if (typeof modal.showModal === 'function') {
                modal.showModal();
            } else {
                alert(`${card.dataset.title}\n\n${card.dataset.description}`);
            }
        });
    });

    close.addEventListener('click', () => modal.close());

    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.close();
        }
    });
}

function initServiceButtons() {
    const projectType = document.getElementById('projectType');

    document.querySelectorAll('[data-service]').forEach((button) => {
        button.addEventListener('click', () => {
            projectType.value = button.dataset.service;
            document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
        });
    });
}

function initTestimonials() {
    const testimonials = [
        {
            quote: 'Daniel took our rough idea and turned it into a clean, professional website that felt easy to use on every device.',
            name: 'Amara King',
            role: 'Founder, Studio Nova'
        },
        {
            quote: 'The redesign made our brand feel sharper, and the site was faster, clearer, and much easier for customers to understand.',
            name: 'Michael Ade',
            role: 'Operations Lead, Kin Store'
        },
        {
            quote: 'He understands both design and code, so the handoff was smooth and the final result looked exactly like the mockup.',
            name: 'Tara Benson',
            role: 'Product Manager, FlowDesk'
        }
    ];

    const quote = document.getElementById('testimonialQuote');
    const name = document.getElementById('testimonialName');
    const role = document.getElementById('testimonialRole');
    const previous = document.getElementById('prevTestimonial');
    const next = document.getElementById('nextTestimonial');
    let index = 0;

    const render = () => {
        quote.textContent = testimonials[index].quote;
        name.textContent = testimonials[index].name;
        role.textContent = testimonials[index].role;
    };

    previous.addEventListener('click', () => {
        index = (index - 1 + testimonials.length) % testimonials.length;
        render();
    });

    next.addEventListener('click', () => {
        index = (index + 1) % testimonials.length;
        render();
    });
}

function initContactForm() {
    const form = document.getElementById('contactForm');
    const status = document.getElementById('formStatus');

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        const name = formData.get('name');
        const projectType = formData.get('projectType');

        status.textContent = `Thanks ${name}. Your ${projectType.toLowerCase()} message is ready to send.`;
        form.reset();

        setTimeout(() => {
            status.textContent = '';
        }, 6000);
    });
}

function initCopyEmail() {
    const button = document.getElementById('copyEmail');
    const email = 'hello@example.com';
    const defaultLabel = button.innerHTML;

    button.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(email);
            button.innerHTML = '<svg class="icon"><use href="#icon-copy"></use></svg> Email copied';
            setTimeout(() => {
                button.innerHTML = defaultLabel;
            }, 2200);
        } catch {
            window.location.href = `mailto:${email}`;
        }
    });
}
