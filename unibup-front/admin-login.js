document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');

    // Mostrar/ocultar contraseña
    togglePassword.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        this.classList.toggle('fa-eye-slash');
    });

    // Validación del formulario
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        showLoading();

        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();

        if (!username || !password) {
            showError('Todos los campos son obligatorios');
            return;
        }

        if (!validateEmail(username)) {
            showError('Por favor ingresa un correo electrónico válido');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ correo: username, contrasena: password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Credenciales incorrectas');
            }

            localStorage.setItem('token', data.token);
            window.location.href = 'university-form.html';
            
        } catch (error) {
            console.error('Error:', error);
            showError(error.message || 'No se pudo conectar con el servidor');
        } finally {
            resetLoading();
        }
    });

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function showError(message) {
        let errorElement = document.querySelector('.error-message');

        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            loginForm.appendChild(errorElement);
        }

        errorElement.textContent = message;
        errorElement.style.display = 'block';

        loginForm.classList.add('shake');
        setTimeout(() => {
            loginForm.classList.remove('shake');
        }, 500);
    }

    function showLoading() {
        const btn = document.querySelector('.login-btn');
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verificando...';
        btn.disabled = true;
    }

    function resetLoading() {
        const btn = document.querySelector('.login-btn');
        btn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Ingresar';
        btn.disabled = false;
    }
});

const style = document.createElement('style');
style.textContent = `
    .shake {
        animation: shake 0.5s;
    }

    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        20%, 60% { transform: translateX(-5px); }
        40%, 80% { transform: translateX(5px); }
    }

    .error-message {
        color: #e74c3c;
        background: #fde8e8;
        padding: 10px 15px;
        border-radius: 5px;
        margin-top: 15px;
        font-size: 14px;
        display: none;
    }
`;
document.head.appendChild(style);