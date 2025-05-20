document.addEventListener('DOMContentLoaded', function() {
    const API_URL = 'http://localhost:3000/api/universidades';
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    const form = document.getElementById('universityForm');
    const actionType = document.getElementById('actionType');
    const universityId = document.getElementById('universityId');
    const universityName = document.getElementById('universityName');
    const universityLocation = document.getElementById('universityLocation');
    const universityRanking = document.getElementById('universityRanking');
    const deleteBtn = document.getElementById('deleteBtn');
    const searchBtn = document.getElementById('searchBtn');
    const newBtn = document.getElementById('newBtn');
    const universitiesTable = document.getElementById('universitiesTable').querySelector('tbody');
    const confirmModal = document.getElementById('confirmModal');
    const confirmDeleteBtn = document.getElementById('confirmDelete');
    const cancelDeleteBtn = document.getElementById('cancelDelete');
    const searchInput = document.getElementById('searchInput');

    let currentUniversityId = null;

    // Cargar universidades al iniciar
    loadUniversities();

    // Event listeners
    actionType.addEventListener('change', handleActionChange);
    form.addEventListener('submit', handleFormSubmit);
    deleteBtn.addEventListener('click', showDeleteModal);
    newBtn.addEventListener('click', prepareNewUniversity);
    confirmDeleteBtn.addEventListener('click', confirmDelete);
    cancelDeleteBtn.addEventListener('click', closeModal);
    searchInput.addEventListener('input', () => loadUniversities(searchInput.value));

    // Funciones
    async function loadUniversities(search = '') {
        try {
            let url = API_URL;
            if (search) {
                url += `?search=${encodeURIComponent(search)}`;
            }

            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Error al cargar universidades');
            }

            const universities = await response.json();
            renderUniversitiesTable(universities);
        } catch (error) {
            console.error('Error:', error);
            showAlert('Error al cargar universidades', 'error');
        }
    }

    function renderUniversitiesTable(universities) {
        universitiesTable.innerHTML = '';
        
        if (universities.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = `<td colspan="5" style="text-align: center;">No se encontraron universidades</td>`;
            universitiesTable.appendChild(row);
            return;
        }

        universities.forEach(university => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${university.id_universidad}</td>
                <td>${university.nombre}</td>
                <td>${university.ubicacion}</td>
                <td>${university.ranking}</td>
                <td>
                    <button class="action-btn edit-btn" data-id="${university.id_universidad}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete-btn" data-id="${university.id_universidad}">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </td>
            `;
            universitiesTable.appendChild(row);
        });

        // Agregar eventos a los botones
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', () => loadUniversity(btn.dataset.id));
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', () => prepareDeleteUniversity(btn.dataset.id));
        });
    }

    async function loadUniversity(id) {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Error al cargar universidad');
            }

            const university = await response.json();
            
            currentUniversityId = university.id_universidad;
            actionType.value = 'edit';
            
            universityId.value = university.id_universidad;
            universityName.value = university.nombre;
            universityLocation.value = university.ubicacion;
            
            // Seleccionar el ranking correcto
            const rankingOption = Array.from(universityRanking.options).find(
                option => option.text === university.ranking
            );
            if (rankingOption) rankingOption.selected = true;
            
            showAlert('Universidad cargada para edición', 'info');
        } catch (error) {
            console.error('Error:', error);
            showAlert(error.message, 'error');
        }
    }

    function prepareDeleteUniversity(id) {
        currentUniversityId = id;
        actionType.value = 'delete';
        showDeleteModal();
    }

    function handleActionChange() {
        switch(actionType.value) {
            case 'new':
                prepareNewUniversity();
                break;
            case 'edit':
                enableForm(true);
                universityId.disabled = false;
                break;
            case 'delete':
                enableForm(false);
                universityId.disabled = false;
                universityName.disabled = true;
                universityLocation.disabled = true;
                universityRanking.disabled = true;
                break;
            default:
                resetForm();
        }
    }

    function prepareNewUniversity() {
        actionType.value = 'new';
        resetForm();
        enableForm(true);
        universityId.disabled = true;
        universityId.value = '';
        universityName.focus();
    }

    function enableForm(enable) {
        universityName.disabled = !enable;
        universityLocation.disabled = !enable;
        universityRanking.disabled = !enable;
    }

    function resetForm() {
        form.reset();
        enableForm(true);
        currentUniversityId = null;
    }

    async function handleFormSubmit(e) {
        e.preventDefault();
        
        if (!validateForm()) return;

        const universityData = {
            nombre: universityName.value,
            ubicacion: universityLocation.value,
            ranking: universityRanking.options[universityRanking.selectedIndex].text
        };

        try {
            let response;
            let method;
            let url = API_URL;

            if (actionType.value === 'edit' && currentUniversityId) {
                method = 'PUT';
                url += `/${currentUniversityId}`;
            } else {
                method = 'POST';
            }

            response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(universityData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al guardar universidad');
            }

            const savedUniversity = await response.json();
            
            showAlert(
                actionType.value === 'edit' 
                    ? 'Universidad actualizada correctamente' 
                    : 'Universidad registrada correctamente', 
                'success'
            );
            
            loadUniversities();
            resetForm();
        } catch (error) {
            console.error('Error:', error);
            showAlert(error.message, 'error');
        }
    }

    function validateForm() {
        if (!universityName.value) {
            showAlert('El nombre de la universidad es requerido', 'error');
            universityName.focus();
            return false;
        }
        return true;
    }

    function showDeleteModal() {
        if (!currentUniversityId) {
            showAlert('Debe seleccionar una universidad para eliminar', 'error');
            return;
        }
        confirmModal.style.display = 'flex';
    }

    async function confirmDelete() {
        try {
            const response = await fetch(`${API_URL}/${currentUniversityId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Error al eliminar universidad');
            }

            showAlert('Universidad eliminada correctamente', 'success');
            loadUniversities();
            resetForm();
            closeModal();
        } catch (error) {
            console.error('Error:', error);
            showAlert(error.message, 'error');
        }
    }

    function closeModal() {
        confirmModal.style.display = 'none';
    }

    function showAlert(message, type = 'success') {
        const alert = document.createElement('div');
        alert.className = `alert alert-${type} fade-in`;
        alert.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            ${message}
        `;
        
        document.body.appendChild(alert);
        
        setTimeout(() => {
            alert.classList.add('fade-out');
            setTimeout(() => alert.remove(), 500);
        }, 3000);
    }

    // Estilos dinámicos
    const style = document.createElement('style');
    style.textContent = `
        .alert {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 5px;
            color: white;
            display: flex;
            align-items: center;
            gap: 10px;
            z-index: 1100;
            box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
        }
        
        .alert-success {
            background-color: #2ecc71;
        }
        
        .alert-error, .alert-danger {
            background-color: #e74c3c;
        }
        
        .alert-info {
            background-color: #3498db;
        }
        
        .fade-in {
            animation: fadeIn 0.3s ease-out forwards;
        }
        
        .fade-out {
            animation: fadeOut 0.5s ease-out forwards;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeOut {
            from { opacity: 1; transform: translateY(0); }
            to { opacity: 0; transform: translateY(-20px); }
        }
        
        .modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 1000;
            justify-content: center;
            align-items: center;
        }
        
        .modal-content {
            background: white;
            padding: 20px;
            border-radius: 5px;
            width: 400px;
            max-width: 90%;
        }
        
        .close-modal {
            float: right;
            cursor: pointer;
            font-size: 1.5rem;
        }
        
        .modal-actions {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
            margin-top: 20px;
        }
    `;
    document.head.appendChild(style);
});