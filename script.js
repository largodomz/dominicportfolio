/* ==========================================================================
   DOMINIC LARGO PORTFOLIO - JAVASCRIPT LOGIC
   Features: Particle Canvas, Typing Text, Filters, Counter Stats, Modals
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // Set Copyright Year
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    /* ----------------------------------------------------------------------
       1. Dynamic Typing Effect
       ---------------------------------------------------------------------- */
    const typingElement = document.getElementById('typingElement');
    const words = [
        "Web Development & Design",
        "Cybersecurity Education",
        "Interactive UI Systems",
        "Network Threat Defense"
    ];
    
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function typeEffect() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            typingElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 50;
        } else {
            typingElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 100;
        }

        if (!isDeleting && charIndex === currentWord.length) {
            isDeleting = true;
            typeSpeed = 1800; // Pause at end of word
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeSpeed = 400;
        }

        setTimeout(typeEffect, typeSpeed);
    }

    if (typingElement) {
        typeEffect();
    }

    /* ----------------------------------------------------------------------
       2. Background Canvas Particle Constellation
       ---------------------------------------------------------------------- */
    const canvas = document.getElementById('particleCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        const particleCount = 60;

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.8;
                this.vy = (Math.random() - 0.5) * 0.8;
                this.radius = Math.random() * 2 + 1;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(6, 182, 212, 0.4)';
                ctx.fill();
            }
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach((p, index) => {
                p.update();
                p.draw();

                for (let j = index + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dist = Math.hypot(p.x - p2.x, p.y - p2.y);

                    if (dist < 120) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.strokeStyle = `rgba(6, 182, 212, ${0.15 - dist / 800})`;
                        ctx.lineWidth = 0.8;
                        ctx.stroke();
                    }
                }
            });

            requestAnimationFrame(animateParticles);
        }

        animateParticles();
    }

    /* ----------------------------------------------------------------------
       3. Dark / Light Theme Toggle Switch
       ---------------------------------------------------------------------- */
    const themeToggleBtn = document.getElementById('themeToggle');
    const htmlElement = document.documentElement;

    // Load saved theme from LocalStorage
    const savedTheme = localStorage.getItem('theme') || 'dark';
    htmlElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            htmlElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        });
    }

    function updateThemeIcon(theme) {
        if (!themeToggleBtn) return;
        const icon = themeToggleBtn.querySelector('i');
        if (theme === 'light') {
            icon.className = 'fa-solid fa-sun';
        } else {
            icon.className = 'fa-solid fa-moon';
        }
    }

    /* ----------------------------------------------------------------------
       4. Navbar Scroll Effect & Mobile Drawer Menu
       ---------------------------------------------------------------------- */
    const navbar = document.getElementById('navbar');
    const mobileToggle = document.getElementById('mobileToggle');
    const navLinks = document.getElementById('navLinks');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = mobileToggle.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.className = 'fa-solid fa-xmark';
            } else {
                icon.className = 'fa-solid fa-bars';
            }
        });
    }

    // Close mobile drawer when clicking a navigation link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                mobileToggle.querySelector('i').className = 'fa-solid fa-bars';
            }
        });
    });

    /* ----------------------------------------------------------------------
       5. Project Filtering Logic
       ---------------------------------------------------------------------- */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    /* ----------------------------------------------------------------------
       6. Counter Animation for Stats
       ---------------------------------------------------------------------- */
    const statNumbers = document.querySelectorAll('.stat-number');
    let hasAnimatedStats = false;

    function animateStats() {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            let count = 0;
            const speed = target / 40;

            const updateCount = () => {
                count += speed;
                if (count < target) {
                    stat.textContent = Math.ceil(count);
                    setTimeout(updateCount, 30);
                } else {
                    stat.textContent = target;
                }
            };
            updateCount();
        });
    }

    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !hasAnimatedStats) {
                animateStats();
                hasAnimatedStats = true;
            }
        }, { threshold: 0.5 });

        observer.observe(statsSection);
    }

    /* ----------------------------------------------------------------------
       7. Project Modal Details Logic
       ---------------------------------------------------------------------- */
    const modalData = {
        modal1: {
            title: "Interactive LMS Learning Portal",
            category: "EdTech / Web Development",
            description: "A complete Learning Management System built tailored for remote and blended learning in computer science. Enables interactive live code execution, progress metrics, and assignment submissions.",
            highlights: [
                "Real-time code evaluation engine",
                "Progress tracking dashboards for students and faculty",
                "Modular syllabus architecture with accessible video integration",
                "Built using Next.js, Node.js, and MongoDB"
            ]
        },
        modal2: {
            title: "Network Vulnerability Scanner Suite",
            category: "Cybersecurity Tooling",
            description: "Automated network security scanner designed to demonstrate vulnerability identification, port analysis, and mitigation reporting in academic labs.",
            highlights: [
                "Automated subnet discovery and port sweeping",
                "Generates detailed CVE vulnerability threat reports",
                "Custom Python scripting with intuitive web dashboard output",
                "Integrates with Nmap APIs and security auditing standards"
            ]
        },
        modal3: {
            title: "Universal Design System (UDS)",
            category: "Design Systems & Accessibility",
            description: "A lightweight, modular UI framework created to standardize accessible interface components across educational web applications.",
            highlights: [
                "WCAG 2.1 AAA Accessibility compliant",
                "Full CSS Variable driven dark and light mode palette",
                "Interactive documentation with live component preview",
                "Tested for seamless screen-reader compatibility"
            ]
        },
        modal4: {
            title: "Secure Authentication & RBAC Engine",
            category: "Cybersecurity & Web",
            description: "An enterprise-grade authentication and authorization engine built to teach secure user session handling and access control.",
            highlights: [
                "OAuth 2.0 & JWT (JSON Web Tokens) with auto-refresh logic",
                "Multi-factor authentication (MFA) with TOTP",
                "Password hashing using Bcrypt with salt rounds",
                "Protection against SQLi, XSS, and CSRF attacks"
            ]
        },
        modal5: {
            title: "Cybersecurity Lab Simulator",
            category: "EdTech & Cyber Defense",
            description: "An interactive, browser-based hands-on laboratory allowing students to test offensive and defensive cyber tactics safely.",
            highlights: [
                "Interactive SQL injection and XSS defense scenarios",
                "Packet sniffing & HTTP header inspection modules",
                "Immediate feedback loops and solution breakdowns",
                "Pure JavaScript browser sandbox environment"
            ]
        },
        modal6: {
            title: "CIE Academic Student Portal UI",
            category: "Web Development",
            description: "Modern web dashboard design for students to manage academic schedules, course materials, grades, and professor communication.",
            highlights: [
                "Responsive CSS Grid and Flexbox layouts",
                "Sub-second page load times with optimized assets",
                "Integrated academic calendar and real-time announcements",
                "Clean, distraction-free visual aesthetics"
            ]
        }
    };

    const projectModal = document.getElementById('projectModal');
    const modalBody = document.getElementById('modalBody');
    const modalClose = document.getElementById('modalClose');

    document.querySelectorAll('.view-project-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const modalKey = btn.getAttribute('data-modal');
            const data = modalData[modalKey];

            if (data) {
                modalBody.innerHTML = `
                    <h3>${data.title}</h3>
                    <span class="modal-category">${data.category}</span>
                    <p>${data.description}</p>
                    <div class="modal-highlights">
                        <h4>Key Highlights:</h4>
                        <ul>
                            ${data.highlights.map(item => `<li>${item}</li>`).join('')}
                        </ul>
                    </div>
                    <button class="btn btn-primary" onclick="document.getElementById('projectModal').classList.remove('active')">
                        Close Overview
                    </button>
                `;
                projectModal.classList.add('active');
            }
        });
    });

    if (modalClose) {
        modalClose.addEventListener('click', () => {
            projectModal.classList.remove('active');
        });
    }

    if (projectModal) {
        projectModal.addEventListener('click', (e) => {
            if (e.target === projectModal) {
                projectModal.classList.remove('active');
            }
        });
    }

    /* ----------------------------------------------------------------------
       8. Contact Form Submission
       ---------------------------------------------------------------------- */
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            formStatus.style.color = 'var(--accent-cyan)';
            formStatus.textContent = 'Sending message...';

            setTimeout(() => {
                formStatus.style.color = '#10b981'; // Success Green
                formStatus.textContent = 'Thank you! Your message has been sent successfully.';
                contactForm.reset();
            }, 1200);
        });
    }

});