document.addEventListener('DOMContentLoaded', function () {
    const API_URL = 'http://localhost:3000/api/v1/universities';

    const form = document.getElementById('universityForm');
    const nombre = document.getElementById('universityName');
    const ubicacion = document.getElementById('universityLocation');
    const ranking = document.getElementById('universityRanking');
    const imagenUrl = document.getElementById('universityURL');
    const map_url = document.getElementById('universityMapURL');
    const tablaUniversidades = document.querySelector('#universitiesTable tbody');

    let universidades = [];

    loadUniversidades();

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const rankingValue = parseInt(ranking.value);
        if (isNaN(rankingValue)) {
            showAlert('El ranking debe ser un número válido', 'error');
            return;
        }

        const nuevaUniversidad = {
            nombre: nombre.value.trim(),
            ubicacion: ubicacion.value.trim(),
            ranking: rankingValue,
            imagen_url: imagenUrl.value.trim(),
            map_url: map_url.value.trim()
        };

        try {
            const res = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(nuevaUniversidad)
            });

            if (!res.ok) throw new Error('No se pudo registrar la universidad.');

            showAlert('Universidad registrada con éxito');
            form.reset();
            loadUniversidades();
        } catch (err) {
            console.error(err);
            showAlert('Error al registrar universidad', 'error');
        }
    });

    async function loadUniversidades() {
        try {
            const res = await fetch(API_URL);
            if (!res.ok) throw new Error('No se pudo obtener la lista de universidades');
            universidades = await res.json();
            renderUniversidades();
        } catch (err) {
            console.error(err);
            showAlert('Error al cargar universidades', 'error');
        }
    }

    function renderUniversidades() {
        tablaUniversidades.innerHTML = '';

        if (universidades.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = `<td colspan="5" style="text-align:center;">No hay universidades registradas</td>`;
            tablaUniversidades.appendChild(row);
            return;
        }

        universidades.forEach(uni => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${uni.id_universidad || ''}</td>
                <td>${uni.nombre}</td>
                <td>${uni.ubicacion}</td>
                <td>${uni.ranking}</td>
                <td><button class="btn-delete" data-id="${uni.id_universidad}"><i class="fas fa-trash-alt"></i> Eliminar</button></td>
            `;
            tablaUniversidades.appendChild(row);
        });

        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', () => deleteUniversidad(btn.dataset.id));
        });
    }

    async function deleteUniversidad(id) {
        if (!confirm('¿Estás seguro de eliminar esta universidad?')) return;

        try {
            const res = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            });

            if (!res.ok) throw new Error('No se pudo eliminar la universidad');

            showAlert('Universidad eliminada');
            loadUniversidades();
        } catch (err) {
            console.error(err);
            showAlert('Error al eliminar universidad', 'error');
        }
    }

    function showAlert(msg, type = 'success') {
        const alert = document.createElement('div');
        alert.textContent = msg;
        alert.className = `alert ${type === 'error' ? 'alert-danger' : 'alert-success'}`;
        document.body.appendChild(alert);
        setTimeout(() => alert.remove(), 3000);
    }
});
