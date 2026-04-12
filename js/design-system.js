// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("hero-canvas");
    const context = canvas.getContext("2d");

    // Configuration
    const frameCount = 192;
    const currentFrame = { index: 0 };
    const images = [];

    // Preload Images
    const preloadImages = () => {
        for (let i = 1; i <= frameCount; i++) {
            const img = new Image();
            const frameNumber = i.toString().padStart(4, '0');
            img.src = `../assets/video_frames/frame_${frameNumber}.jpg`;
            images.push(img);
        }
    };

    // Render function
    const render = () => {
        const frameIndex = Math.floor(currentFrame.index);
        const img = images[frameIndex];

        if (img && img.complete) {
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(img, 0, 0, canvas.width, canvas.height);
        }
    };

    // Start Preloading
    preloadImages();

    // Set Initial Frame
    if (images[0]) {
        images[0].onload = render;
    }

    // Initial Reveal Animation (Hero Text Only)
    const heroReveals = document.querySelectorAll('.hero-scrub-container .reveal-up');
    heroReveals.forEach((el, index) => {
        setTimeout(() => {
            el.classList.add('active');
        }, 100 * index);
    });

    // Canvas Intro Animation
    gsap.fromTo(canvas,
        { opacity: 0, scale: 1.1 },
        { opacity: 1, scale: 1, duration: 1.5, ease: "power3.out" }
    );

    // Parallax Effects for Hero Text (Blur Out on Scroll)
    gsap.to(".hero-scrub-container .reveal-up", {
        y: -60,
        opacity: 0,
        filter: "blur(15px)",
        stagger: 0.05,
        scrollTrigger: {
            trigger: ".hero-scrub-container",
            start: "top top",
            end: "15% top",
            scrub: true
        }
    });

    // Reveal Animation for generic sections
    gsap.utils.toArray('section .reveal-up, section .reveal-zoom').forEach(function (elem) {
        ScrollTrigger.create({
            trigger: elem,
            start: "top 85%",
            onEnter: function () {
                elem.classList.add('active');
            }
        });
    });

    // Flashlight Effect Function
    window.updateFlashlight = function (e, card) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty("--mouse-x", `${x}px`);
        card.style.setProperty("--mouse-y", `${y}px`);
    }

    // GSAP Scroll Animation
    gsap.to(currentFrame, {
        index: frameCount - 1,
        ease: "none",
        scrollTrigger: {
            trigger: ".hero-scrub-container",
            start: "top top",
            end: "bottom bottom",
            scrub: 0,
            onUpdate: () => {
                requestAnimationFrame(render);
            }
        }
    });

    // Add custom keyframe for scroll line
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
        @keyframes scroll-line {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(100%); }
        }
        .animate-scroll-line {
            animation: scroll-line 1.5s cubic-bezier(0.77, 0, 0.175, 1) infinite;
        }
    `;
    document.head.appendChild(styleSheet);
});
