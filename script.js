/* ========================================
   VALLE MIL - CORRETORA DE SEGUROS
   Script.js - Professional & Clean
   ========================================
   Funcionalidades:
   - Menu Mobile Toggle
   - Header Dinâmico no Scroll
   - Smooth Scroll com Offset
   - Animações ao Rolar (IntersectionObserver)
   - Modal Política de Privacidade
   - Validação de Formulário
   - Botão WhatsApp com Mensagem
   - Microinterações
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    /* ========================================
       CONFIGURAÇÕES GLOBAIS
       ======================================== */
    const CONFIG = {
        headerScrollThreshold: 50,
        scrollOffset: 80,
        animationDelay: 100,
        whatsappNumber: '5512991090909',
        whatsappMessage: 'Olá, gostaria de solicitar uma cotação na Valle MIL.',
        formSubmitDelay: 1500
    };

    /* ========================================
       UTILITÁRIOS
       ======================================== */
    const Utils = {
        /**
         * Seleciona elemento do DOM
         */
        select: (selector, parent = document) => {
            return parent.querySelector(selector);
        },

        /**
         * Seleciona todos os elementos do DOM
         */
        selectAll: (selector, parent = document) => {
            return parent.querySelectorAll(selector);
        },

        /**
         * Adiciona classe(s) a um elemento
         */
        addClass: (element, ...classes) => {
            if (element) element.classList.add(...classes);
        },

        /**
         * Remove classe(s) de um elemento
         */
        removeClass: (element, ...classes) => {
            if (element) element.classList.remove(...classes);
        },

        /**
         * Toggle classe em um elemento
         */
        toggleClass: (element, className) => {
            if (element) element.classList.toggle(className);
        },

        /**
         * Verifica se elemento tem classe
         */
        hasClass: (element, className) => {
            return element ? element.classList.contains(className) : false;
        },

        /**
         * Previne comportamento padrão
         */
        preventDefault: (event) => {
            event.preventDefault();
        },

        /**
         * Valida email
         */
        isValidEmail: (email) => {
            const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return regex.test(email);
        },

        /**
         * Valida telefone brasileiro
         */
        isValidPhone: (phone) => {
            const cleaned = phone.replace(/\D/g, '');
            return cleaned.length >= 10 && cleaned.length <= 11;
        },

        /**
         * Formata telefone
         */
        formatPhone: (phone) => {
            const cleaned = phone.replace(/\D/g, '');
            if (cleaned.length === 11) {
                return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
            } else if (cleaned.length === 10) {
                return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
            }
            return phone;
        },

        /**
         * Debounce function
         */
        debounce: (func, wait = 100) => {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },

        /**
         * Smooth scroll to element
         */
        smoothScrollTo: (target, offset = 0) => {
            const element = typeof target === 'string' ? Utils.select(target) : target;
            if (!element) return;

            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    /* ========================================
       MENU MOBILE
       ======================================== */
    const MobileMenu = (() => {
        const toggle = Utils.select('#nav-toggle');
        const nav = Utils.select('#nav-menu');
        const navLinks = Utils.selectAll('.nav__link');
        const body = document.body;

        /**
         * Abre/fecha o menu mobile
         */
        const toggleMenu = () => {
            Utils.toggleClass(nav, 'active');
            Utils.toggleClass(body, 'menu-open');
            
            // Atualiza aria-expanded
            const isExpanded = Utils.hasClass(nav, 'active');
            toggle.setAttribute('aria-expanded', isExpanded);
            
            // Altera ícone
            const icon = Utils.select('i', toggle);
            if (icon) {
                icon.className = isExpanded ? 'fas fa-times' : 'fas fa-bars';
            }
        };

        /**
         * Fecha o menu mobile
         */
        const closeMenu = () => {
            Utils.removeClass(nav, 'active');
            Utils.removeClass(body, 'menu-open');
            toggle.setAttribute('aria-expanded', 'false');
            
            const icon = Utils.select('i', toggle);
            if (icon) {
                icon.className = 'fas fa-bars';
            }
        };

        /**
         * Fecha menu ao clicar em link
         */
        const handleLinkClick = () => {
            if (window.innerWidth <= 768) {
                closeMenu();
            }
        };

        /**
         * Fecha menu ao clicar fora
         */
        const handleClickOutside = (event) => {
            if (window.innerWidth <= 768) {
                if (!nav.contains(event.target) && !toggle.contains(event.target)) {
                    if (Utils.hasClass(nav, 'active')) {
                        closeMenu();
                    }
                }
            }
        };

        /**
         * Fecha menu ao pressionar ESC
         */
        const handleEscKey = (event) => {
            if (event.key === 'Escape' && Utils.hasClass(nav, 'active')) {
                closeMenu();
            }
        };

        /**
         * Inicializa o menu mobile
         */
        const init = () => {
            if (!toggle || !nav) return;

            // Toggle menu
            toggle.addEventListener('click', toggleMenu);

            // Fecha ao clicar nos links
            navLinks.forEach(link => {
                link.addEventListener('click', handleLinkClick);
            });

            // Fecha ao clicar fora
            document.addEventListener('click', handleClickOutside);

            // Fecha ao pressionar ESC
            document.addEventListener('keydown', handleEscKey);

            // Fecha ao redimensionar para desktop
            window.addEventListener('resize', Utils.debounce(() => {
                if (window.innerWidth > 768 && Utils.hasClass(nav, 'active')) {
                    closeMenu();
                }
            }, 250));
        };

        return { init, closeMenu };
    })();

    /* ========================================
       HEADER DINÂMICO
       ======================================== */
    const DynamicHeader = (() => {
        const header = Utils.select('.header');
        let lastScroll = 0;

        /**
         * Atualiza o header baseado no scroll
         */
        const handleScroll = () => {
            const currentScroll = window.pageYOffset;

            // Adiciona classe "scrolled" quando rolar
            if (currentScroll > CONFIG.headerScrollThreshold) {
                Utils.addClass(header, 'scrolled');
            } else {
                Utils.removeClass(header, 'scrolled');
            }

            // Esconde header ao rolar para baixo, mostra ao rolar para cima
            if (currentScroll > lastScroll && currentScroll > 300) {
                Utils.addClass(header, 'header-hidden');
            } else {
                Utils.removeClass(header, 'header-hidden');
            }

            lastScroll = currentScroll;
        };

        /**
         * Inicializa o header dinâmico
         */
        const init = () => {
            if (!header) return;
            window.addEventListener('scroll', Utils.debounce(handleScroll, 10));
        };

        return { init };
    })();

    /* ========================================
       SMOOTH SCROLL
       ======================================== */
    const SmoothScroll = (() => {
        /**
         * Adiciona smooth scroll aos links internos
         */
        const handleClick = (event) => {
            const link = event.target.closest('a[href^="#"]');
            if (!link) return;

            const targetId = link.getAttribute('href');
            if (targetId === '#' || targetId === '') return;

            Utils.preventDefault(event);

            const targetElement = Utils.select(targetId);
            if (targetElement) {
                Utils.smoothScrollTo(targetElement, CONFIG.scrollOffset);
                
                // Atualiza URL sem scroll brusco
                if (history.pushState) {
                    history.pushState(null, null, targetId);
                }

                // Fecha menu mobile se estiver aberto
                MobileMenu.closeMenu();
            }
        };

        /**
         * Inicializa smooth scroll
         */
        const init = () => {
            document.addEventListener('click', handleClick);
        };

        return { init };
    })();

    /* ========================================
       ANIMAÇÃO AO ROLAR (SCROLL REVEAL)
       ======================================== */
    const ScrollReveal = (() => {
        const elements = Utils.selectAll('.animate-on-scroll, .insurance-card, .differential-item, .pillar, .contact-info, .testimonial-card');

        /**
         * Cria o observer
         */
        const createObserver = () => {
            const options = {
                root: null,
                rootMargin: '0px',
                threshold: 0.15
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry, index) => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            Utils.addClass(entry.target, 'reveal', 'active');
                        }, index * CONFIG.animationDelay);
                        observer.unobserve(entry.target);
                    }
                });
            }, options);

            return observer;
        };

        /**
         * Inicializa animações ao rolar
         */
        const init = () => {
            if (!elements.length) return;
            if (!('IntersectionObserver' in window)) {
                // Fallback para navegadores antigos
                elements.forEach(element => {
                    Utils.addClass(element, 'reveal', 'active');
                });
                return;
            }

            const observer = createObserver();
            elements.forEach(element => {
                Utils.addClass(element, 'reveal');
                observer.observe(element);
            });
        };

        return { init };
    })();

    /* ========================================
       MODAL POLÍTICA DE PRIVACIDADE
       ======================================== */
    const PrivacyModal = (() => {
        const modal = Utils.select('#privacy-modal');
        const openButtons = Utils.selectAll('#open-privacy-modal, #open-privacy-modal-footer, [href="#politica-privacidade"]');
        const closeButtons = Utils.selectAll('#close-privacy-modal, #close-privacy-modal-btn');
        const overlay = Utils.select('#privacy-modal-overlay');
        const body = document.body;

        /**
         * Abre o modal
         */
        const openModal = (event) => {
            Utils.preventDefault(event);
            if (!modal) return;

            Utils.addClass(modal, 'active');
            Utils.addClass(body, 'modal-open');
            modal.setAttribute('aria-hidden', 'false');

            // Foca no botão fechar para acessibilidade
            const closeButton = Utils.select('#close-privacy-modal', modal);
            if (closeButton) {
                setTimeout(() => closeButton.focus(), 100);
            }
        };

        /**
         * Fecha o modal
         */
        const closeModal = () => {
            if (!modal) return;

            Utils.removeClass(modal, 'active');
            Utils.removeClass(body, 'modal-open');
            modal.setAttribute('aria-hidden', 'true');
        };

        /**
         * Fecha ao clicar no overlay
         */
        const handleOverlayClick = (event) => {
            if (event.target === overlay) {
                closeModal();
            }
        };

        /**
         * Fecha ao pressionar ESC
         */
        const handleEscKey = (event) => {
            if (event.key === 'Escape' && Utils.hasClass(modal, 'active')) {
                closeModal();
            }
        };

        /**
         * Inicializa o modal
         */
        const init = () => {
            if (!modal) return;

            // Abre modal
            openButtons.forEach(button => {
                button.addEventListener('click', openModal);
            });

            // Fecha modal
            closeButtons.forEach(button => {
                button.addEventListener('click', closeModal);
            });

            // Fecha ao clicar no overlay
            if (overlay) {
                overlay.addEventListener('click', handleOverlayClick);
            }

            // Fecha ao pressionar ESC
            document.addEventListener('keydown', handleEscKey);
        };

        return { init, openModal, closeModal };
    })();

    /* ========================================
       VALIDAÇÃO DE FORMULÁRIO
       ======================================== */
    const FormValidation = (() => {
        const form = Utils.select('#quote-form');

        /**
         * Exibe mensagem de erro
         */
        const showError = (input, message) => {
            const formGroup = input.closest('.form-group');
            if (!formGroup) return;

            // Remove erro existente
            const existingError = Utils.select('.error-message', formGroup);
            if (existingError) existingError.remove();

            // Adiciona classe de erro
            Utils.addClass(input, 'error');
            Utils.addClass(formGroup, 'has-error');

            // Cria mensagem de erro
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = message;
            errorDiv.style.color = '#EF4444';
            errorDiv.style.fontSize = '0.875rem';
            errorDiv.style.marginTop = '0.5rem';

            formGroup.appendChild(errorDiv);

            // Foca no input com erro
            input.focus();
        };

        /**
         * Remove mensagem de erro
         */
        const clearError = (input) => {
            const formGroup = input.closest('.form-group');
            if (!formGroup) return;

            Utils.removeClass(input, 'error');
            Utils.removeClass(formGroup, 'has-error');

            const errorMessage = Utils.select('.error-message', formGroup);
            if (errorMessage) errorMessage.remove();
        };

        /**
         * Valida campo nome
         */
        const validateName = (input) => {
            const value = input.value.trim();
            if (value === '') {
                showError(input, 'Por favor, informe seu nome completo.');
                return false;
            }
            if (value.length < 3) {
                showError(input, 'Nome deve ter pelo menos 3 caracteres.');
                return false;
            }
            clearError(input);
            return true;
        };

        /**
         * Valida campo email
         */
        const validateEmail = (input) => {
            const value = input.value.trim();
            if (value === '') {
                showError(input, 'Por favor, informe seu e-mail.');
                return false;
            }
            if (!Utils.isValidEmail(value)) {
                showError(input, 'Por favor, informe um e-mail válido.');
                return false;
            }
            clearError(input);
            return true;
        };

        /**
         * Valida campo telefone
         */
        const validatePhone = (input) => {
            const value = input.value.trim();
            if (value === '') {
                showError(input, 'Por favor, informe seu telefone.');
                return false;
            }
            if (!Utils.isValidPhone(value)) {
                showError(input, 'Por favor, informe um telefone válido.');
                return false;
            }
            clearError(input);
            return true;
        };

        /**
         * Valida campo select
         */
        const validateSelect = (input) => {
            const value = input.value;
            if (value === '' || value === null) {
                showError(input, 'Por favor, selecione uma opção.');
                return false;
            }
            clearError(input);
            return true;
        };

        /**
         * Valida campo cidade
         */
        const validateCity = (input) => {
            const value = input.value.trim();
            if (value === '') {
                showError(input, 'Por favor, informe sua cidade/estado.');
                return false;
            }
            clearError(input);
            return true;
        };

        /**
         * Valida checkbox LGPD
         */
        const validateConsent = (input) => {
            if (!input.checked) {
                const formGroup = input.closest('.form-group');
                const label = Utils.select('.form-checkbox__label', formGroup);
                if (label) {
                    label.style.color = '#EF4444';
                }
                showError(input, 'Você precisa concordar com a política de privacidade.');
                return false;
            }
            const formGroup = input.closest('.form-group');
            const label = Utils.select('.form-checkbox__label', formGroup);
            if (label) {
                label.style.color = '';
            }
            clearError(input);
            return true;
        };

        /**
         * Valida todos os campos
         */
        const validateForm = () => {
            const nome = Utils.select('#nome', form);
            const email = Utils.select('#email', form);
            const telefone = Utils.select('#telefone', form);
            const tipoSeguro = Utils.select('#tipo-seguro', form);
            const cidade = Utils.select('#cidade', form);
            const consent = Utils.select('#lgpd-consent', form);

            let isValid = true;

            if (nome && !validateName(nome)) isValid = false;
            if (email && !validateEmail(email)) isValid = false;
            if (telefone && !validatePhone(telefone)) isValid = false;
            if (tipoSeguro && !validateSelect(tipoSeguro)) isValid = false;
            if (cidade && !validateCity(cidade)) isValid = false;
            if (consent && !validateConsent(consent)) isValid = false;

            return isValid;
        };

        /**
         * Formata telefone ao digitar
         */
        const handlePhoneInput = (event) => {
            const input = event.target;
            let value = input.value.replace(/\D/g, '');
            
            if (value.length > 11) {
                value = value.slice(0, 11);
            }
            
            if (value.length > 6) {
                value = value.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
            } else if (value.length > 2) {
                value = value.replace(/(\d{2})(\d{0,5})/, '($1) $2');
            } else if (value.length > 0) {
                value = value.replace(/(\d{0,2})/, '($1');
            }
            
            input.value = value;
        };

        /**
         * Exibe mensagem de sucesso
         */
        const showSuccessMessage = () => {
            const formWrapper = form.closest('.quote__form-wrapper');
            
            // Cria mensagem de sucesso
            const successDiv = document.createElement('div');
            successDiv.className = 'success-message';
            successDiv.innerHTML = `
                <div style="
                    background: linear-gradient(135deg, #10B981 0%, #059669 100%);
                    color: white;
                    padding: 2rem;
                    border-radius: 1rem;
                    text-align: center;
                    box-shadow: 0 10px 30px rgba(16, 185, 129, 0.3);
                    animation: slideInUp 0.5s ease-out;
                ">
                    <i class="fas fa-check-circle" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                    <h3 style="font-size: 1.5rem; margin-bottom: 0.5rem; font-weight: 700;">Cotação Enviada com Sucesso!</h3>
                    <p style="font-size: 1rem; opacity: 0.95; margin-bottom: 1rem;">
                        Recebemos sua solicitação e entraremos em contato em breve.
                    </p>
                    <p style="font-size: 0.875rem; opacity: 0.9;">
                        Em até 24 horas você receberá nossa proposta personalizada.
                    </p>
                </div>
            `;

            // Oculta formulário
            form.style.display = 'none';

            // Exibe mensagem
            formWrapper.appendChild(successDiv);

            // Scroll suave até a mensagem
            setTimeout(() => {
                Utils.smoothScrollTo(formWrapper, CONFIG.scrollOffset);
            }, 100);

            // Reseta formulário após delay
            setTimeout(() => {
                form.reset();
                form.style.display = 'grid';
                successDiv.remove();
            }, 5000);
        };

        /**
         * Simula envio do formulário
         */
        const handleSubmit = (event) => {
            Utils.preventDefault(event);

            // Valida formulário
            if (!validateForm()) {
                return;
            }

            // Desabilita botão durante envio
            const submitButton = Utils.select('button[type="submit"]', form);
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
                Utils.addClass(submitButton, 'loading');
            }

            // Simula envio (substitua por sua lógica de backend)
            setTimeout(() => {
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar Cotação';
                    Utils.removeClass(submitButton, 'loading');
                }

                // Exibe mensagem de sucesso
                showSuccessMessage();

                // Limpa erros
                const inputs = Utils.selectAll('input, select, textarea', form);
                inputs.forEach(input => clearError(input));

            }, CONFIG.formSubmitDelay);
        };

        /**
         * Validação em tempo real
         */
        const handleRealTimeValidation = (event) => {
            const input = event.target;
            const type = input.type || input.tagName.toLowerCase();

            if (input.hasAttribute('required') && input.value.trim() !== '') {
                switch (input.id) {
                    case 'nome':
                        validateName(input);
                        break;
                    case 'email':
                        validateEmail(input);
                        break;
                    case 'telefone':
                        validatePhone(input);
                        break;
                    case 'tipo-seguro':
                        validateSelect(input);
                        break;
                    case 'cidade':
                        validateCity(input);
                        break;
                }
            }
        };

        /**
         * Inicializa validação
         */
        const init = () => {
            if (!form) return;

            // Submit do formulário
            form.addEventListener('submit', handleSubmit);

            // Máscara de telefone
            const phoneInput = Utils.select('#telefone', form);
            if (phoneInput) {
                phoneInput.addEventListener('input', handlePhoneInput);
            }

            // Validação em tempo real
            const inputs = Utils.selectAll('input:not([type="checkbox"]), select, textarea', form);
            inputs.forEach(input => {
                input.addEventListener('blur', handleRealTimeValidation);
            });

            // Limpa erro ao começar a digitar
            inputs.forEach(input => {
                input.addEventListener('input', () => {
                    if (Utils.hasClass(input, 'error')) {
                        clearError(input);
                    }
                });
            });
        };

        return { init };
    })();

    /* ========================================
       BOTÃO WHATSAPP
       ======================================== */
    const WhatsAppButton = (() => {
        const button = Utils.select('#whatsapp');

        /**
         * Monta URL do WhatsApp
         */
        const getWhatsAppURL = () => {
            const message = encodeURIComponent(CONFIG.whatsappMessage);
            return `https://wa.me/${CONFIG.whatsappNumber}?text=${message}`;
        };

        /**
         * Atualiza link do botão
         */
        const updateButtonLink = () => {
            if (!button) return;
            button.href = getWhatsAppURL();
        };

        /**
         * Adiciona efeito de clique
         */
        const handleClick = (event) => {
            // Adiciona animação de clique
            Utils.addClass(button, 'clicked');
            setTimeout(() => {
                Utils.removeClass(button, 'clicked');
            }, 300);
        };

        /**
         * Inicializa botão WhatsApp
         */
        const init = () => {
            if (!button) return;

            updateButtonLink();
            button.addEventListener('click', handleClick);
        };

        return { init };
    })();

    /* ========================================
       MICROINTERAÇÕES
       ======================================== */
    const MicroInteractions = (() => {
        /**
         * Efeito ripple em botões
         */
        const createRipple = (event) => {
            const button = event.currentTarget;
            
            // Remove ripples antigos
            const oldRipple = Utils.select('.ripple', button);
            if (oldRipple) oldRipple.remove();

            // Cria novo ripple
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            
            const diameter = Math.max(button.clientWidth, button.clientHeight);
            const radius = diameter / 2;

            const rect = button.getBoundingClientRect();
            ripple.style.width = ripple.style.height = `${diameter}px`;
            ripple.style.left = `${event.clientX - rect.left - radius}px`;
            ripple.style.top = `${event.clientY - rect.top - radius}px`;

            button.appendChild(ripple);

            // Remove ripple após animação
            setTimeout(() => ripple.remove(), 600);
        };

        /**
         * Adiciona estilo do ripple
         */
        const addRippleStyles = () => {
            if (Utils.select('#ripple-styles')) return;

            const style = document.createElement('style');
            style.id = 'ripple-styles';
            style.textContent = `
                .btn {
                    position: relative;
                    overflow: hidden;
                }
                .ripple {
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.5);
                    transform: scale(0);
                    animation: ripple-animation 0.6s ease-out;
                    pointer-events: none;
                }
                @keyframes ripple-animation {
                    to {
                        transform: scale(4);
                        opacity: 0;
                    }
                }
                @keyframes slideInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .whatsapp-float.clicked {
                    animation: bounce 0.3s ease-out;
                }
                @keyframes bounce {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(0.9); }
                }
            `;
            document.head.appendChild(style);
        };

        /**
         * Contador animado
         */
        const animateCounter = (element) => {
            const target = parseInt(element.getAttribute('data-target'));
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    element.textContent = Math.ceil(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    element.textContent = target;
                }
            };

            updateCounter();
        };

        /**
         * Inicializa microinterações
         */
        const init = () => {
            // Adiciona estilos
            addRippleStyles();

            // Ripple em botões
            const buttons = Utils.selectAll('.btn, .insurance-card__link, .nav__link');
            buttons.forEach(button => {
                button.addEventListener('click', createRipple);
            });

            // Contadores animados (se houver)
            const counters = Utils.selectAll('[data-target]');
            if (counters.length > 0 && 'IntersectionObserver' in window) {
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            animateCounter(entry.target);
                            observer.unobserve(entry.target);
                        }
                    });
                }, { threshold: 0.5 });

                counters.forEach(counter => observer.observe(counter));
            }
        };

        return { init };
    })();

    /* ========================================
       CAROUSEL - Carrossel Hero
       ======================================== */
    const HeroCarousel = (() => {
        const carousel = Utils.select('.hero__carousel');
        const slides = Utils.selectAll('.carousel__slide');
        const prevBtn = Utils.select('.carousel__btn--prev');
        const nextBtn = Utils.select('.carousel__btn--next');
        const dots = Utils.selectAll('.carousel__dot');
        
        let currentSlide = 0;
        let autoplayInterval;

        /**
         * Mostra o slide especificado
         */
        const showSlide = (index) => {
            // Remove active de todos
            slides.forEach(slide => Utils.removeClass(slide, 'active'));
            dots.forEach(dot => Utils.removeClass(dot, 'active'));

            // Garante que o índice está dentro dos limites
            if (index >= slides.length) {
                currentSlide = 0;
            } else if (index < 0) {
                currentSlide = slides.length - 1;
            } else {
                currentSlide = index;
            }

            // Ativa o slide e dot atual
            Utils.addClass(slides[currentSlide], 'active');
            Utils.addClass(dots[currentSlide], 'active');
        };

        /**
         * Próximo slide
         */
        const nextSlide = () => {
            showSlide(currentSlide + 1);
        };

        /**
         * Slide anterior
         */
        const prevSlide = () => {
            showSlide(currentSlide - 1);
        };

        /**
         * Autoplay
         */
        const startAutoplay = () => {
            autoplayInterval = setInterval(nextSlide, 5000);
        };

        /**
         * Para autoplay
         */
        const stopAutoplay = () => {
            if (autoplayInterval) {
                clearInterval(autoplayInterval);
            }
        };

        /**
         * Inicializa o carrossel
         */
        const init = () => {
            if (!carousel || slides.length === 0) return;

            // Navegação por botões
            if (prevBtn) {
                prevBtn.addEventListener('click', () => {
                    prevSlide();
                    stopAutoplay();
                    startAutoplay();
                });
            }

            if (nextBtn) {
                nextBtn.addEventListener('click', () => {
                    nextSlide();
                    stopAutoplay();
                    startAutoplay();
                });
            }

            // Navegação por dots
            dots.forEach((dot, index) => {
                dot.addEventListener('click', () => {
                    showSlide(index);
                    stopAutoplay();
                    startAutoplay();
                });
            });

            // Navegação por teclado
            document.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowLeft') {
                    prevSlide();
                    stopAutoplay();
                    startAutoplay();
                } else if (e.key === 'ArrowRight') {
                    nextSlide();
                    stopAutoplay();
                    startAutoplay();
                }
            });

            // Pause autoplay ao passar mouse
            carousel.addEventListener('mouseenter', stopAutoplay);
            carousel.addEventListener('mouseleave', startAutoplay);

            // Touch/Swipe para mobile
            let touchStartX = 0;
            let touchEndX = 0;

            carousel.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            });

            carousel.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
            });

            const handleSwipe = () => {
                if (touchEndX < touchStartX - 50) {
                    nextSlide();
                }
                if (touchEndX > touchStartX + 50) {
                    prevSlide();
                }
                stopAutoplay();
                startAutoplay();
            };

            // Inicia autoplay
            startAutoplay();
        };

        return { init };
    })();

    /* ========================================
       SCROLL TO TOP
       ======================================== */
    const ScrollToTop = (() => {
        let button = null;

        /**
         * Cria botão de volta ao topo
         */
        const createButton = () => {
            button = document.createElement('button');
            button.className = 'scroll-to-top';
            button.innerHTML = '<i class="fas fa-arrow-up"></i>';
            button.setAttribute('aria-label', 'Voltar ao topo');
            button.style.cssText = `
                position: fixed;
                bottom: 100px;
                right: 30px;
                width: 50px;
                height: 50px;
                background: linear-gradient(135deg, #0A2463 0%, #1E3A8A 100%);
                color: white;
                border: none;
                border-radius: 50%;
                font-size: 1.25rem;
                cursor: pointer;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
                z-index: 1020;
                box-shadow: 0 4px 15px rgba(10, 36, 99, 0.3);
            `;
            document.body.appendChild(button);

            // Click handler
            button.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        };

        /**
         * Mostra/esconde botão baseado no scroll
         */
        const handleScroll = () => {
            if (!button) return;

            if (window.pageYOffset > 500) {
                button.style.opacity = '1';
                button.style.visibility = 'visible';
            } else {
                button.style.opacity = '0';
                button.style.visibility = 'hidden';
            }
        };

        /**
         * Inicializa botão
         */
        const init = () => {
            createButton();
            window.addEventListener('scroll', Utils.debounce(handleScroll, 100));
        };

        return { init };
    })();

    /* ========================================
       INICIALIZAÇÃO
       ======================================== */
    const App = (() => {
        const init = () => {
            // Inicializa todos os módulos
            MobileMenu.init();
            DynamicHeader.init();
            SmoothScroll.init();
            ScrollReveal.init();
            PrivacyModal.init();
            FormValidation.init();
            WhatsAppButton.init();
            MicroInteractions.init();
            ScrollToTop.init();
            HeroCarousel.init();

            // Log de inicialização (remover em produção)
            console.log('%c Valle MIL - Site inicializado com sucesso! ', 'background: #0A2463; color: #C9A961; padding: 10px; font-weight: bold;');
        };

        return { init };
    })();

    // Inicializa aplicação
    App.init();
});