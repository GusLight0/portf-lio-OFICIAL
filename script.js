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
    }
    
    // Inicia a animação após um pequeno delay
    setTimeout(type, 500);
}