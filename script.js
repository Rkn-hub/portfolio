
// Performance optimized animation system 
class AnimationEngine {
    constructor() {
        this.mouse = { x: 0, y: 0 };
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
            {
                title: "MVP PLANNING",
                sub: "STRATEGY",
                details: "User-first workflows<br>System-level thinking"
            },
            {
                title: "DEVELOPMENT",
                sub: "CODE",
                details: "HTML, CSS, JS<br>Python (Basics/Auto)<br>Frontend Logic"
            },
            {
                title: "DESIGN",
                sub: "UI/UX",
                details: "UI/UX Fundamentals<br>Figma & Canva<br>Visual Hierarchy"
            },
            {
                title: "AI & EXP.",
                sub: "R&D",
                details: "AI & Content Tools<br>Workflow Automation<br>Realism Experiments"
            },
            {
                title: "STARTUP OPS",
                sub: "EXECUTION",
                details: "Early-stage execution<br>Branding & Positioning<br>Team Coordination"
            },
            {
                title: "PHOTOGRAPHY",
                sub: "VISUALS",
                details: "Visual Storytelling<br>Composition & Lighting<br>Editing & Color Grading"
            }
        ];

        // Sphere Images
        const sphereImages = [
            "gallery/sphere/20220729_173021.jpg",
            "gallery/sphere/IMG-20220805-WA0018.jpg",
            "gallery/sphere/IMG-20240908-WA0040.jpg",
            "gallery/sphere/IMG20240610205908.jpg",
            "gallery/sphere/IMG20240610205931.jpg"
        ];

        let textCardIndex = 0;
        let imageCardIndex = 0;

        for (let i = 0; i < cardCount; i++) {
            const y = 1 - (i / (cardCount - 1)) * 2; // y goes from 1 to -1
            const radius = Math.sqrt(1 - y * y); // radius at y

            const theta = phi * i; // golden angle increment

            const x = Math.cos(theta) * radius;
            const z = Math.sin(theta) * radius;

            // Scale position
            const scale = 180; // Reduced radius for smaller sphere

            const card = document.createElement('div');
            // Even/Odd Logic
            // i=0 -> (1) Odd -> Image
            // i=1 -> (2) Even -> Text
            const isEven = (i + 1) % 2 === 0;
            card.className = `sphere-card ${isEven ? 'even' : 'odd'}`;

            // Generate Inner Content based on Type
            if (isEven) {
                // Get skill data (cycle through the 5 skills)
                const skill = skills[textCardIndex % skills.length];
                textCardIndex++;

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
            } else {
                // Image Holder (Not Flippable, just visual)
                const imgPath = sphereImages[imageCardIndex % sphereImages.length];
                imageCardIndex++;

                card.innerHTML = `
                    <div class="card-face front">
                        <img src="${imgPath}" class="skill-img" alt="Visual" style="object-fit: cover; width: 100%; height: 100%; border-radius: inherit;">
                        <span class="number" style="position: absolute; bottom: 5px; right: 10px; font-size: 1.5rem; color: white; mix-blend-mode: overlay;">${(i + 1).toString().padStart(2, '0')}</span>
                    </div>
                `;
            }

            // Rotation Logic
            const rotY = Math.atan2(x, z) * (180 / Math.PI);
            const rotX = -Math.asin(y) * (180 / Math.PI);

            card.style.transform = `translate3d(${x * scale}px, ${y * scale}px, ${z * scale}px) rotateY(${rotY}deg) rotateX(${rotX}deg)`;

            // Click Event for Overlay
            card.addEventListener('click', (e) => {
                e.stopPropagation();
                this.showOverlay(card, isEven);
            });

            container.appendChild(card);
        }
    }

    showOverlay(sourceCard, isEven) {
        // Populate overlay
        const content = sourceCard.innerHTML;
        this.zoomCard.className = `relative w-[300px] h-[400px] md:w-[350px] md:h-[480px] transform-gpu scale-90 transition-transform duration-300 sphere-card-clone ${isEven ? 'even' : 'odd'}`;
        this.zoomCard.innerHTML = content;

        // Force flip for text cards
        if (isEven) {
            const wrapper = this.zoomCard.querySelector('.flip-wrapper');
            if (wrapper) {
                wrapper.style.transform = 'rotateY(180deg)';
                // Ensure text is visible
                const back = wrapper.querySelector('.back');
                if (back) back.style.backfaceVisibility = 'visible';
            }
        }

        // Show overlay
        this.overlay.classList.remove('opacity-0', 'pointer-events-none');
        this.overlay.classList.add('pointer-events-auto');
        this.zoomCard.classList.remove('scale-90');
        this.zoomCard.classList.add('scale-100');
    }

    hideOverlay() {
        this.overlay.classList.add('opacity-0', 'pointer-events-none');
        this.overlay.classList.remove('pointer-events-auto');
        this.zoomCard.classList.add('scale-90');
        this.zoomCard.classList.remove('scale-100');
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

// Optimized smooth scrolling 
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        // Use native smooth scrolling with fallback 
        if ('scrollBehavior' in document.documentElement.style) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            // Fallback smooth scroll animation 
            const targetPosition = section.offsetTop;
            const startPosition = window.pageYOffset;
            const distance = targetPosition - startPosition;
            const duration = 800;
            let start = null;

            function animation(currentTime) {
                if (start === null) start = currentTime;
                const timeElapsed = currentTime - start;
                const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
                window.scrollTo(0, run);
                if (timeElapsed < duration) requestAnimationFrame(animation);
            }

            function easeInOutQuad(t, b, c, d) {
                t /= d / 2;
                if (t < 1) return c / 2 * t * t + b;
                t--;
                return -c / 2 * (t * (t - 2) - 1) + b;
            }

            requestAnimationFrame(animation);
        }
    } else {
        console.warn(`Section with id '${sectionId}' not found`);
    }
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



// Initialize all systems when DOM is ready 
document.addEventListener('DOMContentLoaded', () => {
    // Critical visual systems first
    const animationEngine = new AnimationEngine();
    const scrollManager = new ScrollManager();
    const textFlipper = new TextFlipper();

    // Initial updates 
    scrollManager.updateProgress();

    // Deferred non-critical systems
    const deferInit = () => {
        new TimeManager();
        new PerformanceMonitor();
        new ParticleText('magnetic-text');

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
        this.canvas.style.top = '-50%'; // Offset to center the larger canvas
        this.canvas.style.left = '-50%';
        this.canvas.style.width = '200%'; // Double size to allow particles to fly out
        this.canvas.style.height = '200%';
        this.canvas.style.zIndex = '50'; // Increased z-index ensuring visibility
        this.canvas.style.pointerEvents = 'auto';

        // Append canvas
        this.container.appendChild(this.canvas);

        // Hide original text
        const children = this.container.children;
        for (let child of children) {
            if (child !== this.canvas) {
                child.style.opacity = '0';
            }
        }

        this.particles = [];
        this.mouse = { x: null, y: null, radius: 120 }; // Reduced radius
        this.friction = 0.85; // Lower friction = less sliding/floaty "water" feel
        this.ease = 0.12; // Higher ease = faster, snappier return like a magnet
        this.isAnimating = true;

        // Wait for fonts to load before initializing
        document.fonts.ready.then(() => {
            this.init();
        });

        window.addEventListener('resize', () => {
            this.resize();
            this.startAnimation();
        });

        // Track mouse on window
        window.addEventListener('mousemove', (e) => {
            if (this.canvas) {
                const rect = this.canvas.getBoundingClientRect();
                // Check proximity (+ margin)
                const margin = 100;
                if (e.clientX >= rect.left - margin && e.clientX <= rect.right + margin &&
                    e.clientY >= rect.top - margin && e.clientY <= rect.bottom + margin) {

                    this.mouse.x = e.clientX - rect.left;
                    this.mouse.y = e.clientY - rect.top;
                    this.startAnimation();
                } else {
                    this.mouse.x = null;
                    this.mouse.y = null;
                }
            }
        });
    }

    init() {
        this.resize();
        this.animate();
    }

    resize() {
        // Canvas resolution should match display size
        this.width = this.container.clientWidth * 2; // Match the 200% CSS width
        this.height = this.container.clientHeight * 2; // Match the 200% CSS height
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
        const gap = 2; // Increased density (smaller gap)

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
        this.ctx.clearRect(0, 0, this.width, this.height);

        let activeParticles = false;

        this.particles.forEach(p => {
            p.update();
            p.draw(this.ctx);

            if (Math.abs(p.x - p.originX) > 0.1 || Math.abs(p.y - p.originY) > 0.1 || Math.abs(p.vx) > 0.1 || Math.abs(p.vy) > 0.1) {
                activeParticles = true;
            }
        });

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
        this.size = 2;
        this.color = '#000000'; // Default black
    }

    update() {
        // Mouse interaction
        const dx = this.effect.mouse.x - this.x;
        const dy = this.effect.mouse.y - this.y;
        const distance = Math.hypot(dx, dy);
        const forceDistance = this.effect.mouse.radius;

        // Stronger linear physics model
        if (this.effect.mouse.x !== null && distance < forceDistance) {
            const angle = Math.atan2(dy, dx);
            // Force increases as distance decreases (0 to 1)
            const force = (forceDistance - distance) / forceDistance;
            const repulsionStrength = 80; // Much stronger push

            const push = force * repulsionStrength;

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

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(Math.floor(this.x), Math.floor(this.y), this.size, this.size);
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
            // Scramble text effect on scroll
            if (Math.random() > 0.7) {
                const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
                const original = "SELECTED WORK";
                let scrambled = "";
                for (let i = 0; i < original.length; i++) {
                    scrambled += Math.random() > 0.5 ? chars[Math.floor(Math.random() * chars.length)] : original[i];
                }
                title.innerText = scrambled;
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
