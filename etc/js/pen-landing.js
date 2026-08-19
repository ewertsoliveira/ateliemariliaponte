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
            img.src = `assets/video_frames/frame_${frameNumber}.jpg`;
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

    // Initial Reveal Animation (Text)
    const reveals = document.querySelectorAll('.reveal-up');
    reveals.forEach((el, index) => {
        setTimeout(() => {
            el.classList.add('active');
        }, 100 * index);
    });

    // Canvas Intro Animation
    gsap.fromTo(canvas,
        { opacity: 0, scale: 1.1 },
        { opacity: 1, scale: 1, duration: 1.5, ease: "power3.out" }
    );

    // Parallax Effects for Text (Blur Out on Scroll)
    gsap.to(".reveal-up", {
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
});
