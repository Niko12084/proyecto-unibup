document.addEventListener('DOMContentLoaded', function () {
    const API_URL = 'http://localhost:3000/api/v1/universities';

    const universityInput = document.getElementById('universityInput');
    const searchBtn = document.getElementById('searchBtn');
    const resultsContainer = document.getElementById('resultsContainer');
    const resultsTitle = document.getElementById('resultsTitle');
    const resultsCount = document.getElementById('resultsCount');
    const universitiesList = document.getElementById('universitiesList');

    let universitiesData = [];

    // Cargar las universidades desde la API
    async function loadUniversities() {
        try {
            const response = await fetch(API_URL);
            universitiesData = await response.json();
            displayAllUniversities();
        } catch (error) {
            console.error('Error al cargar universidades:', error);
            resultsTitle.textContent = 'Error al cargar universidades';
        }
    }

    searchBtn.addEventListener('click', searchUniversities);
    universityInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            searchUniversities();
        }
    });

    function searchUniversities() {
        const searchTerm = universityInput.value.trim().toLowerCase();
        if (!searchTerm) {
            displayAllUniversities();
            return;
        }
        const results = universitiesData.filter(university =>
            university.nombre.toLowerCase().includes(searchTerm) ||
            university.ubicacion.toLowerCase().includes(searchTerm)
        );
        displayResults(results, searchTerm);
    }

    function displayAllUniversities() {
        displayResults(universitiesData, "todas las universidades");
    }

    function displayResults(results, searchTerm) {
        universitiesList.innerHTML = '';

        if (results.length === 0) {
            resultsTitle.textContent = `No se encontraron resultados para "${searchTerm}"`;
            resultsCount.textContent = '';
            return;
        }

        resultsContainer.style.display = 'block';
        resultsTitle.textContent = searchTerm === "todas las universidades"
            ? "Todas las universidades disponibles"
            : `Resultados para "${searchTerm}"`;
        resultsCount.textContent = `${results.length} ${results.length === 1 ? 'universidad' : 'universidades'}`;

        results.forEach((university) => {
            const universityCard = document.createElement('div');
            universityCard.className = 'university-card';
            universityCard.innerHTML = `
                <h4>${university.nombre}</h4>
                <span class="ranking"><h3>Ranking Nacional</h3> ${university.ranking} </span>
                <p class="location"><i class="fas fa-map-marker-alt"></i> ${university.ubicacion}</p>
                <div class="university-links">
                    <a href="${university.imagen_url}" target="_blank" class="university-link">
                        <i class="fas fa-globe"></i> Sitio web
                    </a>
                    <a href="university-detail.html?id=${university.id_universidad}" class="university-link">
                        <i class="fas fa-search"></i> Descubrir
                    </a>
                </div>
            `;
            universitiesList.appendChild(universityCard);
        });
    }

    loadUniversities();
});
