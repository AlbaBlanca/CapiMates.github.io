// Estados y Variables de control
let num1 = 0;
let num2 = 0;
let resultadoCorrecto = 0;
let operacionesAcertadas = 0;
const metaAciertos = 10;

let operacionesDisponibles = [];
let limiteMaximo = 10;

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
const contenedorCapibaraSvg = document.getElementById('contenedor-capibara-svg');
const btnReiniciar = document.getElementById('btn-reiniciar');
const efectoCaricia = document.getElementById('efecto-caricia');

// --- MEJORA 4: Motor de Sonido Nativo (Web Audio API) ---
function reproducirSonido(tipo) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    
    const audioCtx = new AudioContext();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    const ahora = audioCtx.currentTime;

    if (tipo === 'tecla') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(450, ahora);
        gain.gain.setValueAtTime(0.1, ahora);
        gain.gain.exponentialRampToValueAtTime(0.01, ahora + 0.05);
        osc.start(ahora);
        osc.stop(ahora + 0.05);
    } else if (tipo === 'acierto') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, ahora); // Nota Do (C5)
        osc.frequency.setValueAtTime(659.25, ahora + 0.08); // Nota Mi (E5)
        gain.gain.setValueAtTime(0.15, ahora);
        gain.gain.exponentialRampToValueAtTime(0.01, ahora + 0.3);
        osc.start(ahora);
        osc.stop(ahora + 0.3);
    } else if (tipo === 'fallo') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(160, ahora);
        osc.frequency.linearRampToValueAtTime(80, ahora + 0.25); // Efecto Boing
        gain.gain.setValueAtTime(0.12, ahora);
        gain.gain.exponentialRampToValueAtTime(0.01, ahora + 0.25);
        osc.start(ahora);
        osc.stop(ahora + 0.25);
    } else if (tipo === 'cosquillas') {
        osc.type = 'sine';
        gain.gain.setValueAtTime(0.08, ahora);
        for (let i = 0; i < 4; i++) {
            let t = ahora + (i * 0.06);
            osc.frequency.setValueAtTime(550 + (i * 60), t);
            gain.gain.setValueAtTime(0.08, t);
            gain.gain.setValueAtTime(0, t + 0.04);
        }
        osc.start(ahora);
        osc.stop(ahora + 0.26);
    }
}

// --- MEJORA 2: Colección de 5 Capibaras Vectoriales ---
const variantesCapibara = [
    // 1. Capibara Dulce Original
    `<svg id="capibara-svg" viewBox="0 0 200 200" width="200" height="200">
        <circle cx="70" cy="90" r="14" fill="#8c6239"/><circle cx="70" cy="90" r="8" fill="#b1855b"/>
        <path d="M 50,140 C 40,80 135,65 155,95 C 170,95 185,105 185,125 C 185,155 145,165 100,165 C 55,165 50,155 50,140 Z" fill="#a07148"/>
        <path d="M 135,115 C 135,95 180,100 180,125 C 180,145 150,145 135,135 Z" fill="#8c6239"/><ellipse cx="175" cy="116" rx="4" ry="6" fill="#2d1e18"/>
        <circle id="capi-ojo-normal" cx="128" cy="92" r="5.5" fill="#2d1e18"/>
        <path id="capi-boca-normal" d="M 155,132 Q 165,132 170,127" stroke="#2d1e18" stroke-width="3.5" stroke-linecap="round" fill="none"/>
        <path id="capi-ojo-feliz" d="M 120,95 Q 128,85 136,95" stroke="#2d1e18" stroke-width="4.5" stroke-linecap="round" fill="none"/>
        <path id="capi-boca-feliz" d="M 150,127 Q 162,144 172,125" stroke="#2d1e18" stroke-width="3.5" stroke-linecap="round" fill="#d90429"/>
        <circle cx="138" cy="108" r="9" fill="#ffb3c1" opacity="0.75"/>
    </svg>`,
    // 2. Capibara Fiestera (con sombrerito de fiesta)
    `<svg id="capibara-svg" viewBox="0 0 200 200" width="200" height="200">
        <circle cx="70" cy="90" r="14" fill="#8c6239"/><circle cx="70" cy="90" r="8" fill="#b1855b"/>
        <path d="M 50,140 C 40,80 135,65 155,95 C 170,95 185,105 185,125 C 185,155 145,165 100,165 C 55,165 50,155 50,140 Z" fill="#a07148"/>
        <polygon points="95,75 110,35 125,70" fill="#ffb703"/><circle cx="110" cy="35" r="4" fill="#d00000"/>
        <path d="M 135,115 C 135,95 180,100 180,125 C 180,145 150,145 135,135 Z" fill="#8c6239"/><ellipse cx="175" cy="116" rx="4" ry="6" fill="#2d1e18"/>
        <circle id="capi-ojo-normal" cx="128" cy="92" r="5.5" fill="#2d1e18"/>
        <path id="capi-boca-normal" d="M 155,132 Q 165,132 170,127" stroke="#2d1e18" stroke-width="3.5" stroke-linecap="round" fill="none"/>
        <path id="capi-ojo-feliz" d="M 120,95 Q 128,85 136,95" stroke="#2d1e18" stroke-width="4.5" stroke-linecap="round" fill="none"/>
        <path id="capi-boca-feliz" d="M 150,127 Q 162,144 172,125" stroke="#2d1e18" stroke-width="3.5" stroke-linecap="round" fill="#d90429"/>
        <circle cx="138" cy="108" r="9" fill="#ffb3c1" opacity="0.75"/>
    </svg>`,
    // 3. Capibara Intelectual (con gafas azules de empollón)
    `<svg id="capibara-svg" viewBox="0 0 200 200" width="200" height="200">
        <circle cx="70" cy="90" r="14" fill="#8c6239"/><circle cx="70" cy="90" r="8" fill="#b1855b"/>
        <path d="M 50,140 C 40,80 135,65 155,95 C 170,95 185,105 185,125 C 185,155 145,165 100,165 C 55,165 50,155 50,140 Z" fill="#a07148"/>
        <path d="M 135,115 C 135,95 180,100 180,125 C 180,145 150,145 135,135 Z" fill="#8c6239"/><ellipse cx="175" cy="116" rx="4" ry="6" fill="#2d1e18"/>
        <circle id="capi-ojo-normal" cx="128" cy="92" r="5.5" fill="#2d1e18"/>
        <path id="capi-boca-normal" d="M 155,132 Q 165,132 170,127" stroke="#2d1e18" stroke-width="3.5" stroke-linecap="round" fill="none"/>
        <path id="capi-ojo-feliz" d="M 120,95 Q 128,85 136,95" stroke="#2d1e18" stroke-width="4.5" stroke-linecap="round" fill="none"/>
        <path id="capi-boca-feliz" d="M 150,127 Q 162,144 172,125" stroke="#2d1e18" stroke-width="3.5" stroke-linecap="round" fill="#d90429"/>
        <circle cx="128" cy="92" r="11" stroke="#023e8a" stroke-width="3" fill="none"/>
        <line x1="139" y1="92" x2="155" y2="95" stroke="#023e8a" stroke-width="3"/>
        <circle cx="138" cy="108" r="9" fill="#ffb3c1" opacity="0.75"/>
    </svg>`,
    // 4. Capibara Real (con corona dorada)
    `<svg id="capibara-svg" viewBox="0 0 200 200" width="200" height="200">
        <circle cx="70" cy="90" r="14" fill="#8c6239"/><circle cx="70" cy="90" r="8" fill="#b1855b"/>
        <path d="M 50,140 C 40,80 135,65 155,95 C 170,95 185,105 185,125 C 185,155 145,165 100,165 C 55,165 50,155 50,140 Z" fill="#a07148"/>
        <polygon points="95,65 100,45 110,55 120,45 125,65" fill="#ffd166" stroke="#b58900" stroke-width="1.5"/>
        <path d="M 135,115 C 135,95 180,100 180,125 C 180,145 150,145 135,135 Z" fill="#8c6239"/><ellipse cx="175" cy="116" rx="4" ry="6" fill="#2d1e18"/>
        <circle id="capi-ojo-normal" cx="128" cy="92" r="5.5" fill="#2d1e18"/>
        <path id="capi-boca-normal" d="M 155,132 Q 165,132 170,127" stroke="#2d1e18" stroke-width="3.5" stroke-linecap="round" fill="none"/>
        <path id="capi-ojo-feliz" d="M 120,95 Q 128,85 136,95" stroke="#2d1e18" stroke-width="4.5" stroke-linecap="round" fill="none"/>
        <path id="capi-boca-feliz" d="M 150,127 Q 162,144 172,125" stroke="#2d1e18" stroke-width="3.5" stroke-linecap="round" fill="#d90429"/>
        <circle cx="138" cy="108" r="9" fill="#ffb3c1" opacity="0.75"/>
    </svg>`,
    // 5. Capibara con Patito (con un patito de goma amarillo en la cabeza)
    `<svg id="capibara-svg" viewBox="0 0 200 200" width="200" height="200">
        <circle cx="70" cy="90" r="14" fill="#8c6239"/><circle cx="70" cy="90" r="8" fill="#b1855b"/>
        <path d="M 50,140 C 40,80 135,65 155,95 C 170,95 185,105 185,125 C 185,155 145,165 100,165 C 55,165 50,155 50,140 Z" fill="#a07148"/>
        <circle cx="105" cy="58" r="9" fill="#ffea00"/><circle cx="113" cy="51" r="6" fill="#ffea00"/>
        <polygon points="118,49 125,52 118,55" fill="#ff9f1c"/><circle cx="112" cy="49" r="1" fill="#000"/>
        <path d="M 135,115 C 135,95 180,100 180,125 C 180,145 150,145 135,135 Z" fill="#8c6239"/><ellipse cx="175" cy="116" rx="4" ry="6" fill="#2d1e18"/>
        <circle id="capi-ojo-normal" cx="128" cy="92" r="5.5" fill="#2d1e18"/>
        <path id="capi-boca-normal" d="M 155,132 Q 165,132 170,127" stroke="#2d1e18" stroke-width="3.5" stroke-linecap="round" fill="none"/>
        <path id="capi-ojo-feliz" d="M 120,95 Q 128,85 136,95" stroke="#2d1e18" stroke-width="4.5" stroke-linecap="round" fill="none"/>
        <path id="capi-boca-feliz" d="M 150,127 Q 162,144 172,125" stroke="#2d1e18" stroke-width="3.5" stroke-linecap="round" fill="#d90429"/>
        <circle cx="138" cy="108" r="9" fill="#ffb3c1" opacity="0.75"/>
    </svg>`
];

// --- Flujo 1: Configurar e Iniciar Juego ---
btnIniciar.addEventListener('click', () => {
    const checkboxes = document.querySelectorAll('.selector-operaciones input:checked');
    operacionesDisponibles = Array.from(checkboxes).map(cb => cb.value);
    limiteMaximo = parseInt(inputMaximo.value);

    if (operacionesDisponibles.length === 0) {
        alert("¡Selecciona com a mínim una operació per a jugar! 🎯");
        return;
    }
    if (isNaN(limiteMaximo) || limiteMaximo < 5) {
        alert("Introdueix un número màxim vàlid (mínim 5).");
        return;
    }

    reproducirSonido('tecla');
    pantallaConfig.style.display = 'none';
    pantallaJuego.style.display = 'block';
    generarNuevaOperacion();
});

// --- MEJORA 1: Generador Didáctico de Operaciones Escolares ---
function generarNuevaOperacion() {
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
        // Enfoque escolar: Factores lógicos basados en tablas del 1 al 'max'
        num1 = Math.floor(Math.random() * max) + 1;
        num2 = Math.floor(Math.random() * max) + 1;
        resultadoCorrecto = num1 * num2;
        operadorVisual.innerText = '×';
        
    } else if (operacionActual === '/') {
        // Enfoque escolar: División exacta construida a la inversa
        resultadoCorrecto = Math.floor(Math.random() * max) + 1; // El cociente
        num2 = Math.floor(Math.random() * max) + 1;              // El divisor
        num1 = resultadoCorrecto * num2;                        // El dividendo
        operadorVisual.innerText = '÷';
    }

    elementoNum1.innerText = num1;
    elementoNum2.innerText = num2;
}

// --- Flujo 3: Teclado Numérico Integrado ---
teclas.forEach(tecla => {
    tecla.addEventListener('click', () => {
        reproducirSonido('tecla');
        const accion = tecla.dataset.valor;

        if (accion === 'borrar') {
            inputRespuesta.value = inputRespuesta.value.slice(0, -1);
        } else if (accion === 'enviar') {
            verificarRespuesta();
        } else {
            if (inputRespuesta.value.length < 4) {
                inputRespuesta.value += accion;
            }
        }

        if (mensajeFeedback.innerText.includes('Torna a intentar')) {
            mensajeFeedback.innerText = '';
        }
    });
});

// --- Flujo 4: Evaluar Resultados ---
function verificarRespuesta() {
    const respuestaUsuario = parseInt(inputRespuesta.value);

    if (isNaN(respuestaUsuario)) {
        mensajeFeedback.innerText = 'Introdueix un número! ✍️';
        reproducirSonido('fallo');
        return;
    }

    if (respuestaUsuario === resultadoCorrecto) {
        operacionesAcertadas++;
        reproducirSonido('acierto');
        barraProgreso.style.width = `${(operacionesAcertadas / metaAciertos) * 100}%`;
        inputRespuesta.value = '';

        if (operacionesAcertadas >= metaAciertos) {
            ejecutarGranCelebracion();
        } else {
            generarNuevaOperacion();
        }
    } else {
        mensajeFeedback.innerText = 'Torna a intentar ❌';
        reproducirSonido('fallo');
    }
}

function ejecutarGranCelebracion() {
    mensajeFeedback.style.color = '#059669';
    mensajeFeedback.innerText = 'HAS GUANYAT! 🎉✨';

    // Inyecta una capibara aleatoria de las 5 disponibles
    const indiceAleatorio = Math.floor(Math.random() * variantesCapibara.length);
    contenedorCapibaraSvg.innerHTML = variantesCapibara[indiceAleatorio];

    setTimeout(() => {
        pantallaJuego.style.display = 'none';
        pantallaPremio.style.display = 'block';
        activarMascotaVirtual();
    }, 2000);
}

// --- Flujo 5: Interacción con la Capibara Ilustrada ---
function activarMascotaVirtual() {
    areaCapibara.classList.remove('feliz');
    
    function acariciar(e) {
        e.preventDefault(); // Evita doble disparo táctil/ratón
        reproducirSonido('cosquillas');
        areaCapibara.classList.add('feliz');
        efectoCaricia.style.opacity = '1';
        efectoCaricia.style.transform = 'translateY(-25px) rotate(15deg)';

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
    reproducirSonido('tecla');
    operacionesAcertadas = 0;
    barraProgreso.style.width = '0%';
    inputRespuesta.value = '';
    mensajeFeedback.innerText = '';
    mensajeFeedback.style.color = '#dc2626';
    
    pantallaPremio.style.display = 'none';
    pantallaConfig.style.display = 'block';
});
