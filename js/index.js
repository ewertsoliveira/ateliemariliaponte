// 1. Instanciar GSAP e ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {

    // Lógica 01: Entradas Animadas instantâneas (apenas no container topo)
    const heroReveals = document.querySelectorAll('.hero-scrub-container .reveal-up');
    heroReveals.forEach((el, index) => {
        setTimeout(() => { el.classList.add('active'); }, 100 + (100 * index));
    });

    // Parallax Text Fading: Esvaece o texto do Hero enquanto o usuário começa a dar scroll
    gsap.to(".hero-scrub-container .reveal-up, .hero-fade", {
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

    // Lógica 03: Pinned Timeline interativa vertical (A Jornada)
    const journeyTl = gsap.timeline({
        scrollTrigger: {
            trigger: ".journey-pin-container",
            start: "top 60%", // Inicia engatilho visual quando container atinge 60% da página
            end: "bottom 80%", // Esvaece timeline quando o rodapé bater 80%.
            scrub: 1,
        }
    });

    // 1. Barrinha preenchendo (4 unidades de tempo virtuais)
    journeyTl.to(".journey-line-fill", {
        scaleY: 1,
        ease: "none",
        duration: 4
    }, 0);

    // 2. Aparição sequencial dos capítulos (1 unidade de tempo cada)
    const steps = gsap.utils.toArray('.journey-step');
    steps.forEach((step, i) => {
        const startTime = i; // 0, 1, 2, 3
        
        // Fade In + Subir Cartão
        journeyTl.to(step, {
            opacity: 1,
            y: 0,
            ease: "power2.out",
            duration: 0.7
        }, startTime);

        // Destacar o 'dot' correspondente na linha central
        const dot = step.querySelector('.journey-dot');
        if(dot) {
            journeyTl.to(dot, {
                backgroundColor: "#1c1917", // bg-stone-900
                scale: 1.3,
                ease: "back.out(2)",
                duration: 0.3
            }, startTime + 0.1);
        }
        
        // Rotação sutil do icone
        const icon = step.querySelector('iconify-icon');
        if(icon) {
            journeyTl.fromTo(icon, 
                { rotation: -20, scale: 0.8 },
                { rotation: 0, scale: 1, ease: "back.out(1.5)", duration: 0.5 }, 
                startTime + 0.2
            );
        }
    });

    // Gatilhos de Rolagem: Reveal-ups de outras seções (ex: segunda dobra) só acionam quando aparecem na tela
    gsap.utils.toArray('section .reveal-up').forEach(function (elem) {
        ScrollTrigger.create({
            trigger: elem,
            start: "top 85%",
            onEnter: function () {
                elem.classList.add('active');
            }
        });
    });

    // Lógica 02: Engine de Sequência de Imagens Otimizada (Premium Canvas approach)
    const canvas = document.getElementById("hero-canvas");
    const ctx = canvas.getContext("2d"); // Sem alpha: false para não iniciar com tela preta

    // ========================================================================
    // CONFIGURAÇÃO DOS FRAMES
    // O usuário extraiu JPGs do MP4 e os colocou na pasta.
    // Para atualizar, mude o FRAME_COUNT e garanta que as imagens estejam numeradas
    // Ex: assets/video_frames_noiva/frame_0001.jpg
    // ========================================================================
    const FRAME_COUNT = 144;
    const FOLDER_PATH = "assets/video_frames_vestido/";
    const FRAME_NAME = "frame_";
    const FRAME_EXT = ".jpg";

    // Resolução base que o vídeo original tinha
    canvas.width = 1920;
    canvas.height = 1080;

    const images = [];
    const proxy = { frame: 0 };
    let loadedCount = 0;

    function render() {
        const i = Math.round(proxy.frame);
        if (images[i]) {
            ctx.drawImage(images[i], 0, 0, canvas.width, canvas.height);
        }
    }

    // Pré-carregamento dinâmico adaptado para os novos arquivos (000 até 143)
    for (let i = 0; i < FRAME_COUNT; i++) {
        const img = new Image();
        const frameNumber = i.toString().padStart(3, '0');
        img.src = `${FOLDER_PATH}${FRAME_NAME}${frameNumber}${FRAME_EXT}`;

        img.onload = () => {
            loadedCount++;
            // Desenha o primeiro quadro imediatamente para não mostrar fundo branco
            if (i === 0) {
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            }
        };
        images.push(img);
    }

    // Ativa Motor GSAP Frame Perfect
    gsap.to(proxy, {
        frame: FRAME_COUNT - 1,
        ease: "none",
        scrollTrigger: {
            trigger: ".hero-scrub-container",
            start: "top top",
            end: "bottom bottom",
            scrub: 0 // Retorno da mágica: Scroll 100% liso e instantâneo
        },
        onUpdate: () => requestAnimationFrame(render)
    });
});
