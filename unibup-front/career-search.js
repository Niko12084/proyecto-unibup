document.addEventListener('DOMContentLoaded', function() {

    const careerData = [
        {
            career: "Medicina",
            universities: [
                {
                    name: "Universidad Nacional de Colombia",
                    location: "Bogotá, Medellín, Manizales",
                    ranking: "Top 1 en Salud",
                    duration: "12 semestres",
                    degree: "Médico Cirujano"
                },
                {
                    name: "Universidad de Antioquia",
                    location: "Medellín",
                    ranking: "Top 3 en Salud",
                    duration: "12 semestres",
                    degree: "Médico"
                },
                {
                    name: "Universidad del Rosario",
                    location: "Bogotá",
                    ranking: "Top 5 en Salud",
                    duration: "12 semestres",
                    degree: "Médico"
                }
            ]
        },
        {
            career: "Ingeniería Civil",
            universities: [
                {
                    name: "Universidad de los Andes",
                    location: "Bogotá",
                    ranking: "Top 1 en Ingenierías",
                    duration: "10 semestres",
                    degree: "Ingeniero Civil"
                },
                {
                    name: "Universidad Nacional de Colombia",
                    location: "Bogotá, Medellín, Manizales",
                    ranking: "Top 2 en Ingenierías",
                    duration: "10 semestres",
                    degree: "Ingeniero Civil"
                },
                {
                    name: "Universidad del Valle",
                    location: "Cali",
                    ranking: "Top 5 en Ingenierías",
                    duration: "10 semestres",
                    degree: "Ingeniero Civil"
                }
            ]
        },
        {
            career: "Psicología",
            universities: [
                {
                    name: "Pontificia Universidad Javeriana",
                    location: "Bogotá, Cali",
                    ranking: "Top 1 en Psicología",
                    duration: "10 semestres",
                    degree: "Psicólogo"
                },
                {
                    name: "Universidad de los Andes",
                    location: "Bogotá",
                    ranking: "Top 2 en Psicología",
                    duration: "10 semestres",
                    degree: "Psicólogo"
                },
                {
                    name: "Universidad Nacional de Colombia",
                    location: "Bogotá",
                    ranking: "Top 3 en Psicología",
                    duration: "10 semestres",
                    degree: "Psicólogo"
                }
            ]
        },
        {
            career: "Derecho",
            universities: [
                {
                    name: "Universidad Externado de Colombia",
                    location: "Bogotá",
                    ranking: "Top 1 en Derecho",
                    duration: "10 semestres",
                    degree: "Abogado"
                },
                {
                    name: "Universidad de los Andes",
                    location: "Bogotá",
                    ranking: "Top 2 en Derecho",
                    duration: "10 semestres",
                    degree: "Abogado"
                },
                {
                    name: "Universidad Nacional de Colombia",
                    location: "Bogotá",
                    ranking: "Top 3 en Derecho",
                    duration: "10 semestres",
                    degree: "Abogado"
                }
            ]
        }
    ];

    const careerInput = document.getElementById('careerInput');
    const searchBtn = document.getElementById('searchBtn');
    const resultsContainer = document.getElementById('resultsContainer');
    const resultsTitle = document.getElementById('resultsTitle');
    const resultsCount = document.getElementById('resultsCount');
    const universitiesList = document.getElementById('universitiesList');

    searchBtn.addEventListener('click', searchCareers);
    careerInput.addEventListener('keypress', function(e) {
        if(e.key === 'Enter') {
            searchCareers();
        }
    });

    function searchCareers() {
        const searchTerm = careerInput.value.trim().toLowerCase();
        
        if(!searchTerm) {
            showAlert('Por favor ingresa una carrera para buscar');
            return;
        }

        const results = careerData.filter(item => 
            item.career.toLowerCase().includes(searchTerm)
        );

        displayResults(results, searchTerm);
    }

    function displayResults(results, searchTerm) {
        universitiesList.innerHTML = '';
        
        if(results.length === 0) {
            resultsContainer.style.display = 'block';
            resultsTitle.textContent = `No encontramos resultados para "${searchTerm}"`;
            resultsCount.textContent = '0 universidades';
            
            universitiesList.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <h4>No encontramos la carrera que buscas</h4>
                    <p>Intenta con otro nombre o revisa nuestra lista de universidades</p>
                </div>
            `;
        } else {
            resultsContainer.style.display = 'block';
            resultsTitle.textContent = `Resultados para "${results[0].career}"`;
            resultsCount.textContent = `${results[0].universities.length} universidades`;

            results[0].universities.forEach((university, index) => {
            const universityCard = document.createElement('div');
            universityCard.className = 'university-card';
            universityCard.innerHTML = `
                <h4>${university.name}</h4>
                <p><strong>Título:</strong> ${university.degree}</p>
                <p><strong>Duración:</strong> ${university.duration}</p>
                <p class="location"><i class="fas fa-map-marker-alt"></i> ${university.location}</p>
                <span class="ranking">${university.ranking}</span>
                <!-- 🔥 Cambia el href para incluir ?id= -->
                <a href="university-detail.html?id=${index}" class="details-link">
                    Ver detalles completos <i class="fas fa-arrow-right"></i>
                </a>
            `;
                universitiesList.appendChild(universityCard);
            });
        }
    }
    function showAlert(message) {
        alert(message);
        careerInput.focus();
    }
});