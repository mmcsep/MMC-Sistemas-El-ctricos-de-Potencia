/**
 * MMC SISTEMAS ELÉCTRICOS DE POTENCIA
 * JavaScript - CARRUSEL SIMPLIFICADO QUE FUNCIONA
 */

const CONFIG = {
    whatsappNumber: '5569067198',
    companyName: 'MMC Sistemas Eléctricos de Potencia'
};

// ===== 1. MENÚ MÓVIL =====
function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    if (!menuToggle || !navLinks) return;

    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

// ===== 2. SMOOTH SCROLL =====
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                const headerHeight = document.getElementById('header')?.offsetHeight || 0;
                window.scrollTo({
                    top: target.getBoundingClientRect().top + window.pageYOffset - headerHeight,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== 3. WHATSAPP =====
function initQuoteForm() {
    const form = document.getElementById('quoteForm');
    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const data = {
            nombre: document.getElementById('nombre').value.trim(),
            empresa: document.getElementById('empresa').value.trim(),
            email: document.getElementById('email').value.trim(),
            telefono: document.getElementById('telefono').value.trim(),
            servicio: document.getElementById('servicio').value,
            mensaje: document.getElementById('mensaje').value.trim()
        };

        // Validación básica
        if (!data.nombre || !data.email || !data.telefono || !data.servicio || !data.mensaje) {
            alert('Por favor completa todos los campos obligatorios');
            return;
        }

        // Generar mensaje
        const servicios = {
            'instalacion': 'Instalación Eléctrica',
            'mantenimiento': 'Mantenimiento Preventivo/Correctivo/Predictivo',
            'proyecto': 'Diseño de Proyecto',
            'cfe': 'Gestión CFE - Obras Menores',
            'pruebas': 'Pruebas Eléctricas',
            'termografia': 'Termografía Infrarroja',
            'otro': 'Otro'
        };

        let msg = `*Solicitud de Cotización*\n\n`;
        msg += `👤 *Nombre:* ${data.nombre}\n`;
        if (data.empresa) msg += `🏢 *Empresa:* ${data.empresa}\n`;
        msg += `📧 *Email:* ${data.email}\n`;
        msg += `📱 *Teléfono:* ${data.telefono}\n`;
        msg += `⚡ *Servicio:* ${servicios[data.servicio]}\n\n`;
        msg += `📝 *Descripción:*\n${data.mensaje}`;

        // Abrir WhatsApp
        const url = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(msg)}`;
        window.open(url, '_blank');

        // Mostrar confirmación
        alert('¡Gracias! Serás redirigido a WhatsApp');
        form.reset();
    });
}

// ===== 4. CARRUSEL - VERSIÓN ULTRA SIMPLE =====
function initCarousel() {
    const track = document.getElementById('carouselTrack');
    const prevBtn = document.getElementById('carouselPrev');
    const nextBtn = document.getElementById('carouselNext');
    const indicatorsContainer = document.getElementById('carouselIndicators');

    if (!track) {
        console.warn('⚠️ Carrusel no encontrado');
        return;
    }

    const slides = Array.from(track.querySelectorAll('.carousel-slide'));
    const indicators = Array.from(indicatorsContainer?.querySelectorAll('.indicator') || []);

    if (slides.length === 0) {
        console.warn('⚠️ No hay slides');
        return;
    }

    let currentIndex = 0;
    let autoplayTimer = null;

    console.log(`✅ Carrusel cargado: ${slides.length} slides`);

    // Función principal: cambiar slide
    function goToSlide(index) {
        // Validar índice
        if (index < 0 || index >= slides.length) return;

        console.log(`→ Mostrando slide ${index + 1}/${slides.length}`);

        // Quitar active de todos
        slides.forEach(slide => slide.classList.remove('active'));
        indicators.forEach(ind => ind.classList.remove('active'));

        // Activar el slide actual
        slides[index].classList.add('active');
        if (indicators[index]) {
            indicators[index].classList.add('active');
        }

        currentIndex = index;
    }

    // Siguiente slide
    function nextSlide() {
        const next = (currentIndex + 1) % slides.length;
        goToSlide(next);
    }

    // Slide anterior
    function prevSlide() {
        const prev = (currentIndex - 1 + slides.length) % slides.length;
        goToSlide(prev);
    }

    // Autoplay
    function startAutoplay() {
        stopAutoplay();
        autoplayTimer = setInterval(nextSlide, 5000);
        console.log('▶️ Autoplay iniciado (5s)');
    }

    function stopAutoplay() {
        if (autoplayTimer) {
            clearInterval(autoplayTimer);
            autoplayTimer = null;
        }
    }

    // Event listeners
    prevBtn?.addEventListener('click', () => {
        prevSlide();
        startAutoplay(); // Reiniciar autoplay
    });

    nextBtn?.addEventListener('click', () => {
        nextSlide();
        startAutoplay(); // Reiniciar autoplay
    });

    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            goToSlide(index);
            startAutoplay(); // Reiniciar autoplay
        });
    });

    // Pausa al hover
    track.parentElement?.addEventListener('mouseenter', stopAutoplay);
    track.parentElement?.addEventListener('mouseleave', startAutoplay);

    // Teclado
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
            startAutoplay();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
            startAutoplay();
        }
    });

    // Swipe móvil
    let touchStartX = 0;
    track.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].clientX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
            startAutoplay();
        }
    }, { passive: true });

    // Iniciar
    goToSlide(0);
    startAutoplay();

    console.log('✅ Carrusel inicializado correctamente');
}

// ===== 5. HEADER SHADOW =====
function initHeaderShadow() {
    const header = document.getElementById('header');
    if (!header) return;

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 50) {
            header.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
        }
    });
}

// ===== INICIALIZACIÓN =====
function init() {
    console.log(`%c${CONFIG.companyName}`, 'color: #3b82f6; font-size: 20px; font-weight: bold;');
    console.log('%c✓ Sitio cargado', 'color: #10b981; font-size: 14px;');

    initMobileMenu();
    initSmoothScroll();
    initQuoteForm();
    initCarousel();
    initHeaderShadow();
    initNormateca();

    console.log('%c✓ Todo inicializado', 'color: #3b82f6; font-size: 12px;');
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}