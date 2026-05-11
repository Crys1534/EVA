import { db } from './firebase-config.js';
import { collection, addDoc, serverTimestamp } from "[https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js](https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js)";

const formTarea = document.getElementById('form-nueva-tarea');
const codigoActual = "QNT-501"; // El código de tu aula

formTarea.addEventListener('submit', async (e) => {
    e.preventDefault(); // Evita que la página se recargue al enviar

    // Capturamos los datos del formulario
    const titulo = document.getElementById('titulo-tarea').value;
    const descripcion = document.getElementById('desc-tarea').value;

    try {
        // "addDoc" crea un documento nuevo con un ID único automático
        const docRef = await addDoc(collection(db, "tareas"), {
            titulo: titulo,
            descripcion: descripcion,
            idClase: codigoActual,
            fecha: serverTimestamp(), // Fecha exacta del servidor
            estado: "activa"
        });

        alert("¡Tarea publicada con éxito! ID: " + docRef.id);
        formTarea.reset(); // Limpia el formulario
    } catch (error) {
        console.error("Error al publicar:", error);
        alert("Hubo un error al conectar con la base de datos.");
    }
});