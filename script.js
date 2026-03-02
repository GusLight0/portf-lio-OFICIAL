// --- LENIS SCROLL (Suavidade Premium) ---
// Inicializa a rolagem com inércia
const lenis = new Lenis({
    duration: 1.2, // Duração da inércia (quanto maior, mais "pesado" e suave)
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Curva exponencial suave
    direction: 'vertical',
    smooth: true
});

// Seleciona as imagens para o parallax
const parallaxImages = document.querySelectorAll('.project-image img');

// --- GLOBAL ANIMATION LOOP ---
function animationLoop(time) {
    // 1. Lenis Scroll
    lenis.raf(time);
    
    // 2. Parallax Effect
    if (parallaxImages.length > 0) {
        const windowHeight = window.innerHeight;
        parallaxImages.forEach(img => {
            const rect = img.parentElement.getBoundingClientRect();
            if (rect.top < windowHeight && rect.bottom > 0) {
                const speed = 20;
                const progress = (rect.top + rect.height / 2) / windowHeight - 0.5;
                const y = progress * speed;
                img.style.setProperty('--parallax-y', `${y}px`);
            }
        });
    }

    // 3. Custom Cursor Animation
    if (typeof animateCursorOutline === 'function') {
        animateCursorOutline();
    }

    // 4. Particles Animation
    if (typeof handleParticles === 'function') {
        handleParticles();
    }

    // Continue the loop
    requestAnimationFrame(animationLoop);
}
// Start the loop
requestAnimationFrame(animationLoop);

// --- PRELOADER ---
window.addEventListener("load", () => {
    const preloader = document.getElementById("preloader");
    const loaderText = document.querySelector(".loader-text");
    const body = document.body;

    // Prepara o texto para o efeito glitch (copia o conteúdo para o atributo data-text)
    if (loaderText) {
        loaderText.setAttribute("data-text", loaderText.innerText);
    }

    // Ativa o efeito glitch um pouco antes de sumir (aos 1200ms)
    setTimeout(() => {
        if (loaderText) loaderText.classList.add("glitch");
    }, 1200);

    // Garante que o preloader fique visível por pelo menos um tempinho para o efeito "premium"
    setTimeout(() => {
        preloader.classList.add("hide");
        body.classList.add("loaded"); // Libera o scroll
        
        // Remove a classe glitch depois que sumir para limpar a animação
        setTimeout(() => {
            if (loaderText) loaderText.classList.remove("glitch");
        }, 500);

        // Inicia as animações de reveal apenas depois do carregamento
        setTimeout(() => {
            // Dispara o observer de reveal manualmente se necessário ou deixa o scroll fazer
        }, 500);

        // Inicia o efeito de digitação APÓS o loader sumir
        initTypewriter();
    }, 2200); // Tempo levemente ajustado para acomodar o efeito
});

// --- CURSOR PERSONALIZADO ---
const cursorDot = document.querySelector("[data-cursor-dot]");
const cursorOutline = document.querySelector("[data-cursor-outline]");

let targetCursorOutlineX = 0;
let targetCursorOutlineY = 0;
let currentCursorOutlineX = 0;
let currentCursorOutlineY = 0;
const easingFactor = 0.15; // Controla a suavidade do "lag" (0 a 1, menor = mais suave)

// Verifica se os elementos existem (para evitar erros)
if (cursorDot && cursorOutline) {
    window.addEventListener("mousemove", function (e) {
        const posX = e.clientX;
        const posY = e.clientY;

        // Atualiza variáveis CSS para o efeito de Spotlight no fundo
        document.body.style.setProperty('--mouse-x', `${posX}px`);
        document.body.style.setProperty('--mouse-y', `${posY}px`);

        // Ponto segue instantaneamente
        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        // Atualiza o alvo para o outline
        targetCursorOutlineX = posX;
        targetCursorOutlineY = posY;
    });

    // Função para animar o contorno do cursor
    function animateCursorOutline() {
        // Interpola a posição atual em direção à posição alvo
        currentCursorOutlineX += (targetCursorOutlineX - currentCursorOutlineX) * easingFactor;
        currentCursorOutlineY += (targetCursorOutlineY - currentCursorOutlineY) * easingFactor;

        // Aplica a posição usando left/top para o outline
        cursorOutline.style.left = `${currentCursorOutlineX}px`;
        cursorOutline.style.top = `${currentCursorOutlineY}px`;
    }

    // Efeito de Hover em elementos interativos
    const interactiveElements = document.querySelectorAll("a, button, .project-card, input, textarea, .filter-btn");
    
    interactiveElements.forEach(el => {
        el.addEventListener("mouseenter", () => {
            document.body.classList.add("hovering");
            // Opcional: aumentar levemente o ponto
            cursorDot.style.transform = "translate(-50%, -50%) scale(1.5)";
        });
        
        el.addEventListener("mouseleave", () => {
            document.body.classList.remove("hovering");
            cursorDot.style.transform = "translate(-50%, -50%) scale(1)";
        });
    });
    
    // Esconde o cursor quando sai da janela
    document.addEventListener("mouseout", () => {
        cursorDot.style.opacity = "0";
        cursorOutline.style.opacity = "0";
    });
    document.addEventListener("mouseover", () => {
        cursorDot.style.opacity = "1";
        cursorOutline.style.opacity = "1";
    });
}

// Menu Mobile
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const nav = document.querySelector('.nav');

if (mobileMenuBtn && nav) {
    // Abrir/Fechar menu ao clicar no botão
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        nav.classList.toggle('active');
        // Impede a rolagem do corpo quando o menu está aberto (opcional, mas recomendado)
        document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : 'auto';
    });

    // Fechar menu ao clicar em um link
    document.querySelectorAll('.nav a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuBtn.classList.remove('active');
            nav.classList.remove('active');
            document.body.style.overflow = 'auto';
            // Lenis precisa saber que voltamos a rolar
            lenis.start();
        });
    });
    
    // Pausa o Lenis quando o menu mobile abre para evitar rolagem de fundo
    mobileMenuBtn.addEventListener('click', () => {
        if (nav.classList.contains('active')) {
            lenis.stop();
        } else {
            lenis.start();
        }
    });
}

// Animação de Scroll Reveal
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target); // Para de observar após animar (anima apenas uma vez)
        }
    });
}, {
    root: null,
    threshold: 0.1, // Dispara quando 10% do elemento estiver visível
    rootMargin: "0px 0px -50px 0px" // Ajuste para disparar um pouco antes do fim da tela
});

revealElements.forEach(el => revealObserver.observe(el));

// Filtro de Projetos
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

if (filterBtns.length > 0 && projectCards.length > 0) {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove a classe active de todos os botões e desmarca ARIA
            filterBtns.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-pressed', 'false');
            });
            // Adiciona a classe active ao botão clicado e marca ARIA
            btn.classList.add('active');
            btn.setAttribute('aria-pressed', 'true');

            // ensure the clicked button is visible on small screens
            btn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });

            // captura o filtro escolhido antes de usar dentro do timeout
            const filterValue = btn.getAttribute('data-filter');

            // Reset scroll da galeria no mobile para o início
            const gallery = document.querySelector('.project-gallery');
            if (gallery) {
                gallery.scrollTo({ left: 0, behavior: 'smooth' });
            }

            // Lógica de Filtro "Apple-like" (Rápida e Fluida)
            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filterValue === 'all' || category === filterValue) {
                    // Se for mostrar:
                    if (card.classList.contains('hide')) {
                        // Se estava escondido, remove hide e prepara animação de entrada
                        card.classList.remove('hide');
                        card.classList.add('anim-out'); // Começa pequeno/invisível
                        
                        // Força reflow para o navegador processar a mudança de display
                        void card.offsetWidth; 
                        
                        // Remove anim-out para animar para o estado normal
                        requestAnimationFrame(() => {
                            card.classList.remove('anim-out');
                        });
                    } else {
                        // Se já estava visível, garante que não tenha anim-out
                        card.classList.remove('anim-out');
                    }
                } else {
                    // Se for esconder:
                    card.classList.add('hide');
                }
            });
        });
    });

    // Atualizar contadores de projetos
    function updateFilterCounts() {
        filterBtns.forEach(btn => {
            const filterValue = btn.getAttribute('data-filter');
            const countSpan = btn.querySelector('.filter-count');
            
            if (countSpan) {
                let count = 0;
                if (filterValue === 'all') {
                    count = projectCards.length;
                } else {
                    count = Array.from(projectCards).filter(card => card.getAttribute('data-category') === filterValue).length;
                }
                countSpan.textContent = count;
            }
        });
    }
    
    // Chama a função ao carregar a página
    updateFilterCounts();

    // todo: tornar clique no card inteiro direcionar para o link 'Ver Online'
    projectCards.forEach(card => {
        const primary = card.querySelector('.btn-project.primary');
        if (primary) {
            card.style.cursor = 'pointer';
            card.addEventListener('click', e => {
                // se o clique não aconteceu em um link dentro do card, abre o principal
                if (!e.target.closest('a')) {
                    window.open(primary.href, '_blank');
                }
            });
        }
    });

    // --- EFEITO TILT 3D (APPLE TV STYLE) ---
    // Apenas para dispositivos com mouse (desktop) para economizar bateria no mobile
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
        projectCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                // Calcula o centro do cartão
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                // Calcula a rotação (limitada a +/- 8 graus para ser sutil)
                // Multiplicador controla a intensidade
                const rotateX = ((y - centerY) / centerY) * -8; 
                const rotateY = ((x - centerX) / centerX) * 8;

                // Define as variáveis CSS para o transform e para o brilho (glare)
                card.style.setProperty('--rotate-x', `${rotateX}deg`);
                card.style.setProperty('--rotate-y', `${rotateY}deg`);
                card.style.setProperty('--glare-x', `${(x / rect.width) * 100}%`);
                card.style.setProperty('--glare-y', `${(y / rect.height) * 100}%`);
            });

            card.addEventListener('mouseenter', () => {
                // Adiciona classe que remove a transição (para movimento instantâneo)
                card.classList.add('is-hovering');
            });

            card.addEventListener('mouseleave', () => {
                // Remove a classe para que o cartão volte suavemente à posição original
                card.classList.remove('is-hovering');
                // Reseta as variáveis
                card.style.setProperty('--rotate-x', '0deg');
                card.style.setProperty('--rotate-y', '0deg');
                card.style.setProperty('--glare-x', '50%');
                card.style.setProperty('--glare-y', '50%');
            });
        });
    }
}

// Formulário de Contato (Formspree com AJAX)
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Impede o redirecionamento padrão
        const data = new FormData(contactForm);
        
        // Feedback visual de carregamento
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = 'Enviando...';
        submitBtn.disabled = true;

        try {
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: data,
                headers: { 'Accept': 'application/json' }
            });
            
            if (response.ok) {
                formStatus.textContent = "Mensagem enviada com sucesso! Entrarei em contato em breve.";
                formStatus.className = "form-status success";
                contactForm.reset(); // Limpa o formulário

                // Dispara o efeito de confete (Celebração)
                if (typeof confetti === 'function') {
                    confetti({
                        particleCount: 150,
                        spread: 70,
                        origin: { y: 0.6 },
                        colors: ['#00ff8a', '#00c07a', '#ffffff'] // Cores do tema (Neon, Mid Green, White)
                    });
                }
            } else {
                formStatus.textContent = "Ocorreu um erro ao enviar. Tente novamente.";
                formStatus.className = "form-status error";
            }
        } catch (error) {
            formStatus.textContent = "Erro de conexão. Verifique sua internet.";
            formStatus.className = "form-status error";
        } finally {
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
        }
    });
}

// Efeito de Digitação (Typewriter) para o Nome
function initTypewriter() {
    const typewriterElement = document.getElementById('typewriter-text');

    if (typewriterElement) {
        const text1 = "GUSTAVO ";
        const text2 = "DEV";
        let i = 0;
        let j = 0;

        // Limpa o conteúdo inicial para garantir que comece do zero
        typewriterElement.innerHTML = "";

        function type() {
            if (i < text1.length) {
                typewriterElement.innerHTML += text1.charAt(i);
                i++;
                setTimeout(type, 100);
            } else if (j < text2.length) {
                let strong = typewriterElement.querySelector('strong');
                if (!strong) {
                    strong = document.createElement('strong');
                    typewriterElement.appendChild(strong);
                }
                strong.innerHTML += text2.charAt(j);
                j++;
                setTimeout(type, 100);
            }
            
            // Atualiza o atributo data-text para o efeito de glitch CSS funcionar
            typewriterElement.setAttribute('data-text', typewriterElement.innerText);
        }
        type();
    }
}

// Efeito de "Poeira Digital" (Partículas) nas Seções
const particleSections = ['home', 'about', 'services', 'projects', 'certificates', 'contact'];

particleSections.forEach(sectionId => {
    const section = document.getElementById(sectionId);

    if (section) {
        // Cria o container
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'particles-container';
        section.appendChild(particlesContainer);

        const particleCount = 40; // Quantidade de partículas

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Configurações aleatórias para cada partícula
            const left = Math.random() * 100; // Posição horizontal
            const delay = Math.random() * 5; // Atraso na animação
            const duration = Math.random() * 5 + 5; // Duração (5s a 10s)
            const opacity = Math.random() * 0.5 + 0.1; // Opacidade variável
            const drift = (Math.random() - 0.5) * 150 + 'px'; // Desvio lateral

            particle.style.left = `${left}%`;
            particle.style.animationDuration = `${duration}s`;
            particle.style.animationDelay = `-${delay}s`; // Delay negativo para já começarem espalhadas
            particle.style.setProperty('--opacity', opacity);
            particle.style.setProperty('--drift', drift);

            particlesContainer.appendChild(particle);
        }
    }
});


// add numbering to certificates (index/total) and count per issuer
const certCards = document.querySelectorAll('.certificate-card');
if (certCards.length) {
    const total = certCards.length;
    // count occurrences per issuer text
    const counts = {};
    certCards.forEach(card => {
        const header = card.querySelector('.cert-header h3');
        if (header) {
            const key = header.textContent.trim();
            counts[key] = (counts[key] || 0) + 1;
        }
    });

    certCards.forEach((card, idx) => {
        const header = card.querySelector('.cert-header h3');
        if (header) {
            const span = document.createElement('span');
            span.className = 'cert-index';
            span.textContent = `${idx + 1}/${total}`;
            header.prepend(span);

            const key = header.textContent.trim();
            if (counts[key] > 1) {
                const badge = document.createElement('span');
                badge.className = 'cert-issuer-count';
                badge.textContent = `(${counts[key]})`;
                header.appendChild(badge);
            }
        }
    });
}

// Active Scroll Spy (Menu destaca conforme rola a página)
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav a');

const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Remove a classe ativa de todos os links
            navLinks.forEach(link => link.classList.remove('active-link'));
            
            // Pega o ID da seção que está na tela
            const id = entry.target.getAttribute('id');
            
            // Seleciona o link correspondente a esse ID
            const activeLink = document.querySelector(`.nav a[href="#${id}"]`);
            
            // Adiciona a classe ativa
            if (activeLink) {
                activeLink.classList.add('active-link');
            }
        }
    });
}, {
    threshold: 0.3, // Aciona quando 30% da seção estiver visível
    rootMargin: "-10% 0px -10% 0px" // Ajuste fino para ativar um pouco antes do centro
});

sections.forEach(section => {
    scrollObserver.observe(section);
});

// Carrossel de Certificados com Setas
const carouselWrapper = document.querySelector('.carousel-wrapper');

if (carouselWrapper) {
    const carouselList = carouselWrapper.querySelector('.certificates-list');
    const prevBtn = carouselWrapper.querySelector('.carousel-btn.prev');
    const nextBtn = carouselWrapper.querySelector('.carousel-btn.next');

    // helper to update visibility of arrows depending on scroll position
    function updateCarouselButtons() {
        if (!carouselList) return;
        const scrollLeft = carouselList.scrollLeft;
        const maxScroll = carouselList.scrollWidth - carouselList.clientWidth;
        // small tolerance for rounding
        const atStart = scrollLeft <= 10;
        const atEnd = scrollLeft >= maxScroll - 10;

        if (prevBtn) prevBtn.style.display = atStart ? 'none' : 'flex';
        if (nextBtn) nextBtn.style.display = atEnd ? 'none' : 'flex';
    }

    if (carouselList && prevBtn && nextBtn) {
        nextBtn.addEventListener('click', () => {
            const card = carouselList.querySelector('.certificate-card');
            if (!card) return;

            const gap = parseFloat(window.getComputedStyle(carouselList).gap);
            const scrollAmount = card.offsetWidth + gap;
            
            carouselList.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        });

        prevBtn.addEventListener('click', () => {
            const card = carouselList.querySelector('.certificate-card');
            if (!card) return;

            const gap = parseFloat(window.getComputedStyle(carouselList).gap);
            const scrollAmount = card.offsetWidth + gap;

            carouselList.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });

        // listen for scroll and resize to adjust arrows
        carouselList.addEventListener('scroll', updateCarouselButtons);
        window.addEventListener('resize', updateCarouselButtons);

        // initial setup
        updateCarouselButtons();
    }
}

// --- SOM DO WHATSAPP ---
const whatsappBtn = document.querySelector('.whatsapp-btn');
const whatsappSound = document.getElementById('whatsapp-pop');

if (whatsappBtn && whatsappSound) {
    whatsappBtn.addEventListener('mouseenter', () => {
        // Reinicia o áudio para tocar sempre que passar o mouse, mesmo se já estiver tocando
        whatsappSound.currentTime = 0;
        whatsappSound.volume = 0.4; // Volume agradável
        whatsappSound.play().catch(error => console.log("Interação necessária para tocar áudio:", error));
    });
}

// --- SOM DE HOVER NOS PROJETOS ---
const techHoverSound = document.getElementById('tech-hover-sound');
const projectCardsSound = document.querySelectorAll('.project-card');

if (techHoverSound && projectCardsSound.length > 0) {
    projectCardsSound.forEach(card => {
        card.addEventListener('mouseenter', () => {
            techHoverSound.currentTime = 0;
            techHoverSound.volume = 0.1; // Volume bem sutil (10%)
            techHoverSound.play().catch(() => {}); // Ignora erros de autoplay
        });
    });
}

// --- ANIMAÇÃO DE FADE-IN NO CARROSSEL MOBILE (FOCUS EFFECT) ---
const mobileGallery = document.querySelector('.project-gallery');

if (mobileGallery) {
    // Verifica se estamos no mobile (largura < 720px)
    const isMobileView = () => window.matchMedia('(max-width: 720px)').matches;

    if (isMobileView()) {
        const mobileObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Se o card não estiver visível (menos de 60% na tela), adiciona classe 'out-of-view'
                // Se estiver visível, remove a classe (efeito fade-in)
                entry.target.classList.toggle('out-of-view', !entry.isIntersecting);
            });
        }, {
            root: mobileGallery, // Usa a própria galeria como viewport
            threshold: 0.6, // O card precisa estar 60% visível para "acender"
            rootMargin: "0px -15% 0px -15%" // Margem negativa para focar apenas no centro exato
        });

        document.querySelectorAll('.project-card').forEach(card => {
            mobileObserver.observe(card);
        });
    }
}

// --- PARTÍCULAS CONECTADAS (PLEXUS EFFECT) ---
const magneticCanvas = document.getElementById('magnetic-particles');
let particlesArray = [];
let handleParticles; // Declara a função para que possa ser chamada no loop de animação

if (magneticCanvas) {
    const ctx = magneticCanvas.getContext('2d');
    
    function resizeCanvas() {
        magneticCanvas.width = window.innerWidth;
        magneticCanvas.height = window.innerHeight;
        initParticles(); // Recria as partículas para o novo tamanho
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
        constructor() {
            this.x = Math.random() * magneticCanvas.width;
            this.y = Math.random() * magneticCanvas.height;
            this.size = Math.random() * 1.5 + 1; // Partículas menores e mais sutis
            this.vx = (Math.random() - 0.5) * 0.3; // Velocidade de flutuação lenta
            this.vy = (Math.random() - 0.5) * 0.3;
            this.color = `rgba(0, 255, 138, ${Math.random() * 0.6 + 0.2})`; // Opacidade variada
        }

        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Efeito de "loop" nas bordas
            if (this.x < 0) this.x = magneticCanvas.width;
            if (this.x > magneticCanvas.width) this.x = 0;
            if (this.y < 0) this.y = magneticCanvas.height;
            if (this.y > magneticCanvas.height) this.y = 0;

            // Interação de repulsão com o mouse
            const dx = this.x - targetCursorOutlineX;
            const dy = this.y - targetCursorOutlineY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const repulsionRadius = 80; // Raio de repulsão

            if (distance < repulsionRadius) {
                const force = (repulsionRadius - distance) / repulsionRadius;
                const angle = Math.atan2(dy, dx);
                this.x += Math.cos(angle) * force * 1.5; // Empurrão suave
                this.y += Math.sin(angle) * force * 1.5;
            }
        }
    }

    function initParticles() {
        particlesArray = [];
        const numberOfParticles = Math.floor((magneticCanvas.width * magneticCanvas.height) / 20000); // Densidade ajustada
        for (let i = 0; i < numberOfParticles; i++) {
            particlesArray.push(new Particle());
        }
    }

    handleParticles = function() {
        ctx.clearRect(0, 0, magneticCanvas.width, magneticCanvas.height);
        
        // Desenha linhas entre partículas próximas
        for (let i = 0; i < particlesArray.length; i++) {
            for (let j = i; j < particlesArray.length; j++) {
                const dx = particlesArray[i].x - particlesArray[j].x;
                const dy = particlesArray[i].y - particlesArray[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const connectionRadius = 120;

                if (distance < connectionRadius) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(0, 255, 138, ${1 - distance / connectionRadius})`; // Linha some com a distância
                    ctx.lineWidth = 0.4;
                    ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                    ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
                    ctx.stroke();
                }
            }
        }

        // Atualiza e desenha cada partícula
        particlesArray.forEach(p => {
            p.update();
            p.draw();
        });
    }

    initParticles(); // Primeira inicialização
}