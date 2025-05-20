
document.addEventListener('DOMContentLoaded', function() {
    const typed = new Typed('.typed-text', {
        strings: [
            "Transforma tu pasión en profesión",
            "Descubre tu vocación",
            "Encuentra tu camino profesional"
        ],
        typeSpeed: 50,
        backSpeed: 30,
        loop: true,
        showCursor: true,
        cursorChar: '|'
    });

    const elements = document.querySelectorAll('.hero-title, .hero-subtitle, .search-container, .cta-buttons, .hero-stats');
    elements.forEach((el, index) => {
        el.classList.add('animated', `delay-${index}`);
    });

    const compareBtn = document.getElementById('compareBtn');
    const compareModal = document.getElementById('compareModal');
    const closeModal = document.querySelector('.close-modal');
    
    compareBtn.addEventListener('click', () => {
        compareModal.style.display = 'flex';
    });
    
    closeModal.addEventListener('click', () => {
        compareModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === compareModal) {
            compareModal.style.display = 'none';
        }
    });
    const loginForm = document.getElementById('loginRedirectForm');
    const loginBtn = document.getElementById('loginBtn');
    if(loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            window.location.href = 'login.html';
        });
    }   
    const exploreBtn = document.getElementById('exploreBtn');
    if (exploreBtn) {
        exploreBtn.addEventListener('click', function() {
            e.preventDefault();
            window.location.href = "career-search.html";
        });
    }
    const careersLink = document.getElementById('careersLink');
    if (careersLink) {
        careersLink.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'career-search.html';
        });
    }
    
});