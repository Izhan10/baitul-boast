// Core JavaScript for Bait Ul Broast

document.addEventListener('DOMContentLoaded', () => {
    initCustomCursor();
    initThreeJS();
    initAnimations();
    updateCartBadge();
    initMobileMenu();
    initMascotTilt();
});

// Custom Cursor Implementation
function initCustomCursor() {
    const cursor = document.getElementById('custom-cursor') || document.createElement('div');
    if (!document.getElementById('custom-cursor')) {
        cursor.id = 'custom-cursor';
        document.body.appendChild(cursor);
    }

    const trail = document.getElementById('custom-cursor-trail') || document.createElement('div');
    if (!document.getElementById('custom-cursor-trail')) {
        trail.id = 'custom-cursor-trail';
        document.body.appendChild(trail);
    }

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let trailX = 0, trailY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animate() {
        cursorX += (mouseX - cursorX) * 0.2;
        cursorY += (mouseY - cursorY) * 0.2;
        cursor.style.left = `${cursorX}px`;
        cursor.style.top = `${cursorY}px`;

        trailX += (mouseX - trailX) * 0.1;
        trailY += (mouseY - trailY) * 0.1;
        trail.style.left = `${trailX}px`;
        trail.style.top = `${trailY}px`;

        requestAnimationFrame(animate);
    }
    animate();

    // Magnetic Button Effect
    const magneticButtons = document.querySelectorAll('.magnetic');
    magneticButtons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });
}

// Three.js Hero Background
function initThreeJS() {
    const canvas = document.querySelector('#hero-canvas');
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const particlesGeometry = new THREE.BufferGeometry();
    const count = 500;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 10;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.02,
        color: '#FFD700',
        transparent: true,
        opacity: 0.6
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    camera.position.z = 3;

    let mouseX = 0, mouseY = 0;
    window.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) - 0.5;
        mouseY = (e.clientY / window.innerHeight) - 0.5;
    });

    function animate() {
        requestAnimationFrame(animate);
        particles.rotation.y += 0.001;
        particles.rotation.x += 0.0005;
        camera.position.x += (mouseX * 2 - camera.position.x) * 0.05;
        camera.position.y += (-mouseY * 2 - camera.position.y) * 0.05;
        camera.lookAt(scene.position);
        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// GSAP Animations
function initAnimations() {
    if (typeof gsap === 'undefined') return;

    // Register scroll trigger if present
    if (window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

    gsap.utils.toArray('.fade-up').forEach(elem => {
        gsap.from(elem, {
            y: 50,
            opacity: 0,
            duration: 1,
            scrollTrigger: {
                trigger: elem,
                start: 'top 85%',
            }
        });
    });
}

// Mobile Menu
function initMobileMenu() {
    const btn = document.querySelector('button[class*="md:hidden"]');
    if (!btn) return;

    const menu = document.createElement('div');
    menu.id = 'mobile-overlay';
    menu.className = 'fixed inset-0 z-[60] bg-black/95 backdrop-blur-xl hidden flex flex-col items-center justify-center gap-8';
    menu.innerHTML = `
        <a href="index.html" class="text-5xl font-bebas hover:text-primary transition-all">HOME</a>
        <a href="menu.html" class="text-5xl font-bebas hover:text-primary transition-all">MENU</a>
        <a href="about.html" class="text-5xl font-bebas hover:text-primary transition-all">STORY</a>
        <a href="locations.html" class="text-5xl font-bebas hover:text-primary transition-all">FIND US</a>
        <a href="contact.html" class="text-5xl font-bebas hover:text-primary transition-all text-primary">TALK TO US</a>
        <button id="close-mobile" class="mt-8 text-primary">
            <i data-lucide="x" class="w-12 h-12"></i>
        </button>
    `;
    document.body.appendChild(menu);

    btn.addEventListener('click', () => {
        menu.classList.remove('hidden');
        gsap.from('#mobile-overlay a', {
            y: 30,
            opacity: 0,
            stagger: 0.1,
            duration: 0.5,
            ease: 'power3.out'
        });
        lucide.createIcons();
    });

    menu.querySelector('#close-mobile').addEventListener('click', () => {
        gsap.to('#mobile-overlay', {
            opacity: 0,
            duration: 0.3,
            onComplete: () => {
                menu.classList.add('hidden');
                menu.style.opacity = '1';
            }
        });
    });
}

// 3D Mascot Follow Cursor
function initMascotTilt() {
    const mascots = document.querySelectorAll('.mascot-float');
    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 30;
        const y = (e.clientY / window.innerHeight - 0.5) * 30;

        mascots.forEach(m => {
            m.style.transform = `perspective(1000px) rotateY(${x}deg) rotateX(${-y}deg) translateY(-5px)`;
        });
    });
}

// Global Cart UI Update
function updateCartBadge() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    const badges = document.querySelectorAll('.cart-count');
    badges.forEach(badge => {
        badge.textContent = count;
        badge.style.display = count > 0 ? 'flex' : 'none';
    });
}
