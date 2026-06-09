
// Performance optimized animation system 
class AnimationEngine {
    constructor() {
        this.mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        this.currentSection = null;
        this.isAnimating = false;
        this.elements = {
            cursor: null,
            heroParallax: [],
            vanguarrText: null,
            vanguarrCircle: null,
            glitchText: null,
            contactElements: []
        };
        this.overlay = document.getElementById('zoom-overlay');
        this.zoomCard = document.getElementById('zoom-card');
        this.init();
    }

    init() {
        // Cache DOM elements for better performance 
        this.elements.cursor = document.querySelector('.custom-cursor');
        this.elements.heroParallax = Array.from(document.querySelectorAll('#hero .parallax-text'));
        this.elements.vanguarrText = document.getElementById('parallax-text');
        this.elements.vanguarrSphere = document.getElementById('sphereWrapper'); // Target the wrapper for parallax
        this.elements.glitchText = document.querySelector('.glitch-text');
        this.elements.contactElements = Array.from(document.querySelectorAll('#contact .parallax-element'));

        // Bind events 
        this.bindEvents();

        // Init Sphere
        this.initSphere();

        // Start animation loop 
        this.animate();
    }

    initSphere() {
        const container = document.getElementById('sphereContainer');
        if (!container) return;

        const cardCount = 20; // Number of cards
        const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle

        // New Skills Data
        const skills = [
            { title: "PROBLEM SOLVING", sub: "MINDSET", details: "Troubleshooting<br>Strategic Solutions" },
            { title: "COMMUNICATION", sub: "SOFT SKILL", details: "Clear Articulation<br>Active Listening" },
            { title: "TEAMWORK", sub: "COLLABORATION", details: "Cross-functional<br>Supportive Environment" },
            { title: "LEADERSHIP", sub: "MANAGEMENT", details: "Guidance<br>Vision & Execution" },
            { title: "TIME MANAGEMENT", sub: "EFFICIENCY", details: "Prioritization<br>Meeting Deadlines" },
            { title: "PROJECT MANAGEMENT", sub: "OPERATIONS", details: "Agile & Scrum<br>Resource Allocation" },
            { title: "CRITICAL THINKING", sub: "ANALYSIS", details: "Objective Evaluation<br>Logical Reasoning" },
            { title: "ADAPTABILITY", sub: "FLEXIBILITY", details: "Embracing Change<br>Quick Learning" },
            { title: "GRAPHIC DESIGN", sub: "CREATIVITY", details: "Visual Communication<br>Branding & Layout" },
            { title: "RESEARCH SKILLS", sub: "DISCOVERY", details: "Information Gathering<br>Data Synthesis" },
            { title: "ANALYTICAL THINKING", sub: "LOGIC", details: "Pattern Recognition<br>Data-Driven Insights" },
            { title: "PRESENTATION", sub: "COMMUNICATION", details: "Public Speaking<br>Engaging Delivery" },
            { title: "DECISION MAKING", sub: "LEADERSHIP", details: "Risk Assessment<br>Decisive Action" },
            { title: "VIDEO EDITING", sub: "MEDIA", details: "Post-Production<br>Storytelling" },
            { title: "PROMPT ENGINEERING", sub: "AI", details: "LLM Optimization<br>Behavior Tuning" },
            { title: "AI TOOLS", sub: "TECHNOLOGY", details: "Automation<br>Workflow Enhancement" },
            { title: "UI/UX DESIGN", sub: "DESIGN", details: "User Journeys<br>Wireframing" },
            { title: "ALGORITHMS", sub: "PROGRAMMING", details: "Data Structures<br>Code Efficiency" },
            { title: "INNOVATION", sub: "MINDSET", details: "Creative Solutions<br>Forward Thinking" },
            { title: "PCB FABRICATION", sub: "HARDWARE", details: "Circuit Layouts<br>Manufacturing" }
        ];

        for (let i = 0; i < cardCount; i++) {
            const y = 1 - (i / (cardCount - 1)) * 2; // y goes from 1 to -1
            const radius = Math.sqrt(1 - y * y); // radius at y

            const theta = phi * i; // golden angle increment

            const x = Math.cos(theta) * radius;
            const z = Math.sin(theta) * radius;

            // Scale position
            const scale = 320; // Radius for sphere

            const card = document.createElement('div');
            // All cards are text cards
            card.className = `sphere-card even`;

            // Get skill data
            const skill = skills[i % skills.length];

            // Flip Card
            card.innerHTML = `
                <div class="flip-wrapper">
                    <div class="card-face front">
                        <span class="number">${(i + 1).toString().padStart(2, '0')}</span>
                        <span class="label">${skill.title}</span>
                        <span class="sub">${skill.sub}</span>
                    </div>
                    <div class="card-face back">
                        <h3>${skill.title}</h3>
                        <p class="text-xs leading-relaxed mt-2 text-center font-mono opacity-80">${skill.details}</p>
                    </div>
                </div>
            `;

            // Rotation Logic
            const rotY = Math.atan2(x, z) * (180 / Math.PI);
            const rotX = -Math.asin(y) * (180 / Math.PI);

            card.style.transform = `translate3d(${x * scale}px, ${y * scale}px, ${z * scale}px) rotateY(${rotY}deg) rotateX(${rotX}deg)`;

            // Click Event for Overlay
            card.addEventListener('click', (e) => {
                e.stopPropagation();
                this.showOverlay(card, true);
            });

            container.appendChild(card);
        }
    }

    showOverlay(sourceCard, isEven) {
        const grid = document.getElementById('zoom-grid');
        if (!grid) return;
        
        // Clear previous
        grid.innerHTML = '';
        
        const allCards = document.querySelectorAll('#sphereContainer .sphere-card');
        
        allCards.forEach((card, index) => {
            const clone = card.cloneNode(true);
            clone.style.transform = 'none'; // remove 3d transform
            clone.style.position = 'relative'; // reset position
            clone.className = `relative w-[130px] h-[174px] md:w-[150px] md:h-[200px] lg:w-[160px] lg:h-[214px] flex-shrink-0 sphere-card-clone even`;
            
            // Force flip if it's text card
            const wrapper = clone.querySelector('.flip-wrapper');
            if (wrapper) {
                wrapper.style.transform = 'rotateY(180deg)';
                const back = wrapper.querySelector('.back');
                if (back) back.style.backfaceVisibility = 'visible';
            }
            
            // Scatter dispersion effect
            clone.style.opacity = '0';
            const randomX = (Math.random() - 0.5) * 800;
            const randomY = (Math.random() - 0.5) * 800;
            const randomRot = (Math.random() - 0.5) * 360;
            clone.style.transform = `translate(${randomX}px, ${randomY}px) scale(0.1) rotate(${randomRot}deg)`;
            clone.style.transition = `all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) ${Math.random() * 0.15}s`;
            
            grid.appendChild(clone);
            
            // Trigger animation next frame
            requestAnimationFrame(() => {
                setTimeout(() => {
                    clone.style.opacity = '1';
                    clone.style.transform = 'translate(0, 0) scale(1) rotate(0deg)';
                }, 50);
            });
        });

        // Show overlay
        this.overlay.classList.remove('opacity-0', 'pointer-events-none');
        this.overlay.classList.add('pointer-events-auto');
    }

    hideOverlay() {
        this.overlay.classList.add('opacity-0', 'pointer-events-none');
        this.overlay.classList.remove('pointer-events-auto');
        const grid = document.getElementById('zoom-grid');
        if (grid) {
            setTimeout(() => {
                grid.innerHTML = ''; // Clear after fade out
            }, 300);
        }
    }

    bindEvents() {
        // Overlay Click to Close
        if (this.overlay) {
            this.overlay.addEventListener('click', () => this.hideOverlay());
        }
        if (this.zoomCard) {
            this.zoomCard.addEventListener('click', (e) => e.stopPropagation());
        }

        // Throttled mouse move for section detection
        let mouseTicking = false;
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;

            if (!mouseTicking) {
                window.requestAnimationFrame(() => {
                    const elementUnderMouse = document.elementFromPoint(this.mouse.x, this.mouse.y);
                    this.currentSection = elementUnderMouse ? elementUnderMouse.closest('.section') : null;
                    mouseTicking = false;
                });
                mouseTicking = true;
            }
        }, { passive: true });

        if (!this.isAnimating) {
            this.isAnimating = true;
        }
    }

    animate() {
        if (this.isAnimating) {
            this.updateCursor();
            this.updateParallax();
            this.isAnimating = true; // Keep animating
        }
        requestAnimationFrame(() => this.animate());
    }

    updateCursor() {
        if (this.elements.cursor) {
            // Use transform3d for hardware acceleration 
            this.elements.cursor.style.transform = `translate3d(${this.mouse.x - 20}px, ${this.mouse.y - 20}px, 0)`;
        }
    }

    updateParallax() {
        if (!this.currentSection) return;

        const { x: mouseX, y: mouseY } = this.mouse;
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        switch (this.currentSection.id) {
            case 'hero':
                this.updateHeroParallax(centerX - mouseX, centerY - mouseY);
                break;
            case 'vanguarr':
                this.updateVanguarrParallax(mouseX - centerX, mouseY - centerY);
                break;
            case 'projects':
                this.updateProjectsParallax(mouseX - centerX, mouseY - centerY);
                break;
            case 'contact':
                this.updateContactParallax(mouseX - centerX, mouseY - centerY);
                break;
        }
    }

    updateHeroParallax(deltaX, deltaY) {
        const x = deltaX / 25;
        const y = deltaY / 25;

        this.elements.heroParallax.forEach(el => {
            if (el) {
                el.style.transform = `translate3d(${x}px, ${y}px, 0) scaleY(1.1)`;
            }
        });
    }

    updateVanguarrParallax(deltaX, deltaY) {
        const x = deltaX / 30;
        const y = deltaY / 30;

        if (this.elements.vanguarrText) {
            this.elements.vanguarrText.style.transform = `translate3d(${-x * 1.5}px, ${-y * 1.5}px, 0)`;
        }
        if (this.elements.vanguarrSphere) {
            // Move the sphere wrapper slightly
            this.elements.vanguarrSphere.style.transform = `translate3d(${-x}px, ${-y}px, 0)`;
        }
    }

    updateProjectsParallax(deltaX, deltaY) {
        if (this.elements.glitchText) {
            const x = deltaX / 30;
            const y = deltaY / 30;
            this.elements.glitchText.style.setProperty('--para-x', `${x}px`);
            this.elements.glitchText.style.setProperty('--para-y', `${y}px`);
        }
    }

    updateContactParallax(deltaX, deltaY) {
        this.elements.contactElements.forEach(el => {
            if (el) {
                const speed = parseFloat(el.getAttribute('data-speed') || 0.05);
                const x = deltaX * speed;
                const y = deltaY * speed;
                let transform = `translate3d(${x}px, ${y}px, 0)`;

                // Preserve scaleY if present in inline style/class logic? 
                // The original logic was mostly just translation here.
                el.style.transform = transform;
            }
        });
    }
}


// Optimized scroll handling with RAF and better section detection 
class ScrollManager {
    constructor() {
        this.isScrolling = false;
        this.scrollTimeout = null;
        this.sections = ['hero', 'work', 'vanguarr', 'projects', 'about', 'contact'];
        this.sectionNames = ['Introduction', 'Selected Work', 'Skills & Focus', 'Projects', 'About Me', 'Get in Touch'];
        this.elements = {
            progressFill: document.getElementById('progressFill'),
            currentSection: document.getElementById('currentSection'),
            sectionName: document.getElementById('sectionName')
        };
        this.scroller = document.querySelector('.scroll-container');
        this.currentSectionIndex = 0;
        this.bindEvents();
    }

    bindEvents() {
        // Passive scroll listener for better performance 
        this.scroller.addEventListener('scroll', () => {
            if (!this.isScrolling) {
                requestAnimationFrame(() => this.updateProgress());
                this.isScrolling = true;
            }

            // Reset scrolling flag after scroll ends 
            clearTimeout(this.scrollTimeout);
            this.scrollTimeout = setTimeout(() => {
                this.isScrolling = false;
            }, 100);
        }, { passive: true });

        // Intersection Observer for better section detection 
        this.setupIntersectionObserver();
    }

    setupIntersectionObserver() {
        const options = {
            root: this.scroller,
            rootMargin: '-50% 0px -50% 0px',
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id;
                    const index = this.sections.indexOf(sectionId);
                    if (index !== -1 && index !== this.currentSectionIndex) {
                        this.currentSectionIndex = index;
                        this.updateSectionCounter();
                    }
                }
            });
        }, options);

        // Observe all sections 
        this.sections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (section) {
                observer.observe(section);
            }
        });
    }

    updateProgress() {
        const scrollTop = this.scroller.scrollTop;
        const docHeight = this.scroller.scrollHeight - window.innerHeight;
        const scrollPercent = docHeight > 0 ? scrollTop / docHeight : 0;

        // Use transform for smoother progress bar animation 
        if (this.elements.progressFill) {
            const width = Math.min(scrollPercent * 100, 100);
            this.elements.progressFill.style.transform = `scaleX(${width / 100})`;
            this.elements.progressFill.style.transformOrigin = 'left center';
        }

        this.isScrolling = false;
    }

    updateSectionCounter() {
        if (this.elements.currentSection) {
            this.elements.currentSection.textContent = String(this.currentSectionIndex + 1).padStart(2, '0');
        }
        if (this.elements.sectionName) {
            this.elements.sectionName.textContent = this.sectionNames[this.currentSectionIndex];
        }
    }
}

// Optimized smooth scrolling — uses .scroll-container
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    const scroller = document.querySelector('.scroll-container');
    if (section && scroller) {
        scroller.scrollTo({
            top: section.offsetTop,
            behavior: 'smooth'
        });
    } else if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
        console.warn(`Section with id '${sectionId}' not found`);
    }
}

// Scramble text utility (shared by hero and projects)
function createScrambleEffect(element, words, interval, duration) {
    if (!element) return;
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let index = 0;

    function scrambleText(newText) {
        const oldText = element.innerText;
        const length = Math.max(oldText.length, newText.length);
        let frame = 0;

        const anim = setInterval(() => {
            let result = "";
            element.style.opacity = Math.random() > 0.8 ? '0.7' : '1';

            for (let i = 0; i < length; i++) {
                if (i < newText.length && frame > (i / length) * duration + 5) {
                    result += newText[i];
                } else {
                    result += chars[Math.floor(Math.random() * chars.length)];
                }
            }

            element.innerText = result;
            frame++;

            if (frame > duration + 10) {
                clearInterval(anim);
                element.innerText = newText;
                element.style.opacity = '1';
            }
        }, 30);
    }

    setInterval(() => {
        index = (index + 1) % words.length;
        scrambleText(words[index]);
    }, interval);
}

// GSAP hero scroll animation (extracted from inline HTML)
function initHeroScrollAnimation() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    const scroller = document.querySelector(".scroll-container");
    let mm = gsap.matchMedia();

    // Desktop Animation (Move Image Right)
    mm.add("(min-width: 641px)", () => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: "#hero",
                scroller: scroller,
                start: "top top",
                end: "+=100%",
                scrub: 1,
                pin: true,
            }
        });

        tl.to(".hero-magazine-image", {
            x: "25vw",
            scale: 0.9,
            ease: "power2.out"
        }, "start")
            .to("#hero-title-container", {
                opacity: 0,
                scale: 1.2,
                ease: "power2.out"
            }, "start")
            .to(".hero-sub-overlay", {
                opacity: 0,
                y: 50,
                ease: "power2.out"
            }, "start")
            .to(".hero-reveal-text", {
                opacity: 1,
                y: 0,
                ease: "power2.out"
            }, "start+=0.1");
    });

    // Mobile Animation (Keep Image Centered, no X movement)
    mm.add("(max-width: 640px)", () => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: "#hero",
                scroller: scroller,
                start: "top top",
                end: "+=100%",
                scrub: 1,
                pin: true,
            }
        });

        tl.to(".hero-magazine-image", {
            scale: 0.9,
            ease: "power2.out"
        }, "start")
            .to("#hero-title-container", {
                opacity: 0,
                scale: 1.2,
                ease: "power2.out"
            }, "start")
            .to(".hero-sub-overlay", {
                opacity: 0,
                y: 50,
                ease: "power2.out"
            }, "start")
            .to(".hero-reveal-text", {
                opacity: 1,
                y: 0,
                ease: "power2.out"
            }, "start+=0.1");
    });
}

// Touch-toggle for project flip cards
function initProjectCardTapToggle() {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (!isTouch) return;

    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('click', (e) => {
            const inner = card.querySelector('.project-card-inner');
            if (inner) {
                // Close any other open cards
                document.querySelectorAll('.project-card-inner.flipped').forEach(openCard => {
                    if (openCard !== inner) openCard.classList.remove('flipped');
                });
                inner.classList.toggle('flipped');
            }
        });
    });
}

// Optimized time update with RAF 
class TimeManager {
    constructor() {
        this.timeElement = document.getElementById('localTime');
        this.lastUpdate = 0;
        this.updateInterval = 60000; // Update every minute 
        this.init();
    }

    init() {
        this.updateTime();
        this.scheduleNextUpdate();
    }

    updateTime() {
        if (!this.timeElement) return;

        try {
            const now = new Date();
            const timeString = now.toLocaleTimeString('en-US', {
                timeZone: 'America/Los_Angeles',
                hour12: false,
                hour: '2-digit',
                minute: '2-digit'
            });
            this.timeElement.textContent = `Local Time: ${timeString} PST`;
        } catch (error) {
            console.warn('Error updating time:', error);
            const now = new Date();
            const timeString = now.toTimeString().slice(0, 5);
            this.timeElement.textContent = `Local Time: ${timeString}`;
        }
    }

    scheduleNextUpdate() {
        // Use RAF for smooth timing 
        const animate = (currentTime) => {
            if (currentTime - this.lastUpdate >= this.updateInterval) {
                this.updateTime();
                this.lastUpdate = currentTime;
            }
            requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    }
}

// Performance monitoring and optimization 
class PerformanceMonitor {
    constructor() {
        this.frameCount = 0;
        this.lastTime = performance.now();
        this.fps = 60;
        this.init();
    }

    init() {
        this.monitor();
    }

    monitor() {
        const now = performance.now();
        this.frameCount++;

        if (now - this.lastTime >= 1000) {
            this.fps = Math.round((this.frameCount * 1000) / (now - this.lastTime));
            this.frameCount = 0;
            this.lastTime = now;

            // Adjust animation quality based on performance 
            if (this.fps < 30) {
                document.body.classList.add('low-performance');
            } else {
                document.body.classList.remove('low-performance');
            }
        }

        requestAnimationFrame(() => this.monitor());
    }
}



class TextFlipper {
    constructor() {
        this.line1 = document.getElementById('hero-line-1');
        this.line2 = document.getElementById('hero-line-2');
        this.line3 = document.getElementById('hero-line-3');
        this.targetText1 = "I'M Arcane";
        this.targetText2 = "RKN";
        this.targetText3 = "RITESH KUMAR ACHAL";

        // Start animation delay
        setTimeout(() => this.animate(), 2000);
    }

    animate() {
        if (this.line1) this.animateLine(this.line1, this.targetText1);
        // Stagger line 2 slightly
        setTimeout(() => {
            if (this.line2) this.animateLine(this.line2, this.targetText2);

            // Animate line 3 (full name) after line 2
            setTimeout(() => {
                if (this.line3) this.animateLine(this.line3, this.targetText3);

                // Reveal subtext after animation
                setTimeout(() => {
                    const subtext = document.getElementById('hero-subtext');
                    if (subtext) {
                        subtext.classList.remove('opacity-0', '-translate-y-4');
                        subtext.classList.add('opacity-100', 'translate-y-0');
                    }
                }, 1000);
            }, 500);
        }, 500);
    }

    animateLine(element, newText) {
        const oldText = element.innerText.trim();
        element.innerHTML = '';

        // Determine max length to handle spacing
        const maxLength = Math.max(oldText.length, newText.length);

        // Create wrappers for each char position
        const chars = [];
        for (let i = 0; i < maxLength; i++) {
            const charWrapper = document.createElement('span');
            charWrapper.className = 'char-wrapper';
            charWrapper.style.transitionDelay = `${i * 50}ms`; // Stagger effect

            const front = document.createElement('span');
            front.className = 'front';
            // Use non-breaking space if char is space to maintain height/width
            const oldChar = oldText[i] || '';
            front.textContent = oldChar;
            if (!oldChar) front.innerHTML = '&nbsp;'; // Placeholder for new chars to have initial width

            const back = document.createElement('span');
            back.className = 'back';
            const newChar = newText[i] || '';
            back.textContent = newChar;
            if (newChar === ' ') back.innerHTML = '&nbsp;';

            charWrapper.appendChild(front);
            charWrapper.appendChild(back);
            element.appendChild(charWrapper);
            chars.push({ wrapper: charWrapper, front: front });
        }

        // Trigger flip
        // Force reflow
        element.offsetHeight;

        chars.forEach((item, index) => {
            item.wrapper.classList.add('flipping');

            // Halfway through animation (300ms + delay), add collapsed class for smooth shrink
            setTimeout(() => {
                item.front.classList.add('collapsed');
            }, 300 + (index * 50));
        });
    }
}



// Mobile Menu Toggle
function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    const btn = document.getElementById('menu-toggle');
    const icon = btn.querySelector('.material-symbols-outlined');

    if (menu.classList.contains('open')) {
        menu.classList.remove('open');
        icon.textContent = 'menu';
        document.body.style.overflow = '';
    } else {
        menu.classList.add('open');
        icon.textContent = 'close';
        document.body.style.overflow = 'hidden';
    }
}

// Initialize all systems when DOM is ready 
document.addEventListener('DOMContentLoaded', () => {
    // Critical visual systems first
    const animationEngine = new AnimationEngine();
    const scrollManager = new ScrollManager();
    const textFlipper = new TextFlipper();

    // Initial updates 
    scrollManager.updateProgress();

    // Touch detection
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouch) {
        document.body.classList.add('touch-device');
        // Disable custom cursor
        const cursor = document.querySelector('.custom-cursor');
        if (cursor) cursor.style.display = 'none';
    }

    // Initialize extracted inline animations
    // Hero scramble text
    createScrambleEffect(
        document.getElementById('hero-title'),
        ["DEVELOPER", "AI EXPLORER", "FREELANCER"],
        4000, 30
    );

    // Projects scramble text
    const dynamicHeader = document.getElementById('dynamic-header');
    if (dynamicHeader) dynamicHeader.style.transition = 'none';
    createScrambleEffect(dynamicHeader, ["PROJECTS", "IDEAS", "RESEARCHES", "STARTUPS"], 3000, 20);

    // GSAP hero scroll animation
    initHeroScrollAnimation();

    // Touch-toggle for project flip cards
    initProjectCardTapToggle();

    // Initialize Particle Text (Critical Feature - Init immediately)
    try {
        new ParticleText('magnetic-text');
    } catch (e) {
        console.error('ParticleText failed:', e);
    }

    // Deferred non-critical systems
    const deferInit = () => {
        new TimeManager();
        new PerformanceMonitor();

        // Initialize GSAP Gallery
        if (typeof initGalleryAnimation === 'function') {
            initGalleryAnimation();
        }
    };

    if ('requestIdleCallback' in window) {
        requestIdleCallback(deferInit);
    } else {
        setTimeout(deferInit, 200);
    }

    // Sphere animation restart on section visibility
    const vanguarrSection = document.getElementById('vanguarr');
    const sphereContainer = document.getElementById('sphereContainer');
    const sphereMover = document.getElementById('sphereMover');

    if (vanguarrSection && (sphereContainer || sphereMover)) {
        const sphereObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Force restart animation by removing and re-adding animation class
                    if (sphereContainer) {
                        sphereContainer.style.animation = 'none';
                        sphereContainer.offsetHeight; // Force reflow
                        sphereContainer.style.animation = '';
                    }
                    if (sphereMover) {
                        sphereMover.style.animation = 'none';
                        sphereMover.offsetHeight; // Force reflow
                        sphereMover.style.animation = '';
                    }
                }
            });
        }, {
            root: document.querySelector('.scroll-container'),
            threshold: 0.1
        });

        sphereObserver.observe(vanguarrSection);
    }
});

class ParticleText {
    constructor(targetId) {
        this.container = document.getElementById(targetId);
        if (!this.container) return;

        // Ensure container is relative for absolute canvas positioning
        if (getComputedStyle(this.container).position === 'static') {
            this.container.style.position = 'relative';
        }

        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });

        // Position canvas absolutely to cover the text
        // EXPANDED CANVAS: Make it larger than container to avoid clipping
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '-25%'; // Offset to center the larger canvas
        this.canvas.style.left = '-25%';
        this.canvas.style.width = '150%'; // 1.5x size to allow particles to fly out
        this.canvas.style.height = '150%';
        this.canvas.style.zIndex = '50'; // Increased z-index ensuring visibility
        this.canvas.style.pointerEvents = 'none'; // Visual only, events handled by layer

        // Append canvas
        this.container.appendChild(this.canvas);

        // Create Interaction Layer (Exact size of container)
        // This is the "region" the user requested
        this.interactionLayer = document.createElement('div');
        this.interactionLayer.style.position = 'absolute';
        this.interactionLayer.style.top = '0';
        this.interactionLayer.style.left = '0';
        this.interactionLayer.style.width = '100%';
        this.interactionLayer.style.height = '100%';
        this.interactionLayer.style.zIndex = '51'; // Above canvas
        this.interactionLayer.style.touchAction = 'manipulation'; // Allow touch but we control scrolling
        this.interactionLayer.style.pointerEvents = 'auto'; // CRITICAL: Receive touch events
        this.interactionLayer.style.background = 'transparent';
        this.container.appendChild(this.interactionLayer);

        // Hide original text
        const children = this.container.children;
        for (let child of children) {
            if (child !== this.canvas && child !== this.interactionLayer) {
                child.style.opacity = '0';
            }
        }

        this.particles = [];
        this.mouse = { x: null, y: null, radius: 120 }; // Reduced radius
        this.friction = 0.85; // Lower friction = less sliding/floaty "water" feel
        this.ease = 0.12; // Higher ease = faster, snappier return like a magnet
        this.isAnimating = true;
        this.isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

        // Initialize with fallback
        let initialized = false;
        const start = () => {
            if (!initialized) {
                initialized = true;
                this.init();
            }
        };

        // Try to wait for fonts, but force init after 1s if it fails
        if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(start);
        } else {
            setTimeout(start, 500);
        }
        setTimeout(start, 2000); // Fail-safe

        window.addEventListener('resize', () => {
            // Debounce resize
            clearTimeout(this.resizeTimer);
            this.resizeTimer = setTimeout(() => {
                this.resize();
                this.startAnimation();
            }, 100);
        });

        // Track mouse on window (Desktop only)
        window.addEventListener('mousemove', (e) => {
            if (!this.isTouch && this.canvas) {
                this.handleInput(e.clientX, e.clientY);
            }
        });

        // Touch Events - Only activate within text bounds, allow scroll in padding
        if (this.isTouch) {
            this.isTouchingText = false;

            this.interactionLayer.addEventListener('touchstart', (e) => {
                const touch = e.touches[0];
                const containerRect = this.container.getBoundingClientRect();
                const margin = 50; // Add some margin for touch exactly like desktop

                // Check if touch is within the container bounds
                if (touch.clientX >= containerRect.left - margin &&
                    touch.clientX <= containerRect.right + margin &&
                    touch.clientY >= containerRect.top - margin &&
                    touch.clientY <= containerRect.bottom + margin) {

                    this.isTouchingText = true;
                    if (e.cancelable) e.preventDefault();

                    const canvasRect = this.canvas.getBoundingClientRect();
                    this.mouse.x = touch.clientX - canvasRect.left;
                    this.mouse.y = touch.clientY - canvasRect.top;
                    this.startAnimation();
                }
            }, { passive: false });

            this.interactionLayer.addEventListener('touchmove', (e) => {
                if (this.isTouchingText) {
                    if (e.cancelable) e.preventDefault();

                    const touch = e.touches[0];
                    const canvasRect = this.canvas.getBoundingClientRect();
                    this.mouse.x = touch.clientX - canvasRect.left;
                    this.mouse.y = touch.clientY - canvasRect.top;
                    this.startAnimation();
                }
            }, { passive: false });

            this.interactionLayer.addEventListener('touchend', () => {
                this.isTouchingText = false;
                this.mouse.x = null;
                this.mouse.y = null;
            });

            // Allow clicking to trigger the repulsion on touch devices
            this.interactionLayer.addEventListener('click', (e) => {
                const canvasRect = this.canvas.getBoundingClientRect();
                this.mouse.x = e.clientX - canvasRect.left;
                this.mouse.y = e.clientY - canvasRect.top;

                // On mobile, boost the repel force temporarily on tap
                const originalRadius = this.mouse.radius;
                this.mouse.radius = 250; // Increased radius for click
                this.startAnimation();

                // Reset after a brief moment to allow particles to return
                setTimeout(() => {
                    this.mouse.radius = originalRadius;
                    if (!this.isTouchingText) {
                        this.mouse.x = null;
                        this.mouse.y = null;
                    }
                }, 500);
            });
        }
    }

    handleInput(clientX, clientY) {
        if (this.canvas) {
            // map touch from viewport to canvas coordinates
            const rect = this.canvas.getBoundingClientRect();
            const margin = 100;

            // Desktop hover check with margin
            if (clientX >= rect.left - margin && clientX <= rect.right + margin &&
                clientY >= rect.top - margin && clientY <= rect.bottom + margin) {
                this.mouse.x = clientX - rect.left;
                this.mouse.y = clientY - rect.top;
                this.startAnimation();
            } else {
                this.mouse.x = null;
                this.mouse.y = null;
            }
        }
    }

    init() {
        this.resize();
        this.animate();
    }

    resize() {
        if (!this.container || !this.canvas) return;

        // Canvas resolution should match display size
        this.width = Math.round(this.container.clientWidth * 1.5); // Match the 150% CSS width
        this.height = Math.round(this.container.clientHeight * 1.5); // Match the 150% CSS height
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        this.createParticles();
    }

    startAnimation() {
        if (!this.isAnimating) {
            this.isAnimating = true;
            this.animate();
        }
    }

    createParticles() {
        this.particles = [];
        const computedStyle = getComputedStyle(this.container);
        // Use computed font size directly to match the responsive CSS
        const baseFontSize = parseFloat(computedStyle.fontSize);
        const fontFamily = computedStyle.fontFamily;

        const offscreen = document.createElement('canvas');
        offscreen.width = this.width; // Large offscreen
        offscreen.height = this.height;
        const ctx = offscreen.getContext('2d');

        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Draw in the CENTER of the expanded canvas
        const x = this.width / 2;
        const y = this.height / 2;

        // Custom sizing logic for bio text - multi-line
        const lineSize = baseFontSize * 1.2;
        const lineHeight = lineSize * 1.2;
        const lines = [
            "I'm a hands-on builder",
            "who enjoys working where",
            "technology, design,",
            "and ideas meet."
        ];

        ctx.font = `900 ${lineSize}px ${fontFamily}`;

        // Draw each line centered
        const totalHeight = lines.length * lineHeight;
        const startY = y - (totalHeight / 2) + (lineHeight / 2);

        lines.forEach((line, i) => {
            ctx.fillText(line, x, startY + (i * lineHeight));
        });

        const data = ctx.getImageData(0, 0, this.width, this.height).data;
        const gap = 2; // Balance: 4x fewer particles than gap=1, visually solid with size=3

        for (let py = 0; py < this.height; py += gap) {
            for (let px = 0; px < this.width; px += gap) {
                const index = (py * this.width + px) * 4;
                const alpha = data[index + 3];

                if (alpha > 128) {
                    this.particles.push(new Particle(this, px, py));
                }
            }
        }
    }

    animate() {
        // Batch render using ImageData instead of individual fillRect calls
        const imageData = this.ctx.createImageData(this.width, this.height);
        const buf = imageData.data;

        let activeParticles = false;

        for (let i = 0, len = this.particles.length; i < len; i++) {
            const p = this.particles[i];
            p.update();

            // Write pixel directly to ImageData buffer (batch rendering)
            const px = Math.floor(p.x);
            const py = Math.floor(p.y);
            const size = p.size;
            for (let dy = 0; dy < size; dy++) {
                const row = py + dy;
                if (row < 0 || row >= this.height) continue;
                for (let dx = 0; dx < size; dx++) {
                    const col = px + dx;
                    if (col < 0 || col >= this.width) continue;
                    const idx = (row * this.width + col) * 4;
                    buf[idx] = 255;     // R
                    buf[idx + 1] = 255; // G
                    buf[idx + 2] = 255; // B
                    buf[idx + 3] = 255; // A
                }
            }

            if (Math.abs(p.x - p.originX) > 0.5 || Math.abs(p.y - p.originY) > 0.5 || Math.abs(p.vx) > 0.1 || Math.abs(p.vy) > 0.1) {
                activeParticles = true;
            }
        }

        this.ctx.putImageData(imageData, 0, 0);

        // Keep animating if mouse is interacting
        if (this.mouse.x !== null) activeParticles = true;

        if (activeParticles) {
            requestAnimationFrame(() => this.animate());
        } else {
            this.isAnimating = false;
        }
    }
}

class Particle {
    constructor(effect, x, y) {
        this.effect = effect;
        this.originX = x;
        this.originY = y;
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.size = 3; // Larger size fills gaps between particles at gap=2
        this.color = '#ffffff';
    }

    update() {
        // Mouse interaction — use squared distance to avoid Math.hypot/sqrt
        const dx = this.effect.mouse.x - this.x;
        const dy = this.effect.mouse.y - this.y;
        const distSq = dx * dx + dy * dy;
        const forceDistance = this.effect.mouse.radius;
        const forceDistSq = forceDistance * forceDistance;

        if (this.effect.mouse.x !== null && distSq < forceDistSq) {
            const distance = Math.sqrt(distSq); // Only sqrt when within radius
            const angle = Math.atan2(dy, dx);
            const force = (forceDistance - distance) / forceDistance;
            const push = force * 80;

            this.vx -= Math.cos(angle) * push;
            this.vy -= Math.sin(angle) * push;
        }

        // Return to origin (spring force)
        this.vx += (this.originX - this.x) * this.effect.ease;
        this.vy += (this.originY - this.y) * this.effect.ease;

        // Friction
        this.vx *= this.effect.friction;
        this.vy *= this.effect.friction;

        this.x += this.vx;
        this.y += this.vy;
    }
}

function initGalleryAnimation() {
    gsap.registerPlugin(ScrollTrigger);

    // Tell ScrollTrigger to use the .scroll-container
    const scroller = document.querySelector('.scroll-container');

    ScrollTrigger.defaults({
        scroller: scroller
    });

    // Create the timeline
    const workSection = document.querySelector('#work');
    const galleryContainer = document.querySelector('.gallery-container');
    const title = document.querySelector('.work-title');
    const oddRows = document.querySelectorAll('.row-odd');
    const evenRows = document.querySelectorAll('.row-even');

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: workSection,
            start: "top top",
            end: "+=400%",
            pin: true,
            scrub: 1,
        }
    });

    // Initial state for blur
    gsap.set(galleryContainer, { filter: "blur(10px)" });

    tl.to(title, {
        opacity: 0,
        scale: 1.5,
        duration: 1,
        ease: "power2.inOut",
        onUpdate: function () {
            // Flicker through specific words on scroll
            if (Math.random() > 0.7) {
                const words = [
                    "Gallery",
                    "Portfolio",
                    "Certificates",
                    "Rkn",
                    "Skills",
                    "Startups",
                    "Freelancing",
                    "Ideas",
                    "Design"
                ];
                const randomWord = words[Math.floor(Math.random() * words.length)];
                title.innerText = randomWord;
            }
        }
    }, "start")
        .to(galleryContainer, {
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
            duration: 1
        }, "start+=0.5")
        .to(galleryContainer, {
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
            duration: 1
        }, "start+=0.5");

    // Continuous Infinite Marquee
    const rows = [...document.querySelectorAll('.gallery-row')];

    rows.forEach((row, i) => {
        // Clone content for seamless loop
        const content = row.innerHTML;
        row.innerHTML = content + content; // Duplicate items

        // odd rows move left, even rows move right
        const isEven = row.classList.contains('row-even');

        // All rows start at 0, but animate in opposite directions
        // When animation completes, it seamlessly loops
        gsap.set(row, { xPercent: 0 });

        if (isEven) {
            // Even rows: move right (0 to 50, then reset to 0)
            gsap.to(row, {
                xPercent: 50,
                ease: "none",
                duration: 40,
                repeat: -1,
                modifiers: {
                    xPercent: gsap.utils.wrap(0, 50)
                }
            });
        } else {
            // Odd rows: move left (0 to -50, then reset to 0)
            gsap.to(row, {
                xPercent: -50,
                ease: "none",
                duration: 40,
                repeat: -1
            });
        }
    });


    // Independent card float effect
    gsap.utils.toArray('.gallery-card').forEach(card => {
        gsap.to(card, {
            y: "random(-20, 20)",
            rotation: "random(-2, 2)",
            duration: "random(2, 4)",
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true
        });
    });
}
