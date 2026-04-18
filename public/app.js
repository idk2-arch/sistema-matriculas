
const API_ESTUDIANTE   = "http://localhost/Matriculas/api/estudiante.php";
const API_DOCENTE      = "http://localhost/Matriculas/api/docente.php";
const API_CURSO        = "http://localhost/Matriculas/api/curso.php";
const API_MATRICULA    = "http://localhost/Matriculas/api/matriculas.php";   
const API_CALIFICACION = "http://localhost/Matriculas/api/calificacion.php";


async function apiRequest(url, options = {}) {
    try {
        const res = await fetch(url, options);
        
        if (!res.ok) {
            let errorMsg = `HTTP ${res.status}`;
            try {
                const errData = await res.json();
                errorMsg += `: ${errData.error || res.statusText}`;
            } catch (e) {
                errorMsg += `: ${res.statusText}`;
            }
            throw new Error(errorMsg);
        }
        
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            return await res.json();
        }
        return await res.text();
    } catch (e) {
        console.error("Error en API:", e);
        alert("Error: " + e.message);
        throw e;
    }
}



async function cargarEstudiantes() {
    try {
        const data = await apiRequest(API_ESTUDIANTE);
        const tbody = document.querySelector("#tablaEstudiantes tbody");
        tbody.innerHTML = "";

        data.forEach(est => {
            tbody.innerHTML += `
                <tr>
                    <td>${est.id_estudiante || ''}</td>
                    <td>${est.nombre || ''}</td>
                    <td>${est.apellido || ''}</td>
                    <td>${est.fecha_nacimiento || ''}</td>
                    <td>${est.telefono || ''}</td>
                    <td>
                        <button class="btn btn-danger btn-sm me-1" onclick="eliminarEstudiante(${est.id_estudiante || 0})">Eliminar</button>
                        <button class="btn btn-warning btn-sm" onclick="editarEstudiante(${est.id_estudiante || 0}, '${(est.nombre || '').replace(/'/g, "\\'")}', '${(est.apellido || '').replace(/'/g, "\\'")}', '${est.fecha_nacimiento || ''}', '${est.telefono || ''}')">Editar</button>
                    </td>
                </tr>`;
        });
        cargarListaEstudiantes();
    } catch (e) {
        console.error("Error cargando estudiantes:", e);
    }
}

async function crearEstudiante() {
    const nombre = document.getElementById("nombre").value.trim();
    const apellido = document.getElementById("apellido").value.trim();
    const fecha = document.getElementById("fecha").value;
    const telefono = document.getElementById("telefono").value.trim();

    if (!nombre || !apellido) return alert("Nombre y apellido son obligatorios");

    await apiRequest(API_ESTUDIANTE, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ nombre, apellido, fecha_nacimiento: fecha, telefono })
    });

    limpiarEstudiante();
    cargarEstudiantes();
}

function limpiarEstudiante() {
    document.getElementById("nombre").value = "";
    document.getElementById("apellido").value = "";
    document.getElementById("fecha").value = "";
    document.getElementById("telefono").value = "";
}

async function eliminarEstudiante(id) {
    if (!confirm("¿Eliminar estudiante?")) return;
    await apiRequest(API_ESTUDIANTE + "?id=" + id, { method: "DELETE" });
    cargarEstudiantes();
}

function editarEstudiante(id, nombre, apellido, fecha, telefono) {
    const nNombre = prompt("Nuevo nombre:", nombre);
    const nApellido = prompt("Nuevo apellido:", apellido);
    const nFecha = prompt("Nueva fecha (YYYY-MM-DD):", fecha);
    const nTelefono = prompt("Nuevo teléfono:", telefono);
    
    if (nNombre && nApellido) {
        apiRequest(API_ESTUDIANTE, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, nombre: nNombre, apellido: nApellido, fecha_nacimiento: nFecha, telefono: nTelefono })
        }).then(() => cargarEstudiantes());
    }
}








async function cargarDocentes() {
    try {
        const data = await apiRequest(API_DOCENTE);
        const tbody = document.querySelector("#tablaDocentes tbody");
        tbody.innerHTML = "";
        data.forEach(d => {
            tbody.innerHTML += `<tr>
                <td>${d.id_docente || ''}</td>
                <td>${d.nombre || ''}</td>
                <td>${d.apellido || ''}</td>
                <td>${d.especialidad || ''}</td>
                <td>${d.telefono || ''}</td>
                <td><button class="btn btn-danger btn-sm" onclick="eliminarDocente(${d.id_docente || 0})">Eliminar</button></td>
            </tr>`;
        });
        cargarListaDocentes();
    } catch (e) {
        console.error("Error cargando docentes:", e);
    }
}




async function cargarCursos() {
    try {
        const data = await apiRequest(API_CURSO);
        const tbody = document.querySelector("#tablaCursos tbody");
        tbody.innerHTML = "";
        data.forEach(c => {
            tbody.innerHTML += `<tr>
                <td>${c.id_curso || ''}</td>
                <td>${c.nombre_curso || ''}</td>
                <td>${c.area || ''}</td>
                <td>${c.grado || ''}</td>
                <td>${c.docente_nombre || 'Sin asignar'}</td>
                <td><button class="btn btn-danger btn-sm" onclick="eliminarCurso(${c.id_curso || 0})">Eliminar</button></td>
            </tr>`;
        });
        cargarListaCursos();
    } catch (e) {
        console.error("Error cargando cursos:", e);
    }
}
async function cargarSelectDocentesEnCursos() {
    try {
        const data = await apiRequest(API_DOCENTE);
        const select = document.getElementById("cur_docente");
        select.innerHTML = '<option value="0">Seleccionar Docente</option>';

        data.forEach(d => {
            const nombreCompleto = `${d.nombre} ${d.apellido}`;
            select.innerHTML += `<option value="${d.id_docente}">${nombreCompleto}</option>`;
        });
    } catch (e) {
        console.error("Error cargando docentes en cursos:", e);
    }
}




async function cargarMatriculas() {
    const tbody = document.querySelector("#tablaMatriculas tbody");
    tbody.innerHTML = `<tr><td colspan="6" class="text-center py-3">Cargando matrículas...</td></tr>`;

    try {
        const data = await apiRequest(API_MATRICULA);
        tbody.innerHTML = "";

        if (!data || data.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" class="text-center py-3">No hay matrículas registradas</td></tr>`;
            return;
        }

        data.forEach(m => {
            const id = m.id_matricula || 0;
            tbody.innerHTML += `
                <tr>
                    <td>${id}</td>
                    <td>${m.estudiante || '---'}</td>
                    <td>${m.curso || '---'}</td>
                    <td>${m.fecha_matricula || ''}</td>
                    <td><span class="badge bg-success">${m.estado || 'Activa'}</span></td>
                    <td><button class="btn btn-danger btn-sm" onclick="eliminarMatricula(${id})">Eliminar</button></td>
                </tr>`;
        });
    } catch (e) {
        console.error("Error cargando matrículas:", e);
        tbody.innerHTML = `<tr><td colspan="6" class="text-center py-3 text-danger">Error al cargar matrículas</td></tr>`;
    }
}

async function crearMatricula() {
    const id_estudiante = document.getElementById("mat_estudiante").value;
    const id_curso = document.getElementById("mat_curso").value;
    const estado = document.getElementById("mat_estado").value || 'Activa';

    if (id_estudiante == 0 || id_curso == 0) {
        return alert("❌ Debe seleccionar estudiante y curso");
    }

    try {
        await apiRequest(API_MATRICULA, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                id_estudiante,
                id_curso,
                estado,
                fecha_matricula: new Date().toISOString().split('T')[0]
            })
        });

        alert("✅ Matrícula creada correctamente");
        cargarMatriculas();
    } catch (e) {
        console.error("Error creando matrícula:", e);
        alert("❌ Error al crear la matrícula");
    }
}

async function eliminarMatricula(id) {
    if (!confirm("¿Eliminar esta matrícula?")) return;
    try {
        await apiRequest(API_MATRICULA + "?id=" + id, { method: "DELETE" });
        cargarMatriculas();
    } catch (e) {
        console.error("Error eliminando matrícula:", e);
        alert("❌ Error al eliminar la matrícula");
    }
}




async function cargarCalificaciones() {
    try {
        const data = await apiRequest(API_CALIFICACION);
        const tbody = document.querySelector("#tablaCalificaciones tbody");
        tbody.innerHTML = "";

        if (!data || data.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" class="text-center py-3">No hay calificaciones registradas</td></tr>`;
            return;
        }

        data.forEach(cal => {
            const id = cal.id_calificacion || 0;
            tbody.innerHTML += `
                <tr>
                    <td>${id}</td>
                    <td>${cal.estudiante_nombre || ''} ${cal.estudiante_apellido || ''}</td>
                    <td>${cal.nombre_curso || ''}</td>
                    <td><strong>${cal.nota || ''}</strong></td>
                    <td>${cal.periodo || ''}</td>
                    <td>${cal.observacion || ''}</td>
                    <td><button class="btn btn-danger btn-sm" onclick="eliminarCalificacion(${id})">Eliminar</button></td>
                </tr>`;
        });
    } catch (e) {
        console.error("Error cargando calificaciones:", e);
    }
}

async function crearCalificacion() {
    const id_matricula = document.getElementById("cal_matricula").value;
    const nota = parseFloat(document.getElementById("cal_nota").value);
    const periodo = document.getElementById("cal_periodo").value.trim() || '1';
    const observacion = document.getElementById("cal_observacion") ? document.getElementById("cal_observacion").value.trim() : '';

    if (id_matricula == 0 || isNaN(nota) || nota < 0 || nota > 100) {
        return alert("❌ Seleccione una matrícula y escriba una nota válida (0-100)");
    }

    try {
        await apiRequest(API_CALIFICACION, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({ nota, periodo, observacion, id_matricula })
        });

        alert("✅ Calificación guardada correctamente");
        cargarCalificaciones();
        document.getElementById("cal_nota").value = "";
    } catch (e) {
        console.error("Error guardando calificación:", e);
        alert("❌ Error al guardar la calificación");
    }
}

async function eliminarCalificacion(id) {
    if (!confirm("¿Eliminar calificación?")) return;
    await apiRequest(API_CALIFICACION + "?id=" + id, { method: "DELETE" });
    cargarCalificaciones();
}


async function cargarSelectEstudiantes() {
    try {
        const data = await apiRequest(API_ESTUDIANTE);
        const select = document.getElementById("mat_estudiante");
        select.innerHTML = '<option value="0">Seleccionar Estudiante</option>';
        data.forEach(est => {
            select.innerHTML += `<option value="${est.id_estudiante}">${est.nombre} ${est.apellido}</option>`;
        });
    } catch (e) { console.error(e); }
}

async function cargarSelectCursos() {
    try {
        const data = await apiRequest(API_CURSO);
        const select = document.getElementById("mat_curso");
        select.innerHTML = '<option value="0">Seleccionar Curso</option>';
        data.forEach(cur => {
            select.innerHTML += `<option value="${cur.id_curso}">${cur.nombre_curso} (${cur.grado})</option>`;
        });
    } catch (e) { console.error(e); }
}

async function cargarSelectMatriculas() {
    try {
        const data = await apiRequest(API_MATRICULA);
        const select = document.getElementById("cal_matricula");
        select.innerHTML = '<option value="0">Seleccionar Matrícula</option>';

        if (!data || data.length === 0) {
            select.innerHTML += '<option value="0" disabled>No hay matrículas registradas</option>';
            return;
        }

        data.forEach(m => {
            const texto = `${m.estudiante || '---'} - ${m.curso || '---'} (${m.fecha_matricula || ''})`;
            select.innerHTML += `<option value="${m.id_matricula}">${texto}</option>`;
        });
    } catch (e) { console.error(e); }
}

async function cargarListaEstudiantes() {
    try {
        const data = await fetch(API_ESTUDIANTE + "?lista=1").then(res => res.json());
        const ul = document.getElementById("listaEstudiantes");
        ul.innerHTML = data.map(n => `<li class="list-group-item">${n}</li>`).join('');
        console.log("Lista Estudiantes cargada:", data);
    } catch (e) {
        console.error("Error estudiantes:", e);
    }
}

async function cargarListaDocentes() {
    try {
        const data = await fetch(API_DOCENTE + "?lista=1").then(res => res.json());
        const ul = document.getElementById("listaDocentes");
        ul.innerHTML = data.map(n => `<li class="list-group-item">${n}</li>`).join('');
        console.log("Lista Docentes cargada:", data);
    } catch (e) {
        console.error("Error docentes:", e);
    }
}

async function cargarListaCursos() {
    try {
        const data = await fetch(API_CURSO + "?lista=1").then(res => res.json());
        const ul = document.getElementById("listaCursos");
        ul.innerHTML = data.map(n => `<li class="list-group-item">${n}</li>`).join('');
        console.log("Lista Cursos cargada:", data);
    } catch (e) {
        console.error("Error cursos:", e);
    }
}
///INICIO
document.addEventListener("DOMContentLoaded", async () => {
    cargarEstudiantes();
    cargarDocentes();
    cargarCursos();
    cargarMatriculas();
    cargarCalificaciones();

    await cargarSelectEstudiantes();
    await cargarSelectCursos();
    await cargarSelectMatriculas();

    
    await cargarSelectDocentesEnCursos();
    await cargarListaEstudiantes();
    await cargarListaDocentes();
    await cargarListaCursos();
});