document.addEventListener('DOMContentLoaded', function() {
    const API_URL = 'http://localhost:3000/api/v1/universities';
    
    // Elementos del DOM
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const universitiesTable = document.getElementById('universitiesTable').querySelector('tbody');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const paginationInfo = document.getElementById('paginationInfo');
    const detailsModal = document.getElementById('detailsModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    const closeModalBtn = document.querySelector('.close-modal');

    // Variables de estado
    let currentPage = 1;
    const itemsPerPage = 5;
    let allUniversities = [];
    let filteredUniversities = [];

    // Inicializar la tabla
    loadUniversities();

    // Event listeners
    searchInput.addEventListener('input', handleSearch);
    searchBtn.addEventListener('click', handleSearch);
    prevBtn.addEventListener('click', goToPrevPage);
    nextBtn.addEventListener('click', goToNextPage);
    closeModalBtn.addEventListener('click', closeModal);

    /**
     * Carga las universidades desde la API
     */
    async function loadUniversities() {
        try {
            const response = await fetch(API_URL, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Error al cargar universidades');
            }

            const data = await response.json();
            allUniversities = data.map(item => ({
                id: item.id_universidad,
                name: item.nombre,
                location: item.ubicacion,
                ranking: item.ranking,
                image_url: item.imagen_url,
                founded: new Date(item.fecha_creacion).getFullYear()
            }));

            filteredUniversities = [...allUniversities];
            renderTable();
        } catch (error) {
            console.error('Error:', error);
            alert('Error al cargar las universidades: ' + error.message);
        }
    }

    function handleSearch() {
        const searchTerm = searchInput.value.toLowerCase();
        filteredUniversities = allUniversities.filter(u => 
            u.name.toLowerCase().includes(searchTerm) || 
            u.location.toLowerCase().includes(searchTerm) ||
            u.ranking.toString().toLowerCase().includes(searchTerm) ||
            u.id.toString().includes(searchTerm)
        );
        currentPage = 1;
        renderTable();
    }

    function renderTable() {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedItems = filteredUniversities.slice(startIndex, endIndex);

        universitiesTable.innerHTML = '';

        if(paginatedItems.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = `<td colspan="4" style="text-align: center;">No se encontraron universidades</td>`;
            universitiesTable.appendChild(row);
        } else {
            paginatedItems.forEach(university => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${university.id}</td>
                    <td>${university.name}</td>
                    <td>${university.location}</td>
                    <td>${university.ranking}</td>
                `;
                universitiesTable.appendChild(row);
            });
        }

        updatePaginationControls();
    }

    function updatePaginationControls() {
        const totalPages = Math.ceil(filteredUniversities.length / itemsPerPage);

        paginationInfo.textContent = `${currentPage} de ${totalPages > 0 ? totalPages : 1}`;

        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage === totalPages || totalPages === 0;
    }

    function goToPrevPage() {
        if(currentPage > 1) {
            currentPage--;
            renderTable();
        }
    }

    function goToNextPage() {
        const totalPages = Math.ceil(filteredUniversities.length / itemsPerPage);
        if(currentPage < totalPages) {
            currentPage++;
            renderTable();
        }
    }

    function closeModal() {
        detailsModal.style.display = 'none';
    }

    window.addEventListener('click', (event) => {
        if(event.target === detailsModal) {
            closeModal();
        }
    });
});