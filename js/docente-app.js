import { db } from './firebase-config.js';
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

const formPublicar = document.getElementById('form-publicar');
const feedDocente = document.getElementById('lista-tareas-docente');
const codigoActual = "QNT-501"; // El código de tu grupo

// 1. PUBLICAR NUEVO PROYECTO
formPublicar.addEventListener('submit', async (e) => {
    e.preventDefault(); 

    const titulo = document.getElementById('titulo-tarea').value;
    const campoFormativo = document.getElementById('campo-formativo').value;
    const descripcion = document.getElementById('desc-tarea').value;

    try {
        await addDoc(collection(db, "tareas"), {
            titulo: titulo,
            campo: campoFormativo,
            descripcion: descripcion,
            idClase: codigoActual,
            fecha: serverTimestamp(),
            estado: "activa"
        });

        alert("¡Proyecto publicado con éxito a tus alumnos!");
        formPublicar.reset(); 
    } catch (error) {
        console.error("Error:", error);
        alert("Hubo un error al publicar el proyecto.");
    }
});

// 2. MOSTRAR PROYECTOS ACTIVOS EN EL PANEL DEL DOCENTE
const q = query(collection(db, "tareas"), orderBy("fecha", "desc"));

onSnapshot(q, (snapshot) => {
    if (snapshot.empty) {
        feedDocente.innerHTML = `
            <div class="empty-state">
                <i class="fa-solid fa-box-open"></i>
                <p>No has publicado proyectos aún.</p>
            </div>`;
        return;
    }

    feedDocente.innerHTML = ''; // Limpiamos para no duplicar

    snapshot.forEach((doc) => {
        const tarea = doc.data();
        // Asignamos una clase CSS basada en el campo formativo seleccionado
        const claseColor = tarea.campo.toLowerCase().split(' ')[0]; 

        feedDocente.innerHTML += `
            <div class="card" style="margin-bottom: 1rem; border-left: 4px solid var(--primary);">
                <div style="display: flex; justify-content: space-between;">
                    <span style="font-size: 0.8rem; font-weight: bold; color: var(--primary); text-transform: uppercase;">
                        ${tarea.campo}
                    </span>
                </div>
                <h3 style="margin: 0.5rem 0;">${tarea.titulo}</h3>
                <p style="color: var(--text-muted); font-size: 0.95rem;">${tarea.descripcion}</p>
            </div>
        `;
    });
});