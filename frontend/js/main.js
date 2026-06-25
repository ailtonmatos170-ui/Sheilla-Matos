/**
 * Loja Sheilla Matos - Interatividade e Interações
 * Código JavaScript puro para carrossel de produtos, slider de depoimentos, links do WhatsApp e modais de busca/carrinho.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Inicializa todas as funcionalidades
  initScrollReveal();
  initProductCarousel();
  initTestimonialsSlider();
  initWhatsAppLinks();
  initModalsAndDrawers();
  initFavoriteButtons();
  initAuthModals();
});

/**
 * 1. Animações de Revelar ao Rolar (Scroll Reveal)
 * Usa IntersectionObserver para disparar animações suaves de CSS quando as seções entram na viewport.
 */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal-on-scroll');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Para de observar após exibir para manter a performance otimizada
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px' // dispara um pouco antes de entrar
  });

  reveals.forEach(el => observer.observe(el));
}

/**
 * 2. Carrossel de Produtos (Destaques)
 * Carrossel responsivo baseado em slides. Move o container usando transforms do CSS.
 */
function initProductCarousel() {
  const track = document.querySelector('[data-carousel-track]');
  const prevBtn = document.querySelector('[data-carousel-prev]');
  const nextBtn = document.querySelector('[data-carousel-next]');

  if (!track || !prevBtn || !nextBtn) return;

  let currentIndex = 0;

  // Calcula o total de passos com base na largura da tela
  function getItemsPerScreen() {
    if (window.innerWidth >= 1024) return 4; // Desktop
    if (window.innerWidth >= 768) return 2;  // Tablet
    return 1;                                 // Mobile
  }

  function updateCarousel() {
    const items = track.children;
    const totalItems = items.length;
    const itemsPerScreen = getItemsPerScreen();
    const maxIndex = Math.max(0, totalItems - itemsPerScreen);

    // Verificação de limites
    if (currentIndex > maxIndex) currentIndex = maxIndex;
    if (currentIndex < 0) currentIndex = 0;

    // Desloca o track
    const itemWidth = items[0].getBoundingClientRect().width;
    const gap = 24; // corresponde ao gap-6 (24px) no Tailwind
    const amountToMove = currentIndex * (itemWidth + gap);

    track.style.transform = `translateX(-${amountToMove}px)`;

    // Alterna os estados ativo/inativo nos botões de navegação
    prevBtn.style.opacity = currentIndex === 0 ? '0.4' : '1';
    prevBtn.style.cursor = currentIndex === 0 ? 'not-allowed' : 'pointer';

    nextBtn.style.opacity = currentIndex === maxIndex ? '0.4' : '1';
    nextBtn.style.cursor = currentIndex === maxIndex ? 'not-allowed' : 'pointer';
  }

  prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateCarousel();
    }
  });

  nextBtn.addEventListener('click', () => {
    const totalItems = track.children.length;
    const itemsPerScreen = getItemsPerScreen();
    const maxIndex = totalItems - itemsPerScreen;

    if (currentIndex < maxIndex) {
      currentIndex++;
      updateCarousel();
    }
  });

  // Atualiza o posicionamento do carrossel ao redimensionar a janela
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      updateCarousel();
    }, 100);
  });

  // Verificação inicial
  setTimeout(updateCarousel, 300);
}

/**
 * 3. Slider de Depoimentos
 * Transições suaves entre slides com indicadores em pontos.
 */
function initTestimonialsSlider() {
  const track = document.getElementById('testimonials-track');
  const dotsContainer = document.getElementById('testimonials-dots');

  if (!track || !dotsContainer) return;

  const slides = Array.from(track.children);
  let activeIndex = 0;
  let autoplayInterval;

  // Cria os pontos com base na quantidade de slides
  dotsContainer.innerHTML = '';
  slides.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.className = `w-2.5 h-2.5 rounded-full transition-all duration-300 ${
      index === 0 ? 'bg-[#5C4A37] w-6' : 'bg-gray-300 hover:bg-gray-400'
    }`;
    dot.setAttribute('aria-label', `Ir para depoimento ${index + 1}`);
    dot.addEventListener('click', () => {
      goToSlide(index);
      resetAutoplay();
    });
    dotsContainer.appendChild(dot);
  });

  const dots = Array.from(dotsContainer.children);

  function goToSlide(index) {
    activeIndex = index;

    // Desloca o track
    track.style.transform = `translateX(-${index * 100}%)`;

    // Atualiza o estilo dos pontos
    dots.forEach((dot, idx) => {
      if (idx === index) {
        dot.classList.remove('bg-gray-300', 'w-2.5');
        dot.classList.add('bg-[#5C4A37]', 'w-6');
      } else {
        dot.classList.remove('bg-[#5C4A37]', 'w-6');
        dot.classList.add('bg-gray-300', 'w-2.5');
      }
    });
  }

  function startAutoplay() {
    autoplayInterval = setInterval(() => {
      let nextIndex = activeIndex + 1;
      if (nextIndex >= slides.length) {
        nextIndex = 0;
      }
      goToSlide(nextIndex);
    }, 5000); // muda o slide a cada 5 segundos
  }

  function resetAutoplay() {
    clearInterval(autoplayInterval);
    startAutoplay();
  }

  // Inicia o loop de slides
  startAutoplay();
}

/**
 * 4. Formatação dos Links do WhatsApp
 * Formata os parâmetros da mensagem personalizada do WhatsApp com base na ação do botão clicado.
 */
function initWhatsAppLinks() {
  const phone = '5533987512055'; // Código do país 55 (Brasil) + DDD 33 + número

  // Botão flutuante
  const floatBtn = document.querySelector('.whatsapp-float');
  if (floatBtn) {
    const text = encodeURIComponent('Olá! Visitei o site da Loja Sheilla Matos e gostaria de conhecer as novidades e o catálogo completo.');
    floatBtn.setAttribute('href', `https://wa.me/${phone}?text=${text}`);
  }

  // Links principais de telefone no rodapé
  const footerPhoneLinks = document.querySelectorAll('.whatsapp-link-dynamic');
  footerPhoneLinks.forEach(link => {
    const text = encodeURIComponent('Olá! Gostaria de atendimento sobre as lingeries.');
    link.setAttribute('href', `https://wa.me/${phone}?text=${text}`);
  });

  // Botões de WhatsApp dos cards de produtos
  const buyButtons = document.querySelectorAll('[data-product-whatsapp]');
  buyButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const productName = btn.getAttribute('data-product-name');
      const text = encodeURIComponent(`Olá! Gostaria de consultar a disponibilidade do produto: "${productName}" que vi no site.`);
      window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
    });
  });
}

/**
 * 5. Interação de Drawer e Modais
 * Lógica para abrir/fechar o drawer do carrinho, overlay de busca e menu de navegação mobile.
 */
function initModalsAndDrawers() {
  const body = document.body;

  // Alternar Menu Mobile
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileNav = document.getElementById('mobile-navigation');
  const mobileNavClose = document.getElementById('mobile-nav-close');

  if (mobileMenuBtn && mobileNav) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileNav.classList.remove('translate-x-full');
      body.style.overflow = 'hidden'; // bloqueia a rolagem da página
    });
  }

  if (mobileNavClose) {
    mobileNavClose.addEventListener('click', () => {
      mobileNav.classList.add('translate-x-full');
      body.style.overflow = '';
    });
  }

  // Alternar Overlay de Busca
  const searchBtn = document.getElementById('search-btn');
  const searchOverlay = document.getElementById('search-overlay');
  const searchClose = document.getElementById('search-close');

  if (searchBtn && searchOverlay) {
    searchBtn.addEventListener('click', (e) => {
      e.preventDefault();
      searchOverlay.classList.remove('opacity-0', 'pointer-events-none');
      searchOverlay.querySelector('input')?.focus();
    });
  }

  if (searchClose) {
    searchClose.addEventListener('click', () => {
      searchOverlay.classList.add('opacity-0', 'pointer-events-none');
    });
  }

  // Fecha a busca com a tecla Escape
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      searchOverlay?.classList.add('opacity-0', 'pointer-events-none');
      document.getElementById('cart-drawer')?.classList.add('translate-x-full');
      mobileNav?.classList.add('translate-x-full');
      document.getElementById('login-modal')?.classList.add('opacity-0', 'pointer-events-none');
      document.getElementById('register-modal')?.classList.add('opacity-0', 'pointer-events-none');
      body.style.overflow = '';
    }
  });

  // Alternar Drawer do Carrinho
  const cartBtn = document.getElementById('cart-btn');
  const cartDrawer = document.getElementById('cart-drawer');
  const cartClose = document.getElementById('cart-close');

  if (cartBtn && cartDrawer) {
    cartBtn.addEventListener('click', (e) => {
      e.preventDefault();
      cartDrawer.classList.remove('translate-x-full');
      body.style.overflow = 'hidden';
    });
  }

  if (cartClose) {
    cartClose.addEventListener('click', () => {
      cartDrawer.classList.add('translate-x-full');
      body.style.overflow = '';
    });
  }
}

/**
 * 6. Alternar Botões de Favorito
 * Interatividade simples para adicionar feedback visual quando a cliente curte uma lingerie.
 */
function initFavoriteButtons() {
  const favBtns = document.querySelectorAll('.favorite-btn');
  favBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const icon = btn.querySelector('i');
      if (icon.classList.contains('far')) {
        icon.classList.remove('far');
        icon.classList.add('fas', 'text-red-500');
        showToast('Adicionado aos favoritos!');
      } else {
        icon.classList.remove('fas', 'text-red-500');
        icon.classList.add('far');
        showToast('Removido dos favoritos.');
      }
    });
  });
}

/**
 * 7. Modais de Autenticação (Login e Cadastro)
 * Controla abertura, fechamento, alternância, exibição de senha e envio dos formulários.
 */
function initAuthModals() {
  const body = document.body;

  // Modais
  const loginModal = document.getElementById('login-modal');
  const registerModal = document.getElementById('register-modal');

  // Gatilhos
  const navLoginBtn = document.getElementById('nav-login-btn');
  const navRegisterBtn = document.getElementById('nav-register-btn');
  const mobileLoginBtn = document.getElementById('mobile-login-btn');
  const mobileRegisterBtn = document.getElementById('mobile-register-btn');

  // Botões de fechar
  const loginClose = document.getElementById('login-close');
  const registerClose = document.getElementById('register-close');

  // Gatilhos de alternância
  const goToRegister = document.getElementById('login-go-to-register');
  const goToLogin = document.getElementById('register-go-to-login');

  // Alternadores de senha
  const loginTogglePass = document.getElementById('login-toggle-password');
  const registerTogglePass = document.getElementById('register-toggle-password');

  // Formulários
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');

  if (!loginModal || !registerModal) return;

  // Abrir Login
  function openLogin(e) {
    if (e) e.preventDefault();
    // Fecha o drawer do menu mobile, caso esteja aberto
    document.getElementById('mobile-navigation')?.classList.add('translate-x-full');

    registerModal.classList.add('opacity-0', 'pointer-events-none');
    loginModal.classList.remove('opacity-0', 'pointer-events-none');
    body.style.overflow = 'hidden';
    loginModal.querySelector('input')?.focus();
  }

  // Abrir Cadastro
  function openRegister(e) {
    if (e) e.preventDefault();
    document.getElementById('mobile-navigation')?.classList.add('translate-x-full');

    loginModal.classList.add('opacity-0', 'pointer-events-none');
    registerModal.classList.remove('opacity-0', 'pointer-events-none');
    body.style.overflow = 'hidden';
    registerModal.querySelector('input')?.focus();
  }

  // Fecha os modais
  function closeAllModals() {
    loginModal.classList.add('opacity-0', 'pointer-events-none');
    registerModal.classList.add('opacity-0', 'pointer-events-none');
    body.style.overflow = '';
  }

  // Listeners
  if (navLoginBtn) navLoginBtn.addEventListener('click', openLogin);
  if (mobileLoginBtn) mobileLoginBtn.addEventListener('click', openLogin);
  if (navRegisterBtn) navRegisterBtn.addEventListener('click', openRegister);
  if (mobileRegisterBtn) mobileRegisterBtn.addEventListener('click', openRegister);

  if (loginClose) loginClose.addEventListener('click', closeAllModals);
  if (registerClose) registerClose.addEventListener('click', closeAllModals);

  if (goToRegister) goToRegister.addEventListener('click', openRegister);
  if (goToLogin) goToLogin.addEventListener('click', openLogin);

  // Fecha ao clicar fora do card do modal
  [loginModal, registerModal].forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeAllModals();
      }
    });
  });

  // Função auxiliar para alternar a visibilidade da senha
  function togglePasswordVisibility(button, inputId) {
    if (!button) return;
    button.addEventListener('click', () => {
      const input = document.getElementById(inputId);
      const icon = button.querySelector('i');
      if (input && icon) {
        if (input.type === 'password') {
          input.type = 'text';
          icon.classList.remove('fa-regular', 'fa-eye');
          icon.classList.add('fa-solid', 'fa-eye-slash');
        } else {
          input.type = 'password';
          icon.classList.remove('fa-solid', 'fa-eye-slash');
          icon.classList.add('fa-regular', 'fa-eye');
        }
      }
    });
  }

  togglePasswordVisibility(loginTogglePass, 'login-password');
  togglePasswordVisibility(registerTogglePass, 'register-password');

  // Envio do formulário de login
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value;

      // Verificação simples de validação
      if (email) {
        closeAllModals();
        showToast('Acesso autorizado! Bem-vindo(a) à Loja Sheilla Matos.');
        // Limpa o formulário
        loginForm.reset();
      }
    });
  }

  // Envio do formulário de cadastro
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('register-name').value;
      const email = document.getElementById('register-email').value;
      const password = document.getElementById('register-password').value;
      const confirmPassword = document.getElementById('register-confirm-password').value;

      if (password.length < 6) {
        showToast('A senha deve conter no mínimo 6 caracteres.');
        return;
      }

      if (password !== confirmPassword) {
        showToast('As senhas não coincidem. Tente novamente.');
        return;
      }

      closeAllModals();
      showToast(`Conta criada com sucesso! Seja bem-vinda, ${name}.`);
      registerForm.reset();

      // Abre o login automaticamente após o cadastro
      setTimeout(() => {
        openLogin();
      }, 800);
    });
  }
}

/**
 * Auxiliar: Exibe o popup de confirmação (toast) de ações
 */
function showToast(message) {
  let toast = document.getElementById('custom-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'custom-toast';
    toast.className = 'fixed bottom-24 left-1/2 transform -translate-x-1/2 z-50 bg-[#1A1510] text-[#E6DFD5] font-sans-modern text-sm px-6 py-3 rounded-full shadow-2xl transition-all duration-300 opacity-0 translate-y-2 pointer-events-none border border-opacity-10 border-[#C5A880]';
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.remove('opacity-0', 'translate-y-2', 'pointer-events-none');
  toast.classList.add('opacity-100', 'translate-y-0');

  setTimeout(() => {
    toast.classList.remove('opacity-100', 'translate-y-0');
    toast.classList.add('opacity-0', 'translate-y-2', 'pointer-events-none');
  }, 2500);
}
