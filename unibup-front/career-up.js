document.addEventListener("DOMContentLoaded", () => {
    const API_URL = "http://localhost:3000/api/v1/university-careers";
    const tabla = document.querySelector(".data-table tbody");
    const form = document.querySelector("#careerForm");
    const btnLimpiar = form.querySelector('button[type="reset"]');

    // 🟣 Cargar relaciones al iniciar
    loadRelaciones();

    async function loadRelaciones() {
        try {
            const response = await fetch("http://localhost:3000/api/v1/university-careers/1");
            if (!response.ok) throw new Error("Error al obtener datos del servidor");

            const data = await response.json();
            console.log("Relaciones cargadas:", data);

            tabla.innerHTML = "";

            if (!data || data.length === 0) {
                tabla.innerHTML = `<tr><td colspan="5">Sin datos disponibles</td></tr>`;
                return;
            }

            // 🔹 Mostrar filas
            data.forEach(rel => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${rel.id_universidad}</td>
                    <td>${rel.id_carrera}</td>
                    <td>${rel.requisitos}</td>
                    <td>${rel.puntaje_minimo}</td>
                    <td>
                        <button class="btn-delete" data-id="${rel.id}">
                            <i class="fas fa-trash"></i> Eliminar
                        </button>
                    </td>
                `;
                tabla.appendChild(row);
            });

            // 🔹 Agregar eventos de eliminación
            document.querySelectorAll(".btn-delete").forEach(btn => {
                btn.addEventListener("click", eliminarRelacion);
            });

        } catch (error) {
            console.error("Error al obtener los registros:", error);
        }
    }

    // 🟣 Crear nueva relación (POST)
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const id_carrera = document.querySelector("#careerId").value.trim();
        const id_universidad = document.querySelector("#universityId").value.trim();
        const requisitos = document.querySelector("#requirements").value.trim();
        const puntaje_minimo = document.querySelector("#minScore").value.trim();

        if (!id_carrera || !id_universidad || !requisitos || !puntaje_minimo) {
            alert("Por favor completa todos los campos.");
            return;
        }

        const nuevaRelacion = {
            id_carrera: Number(id_carrera),
            id_universidad: Number(id_universidad),
            requisitos,
            puntaje_minimo: Number(puntaje_minimo)
        };

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(nuevaRelacion)
            });

            if (!response.ok) throw new Error("Error al registrar la relación.");

            alert("Relación registrada correctamente.");
            form.reset();
            loadRelaciones();
        } catch (error) {
            console.error("Error al guardar la relación:", error);
        }
    });

    // 🟣 Eliminar relación (DELETE)
    async function eliminarRelacion(e) {
        const id = e.target.closest("button").dataset.id;
        if (!confirm("¿Seguro que deseas eliminar esta relación?")) return;

        try {
            const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
            if (!response.ok) throw new Error("Error al eliminar relación.");

            alert("Relación eliminada correctamente.");
            loadRelaciones();
        } catch (error) {
            console.error("Error al eliminar:", error);
        }
    }

    // 🟣 Limpiar formulario
    btnLimpiar.addEventListener("click", () => form.reset());
});
