// 1. Instanciar GSAP e ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {

    // Lógica 01: Garantir que os elementos do Hero fiquem ativos e sem conflito de CSS transition
    const heroElements = document.querySelectorAll('.hero-scrub-container .reveal-up, .hero-scrub-container .hero-fade');
    heroElements.forEach((el) => {
        el.classList.add('active');
        el.style.transition = 'none'; // Impede que o transition do CSS brigue com o scrub do GSAP
    });

    // Entrada suave no carregamento inicial (se estiver no topo)
    if (window.scrollY < 60) {
        gsap.fromTo(heroElements, 
            {
                y: 35,
                opacity: 0,
                filter: "blur(10px)"
            },
            {
                y: 0,
                opacity: 1,
                filter: "blur(0px)",
                duration: 1.1,
                stagger: 0.1,
                ease: "power2.out"
            }
        );
    }

    // Parallax Text Fading: Esvaece o texto do Hero ao rolar e GARANTE retorno ao subir ao topo
    gsap.fromTo(heroElements, 
        {
            y: 0,
            opacity: 1,
            filter: "blur(0px)"
        },
        {
            y: -60,
            opacity: 0,
            filter: "blur(15px)",
            stagger: 0.04,
            ease: "none",
            scrollTrigger: {
                trigger: ".hero-scrub-container",
                start: "top top",
                end: "20% top",
                scrub: true,
                invalidateOnRefresh: true
            }
        }
    );

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

    // Gatilhos de Rolagem: Reveal-ups de outras seções (excluindo hero) só acionam quando aparecem na tela
    gsap.utils.toArray('section .reveal-up').forEach(function (elem) {
        if (elem.closest('.hero-scrub-container')) return;
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
    const FRAME_COUNT = 160;
    const FOLDER_PATH = "assets/sequencia/";
    const FRAME_NAME = "sequencia-";
    const FRAME_EXT = ".webp";

    // Resolução base que o vídeo original tinha
    canvas.width = 1920;
    canvas.height = 1080;

    const images = new Array(FRAME_COUNT);
    const proxy = { frame: 0 };

    function frameSrc(i) {
        return `${FOLDER_PATH}${FRAME_NAME}${i.toString().padStart(3, '0')}${FRAME_EXT}`;
    }

    function isReady(img) {
        return !!img && img.complete && img.naturalWidth > 0;
    }

    // Se o frame exato ainda não chegou, usa o carregado mais próximo.
    // Assim o canvas mostra sempre algo coerente durante o scroll, em vez
    // de congelar no último frame desenhado ou piscar em branco.
    function pickFrame(i) {
        if (isReady(images[i])) return images[i];
        for (let d = 1; d < FRAME_COUNT; d++) {
            if (isReady(images[i - d])) return images[i - d];
            if (isReady(images[i + d])) return images[i + d];
        }
        return null;
    }

    function render() {
        const img = pickFrame(Math.round(proxy.frame));
        if (img) {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        }
    }

    // ========================================================================
    // CARREGAMENTO ESCALONADO DOS FRAMES
    // Os 160 frames somam ~13 MB. Dispará-los de uma vez (como antes) satura
    // a conexão e atrasa a primeira pintura no celular. Aqui carregamos
    // primeiro o lote que o início do scroll realmente precisa e o restante
    // só depois do load da página, com no máximo MAX_PARALLEL requisições
    // simultâneas.
    // ========================================================================
    const EAGER_COUNT = 25;   // frames do croqui — aparecem logo no topo
    const MAX_PARALLEL = 6;

    function loadFrame(i) {
        return new Promise((resolve) => {
            const img = new Image();
            img.decoding = "async";
            img.onload = () => {
                if (i === 0) render();
                resolve();
            };
            img.onerror = resolve;   // um frame ausente não trava a fila
            img.src = frameSrc(i);
            images[i] = img;
        });
    }

    function loadRange(from, to) {
        let next = from;
        const worker = async () => {
            while (next < to) {
                await loadFrame(next++);
            }
        };
        return Promise.all(Array.from({ length: MAX_PARALLEL }, worker));
    }

    loadRange(0, EAGER_COUNT).then(() => {
        render();
        const loadRest = () => loadRange(EAGER_COUNT, FRAME_COUNT);
        if (document.readyState === "complete") {
            loadRest();
        } else {
            window.addEventListener("load", loadRest, { once: true });
        }
    });

    // Ativa Motor GSAP Frame Perfect com mapeamento não-linear
    // Frames do croqui (0-24): recebem 70% do scroll → animação lenta e detalhada
    // Frames da noiva (25-95): recebem 30% do scroll → velocidade normal
    const CROQUI_END_FRAME = 25;    // último frame do croqui (0-indexado)
    const CROQUI_SCROLL_SHARE = 0.30; // croqui=150vh (30%), noiva=350vh (70%)

    gsap.to({}, {
        scrollTrigger: {
            trigger: ".hero-scrub-container",
            start: "top top",
            end: "bottom bottom",
            scrub: 0,
            onUpdate: (self) => {
                const progress = self.progress;
                let frame;
                if (progress <= CROQUI_SCROLL_SHARE) {
                    // Croqui: mapeia 0→70% do scroll para frames 0→24
                    frame = Math.round((progress / CROQUI_SCROLL_SHARE) * CROQUI_END_FRAME);
                } else {
                    // Noiva: mapeia 70→100% do scroll para frames 25→95
                    const noivaProg = (progress - CROQUI_SCROLL_SHARE) / (1 - CROQUI_SCROLL_SHARE);
                    frame = Math.round(CROQUI_END_FRAME + noivaProg * (FRAME_COUNT - 1 - CROQUI_END_FRAME));
                }
                proxy.frame = Math.min(Math.max(frame, 0), FRAME_COUNT - 1);
                requestAnimationFrame(render);

                // Panning e Zoom dinâmico no mobile
                if (window.innerWidth < 768) {
                    if (progress <= CROQUI_SCROLL_SHARE) {
                        // Cena 1 (Croqui): desliza para a direita (63.5% → 78.5%), mantém zoom de 1.4
                        const localProg = progress / CROQUI_SCROLL_SHARE;
                        const pos = 63.5 + (localProg * 15);
                        canvas.style.objectPosition = `${pos}% center`;
                        canvas.style.transform = `scale(1.4)`;
                    } else {
                        // Cena 2+3: desliza para centralizar a noiva e reduz o zoom rapidamente para abrir o plano na Cena 2
                        const noivaProg = (progress - CROQUI_SCROLL_SHARE) / (1 - CROQUI_SCROLL_SHARE);
                        // Posição: 78.5% -> 50%
                        const pos = 78.5 - (noivaProg * 28.5);
                        canvas.style.objectPosition = `${pos}% center`;
                        // Zoom: afasta rápido de 1.4 para 1.0 logo no começo da Cena 2
                        const currentScale = Math.max(1.0, 1.4 - (noivaProg * 1.2));
                        canvas.style.transform = `scale(${currentScale})`;
                    }
                }

                // Fade in the white gradient during the last 10% of the scroll
                const fadeEl = document.getElementById("hero-gradient-fade");
                if (fadeEl) {
                    if (progress > 0.90) {
                        fadeEl.style.opacity = (progress - 0.90) * 10;
                    } else {
                        fadeEl.style.opacity = 0;
                    }
                }
            }
        }
    });

    
});
