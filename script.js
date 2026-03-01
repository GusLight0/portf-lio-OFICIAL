// --- LENIS SCROLL (Suavidade Premium) ---
// Inicializa a rolagem com inércia
const lenis = new Lenis({
    duration: 1.2, // Duração da inércia (quanto maior, mais "pesado" e suave)
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Curva exponencial suave
    direction: 'vertical',
    smooth: true
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// --- PRELOADER ---
window.addEventListener("load", () => {
    const preloader = document.getElementById("preloader");
    const body = document.body;

    // Garante que o preloader fique visível por pelo menos um tempinho para o efeito "premium"
    setTimeout(() => {
        preloader.classList.add("hide");
        body.classList.add("loaded"); // Libera o scroll
        
        // Inicia as animações de reveal apenas depois do carregamento
        setTimeout(() => {
            // Dispara o observer de reveal manualmente se necessário ou deixa o scroll fazer
        }, 500);
    }, 2000); // Tempo ajustado para 2s (equilíbrio ideal entre estética e UX)
});

// --- CURSOR PERSONALIZADO ---
const cursorDot = document.querySelector("[data-cursor-dot]");
const cursorOutline = document.querySelector("[data-cursor-outline]");

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

        // Anel segue com uma animação suave (usando animate do JS para performance)
        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" });
    });

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
let filterTimeout; // Variável para controlar cliques rápidos e evitar bugs visuais

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

            // Se houver uma animação de filtro rodando, cancela ela para reiniciar
            if (filterTimeout) clearTimeout(filterTimeout);

            // ensure the clicked button is visible on small screens
            btn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });

            // captura o filtro escolhido antes de usar dentro do timeout
            const filterValue = btn.getAttribute('data-filter');

            // Inicia animação de saída (fade-out) em TODOS os cards
            projectCards.forEach(card => {
                card.classList.add('anim-out');
            });

            // 2. Aguarda o tempo da transição (600ms) para reorganizar o layout
            filterTimeout = setTimeout(() => {
                let delay = 0; // Variável para controlar o atraso sequencial (efeito shuffle)
                projectCards.forEach(card => {
                    if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                        card.classList.remove('hide');
                        
                        // Remove a classe de animação com um atraso crescente para cada card
                        setTimeout(() => {
                            card.classList.remove('anim-out');
                        }, delay);
                        delay += 100; // Adiciona 100ms de atraso para o próximo card
                    } else {
                        card.classList.add('hide');
                    }
                });
            }, 600); // Tempo ajustado para igualar a transição do CSS (0.6s)
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
const typewriterElement = document.getElementById('typewriter-text');

if (typewriterElement) {
    const text1 = "GUSTAVO ";
    const text2 = "DEV";
    let i = 0;
    let j = 0;

    function type() {
        if (i < text1.length) {
            typewriterElement.innerHTML += text1.charAt(i);
            i++;
            setTimeout(type, 100); // Velocidade da digitação
        } else if (j < text2.length) {
            // Cria o elemento strong se ainda não existir
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
    
    // Inicia a animação após um pequeno delay
    setTimeout(type, 500);
}

// Efeito de "Poeira Digital" (Partículas) nas Seções
const particleSections = ['about', 'projects', 'contact'];

particleSections.forEach(sectionId => {
    const section = document.getElementById(sectionId);

    if (section) {
        // Cria o container
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'particles-container';
        particlesContainer.setAttribute('aria-hidden', 'true');
        section.appendChild(particlesContainer);

        const particleCount = 40; // Quantidade de partículas

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            
            // Configurações aleatórias para cada partícula
            const left = Math.random() * 100; // Posição horizontal (0 a 100%)
            const duration = Math.random() * 20 + 15; // Duração entre 15s e 35s (bem lento)
            const delay = Math.random() * 30; // Delay inicial para não subirem todas juntas
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

// toggle filters visibility (small screens)
const filterToggle = document.querySelector('.filter-toggle');
if (filterToggle) {
    filterToggle.addEventListener('click', () => {
        const controls = filterToggle.closest('.project-controls');
        const open = controls.classList.toggle('filters-open');
        filterToggle.setAttribute('aria-expanded', open);
    });
}

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