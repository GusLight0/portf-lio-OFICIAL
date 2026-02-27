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
        });
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
            // Remove a classe active de todos os botões
            filterBtns.forEach(b => b.classList.remove('active'));
            // Adiciona a classe active ao botão clicado
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            // 1. Inicia animação de saída (fade-out) em TODOS os cards
            projectCards.forEach(card => {
                card.classList.add('anim-out');
            });

            // 2. Aguarda o tempo da transição (300ms) para reorganizar o layout
            setTimeout(() => {
                projectCards.forEach(card => {
                    if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                        card.classList.remove('hide');
                        // Pequeno delay para garantir que o navegador processe a remoção do hide antes do fade-in
                        setTimeout(() => card.classList.remove('anim-out'), 50);
                    } else {
                        card.classList.add('hide');
                    }
                });
            }, 300);
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