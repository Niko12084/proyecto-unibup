document.addEventListener('DOMContentLoaded', function () {
    const API_URL = 'http://localhost:3000/api/v1/careers'; // Ajusta si es diferente
    const form = document.querySelector('form');
    const nombre = document.querySelector('input[placeholder="Ingrese el nombre de la universidad"]');
    const descripcion = document.querySelector('textarea');
    const duracion = document.querySelector('input[placeholder="Ej: 4 años"]');
    const costo = document.querySelector('input[placeholder="Ej: $2000"]');
    const guardarBtn = document.querySelector('button[type="submit"]');
    const limpiarBtn = document.querySelector('button[type="button"]');
    const tablaCarreras = document.querySelector('table tbody');

    let carreras = [];

    // Cargar carreras al inicio
    loadCarreras();

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nuevaCarrera = {
            nombre: nombre.value,
            descripcion: descripcion.value,
            duracion: duracion.value,
            costo_estimado: parseFloat(costo.value.replace(/\$/g, '').replace(',', ''))
        };

        try {
            const res = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(nuevaCarrera)
            });

            if (!res.ok) throw new Error('No se pudo registrar la carrera.');

            showAlert('Carrera registrada con éxito');
            form.reset();
            loadCarreras();
        } catch (err) {
            console.error(err);
            showAlert('Error al registrar carrera', 'error');
        }
    });

    limpiarBtn.addEventListener('click', () => {
        form.reset();
    });

    async function loadCarreras() {
        try {
            const res = await fetch(API_URL);
            if (!res.ok) throw new Error('No se pudo obtener la lista de carreras');

            carreras = await res.json();
            renderCarreras();
        } catch (err) {
            console.error(err);
            showAlert('Error al cargar carreras', 'error');
        }
    }

    function renderCarreras() {
        tablaCarreras.innerHTML = '';

        if (carreras.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = `<td colspan="5" style="text-align:center;">No hay carreras registradas</td>`;
            tablaCarreras.appendChild(row);
            return;
        }

        carreras.forEach(carrera => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${carrera.id_carrera}</td>
                <td>${carrera.nombre}</td>
                <td>${carrera.descripcion}</td>
                <td>${carrera.duracion} años</td>
                <td>$${parseFloat(carrera.costo_estimado).toLocaleString()}</td>
                <td>${new Date(carrera.fecha_creacion).toLocaleDateString()}</td>
                <td>
                    <button class="btn-delete" delete-btn" data-id="${carrera.id_carrera}"><i class="fas fa-trash-alt"></i> Eliminar</button>
                </td>
            `;
            tablaCarreras.appendChild(row);
        });

        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', () => deleteCarrera(btn.dataset.id));
        });
    }

    async function deleteCarrera(id) {
        if (!confirm('¿Estás seguro de eliminar esta carrera?')) return;

        try {
            const res = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            });

            if (!res.ok) throw new Error('No se pudo eliminar la carrera');

            showAlert('Carrera eliminada');
            loadCarreras();
        } catch (err) {
            console.error(err);
            showAlert('Error al eliminar carrera', 'error');
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
