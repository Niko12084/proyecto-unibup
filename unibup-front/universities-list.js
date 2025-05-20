document.addEventListener('DOMContentLoaded', function() {
    // Datos de ejemplo (en producción vendrían de una API)
    const allUniversities = [
        { id: 1, name: "Universidad Nacional de Colombia", location: "Bogotá, Colombia", ranking: "Top 5", 
          description: "Universidad pública líder en Colombia", founded: 1867, students: 50000, website: "https://unal.edu.co" },
        { id: 2, name: "Universidad de los Andes", location: "Bogotá, Colombia", ranking: "Top 5", 
          description: "Universidad privada de alto prestigio", founded: 1948, students: 20000, website: "https://uniandes.edu.co" },
        { id: 3, name: "Pontificia Universidad Javeriana", location: "Bogotá, Colombia", ranking: "Top 10", 
          description: "Universidad privada con enfoque humanista", founded: 1623, students: 25000, website: "https://www.javeriana.edu.co" },
        { id: 4, name: "Universidad del Rosario", location: "Bogotá, Colombia", ranking: "Top 10", 
          description: "Una de las universidades más antiguas de América", founded: 1653, students: 12000, website: "https://urosario.edu.co" },
        { id: 5, name: "Universidad Externado de Colombia", location: "Bogotá, Colombia", ranking: "Top 20", 
          description: "Especializada en ciencias sociales y humanas", founded: 1886, students: 15000, website: "https://www.uexternado.edu.co" },
        { id: 6, name: "Universidad del Valle", location: "Cali, Colombia", ranking: "Top 20", 
          description: "Principal universidad pública del occidente colombiano", founded: 1945, students: 30000, website: "https://www.univalle.edu.co" },
        { id: 7, name: "Universidad de Antioquia", location: "Medellín, Colombia", ranking: "Top 20", 
          description: "Universidad pública líder en la región antioqueña", founded: 1803, students: 40000, website: "https://www.udea.edu.co" },
        { id: 8, name: "Universidad Industrial de Santander", location: "Bucaramanga, Colombia", ranking: "Top 50", 
          description: "Destacada en ingenierías y ciencias básicas", founded: 1948, students: 25000, website: "https://www.uis.edu.co" },
        { id: 9, name: "Universidad del Norte", location: "Barranquilla, Colombia", ranking: "Top 50", 
          description: "Líder en la región Caribe", founded: 1966, students: 18000, website: "https://www.uninorte.edu.co" },
        { id: 10, name: "Universidad ICESI", location: "Cali, Colombia", ranking: "Top 50", 
          description: "Excelencia académica en el suroccidente", founded: 1979, students: 8000, website: "https://www.icesi.edu.co" }
    ];

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
    let filteredUniversities = [...allUniversities];

    // Inicializar la tabla
    renderTable();

    // Event listeners
    searchInput.addEventListener('input', handleSearch);
    searchBtn.addEventListener('click', handleSearch);
    prevBtn.addEventListener('click', goToPrevPage);
    nextBtn.addEventListener('click', goToNextPage);
    closeModalBtn.addEventListener('click', closeModal);

    // Funciones
    function handleSearch() {
        const searchTerm = searchInput.value.toLowerCase();
        filteredUniversities = allUniversities.filter(u => 
            u.name.toLowerCase().includes(searchTerm) || 
            u.location.toLowerCase().includes(searchTerm) ||
            u.ranking.toLowerCase().includes(searchTerm) ||
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
            row.innerHTML = `<td colspan="5" style="text-align: center;">No se encontraron universidades</td>`;
            universitiesTable.appendChild(row);
        } else {
            paginatedItems.forEach(university => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${university.id}</td>
                    <td>${university.name}</td>
                    <td>${university.location}</td>
                    <td>${university.ranking}</td>
                    <td>
                        <button class="action-btn details-btn" data-id="${university.id}">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="action-btn edit-btn" data-id="${university.id}">
                            <i class="fas fa-edit"></i>
                        </button>
                    </td>
                `;
                universitiesTable.appendChild(row);
            });
        }

        updatePaginationControls();

        document.querySelectorAll('.details-btn').forEach(btn => {
            btn.addEventListener('click', () => showUniversityDetails(btn.dataset.id));
        });

        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', () => editUniversity(btn.dataset.id));
        });
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

    function showUniversityDetails(id) {
        const university = allUniversities.find(u => u.id == id);
        if(!university) return;

        modalTitle.textContent = university.name;
        
        modalBody.innerHTML = `
            <div class="university-detail">
                <label>ID:</label>
                <p>${university.id}</p>
            </div>
            <div class="university-detail">
                <label>Nombre:</label>
                <p>${university.name}</p>
            </div>
            <div class="university-detail">
                <label>Ubicación:</label>
                <p>${university.location}</p>
            </div>
            <div class="university-detail">
                <label>Ranking:</label>
                <p>${university.ranking}</p>
            </div>
            <div class="university-detail">
                <label>Descripción:</label>
                <p>${university.description}</p>
            </div>
            <div class="university-detail">
                <label>Año de fundación:</label>
                <p>${university.founded}</p>
            </div>
            <div class="university-detail">
                <label>Estudiantes:</label>
                <p>${university.students.toLocaleString()}</p>
            </div>
            <div class="university-detail">
                <label>Sitio web:</label>
                <p><a href="${university.website}" target="_blank">${university.website}</a></p>
            </div>
        `;

        detailsModal.style.display = 'flex';
    }

    function editUniversity(id) {

        alert(`Editar universidad con ID: ${id}\n\nEn una implementación completa, esto redirigiría al formulario de edición.`);
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