document.addEventListener('DOMContentLoaded', function () {
    const API_URL = 'http://localhost:3000/api/v1/users';
    const userForm = document.getElementById('userForm');
    const searchInput = document.getElementById('searchInput');
    const usersTable = document.getElementById('usersTable').querySelector('tbody');
    const confirmModal = document.getElementById('confirmModal');
    let selectedUserId = null;

    if (userForm) userForm.addEventListener('submit', handleFormSubmit);
    if (searchInput) searchInput.addEventListener('input', () => loadUsers(searchInput.value));
    document.getElementById('confirmDelete')?.addEventListener('click', confirmDelete);
    document.getElementById('cancelDelete')?.addEventListener('click', closeModal);
    document.getElementById('newBtn')?.addEventListener('click', prepareNewUser);

    loadUsers();

    async function loadUsers(search = '') {
        try {
            let url = API_URL + (search ? `?search=${encodeURIComponent(search)}` : '');
            const response = await fetch(url, {
                headers: authHeaders()
            });

            if (!response.ok) throw new Error('Error al cargar usuarios');
            const users = await response.json();
            renderUsers(users);
        } catch (error) {
            console.error(error);
            showAlert(error.message, 'error');
        }
    }

    function renderUsers(users) {
        usersTable.innerHTML = '';

        if (!users.length) {
            usersTable.innerHTML = '<tr><td colspan="6">No se encontraron usuarios</td></tr>';
            return;
        }

        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.role}</td>
                <td>${new Date(user.created_at).toLocaleDateString()}</td>
                <td>
                    <button class="btn-danger delete-btn" data-id="${user.id}"><i class="fas fa-trash-alt"></i> Eliminar</button>
                </td>
            `;
            usersTable.appendChild(row);
        });

        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', () => loadUserForEdit(btn.dataset.id));
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                selectedUserId = btn.dataset.id;
                confirmModal.style.display = 'block';
            });
        });
    }

    async function handleFormSubmit(e) {
        e.preventDefault();

        const id = document.getElementById('userId')?.value;
        const isEdit = !!id;

        const name = document.getElementById('userName')?.value.trim();
        const email = document.getElementById('userEmail')?.value.trim();
        const role = document.getElementById('userRole')?.value;
        const password = document.getElementById('userPassword')?.value;
        const confirmPassword = document.getElementById('userConfirmPassword')?.value;

        if (!name || !email || !role) {
            showAlert('Nombre, correo electrónico y rol son obligatorios', 'error');
            return;
        }

        if (!isEdit && (!password || password !== confirmPassword)) {
            showAlert('Las contraseñas no coinciden o están vacías', 'error');
            return;
        }

        const userData = { name,  correo: email, rol: role };
        if (!isEdit) {
            userData.contrasena = password;
            userData.confirmar_contraseña = confirmPassword;
        } else if (password && password === confirmPassword) {
            userData.contrasena = password;
            userData.confirmar_contraseña = confirmPassword;
        }

        const url = isEdit ? `${API_URL}/${id}` : API_URL;

        try {
            const response = await fetch(url, {
                method: isEdit ? 'PUT' : 'POST',
                headers: authHeaders(),
                body: JSON.stringify(userData)
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.message || 'Error en la operación');
            }

            showAlert(isEdit ? 'Usuario actualizado' : 'Usuario registrado');
            resetForm();
            loadUsers();
        } catch (error) {
            console.error(error);
            showAlert(error.message, 'error');
        }
    }

    async function loadUserForEdit(id) {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                headers: authHeaders()
            });

            if (!response.ok) throw new Error('Error al cargar usuario');
            const user = await response.json();

            document.getElementById('userId').value = user.id;
            document.getElementById('userName').value = user.name;
            document.getElementById('userEmail').value = user.email;
            document.getElementById('userRole').value = user.role;
            document.getElementById('userPassword').value = '';
            document.getElementById('userConfirmPassword').value = '';

            showAlert('Usuario cargado para edición', 'info');
        } catch (error) {
            console.error(error);
            showAlert(error.message, 'error');
        }
    }

    async function confirmDelete() {
        if (!selectedUserId) return;

        try {
            const response = await fetch(`${API_URL}/${selectedUserId}`, {
                method: 'DELETE',
                headers: authHeaders()
            });

            if (!response.ok) throw new Error('Error al eliminar usuario');

            showAlert('Usuario eliminado');
            loadUsers();
        } catch (error) {
            console.error(error);
            showAlert(error.message, 'error');
        } finally {
            closeModal();
            selectedUserId = null;
        }
    }

    function resetForm() {
        userForm.reset();
        document.getElementById('userId').value = '';
    }

    function closeModal() {
        confirmModal.style.display = 'none';
    }

    function prepareNewUser() {
        resetForm();
        showAlert('Formulario listo para nuevo usuario', 'info');
    }

    function showAlert(message, type = 'success') {
        alert(`${type.toUpperCase()}: ${message}`);
    }

    function authHeaders() {
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        };
    }
});
