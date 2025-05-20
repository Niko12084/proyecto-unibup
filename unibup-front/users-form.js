document.addEventListener('DOMContentLoaded', function() {
    const API_URL = 'http://localhost:3000/api/users';
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    // Elementos del DOM
    const userForm = document.getElementById('userForm');
    const deleteBtn = document.getElementById('deleteBtn');
    const searchBtn = document.getElementById('searchBtn');
    const newBtn = document.getElementById('newBtn');
    const confirmModal = document.getElementById('confirmModal');
    const searchInput = document.getElementById('searchInput');
    const usersTable = document.getElementById('usersTable').querySelector('tbody');

    let selectedUserId = null;

    // Cargar usuarios al iniciar
    loadUsers();

    // Event listeners
    userForm.addEventListener('submit', handleFormSubmit);
    newBtn.addEventListener('click', prepareNewUser);
    searchInput.addEventListener('input', () => loadUsers(searchInput.value));
    document.getElementById('confirmDelete').addEventListener('click', confirmDelete);
    document.querySelectorAll('.close-modal, #cancelDelete').forEach(btn => {
        btn.addEventListener('click', closeModal);
    });

    // Funciones
    async function loadUsers(search = '') {
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
                throw new Error('Error al cargar usuarios');
            }

            const users = await response.json();
            renderUsers(users);
        } catch (error) {
            console.error('Error:', error);
            showAlert(error.message, 'error');
        }
    }

    function renderUsers(users) {
        usersTable.innerHTML = '';

        if (users.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = '<td colspan="5">No se encontraron usuarios</td>';
            usersTable.appendChild(row);
            return;
        }

        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.id_usuario}</td>
                <td>${user.nombre}</td>
                <td>${user.correo}</td>
                <td>${user.rol}</td>
                <td>
                    <button class="btn-secondary edit-btn" data-id="${user.id_usuario}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-danger delete-btn" data-id="${user.id_usuario}">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </td>
            `;
            usersTable.appendChild(row);
        });

        // Agregar eventos a los botones
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', () => loadUser(btn.dataset.id));
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                selectedUserId = btn.dataset.id;
                confirmModal.style.display = 'block';
            });
        });
    }

    async function loadUser(id) {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Error al cargar usuario');
            }

            const user = await response.json();
            
            document.getElementById('userId').value = user.id_usuario;
            document.getElementById('userName').value = user.nombre;
            document.getElementById('userEmail').value = user.correo;
            document.getElementById('userRole').value = user.rol;
            document.getElementById('userPassword').value = '';
            
            showAlert('Usuario cargado para edición', 'info');
        } catch (error) {
            console.error('Error:', error);
            showAlert(error.message, 'error');
        }
    }

    async function handleFormSubmit(e) {
        e.preventDefault();
        
        const userData = {
            nombre: document.getElementById('userName').value,
            correo: document.getElementById('userEmail').value,
            contrasena: document.getElementById('userPassword').value,
            rol: document.getElementById('userRole').value
        };

        const userId = document.getElementById('userId').value;
        const method = userId ? 'PUT' : 'POST';
        const url = userId ? `${API_URL}/${userId}` : API_URL;

        try {
            // Validación básica
            if (!userData.nombre || !userData.correo || !userData.rol) {
                throw new Error('Nombre, correo y rol son obligatorios');
            }

            if (!userId && !userData.contrasena) {
                throw new Error('La contraseña es requerida para nuevos usuarios');
            }

            const response = await fetch(url, {
                method,
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error en la operación');
            }

            showAlert(userId ? 'Usuario actualizado' : 'Usuario registrado');
            userForm.reset();
            loadUsers();
        } catch (error) {
            console.error('Error:', error);
            showAlert(error.message, 'error');
        }
    }

    async function confirmDelete() {
        if (!selectedUserId) return;
        
        try {
            const response = await fetch(`${API_URL}/${selectedUserId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Error al eliminar usuario');
            }
            
            showAlert('Usuario eliminado');
            loadUsers();
        } catch (error) {
            console.error('Error:', error);
            showAlert(error.message, 'error');
        } finally {
            closeModal();
            selectedUserId = null;
        }
    }

    function prepareNewUser() {
        userForm.reset();
        document.getElementById('userId').value = '';
        showAlert('Formulario listo para nuevo usuario', 'info');
    }

    function closeModal() {
        confirmModal.style.display = 'none';
    }

    function showAlert(message, type = 'success') {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type}`;
        alertDiv.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            ${message}
        `;
        
        const container = document.querySelector('.admin-main');
        container.prepend(alertDiv);
        
        setTimeout(() => {
            alertDiv.classList.add('fade-out');
            setTimeout(() => alertDiv.remove(), 500);
        }, 3000);
    }

    // Estilos dinámicos
    const style = document.createElement('style');
    style.textContent = `
        .alert {
            padding: 15px 20px;
            border-radius: 5px;
            color: white;
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 20px;
            box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
        }
        
        .alert-success {
            background-color: #2ecc71;
        }
        
        .alert-error {
            background-color: #e74c3c;
        }
        
        .alert-info {
            background-color: #3498db;
        }
        
        .fade-out {
            animation: fadeOut 0.5s ease-out forwards;
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