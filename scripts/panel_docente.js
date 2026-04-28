// Importa tus funciones de Firebase aquí (Firestore y Auth)

const generarPinUnico = () => {
    return Math.floor(10000 + Math.random() * 90000).toString();
};

window.guardarAula = async () => {
    const escuela = document.getElementById('escuela-nombre').value;
    const grado = document.getElementById('grado-num').value;
    const seccion = document.getElementById('seccion-letra').value;

    if(!escuela || !grado || !seccion) return alert("LLENA TODOS LOS BLOQUES");

    console.log("Guardando aula en Firebase...");
    // Lógica Firebase:
    // await addDoc(collection(db, "aulas"), { escuela, grado, seccion, docenteId: user.uid });
    
    document.getElementById('crear-aula-section').classList.add('hidden');
    document.getElementById('alumnos-section').classList.remove('hidden');
    document.getElementById('titulo-aula').innerText = `AULA: ${grado}º ${seccion} - ${escuela}`;
};

window.agregarAlumno = async () => {
    const nombre = document.getElementById('nombre-alumno').value;
    if(!nombre) return;

    const pin = generarPinUnico();
    
    // Guardar en Firestore dentro de la colección 'alumnos'
    console.log(`Registrando a ${nombre} con el PIN: ${pin}`);

    const tbody = document.getElementById('lista-alumnos-body');
    const row = `<tr>
        <td>${nombre.toUpperCase()}</td>
        <td class="pin-code">${pin}</td>
    </tr>`;
    tbody.innerHTML += row;
    
    document.getElementById('nombre-alumno').value = "";
};