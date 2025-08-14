document.addEventListener('DOMContentLoaded', async function () {
    // Obtener ID de la universidad desde los parámetros de la URL
    const queryString = window.location.search;

    const urlParams = new URLSearchParams(queryString);

    const universityId = urlParams.get('id');

    const response = await fetch("http://localhost:3000/api/v1/universities")
    const universities = await response.json();

    const university = universities.find(item => item.id_universidad === Number(universityId))

    const mapContainer = document.querySelector('.map-container')
    
    mapContainer.src = university?.map_url

    try {
        // Obtener toda la información de la universidad y sus carreras
        const response = await fetch(`http://localhost:3000/api/v1/university-careers/${universityId}`);
        if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
        const universityData = await response.json();

        if (!universityData || universityData.length === 0) {
            throw new Error('No se encontraron datos para esta universidad');
        }

        // Mostrar información general y programas académicos
        displayUniversityInfo(universityData[0]);
        displayAcademicPrograms(universityData);

    } catch (error) {
        console.error('Error:', error);
        const errorContainer = document.getElementById('errorContainer');
        if (errorContainer) {
            errorContainer.textContent = 'Error al cargar los datos: ' + error.message;
            errorContainer.style.display = 'block';
        }
    }
});

// Mostrar información general de la universidad
function displayUniversityInfo(university) {
    document.getElementById('universityName').textContent = university.universidad?.nombre || 'Universidad';
    document.getElementById('mainAddress').textContent = university.universidad?.ubicacion || 'Dirección no disponible';
    document.getElementById('schedule').textContent = university.universidad?.ranking || 'Ranking no disponible';
}

// Mostrar los programas académicos
function displayAcademicPrograms(programsData) {
    const programsGrid = document.getElementById('programsGrid');
    if (!programsGrid) return;

    programsGrid.innerHTML = '';

    programsData.forEach(program => {
        const programCard = document.createElement('div');
        programCard.className = 'program-card';

        programCard.innerHTML = `
            <h3>${program.carrera?.nombre || 'Programa no disponible'}</h3>
            <p><strong>Requisitos:</strong> ${program.requisitos || 'No especificado'}</p>
            <p><strong>Puntaje mínimo:</strong> ${program.puntaje_minimo || 'No especificado'}</p>
            <p><strong>Duración:</strong> ${program.carrera?.duracion || 'No especificado'}</p>
            <p><strong>Costo estimado:</strong> ${program.carrera?.costo_estimado || 'No especificado'}</p>
        `;

        programsGrid.appendChild(programCard);
    });
}
