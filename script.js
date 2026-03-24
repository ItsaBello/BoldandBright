const burgerButton = document.querySelector('.burgermenu-icon');
const menu = document.querySelector('.burgermenu');

if (burgerButton && menu) {
    burgerButton.addEventListener('click', () => {
        menu.classList.toggle('is-active');
        burgerButton.classList.toggle('is-active');

        const isOpen = menu.classList.contains('is-active');
        burgerButton.setAttribute('aria-label', isOpen ? 'Sluit menu' : 'Open menu');
    });
}

const backToTop = document.querySelector('.back-to-top');
const footer = document.querySelector('footer');

if (backToTop && footer) {
  const observer = new IntersectionObserver(([entry]) => {
    backToTop.classList.toggle('is-visible', entry.isIntersecting);
  }, { threshold: 0.1 });

  observer.observe(footer);
}

const headerEl = document.querySelector("header");
const prevBtn = document.querySelector(".arrow-left");
const nextBtn = document.querySelector(".arrow-right");

const headerImages = [
  "images/mock background.png",
  "images/mock header 1.jpg",
  "images/mock header 2.jpg",
  "images/mock header 3.jpeg",
  "images/mock header 4.jpg"
];

let currentIndex = 0;
let isFading = false;
let autoplayId = null;

function slideHeader(step) {
  if (!headerEl || isFading) return;

  const nextIndex = (currentIndex + step + headerImages.length) % headerImages.length;
  const nextUrl = `url("${headerImages[nextIndex]}")`;

  headerEl.style.setProperty("--header-next-image", nextUrl);
  headerEl.classList.add("is-fading");
  isFading = true;

  setTimeout(() => {
    currentIndex = nextIndex;
    headerEl.style.setProperty("--header-image", nextUrl);
    headerEl.classList.remove("is-fading");
    isFading = false;
  }, 420);
}

function startHeaderAutoplay() {
    if (!headerEl) return;
    if (autoplayId) clearInterval(autoplayId);
    autoplayId - setInterval(() => slideHeader(1), 5000);
}

function stopHeaderAutoplay() {
    if (autoplayId) clearInterval(autoplayId);
    autoplayId = null;
}


nextBtn?.addEventListener("click", () => {
    slideHeader(1);
    startHeaderAutoplay();
});

prevBtn?.addEventListener("click", () => {
    slideHeader(-1);
    startHeaderAutoplay();
});

headerEl?.addEventListener("mouseenter", stopHeaderAutoplay);
headerEl?.addEventListener("mouseleave", startHeaderAutoplay);

startHeaderAutoplay();

const faqQuestions = document.querySelectorAll('.faq-question');

faqQuestions.forEach(question => {
    question.addEventListener('click', () => {

        faqQuestions.forEach(item => {
            if (item !== question) {
                item.classList.remove('active'); 
                item.nextElementSibling.style.maxHeight = null;
            }
        });

        question.classList.toggle('active');

        const answer = question.nextElementSibling;

        if (answer.style.maxHeight) {
            answer.style.maxHeight = null;
        } else {
            answer.style.maxHeight = answer.scrollHeight + 'px';
        }
    });
});

