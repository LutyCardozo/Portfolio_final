const horizontal = document.querySelector('.horizontal');
const race = document.querySelector('.race');
const path = document.getElementById('line');
const checkpoints = document.querySelectorAll('.checkpoint');
const header = document.querySelector('header');
const esPaginaProyecto =
    document.body.classList.contains('project-page') ||
    document.body.classList.contains('proyecto-page') ||
    document.querySelector('.project-detail') ||
    document.querySelector('.proyecto-detalle') ||
    document.querySelector('.project-hero');
const proyectosTrack = document.querySelector('.proyectos-track');
const leftArrow = document.querySelector('.arrow-left');
const rightArrow = document.querySelector('.arrow-right');

let pathLength = 0;
let scrollDistance = 0;

function setupLine() {
    if (!path) return;

    pathLength = path.getTotalLength();
    path.style.strokeDasharray = pathLength;
    path.style.strokeDashoffset = pathLength;
}

setupLine();

function setRaceScrollDistance() {
    if (!race || !horizontal) return;

    const raceWidth = race.offsetWidth || window.innerWidth;
    const naturalMove = Math.max(horizontal.scrollWidth - raceWidth, 0);
    const allCheckpoints = horizontal.querySelectorAll('.checkpoint');
    const lastCheckpoint = allCheckpoints[allCheckpoints.length - 1];

    if (lastCheckpoint) {
        const metaCenter = lastCheckpoint.offsetLeft + lastCheckpoint.offsetWidth / 2;

        // El recorrido llega hasta Meta, dejando el checkpoint visible en pantalla.
        scrollDistance = Math.max(metaCenter - window.innerWidth * 0.55, 0);
    } else {
        scrollDistance = naturalMove;
    }

    scrollDistance = Math.min(scrollDistance, naturalMove);
    scrollDistance = Math.max(scrollDistance, 0);

    // La sección dura exactamente lo necesario para mover la línea;
    // cuando termina, el sitio vuelve a bajar normalmente.
    race.style.height = `${window.innerHeight + scrollDistance}px`;
}

let targetProgress = 0;
let currentProgress = 0;
let animationStarted = false;

function getRaceProgress() {
    if (!race || scrollDistance <= 0) return 0;

    const rect = race.getBoundingClientRect();
    const currentScroll = Math.min(Math.max(-rect.top, 0), scrollDistance);

    return currentScroll / scrollDistance;
}

function updateTargetProgress() {
    targetProgress = getRaceProgress();
}

function updateHeaderBackground() {
    if (!header) return;

    if (esPaginaProyecto) {
        header.classList.add('scrolled');
        return;
    }

    if (window.scrollY > 40) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}

function showCheckpointsOnScreen() {
    if (!checkpoints.length) return;

    checkpoints.forEach((checkpoint) => {
        const rect = checkpoint.getBoundingClientRect();
        const appearsInView = rect.left < window.innerWidth * 0.68 && rect.right > window.innerWidth * 0.08;

        if (appearsInView) {
            checkpoint.classList.add('visible');
        } else {
            checkpoint.classList.remove('visible');
        }
    });
}

function animateRace() {
    if (!horizontal || !race) return;

    const movementEase = 0.095;
    currentProgress += (targetProgress - currentProgress) * movementEase;

    const raceWidth = race.offsetWidth || window.innerWidth;
    const maxTranslate = Math.max(horizontal.scrollWidth - raceWidth, 0);
    const translateX = Math.min(scrollDistance * currentProgress, maxTranslate);
    horizontal.style.transform = `translateX(-${translateX}px)`;

    if (path) {
        path.style.strokeDashoffset = pathLength * (1 - targetProgress);
    }

    showCheckpointsOnScreen();

    requestAnimationFrame(animateRace);
}

function initRaceAnimation() {
    setRaceScrollDistance();
    setupLine();
    updateTargetProgress();
    currentProgress = targetProgress;

    if (!animationStarted) {
        animationStarted = true;
        animateRace();
    }
}

window.addEventListener('scroll', () => {
    updateTargetProgress();
    updateHeaderBackground();
}, { passive: true });
window.addEventListener('resize', () => {
    setRaceScrollDistance();
    setupLine();
    updateTargetProgress();
    updateHeaderBackground();
});
window.addEventListener('load', () => {
    initRaceAnimation();
    updateHeaderBackground();
});

initRaceAnimation();
updateHeaderBackground();

// flechas de proyectos
if (proyectosTrack && leftArrow && rightArrow) {
    function getProjectScrollAmount() {
        const card = proyectosTrack.querySelector('.proyecto-card');
        const gap = parseInt(window.getComputedStyle(proyectosTrack).gap) || 24;

        if (!card) return 320;

        return card.offsetWidth + gap;
    }

    leftArrow.addEventListener('click', () => {
        proyectosTrack.scrollBy({
            left: -getProjectScrollAmount(),
            behavior: 'smooth'
        });
    });

    rightArrow.addEventListener('click', () => {
        proyectosTrack.scrollBy({
            left: getProjectScrollAmount(),
            behavior: 'smooth'
        });
    });
}

// menú hamburguesa
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');

if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // cerrar menú al hacer click en un link
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    /* HERO ROTATING TEXT */
    const rotatingWords = document.querySelectorAll('.hero-rotating-text .word');

    if (rotatingWords.length) {
        let currentWord = 0;

        setInterval(() => {
            rotatingWords[currentWord].classList.remove('active');

            currentWord = (currentWord + 1) % rotatingWords.length;

            rotatingWords[currentWord].classList.add('active');
        }, 2200);
    }

    /* HERO SCROLL TRANSITION */
    /* HERO SCROLL TRANSITION - primer scroll cambia el texto, segundo scroll avanza */
    const heroSection = document.querySelector('.hero');
    const heroMainTitle = document.querySelector('.hero-main-title');
    const heroScrollContent = document.querySelector('.hero-scroll-content');
    let heroTextChanged = false;
    let heroLockedScroll = false;
    let heroStartY = 0;

    function showHeroStory() {
        if (!heroMainTitle || !heroScrollContent) return;

        heroMainTitle.classList.add('hide');
        heroScrollContent.classList.add('show');

        rotatingWords.forEach(word => {
            word.classList.remove('active');
            word.style.opacity = '0';
            word.style.transform = 'translateX(-50%) translateY(-20px)';
        });

        heroTextChanged = true;
    }

    function showHeroTitle() {
        if (!heroMainTitle || !heroScrollContent) return;

        heroMainTitle.classList.remove('hide');
        heroScrollContent.classList.remove('show');

        rotatingWords.forEach((word, index) => {
            word.style.opacity = '';
            word.style.transform = '';
            word.classList.toggle('active', index === 0);
        });

        heroTextChanged = false;
    }

    window.addEventListener('wheel', (event) => {
        if (!heroSection || !heroMainTitle || !heroScrollContent) return;

        const isAtTop = window.scrollY <= 2;
        const scrollingDown = event.deltaY > 0;
        const scrollingUp = event.deltaY < 0;

        if (heroLockedScroll) {
            event.preventDefault();
            event.stopPropagation();
            window.scrollTo(0, 0);
            return;
        }

        if (isAtTop && scrollingDown && !heroTextChanged) {
            event.preventDefault();
            event.stopPropagation();

            heroLockedScroll = true;
            document.documentElement.style.overflow = 'hidden';
            document.body.style.overflow = 'hidden';
            window.scrollTo(0, 0);

            showHeroStory();

            setTimeout(() => {
                window.scrollTo(0, 0);
                document.documentElement.style.overflow = '';
                document.body.style.overflow = '';
                heroLockedScroll = false;
            }, 650);

            return;
        }

        if (isAtTop && scrollingUp && heroTextChanged) {
            event.preventDefault();
            event.stopPropagation();
            window.scrollTo(0, 0);
            showHeroTitle();
        }
    }, { passive: false });

    window.addEventListener('touchstart', (event) => {
        heroStartY = event.touches[0].clientY;
    }, { passive: true });

    window.addEventListener('touchmove', (event) => {
        if (!heroSection || !heroMainTitle || !heroScrollContent) return;

        const isAtTop = window.scrollY <= 2;
        const currentY = event.touches[0].clientY;
        const scrollingDown = heroStartY > currentY;

        if (isAtTop && scrollingDown && !heroTextChanged) {
            event.preventDefault();
            window.scrollTo(0, 0);
            showHeroStory();
        }
    }, { passive: false });

    window.addEventListener('scroll', () => {
        if (window.scrollY <= 2 && !heroTextChanged) {
            showHeroTitle();
        }
    }, { passive: true });

    window.addEventListener('load', () => {
        if (window.scrollY <= 2) {
            showHeroTitle();
        }
    });
}

// Contact form status for Netlify Forms
const contactForm = document.getElementById("contact - form");
const formStatus = document.getElementById("form - status");


if (contactForm && formStatus) {
    const params = new URLSearchParams(window.location.search);

    if (params.has("success")) {
        formStatus.textContent = "Mensaje enviado correctamente.Gracias por escribirme.";
        formStatus.classList.add("is - visible");
    }
}