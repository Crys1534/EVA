// 1. Lo primero que pasa al abrir la página: revisar si ya hay un nombre guardado
window.onload = function() {
    let alumnoGuardado = localStorage.getItem('nombreAlumno');
    if (alumnoGuardado) {
        // Si ya se había registrado antes, lo dejamos pasar directo al aula
        mostrarAula(alumnoGuardado);
        revisarInsignias();
    }
};

// 2. Función para guardar el nombre la primera vez que entran
function guardarNombre() {
    let nombre = document.getElementById('nombre-alumno').value;
    
    if (nombre !== "") {
        // Guardamos el nombre en la "mochila" del navegador
        localStorage.setItem('nombreAlumno', nombre);
        mostrarAula(nombre);
    } else {
        alert("¡Por favor, escribe tu nombre para poder entrar!");
    }
}

// 3. Función para cambiar de la pantalla de ingreso al tablero
function mostrarAula(nombre) {
    document.getElementById('seccion-ingreso').style.display = 'none';
    document.getElementById('seccion-aula').style.display = 'block';
    // Personalizamos el saludo
    document.getElementById('saludo-alumno').innerText = "¡Hola, " + nombre + "!";
}

// 4. Función para guardar que ya terminaron un proyecto/actividad
function marcarCompletado(idActividad) {
    // Guardamos en la mochila que esta actividad específica está completada
    localStorage.setItem(idActividad, 'completado');
    alert("¡Excelente trabajo! Has ganado una nueva insignia.");
    
    // Actualizamos la pantalla para que la insignia brille
    revisarInsignias(); 
}

// 5. Función que revisa la mochila y enciende las insignias ganadas
function revisarInsignias() {
    let estadoSaberes1 = localStorage.getItem('pda_saberes_1');

    if (estadoSaberes1 === 'completado') {
        let insignia = document.getElementById('insignia-saberes-1');
        // Le quitamos lo gris y la ponemos a color
        insignia.classList.remove('bloqueada');
        insignia.classList.add('desbloqueada');
    }
}