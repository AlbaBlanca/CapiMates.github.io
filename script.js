// Estados y Variables de control
let num1 = 0;
let num2 = 0;
let resultadoCorrecto = 0;
let operacionesAcertadas = 0;
const metaAciertos = 10;

let operacionesDisponibles = [];
let limiteMaximo = 20;

// Elementos de Pantallas
const pantallaConfig = document.getElementById('pantalla-configuracion');
const pantallaJuego = document.getElementById('pantalla-juego');
const pantallaPremio = document.getElementById('pantalla-premio');

// Botones e Inputs de Ajustes
const btnIniciar = document.getElementById('btn-iniciar');
const inputMaximo = document.getElementById('input-maximo');
const operadorVisual = document.getElementById('operador-visual');

// Elementos del juego
const elementoNum1 = document.getElementById('num1');
const elementoNum2 = document.getElementById('num2');
const inputRespuesta = document.getElementById('input-respuesta');
const barraProgreso = document.getElementById('barra-progreso');
const mensajeFeedback = document.getElementById('mensaje-feedback');

// Elementos del teclado numérico
const teclas = document.querySelectorAll('.tecla');

// Elementos de Recompensa
const areaCapibara = document.getElementById('area-capibara');
const btnReiniciar = document.getElementById('btn-reiniciar');
const efectoCaricia = document.getElementById('efecto-caricia');

// --- Flujo 1: Configurar e Iniciar Juego ---
btnIniciar.addEventListener('click', () => {
    // Escanea qué casillas están marcadas
    const checkboxes = document.querySelectorAll('.selector-operaciones input:checked');
    operacionesDisponibles = Array.from(checkboxes).map(cb => cb.value);
    limiteMaximo = parseInt(inputMaximo.value);

    if (operacionesDisponibles.length === 0) {
        alert("¡Selecciona com a mínimim una operació per a jugar! 🎯");
        return;
    }
    if (isNaN(limiteMaximo) || limiteMaximo < 5) {
        alert("Introdueix un número màxim vàlid (mínim 5).");
        return;
    }

    pantallaConfig.style.display = 'none';
    pantallaJuego.style.display = 'block';
    generarNuevaOperacion();
});

// --- Flujo 2: Generador de Operaciones Aleatorias Mixtas ---
function generarNuevaOperacion() {
    // Elige al azar una de las operaciones seleccionadas por el usuario
    const indiceAzar = Math.floor(Math.random() * operacionesDisponibles.length);
    const operacionActual = operacionesDisponibles[indiceAzar];
    let max = limiteMaximo;

    if (operacionActual === '+') {
        resultadoCorrecto = Math.floor(Math.random() * max) + 1;
        num1 = Math.floor(Math.random() * (resultadoCorrecto + 1));
        num2 = resultadoCorrecto - num1;
        operadorVisual.innerText = '+';
        
    } else if (operacionActual === '-') {
        num1 = Math.floor(Math.random() * max) + 1;
        num2 = Math.floor(Math.random() * (num1 + 1));
        resultadoCorrecto = num1 - num2;
        operadorVisual.innerText = '−';
        
    } else if (operacionActual === '*') {
        num1 = Math.floor(Math.random() * max) + 1;
        let maxNum2 = Math.floor(max / num1);
        if (maxNum2 < 1) maxNum2 = 1;
        num2 = Math.floor(Math.random() * maxNum2) + 1;
        resultadoCorrecto = num1 * num2;
        operadorVisual.innerText = '×';
        
    } else if (operacionActual === '/') {
        resultadoCorrecto = Math.floor(Math.random() * max) + 1;
        let maxNum2 = Math.floor(max / resultadoCorrecto);
        if (maxNum2 < 1) maxNum2 = 1;
        num2 = Math.floor(Math.random() * maxNum2) + 1;
        num1 = resultadoCorrecto * num2;
        operadorVisual.innerText = '÷';
    }

    elementoNum1.innerText = num1;
    elementoNum2.innerText = num2;
}

// --- Flujo 3: Teclado Numérico Integrado ---
teclas.forEach(tecla => {
    tecla.addEventListener('click', () => {
        const accion = tecla.dataset.valor;

        if (accion === 'borrar') {
            inputRespuesta.value = inputRespuesta.value.slice(0, -1);
        } else if (accion === 'enviar') {
            verificarRespuesta();
        } else {
            // Limita la entrada a un máximo razonable de 4 dígitos
            if (inputRespuesta.value.length < 4) {
                inputRespuesta.value += accion;
            }
        }

        // Limpieza de alertas automática al interactuar
        if (mensajeFeedback.innerText.includes('Vuelve a intentarlo')) {
            mensajeFeedback.innerText = '';
        }
    });
});

// --- Flujo 4: Evaluar Resultados ---
function verificarRespuesta() {
    const respuestaUsuario = parseInt(inputRespuesta.value);

    if (isNaN(respuestaUsuario)) {
        mensajeFeedback.innerText = 'Introdueix un número! ✍️';
        return;
    }

    if (respuestaUsuario === resultadoCorrecto) {
        operacionesAcertadas++;
        barraProgreso.style.width = `${(operacionesAcertadas / metaAciertos) * 100}%`;
        inputRespuesta.value = '';

        if (operacionesAcertadas >= metaAciertos) {
            ejecutarGranCelebracion();
        } else {
            generarNuevaOperacion();
        }
    } else {
        mensajeFeedback.innerText = 'Torna a intentar ❌';
    }
}

function ejecutarGranCelebracion() {
    mensajeFeedback.style.color = '#059669';
    mensajeFeedback.innerText = 'HAS GUANYAT! 🎉✨';

    setTimeout(() => {
        pantallaJuego.style.display = 'none';
        pantallaPremio.style.display = 'block';
        activarMascotaVirtual();
    }, 2000);
}

// --- Flujo 5: Interacción con la Capibara Ilustrada ---
function activarMascotaVirtual() {
    // Limpiamos cualquier rastro anterior de la clase feliz
    areaCapibara.classList.remove('feliz');
    
    function acariciar() {
        areaCapibara.classList.add('feliz');
        efectoCaricia.style.opacity = '1';
        efectoCaricia.style.transform = 'translateY(-25px) rotate(15deg)';

        // Retorna a su estado dulce y calmado tras la reacción de cosquillas
        setTimeout(() => {
            areaCapibara.classList.remove('feliz');
            efectoCaricia.style.opacity = '0';
            efectoCaricia.style.transform = 'translateY(0) rotate(0deg)';
        }, 500);
    }

    areaCapibara.removeEventListener('mousedown', acariciar);
    areaCapibara.removeEventListener('touchstart', acariciar);
    areaCapibara.addEventListener('mousedown', acariciar);
    areaCapibara.addEventListener('touchstart', acariciar);
}

// --- Flujo 6: Reiniciar el bucle ---
btnReiniciar.addEventListener('click', () => {
    operacionesAcertadas = 0;
    barraProgreso.style.width = '0%';
    inputRespuesta.value = '';
    mensajeFeedback.innerText = '';
    mensajeFeedback.style.color = '#dc2626';
    
    pantallaPremio.style.display = 'none';
    pantallaConfig.style.display = 'block';
});