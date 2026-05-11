import { db } from './firebase-config.js';
import { collection, query, where, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

const codigoClase = "QNT-501"; 
const feedTareas = document.getElementById('feed-tareas');

// Función que escucha las tareas en tiempo real
function cargarTareas() {
    // Buscamos tareas específicas de este grupo, ordenadas de la más nueva a la más vieja
    const q = query(collection(db, "tareas"), where("idClase", "==", codigoClase), orderBy("fecha", "desc"));

    onSnapshot(q, (snapshot) => {
        feedTareas.innerHTML = ''; 

        if (snapshot.empty) {
            feedTareas.innerHTML = '<p style="text-align: center; color: var(--text-muted); grid-column: 1 / -1;">No hay proyectos pendientes para esta semana.</p>';
            return;
        }

        snapshot.forEach((doc) => {
            const tarea = doc.data();
            
            // Lógica para asignar el color de la etiqueta según el campo formativo
            let claseCampo = "saberes";
            if(tarea.campo === "Lenguajes") claseCampo = "lenguajes";
            if(tarea.campo === "Etica") claseCampo = "etica";
            if(tarea.campo === "Humano") claseCampo = "humano";

            const htmlTarea = `
                <div class="task-card card">
                    <div class="task-header">
                        <span class="badge-formativo ${claseCampo}">${tarea.campo}</span>
                        <span class="badge-status pending">Pendiente</span>
                    </div>
                    <h3 class="task-title">${tarea.titulo}</h3>
                    <p class="task-desc">${tarea.descripcion}</p>
                    <button class="btn btn-action" onclick="alert('¡Excelente trabajo! Guardando evidencia...')">
                        <i class="fa-solid fa-upload"></i> Marcar como Entregado
                    </button>
                </div>
            `;
            
            feedTareas.innerHTML += htmlTarea;
        });
    });
}

// Inicializamos la carga para que esté lista cuando el alumno entre
cargarTareas();