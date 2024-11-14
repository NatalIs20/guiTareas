// URL del servidor backend en Flask
const API_URL = 'https://apitareas-ku14.onrender.com/tareas';

// Función para obtener todas las tareas
async function obtenerTareas() {
    try {
        const response = await fetch(`${API_URL}`);
        const tareas = await response.json();
        const tareasTabla = document.getElementById('tareasTabla');
        tareasTabla.innerHTML = ''; // Limpiar la tabla antes de añadir nuevas filas

        tareas.forEach(tarea => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td><span>${tarea.id}</span></td>
                <td><input type="text" class="form-control form-control-sm" value="${tarea.titulo}" id="titulo-${tarea.id}"></td>
                <td><input type="text" class="form-control form-control-sm" value="${tarea.descripcion || ''}" id="descripcion-${tarea.id}"></td>
                <td><input type="checkbox" class="form-check-input" id="completada-${tarea.id}" ${tarea.completada ? 'checked' : ''}></td>
                <td>
                    <div class="btn-container">
                        <button onclick="guardarCambios('${tarea.id}')" class="btn btn-primary btn-sm">Guardar Cambios</button>
                        <button onclick="eliminarTarea('${tarea.id}')" class="btn btn-danger btn-sm">Eliminar</button>
                    </div>
                </td>
            `;
            tareasTabla.appendChild(fila);
        });
    } catch (error) {
        console.error('Error al obtener tareas:', error);
    }
}

// Función para crear una tarea
async function crearTarea() {
    const tituloInput = document.getElementById('titulo');
    const descripcionInput = document.getElementById('descripcion');
    const titulo = tituloInput.value;
    const descripcion = descripcionInput.value;

    if (!titulo) {
        alert('El título es obligatorio');
        return;
    }

    try {
        const response = await fetch(`${API_URL}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ titulo, descripcion })
        });

        if (response.ok) {
            tituloInput.value = '';
            descripcionInput.value = ''; // Limpiar el campo de entrada
            obtenerTareas(); // Recargar la lista de tareas
            alert('Tarea ingresada correctamente');
        } else {
            const error = await response.json();
            alert(error.error);
        }
    } catch (error) {
        console.error('Error al crear tarea:', error);
    }
}

// Función para guardar cambios en una tarea
async function guardarCambios(id) {
    const nuevoTitulo = document.getElementById(`titulo-${id}`).value;
    const nuevaDescripcion = document.getElementById(`descripcion-${id}`).value;
    const nuevaCompletada = document.getElementById(`completada-${id}`).checked;

    if (!nuevoTitulo) {
        alert('El título no puede estar vacío');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ titulo: nuevoTitulo, descripcion: nuevaDescripcion, completada: nuevaCompletada })
        });

        if (response.ok) {
            obtenerTareas();
            alert('Cambios guardados correctamente');
            if (nuevaCompletada) {
                alert('Tarea completada');
            }
        } else {
            const error = await response.json();
            alert(error.error);
        }
    } catch (error) {
        console.error('Error al actualizar tarea:', error);
    }
}

// Función para eliminar una tarea
async function eliminarTarea(id) {
    if (confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                obtenerTareas();
                alert('Tarea eliminada');
            } else {
                const error = await response.json();
                alert(error.error);
            }
        } catch (error) {
            console.error('Error al eliminar tarea:', error);
        }
    }
}

// Obtener las tareas al cargar la página
document.addEventListener('DOMContentLoaded', obtenerTareas);
