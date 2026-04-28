// 1. Importaciones de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

// 2. CONFIGURACIÓN DE FIREBASE
const firebaseConfig = {
  apiKey: "AIzaSyBnX__R6A6lQw_KuzZxqHRkzZyj10S_4wU",
  authDomain: "aula-virtual-79e4d.firebaseapp.com",
  projectId: "aula-virtual-79e4d",
  storageBucket: "aula-virtual-79e4d.firebasestorage.app",
  messagingSenderId: "384731632952",
  appId: "1:384731632952:web:9b4facff98bc7f6ebf5dcd",
  measurementId: "G-SR9D2CJX40"
};

// 3. Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Variables globales para el estado del panel
let aulaIdActual = null; 
let usuarioActivo = null; // Guardará la info del docente de forma segura

// 4. SEGURIDAD: Verificar sesión antes de hacer cualquier cosa
onAuthStateChanged(auth, (user) => {
    if (!user) {
        // Si no hay profe, de vuelta al inicio
        window.location.href = "index.html";
    } else {
        // Si sí hay profe, guardamos sus datos
        usuarioActivo = user;
    }
});

// Función para generar el código secreto
const generarPinUnico = () => {
    return Math.floor(10000 + Math.random() * 90000).toString();
};

// 5. CREAR EL AULA (Guardar en Firestore)
window.guardarAula = async () => {
    const escuela = document.getElementById('escuela-nombre').value;
    const grado = document.getElementById('grado-num').value;
    const seccion = document.getElementById('seccion-letra').value;

    if(!escuela || !grado || !seccion) return alert("LLENA TODOS LOS BLOQUES");
    
    // Si la sesión aún no carga por el internet, esperamos
    if(!usuarioActivo) return alert("Cargando tu sesión, por favor espera un segundo e intenta de nuevo.");

    try {
        console.log("Creando el mundo en Firestore...");
        
        // Creamos un documento en la colección "aulas"
        const docRef = await addDoc(collection(db, "aulas"), {
            escuela: escuela,
            grado: parseInt(grado),
            seccion: seccion.toUpperCase(),
            docenteId: usuarioActivo.uid // Usamos el ID seguro que nos dio Firebase
        });
        
        aulaIdActual = docRef.id; // Guardamos la llave de esta aula

        // Cambiamos la vista de creación a la vista de alumnos
        document.getElementById('crear-aula-section').classList.add('hidden');
        document.getElementById('alumnos-section').classList.remove('hidden');
        document.getElementById('titulo-aula').innerText = `AULA: ${grado}º ${seccion} - ${escuela}`;
    } catch (error) {
        console.error("Error al crear aula:", error);
        alert("Hubo un error al conectar con la base de datos.");
    }
};

// 6. REGISTRAR ALUMNOS (Guardar en Firestore)
window.agregarAlumno = async () => {
    const nombre = document.getElementById('nombre-alumno').value;
    if(!nombre) return;

    const pin = generarPinUnico();
    
    try {
        console.log(`Registrando a ${nombre} en la base de datos...`);
        
        // Guardamos al alumno en "alumnos" con sus stats iniciales
        await addDoc(collection(db, "alumnos"), {
            nombre: nombre,
            pin: pin,
            aulaId: aulaIdActual, // Lo vinculamos a tu aula recién creada
            monedas: 0,           // Economía en cero
            nivel: 1,             // Nivel inicial
            xp: 0                 // Experiencia en cero
        });

        // Lo agregamos visualmente a la tabla HTML
        const tbody = document.getElementById('lista-alumnos-body');
        const row = `<tr>
            <td>${nombre.toUpperCase()}</td>
            <td class="pin-code">${pin}</td>
        </tr>`;
        tbody.innerHTML += row;
        
        // Limpiamos la caja de texto para el siguiente niño
        document.getElementById('nombre-alumno').value = "";
    } catch (error) {
        console.error("Error al registrar alumno:", error);
        alert("Error al guardar al alumno en la base de datos.");
    }
};

// 7. CERRAR SESIÓN
window.cerrarSesion = () => {
    signOut(auth).then(() => {
        window.location.href = "index.html";
    });
};