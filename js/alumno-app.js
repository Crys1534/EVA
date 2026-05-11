import { db } from './firebase-config.js';
import { collection, query, where, onSnapshot } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

// El código de tu grupo 
const codigoClase = "QNT-501"; 
const feedTareas = document.getElementById('feed-tareas');

// 1. Función para unirse a la clase (Control de la interfaz)
window.unirseClase = function() {
    const inputCodigo = document.getElementById('input-codigo').value.trim().toUpperCase();
    
    if(inputCodigo === codigoClase) {
        // Ocultamos la pantalla de ingreso y mostramos el tablero
        document.getElementById('seccion-unirse').style.display = 'none';
        document.getElementById('tablero-alumno').style.display = 'block';
    } else {
        alert("Código incorrecto. Asegúrate de escribir el código exacto.");
    }
}

// 2. Escuchar las tareas en tiempo real
// Creamos una "consulta" para traer solo las tareas que coincidan con este grupo
const q = query(collection(db, "tareas"), where("idClase", "==", codigoClase));

// onSnapshot es la magia: se ejecuta automáticamente cada vez que hay un cambio en la base de datos
onSnapshot(q, (snapshot) => {
    feedTareas.innerHTML = ''; // Limpiamos el panel antes de actualizar para no duplicar

    if (snapshot.empty) {
        feedTareas.innerHTML = '<p style="text-align: center; color: var(--text-muted);">Aún no hay proyectos asignados para esta semana.</p>';
        return;
    }

    // Recorremos cada tarea que encontró en la nube
    snapshot.forEach((doc) => {
        const tarea = doc.data();
        
        // Diseñamos la tarjeta de la tarea inyectando los datos (titulo y descripcion)
        const htmlTarea = `
            <div class="card" style="border-left: 5px solid var(--primary-color);">
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                    <h3 style="color: var(--primary-color); margin-bottom: 0.5rem;">${tarea.titulo}</h3>
                    <span style="background: #FEF3C7; color: #D97706; padding: 0.2rem 0.8rem; border-radius: 20px; font-size: 0.8rem; font-weight: 600;">Pendiente</span>
                </div>
                <p style="margin-top: 0.5rem; color: var(--text-muted);">${tarea.descripcion}</p>
                <button class="btn" style="background-color: var(--success); margin-top: 1.5rem; width: 100%;">Marcar como completado</button>
            </div>
        `;
        
        // Agregamos la tarjeta al panel del alumno
        feedTareas.innerHTML += htmlTarea;
    });
});