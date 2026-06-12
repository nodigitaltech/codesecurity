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
  if (backToTopBtn) {
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
  }

  // Modal: Solicitar Auditoria (vincula todos os gatilhos)
  const openAuditTriggers = Array.from(document.querySelectorAll('#openAuditBtn, [data-open-audit]'));
  const auditModal = document.getElementById('auditModal');
  const auditForm = document.getElementById('auditForm');
  // Dev modal (Ferramentas)
  const openDevTriggers = Array.from(document.querySelectorAll('[data-open-dev]'));
  const devModal = document.getElementById('devModal');
  // Validation elements
  const nameInput = document.getElementById('auditName');
  const emailInput = document.getElementById('auditEmail');
  const msgInput = document.getElementById('auditMessage');
  const submitBtn = auditForm?.querySelector('.modal-submit');
  const errorName = document.getElementById('errorAuditName');
  const errorEmail = document.getElementById('errorAuditEmail');
  const errorMsg = document.getElementById('errorAuditMessage');

  function openModal(title = 'Solicitar Auditoria') {
    if (!auditModal) return;
    // set title dynamically
    const titleEl = auditModal.querySelector('#auditModalTitle');
    const descEl = auditModal.querySelector('#auditModalDesc');
    const msgEl = auditModal.querySelector('#auditMessage');
    if (titleEl) titleEl.textContent = title;
    if (descEl) {
      // customize description depending on trigger
      if (title === 'Fale conosco') {
        descEl.textContent = 'Deixe aqui a sua mensagem.';
      } else {
        descEl.textContent = 'Deixe a sua mensagem que entraremos em contato.';
      }
    }

    // adjust textarea placeholder according to context
    if (msgEl) {
      if (title === 'Fale conosco') {
        msgEl.placeholder = 'Deixe aqui a sua mensagem.';
      } else {
        msgEl.placeholder = 'Descreva brevemente o escopo da auditoria...';
      }
    }

    auditModal.classList.remove('hidden');
    auditModal.classList.add('flex');
    document.body.style.overflow = 'hidden';
    const firstInput = auditModal.querySelector('input[name="Nome"]');
    if (firstInput) firstInput.focus();
  }

  function closeModal() {
    if (!auditModal) return;
    // reset form and hide overlays when closing
    try { resetForm(); } catch (e) {}
    auditModal.classList.add('hidden');
    auditModal.classList.remove('flex');
    document.body.style.overflow = '';
  }

  openAuditTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      // if trigger is a menu 'Entrar em contato' (marked with data-open-contact) show 'Fale conosco'
      const isMenuTrigger = btn.hasAttribute && btn.hasAttribute('data-open-contact');
      openModal(isMenuTrigger ? 'Fale conosco' : 'Solicitar Auditoria');
    });
  });

  // Robust open handler for Dev modal (event delegation)
  function openDevModal() {
    if (!devModal) return;
    devModal.classList.remove('hidden');
    devModal.classList.add('flex');
    document.body.style.overflow = 'hidden';
    const closeBtn = devModal.querySelector('[data-modal-close]');
    if (closeBtn) closeBtn.focus();
  }

  document.addEventListener('click', (e) => {
    const trigger = e.target.closest && e.target.closest('[data-open-dev]');
    if (!trigger) return;
    e.preventDefault();
    openDevModal();
  });

  // Validation helpers
  function setError(input, errorEl, msg) {
    if (input) input.classList.add('invalid');
    if (input) input.setAttribute('aria-invalid', 'true');
    if (errorEl) { errorEl.textContent = msg; errorEl.classList.remove('hidden'); }
  }

  function clearError(input, errorEl) {
    if (input) input.classList.remove('invalid');
    if (input) input.removeAttribute('aria-invalid');
    if (errorEl) { errorEl.textContent = ''; errorEl.classList.add('hidden'); }
  }

  function validateName() {
    if (!nameInput) return true;
    const v = nameInput.value.trim();
    if (v.length < 2) { setError(nameInput, errorName, 'Informe seu nome (mín. 2 caracteres).'); return false; }
    clearError(nameInput, errorName); return true;
  }

  function validateEmail() {
    if (!emailInput) return true;
    const v = emailInput.value.trim();
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(v)) { setError(emailInput, errorEmail, 'Informe um e-mail válido.'); return false; }
    clearError(emailInput, errorEmail); return true;
  }

  function validateMessage() {
    if (!msgInput) return true;
    const v = msgInput.value.trim();
    if (v.length < 10) { setError(msgInput, errorMsg, 'Descreva ao menos 10 caracteres.'); return false; }
    clearError(msgInput, errorMsg); return true;
  }

  function validateFormUI() {
    const ok = validateName() && validateEmail() && validateMessage();
    if (submitBtn) submitBtn.disabled = !ok;
    return ok;
  }

  // Wire up live validation
  nameInput?.addEventListener('input', validateFormUI);
  emailInput?.addEventListener('input', validateFormUI);
  msgInput?.addEventListener('input', validateFormUI);


  // Close elements (backdrop + buttons) - global handler for any modal
  document.querySelectorAll('[data-modal-close]').forEach(el => {
    el.addEventListener('click', (e) => {
      const modal = el.closest('[role="dialog"]');
      if (!modal) return;
      // If it's the audit modal, use closeModal to reset form state
      if (modal.id === 'auditModal') {
        closeModal();
      } else {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        document.body.style.overflow = '';
      }
    });
  });

  // Close on backdrop click
  auditModal?.addEventListener('click', (e) => {
    if (e.target === auditModal) closeModal();
  });

  // Dev modal backdrop click
  devModal?.addEventListener('click', (e) => {
    if (e.target === devModal) {
      devModal.classList.add('hidden'); devModal.classList.remove('flex'); document.body.style.overflow = '';
    }
  });

  // Close on ESC for any modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (auditModal && !auditModal.classList.contains('hidden')) closeModal();
      if (devModal && !devModal.classList.contains('hidden')) { devModal.classList.add('hidden'); devModal.classList.remove('flex'); document.body.style.overflow = ''; }
    }
  });

  // Form submit: POST to configured endpoint and show success UI
  const FORM_ENDPOINT = ''; // <-- Replace with your endpoint, e.g. https://formspree.io/f/yourFormId

  const auditSuccess = document.getElementById('auditSuccess');

  auditForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    // validate before sending
    if (!validateFormUI()) {
      // focus first invalid
      const firstInvalid = auditForm.querySelector('.invalid');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    if (!FORM_ENDPOINT) {
      console.error('FORM_ENDPOINT not set. Configure an endpoint (Formspree, serverless function, etc.).');
      showSuccess();
      return;
    }

    if (submitBtn) submitBtn.setAttribute('disabled', '');

    const formData = new FormData(auditForm);
    const payload = {};
    formData.forEach((v, k) => { payload[k] = v; });

    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        showSuccess();
      } else {
        console.error('Form submit failed', res.status);
        showError();
      }
    } catch (err) {
      console.error('Form submit error', err);
      showError();
    } finally {
      if (submitBtn) submitBtn.removeAttribute('disabled');
    }
  });

  function showSuccess() {
    if (!auditForm || !auditSuccess) return;
    auditForm.classList.add('hidden');
    auditSuccess.classList.remove('hidden');
    auditSuccess.classList.add('modal-success-show');
    // Do not auto-close; allow user to dismiss via X or backdrop
  }

  function showError() {
    // Simple fallback: show a browser alert. You can improve this to show inline error UI.
    alert('Não foi possível enviar a mensagem no momento. Tente novamente mais tarde.');
  }

  function resetForm() {
    auditForm.reset();
    auditForm.classList.remove('hidden');
    if (auditSuccess) {
      auditSuccess.classList.add('hidden');
      auditSuccess.classList.remove('modal-success-show');
    }
  }
});