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
    autoplayId = setInterval(() => slideHeader(1), 5000);
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

const fileInput = document.querySelector('#reference_images');
const fileUploadText = document.querySelector('#file-upload-text');
const fileUploadList = document.querySelector('#files-upload-list');

function renderSelectedFiles() {
    fileUploadList.innerHTML = '';

    for (const [index, file] of Array.from(fileInput.files).entries()) {
        const fileItem = document.createElement('div');
        fileItem.classList.add('file-upload-item');

        const fileName = document.createElement('span');
        fileName.classList.add('file-upload-name');
        fileName.textContent = file.name;

        const removeButton = document.createElement('button');
        removeButton.classList.add('file-upload-remove');
        removeButton.type = 'button';
        removeButton.textContent = '×';

        removeButton.addEventListener('click', () => {
            const dataTransfer = new DataTransfer();

            Array.from(fileInput.files).forEach((currentFile, currentIndex) => {
                if (currentIndex !== index) {
                    dataTransfer.items.add(currentFile);
                }
            });

            fileInput.files = dataTransfer.files;

            if (fileInput.files.length === 0) {
                fileUploadText.textContent = 'Nog geen bestand gekozen';
            } else if (fileInput.files.length === 1) {
                fileUploadText.textContent = '1 bestand gekozen';
            } else {
                fileUploadText.textContent = `${fileInput.files.length} bestanden gekozen`;
            }

            renderSelectedFiles();
        });

        fileItem.appendChild(fileName);
        fileItem.appendChild(removeButton);

        fileUploadList.appendChild(fileItem);
    }
}

if (fileInput && fileUploadText && fileUploadList) {
    fileInput.addEventListener('change', () => {
        const fileCount = fileInput.files.length;
        const maxFiles = 5;

        fileUploadList.innerHTML = '';

        if (fileCount === 0) {
            fileUploadText.textContent = 'Nog geen bestanden gekozen';
            return;
        }

        if (fileCount > maxFiles) {
            fileUploadText.textContent = `Je kunt maximaal ${maxFiles} bestanden kiezen`;
            fileInput.value = '';
            return;
        }

        if (fileCount === 1) {
            fileUploadText.textContent = '1 bestand gekozen';
        } else {
            fileUploadText.textContent = `${fileCount} bestanden gekozen`;
        }

        renderSelectedFiles();
    });
}

const formStatus = document.querySelector('#form-status');

const formStatusMessage = document.querySelector('#form-status-message');
const formStatusClose = document.querySelector('#form-status-close');
const formStatusCard = document.querySelector('.form-status-card');

const params = new URLSearchParams(window.location.search);
const status = params.get('status');

if (formStatus && formStatusMessage && formStatusClose && status) {
    function closeFormStatus() {
        formStatus.hidden = true;

        if (window.history.replaceState) {
            window.history.replaceState({}, document.title, `${window.location.pathname}${window.location.hash}`);
        }
    }

    formStatusClose.addEventListener('click', closeFormStatus);
    
    formStatus.addEventListener('click', (event) => {
        if (event.target === formStatus) {
            closeFormStatus();
        }
    });

    if (status === 'success') {
        formStatusMessage.textContent = 'Thanks! Je bericht is verzonden. Ink incoming!';
        formStatus.hidden = false;
    } else if (status === 'error') {
        formStatusMessage.textContent = 'Er ging iets mis bij het verzenden van je bericht.';
        formStatus.hidden = false;
    }
}