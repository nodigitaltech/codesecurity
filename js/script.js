document.addEventListener("DOMContentLoaded", () => {
  // Inicializa os ícones Lucide a partir das tags <i>
  lucide.createIcons();

  // Configuração do Intersection Observer para as animações
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observa todos os elementos com nossas classes de animação inicial
  document.querySelectorAll('.animate-on-scroll, .scale-in').forEach(el => {
    observer.observe(el);
  });

  // Navegação suave interceptada (Remove o # da URL)
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault(); // Impede o comportamento padrão de colocar o # na URL
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        // Faz a rolagem suave até a seção
        targetElement.scrollIntoView({
          behavior: 'smooth'
        });

        // Mantém a URL limpa na raiz (ex: apenas site.com) para evitar o erro 404 (Cannot GET /secao)
        // caso o usuário atualize a página (F5) ou tente acessar o link diretamente.
        window.history.pushState(null, '', window.location.pathname);
      }
    });
  });

  // Lógica do botão "Voltar ao Topo"
  const backToTopBtn = document.getElementById('backToTopBtn');

  window.addEventListener('scroll', () => {
    // Mostra o botão se a rolagem passar de 400 pixels
    if (window.scrollY > 400) {
      backToTopBtn.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-4');
      backToTopBtn.classList.add('opacity-100', 'pointer-events-auto', 'translate-y-0');
    } else {
      backToTopBtn.classList.remove('opacity-100', 'pointer-events-auto', 'translate-y-0');
      backToTopBtn.classList.add('opacity-0', 'pointer-events-none', 'translate-y-4');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // Modal: Solicitar Auditoria
  const openAuditBtn = document.getElementById('openAuditBtn');
  const auditModal = document.getElementById('auditModal');
  const auditForm = document.getElementById('auditForm');

  function openModal() {
    if (!auditModal) return;
    auditModal.classList.remove('hidden');
    auditModal.classList.add('flex');
    document.body.style.overflow = 'hidden';
    const firstInput = auditModal.querySelector('input[name="Nome"]');
    if (firstInput) firstInput.focus();
  }

  function closeModal() {
    if (!auditModal) return;
    auditModal.classList.add('hidden');
    auditModal.classList.remove('flex');
    document.body.style.overflow = '';
  }

  openAuditBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    openModal();
  });

  // Close elements (backdrop + buttons)
  auditModal?.querySelectorAll('[data-modal-close]').forEach(el => {
    el.addEventListener('click', () => closeModal());
  });

  // Close on backdrop click
  auditModal?.addEventListener('click', (e) => {
    if (e.target === auditModal) closeModal();
  });

  // Close on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && auditModal && !auditModal.classList.contains('hidden')) {
      closeModal();
    }
  });

  // Form submit: mailto fallback (opens client). Close modal after submit.
  auditForm?.addEventListener('submit', () => {
    setTimeout(() => {
      try { closeModal(); } catch (err) { /* ignore */ }
    }, 300);
  });
});