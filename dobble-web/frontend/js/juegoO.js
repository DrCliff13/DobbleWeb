let tiempo = 0;
let intervaloCronometro; 
let puntaje = 0;
const puntajeFinal = 10;
const TIEMPO_LIMITE = 60;
let juegoPausado = false;
let tiempoInicio = 0; 
let procesandoClick = false;

let carta1, carta2, zonaJuego, btnIniciar, simboloCorrecto;
let figurasCarta1, figurasCarta2;
let btnReiniciar, btnMenu, btnVolverMenu, btnPausa, btnReanudar, puntajeSpan, menuPausa;
let resultadoDiv;

const simbolosDisponibles = [
  "☀️", "☁️", "⛄", "⚡", "🔥", "🌟", "💧", "🌿", "🌳",
  "🌺", "🎉", "💫", "🎮", "🍕", "🚀", "🏀", "📚", "🧩", "🎲", "🎯"
];

// === FUNCIÓN PARA REGISTRAR LA PARTIDA EN EL BACKEND ===
async function registrarPartida(gano) {
    const usuario_id = localStorage.getItem('user_id');
    if (!usuario_id) {
        console.error("No se encontró usuario para registrar la partida.");
        return;
    }

    const datosPartida = {
        usuario_id: parseInt(usuario_id),
        tiempo_partida: parseFloat(tiempo.toFixed(2)),
        gano: gano
    };

    try {
        // Asegúrate de que la URL coincida con la de tu servidor
        const response = await fetch('http://localhost:3000/api/estadisticas/actualizar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datosPartida)
        });

        const data = await response.json();

        if (data.success) {
            console.log("Partida registrada con éxito:", data.message);
        } else {
            console.error("Error al registrar la partida:", data.error);
        }
    } catch (error) {
        console.error("Error de conexión al registrar la partida:", error);
    }
}

function generarCartas() {
  const simbolosMezclados = [...simbolosDisponibles].sort(() => 0.5 - Math.random());
  const simboloComun = simbolosMezclados[0];

  const carta1Simbolos = [simboloComun, ...simbolosMezclados.slice(1, 9)].sort(() => 0.5 - Math.random());
  const carta2Simbolos = [simboloComun, ...simbolosMezclados.slice(9, 17)].sort(() => 0.5 - Math.random());

  renderizarSimbolos(figurasCarta1, carta1Simbolos);
  renderizarSimbolos(figurasCarta2, carta2Simbolos);

  return simboloComun;
}

function renderizarSimbolos(container, simbolos) {
    container.innerHTML = '';
    simbolos.forEach(s => {
        const span = document.createElement("span");
        span.className = "simbolo";
        span.textContent = s;
        container.appendChild(span);
    });
}

function iniciarCronometro() {
  clearInterval(intervaloCronometro);
  tiempoInicio = Date.now();
  intervaloCronometro = setInterval(() => {
    if (!juegoPausado) {
      tiempo += 0.1;
      document.getElementById("tiempo").textContent = tiempo.toFixed(2);
      if (tiempo >= TIEMPO_LIMITE) {
        detenerCronometro();
        mostrarMensaje("⏱ ¡Tiempo agotado!", "incorrecto", true);
        eliminarListenersSimbolos();
        mostrarBotonesFinJuego();
        
        // === CORRECCIÓN: Llamando al hechizo correcto al perder ===
        registrarPartida(false); 
      }
    }
  }, 100);
}

function detenerCronometro() {
  clearInterval(intervaloCronometro);
  intervaloCronometro = null;
  mostrarBotonesFinJuego();
}

function mostrarBotonesFinJuego() {
  if (btnReiniciar) btnReiniciar.style.display = "inline-block";
  if (btnMenu) btnMenu.style.display = "inline-block";
  if (btnPausa) btnPausa.style.display = "none";
}

function pausarJuego() {
  if (juegoPausado || !intervaloCronometro) return;
  juegoPausado = true;
  clearInterval(intervaloCronometro);
  eliminarListenersSimbolos();
  if (menuPausa) menuPausa.style.display = "block";
}

function reanudarJuego() {
  if (!juegoPausado) return;
  juegoPausado = false;
  iniciarCronometro();
  agregarListenersSimbolos();
  if (menuPausa) menuPausa.style.display = "none";
}

function mostrarMensaje(texto, tipo, permanente = false) {
    resultadoDiv.textContent = texto;
    resultadoDiv.className = 'resultado-mensaje';
    resultadoDiv.classList.add(tipo);
    resultadoDiv.classList.add('visible');

    if (!permanente) {
        setTimeout(() => {
            resultadoDiv.classList.remove('visible');
        }, 1200);
    }
}

function siguienteTurno() {
    simboloCorrecto = generarCartas();
    agregarListenersSimbolos();
    procesandoClick = false;
}

function manejarClicSimbolo(e) {
  if (juegoPausado || procesandoClick || !e.target.classList.contains("simbolo")) return;

  procesandoClick = true;
  eliminarListenersSimbolos();
  const seleccion = e.target.textContent;

  if (seleccion === simboloCorrecto) {
    puntaje++;
    if (puntajeSpan) puntajeSpan.textContent = puntaje;
    mostrarMensaje("🎉 ¡Correcto!", "correcto");
    e.target.classList.add("correcto");

    if (puntaje >= puntajeFinal) {
      detenerCronometro();
      mostrarMensaje("🏆 ¡Has ganado!", "correcto", true);
      
      // === CORRECCIÓN: Llamando al hechizo correcto al ganar ===
      registrarPartida(true);
      
      if (btnPausa) btnPausa.style.display = "none";
      return;
    }

    setTimeout(siguienteTurno, 1300);

  } else {
    mostrarMensaje("❌ Incorrecto", "incorrecto");
    e.target.classList.add("incorrecto");
    setTimeout(() => e.target.classList.remove("incorrecto"), 500);
    setTimeout(siguienteTurno, 1300);
  }
}

function agregarListenersSimbolos() {
  document.querySelectorAll(".simbolo").forEach(simbolo => {
    simbolo.addEventListener("click", manejarClicSimbolo);
  });
}

function eliminarListenersSimbolos() {
  document.querySelectorAll(".simbolo").forEach(simbolo => {
    simbolo.replaceWith(simbolo.cloneNode(true));
  });
}

// La vieja función registrarPuntaje ha sido eliminada.

function iniciarJuego() {
  puntaje = 0;
  tiempo = 0;
  juegoPausado = false;
  procesandoClick = false;
  
  document.getElementById("tiempo").textContent = "0.00";
  if (puntajeSpan) puntajeSpan.textContent = puntaje;
  
  resultadoDiv.classList.remove('visible', 'correcto', 'incorrecto');

  simboloCorrecto = generarCartas();
  agregarListenersSimbolos();
  iniciarCronometro();
  
  if (zonaJuego) zonaJuego.style.display = "block";
  if (btnIniciar) btnIniciar.style.display = "none";
  if (btnReiniciar) btnReiniciar.style.display = "none";
  if (btnMenu) btnMenu.style.display = "none";
  if (btnPausa) btnPausa.style.display = "inline-block";
}

document.addEventListener("DOMContentLoaded", () => {
  zonaJuego = document.getElementById("zonaJuego");
  btnIniciar = document.getElementById("btnIniciar");
  figurasCarta1 = document.getElementById("figurasCarta1");
  figurasCarta2 = document.getElementById("figurasCarta2");
  btnReiniciar = document.getElementById("btnReiniciar");
  btnMenu = document.getElementById("btnMenu");
  btnVolverMenu = document.getElementById("btnVolverMenu");
  btnPausa = document.getElementById("btnPausa");
  btnReanudar = document.getElementById("btnReanudar");
  puntajeSpan = document.getElementById("puntaje");
  menuPausa = document.getElementById("menuPausa");
  resultadoDiv = document.getElementById("resultado");

  const nombre = localStorage.getItem('usuario') || 'Jugador';
  document.getElementById("nombreUsuario").textContent = nombre;

  if (btnIniciar) btnIniciar.addEventListener("click", iniciarJuego);
  if (btnPausa) btnPausa.addEventListener("click", pausarJuego);
  if (btnReanudar) btnReanudar.addEventListener("click", reanudarJuego);
  if (btnVolverMenu) btnVolverMenu.addEventListener("click", () => window.location.href = "Menu2.0.html");
  if (btnReiniciar) btnReiniciar.addEventListener("click", iniciarJuego);
  if (btnMenu) btnMenu.addEventListener("click", () => window.location.href = "Menu2.0.html");
});
