// 1. Importar las funciones de Firebase directamente desde internet (CDN)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

// 2. PEGA AQUÍ TU CONFIGURACIÓN (Reemplaza este bloque de ejemplo por el tuyo)
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
const auth = getAuth(app);
const db = getFirestore(app);

// Variables de estado
let modoRegistroDocente = false;

// Funciones de Navegación de la UI
window.showLogin = (role) => {
    document.getElementById('role-selection').classList.add('hidden');
    if(role === 'docente') {
        document.getElementById('login-docente').classList.remove('hidden');
    } else {
        document.getElementById('login-estudiante').classList.remove('hidden');
    }
}

window.resetView = () => {
    document.getElementById('login-docente').classList.add('hidden');
    document.getElementById('login-estudiante').classList.add('hidden');
    document.getElementById('role-selection').classList.remove('hidden');
}

window.toggleDocenteAuth = () => {
    modoRegistroDocente = !modoRegistroDocente;
    document.getElementById('docente-action-title').innerText = 
        modoRegistroDocente ? "CREAR CUENTA" : "INICIAR SESIÓN";
}

// 4. LÓGICA DE DOCENTE (CON FIREBASE AUTH)
window.authDocente = async () => {
    const email = document.getElementById('doc-user').value;
    const pass = document.getElementById('doc-pass').value;

    // Validación 1: Que no estén vacíos
    if(!email || !pass) {
        alert("Por favor, llena los bloques de correo y contraseña.");
        return;
    }

    // Validación 2: Que la contraseña sea de al menos 6 caracteres (Solo al registrar)
    if(modoRegistroDocente && pass.length < 6) {
        alert("¡Tu contraseña estilo bloque debe tener al menos 6 caracteres!");
        return; 
    }

    try {
        if(modoRegistroDocente) {
            console.log("Registrando maestro en la base de datos...");
            await createUserWithEmailAndPassword(auth, email, pass);
            alert("¡Cuenta creada con éxito! Entrando al sistema...");
        } else {
            console.log("Comprobando credenciales...");
            await signInWithEmailAndPassword(auth, email, pass);
        }
        
        // Si todo sale bien, viajamos al panel:
        window.location.href = "panel_docente.html";

    } catch (error) {
        console.error("Error de Firebase:", error.code);
        
        // Manejo de errores amigable
        if(error.code === 'auth/email-already-in-use') {
            alert("Ese correo ya está registrado. Intenta iniciar sesión.");
        } else if(error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
            alert("Contraseña o correo incorrectos.");
        } else {
            alert("Hubo un error de conexión: " + error.message);
        }
    }
}

// 5. LÓGICA DE ESTUDIANTE (CON FIRESTORE)
window.loginEstudiante = async () => {
    const pin = document.getElementById('student-pin').value;
    
    if(pin.length !== 5) {
        alert("¡EL PIN DEBE SER DE 5 NÚMEROS EXACTOS!");
        return;
    }

    try {
        // Buscamos en la colección "alumnos" un documento que tenga este PIN
        const q = query(collection(db, "alumnos"), where("pin", "==", pin));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
            // El alumno existe
            querySnapshot.forEach((doc) => {
                const datosAlumno = doc.data();
                alert(`¡Bienvenido ${datosAlumno.nombre}! Preparando tu mundo...`);
                // Aquí guardaremos sus datos en sesión y lo enviaremos al feed
                // sessionStorage.setItem('alumnoActivo', JSON.stringify(datosAlumno));
                // window.location.href = "feed.html";
            });
        } else {
            alert("CÓDIGO NO ENCONTRADO. Pregúntale a tu profe por tu PIN.");
        }
    } catch (error) {
        console.error("Error buscando PIN:", error);
        alert("Error de conexión al buscar el código.");
    }
}