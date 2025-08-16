let tiempo = 0;
let intervalo;
let puntaje = 0;
let juegoPausado = false;
let procesandoClick = false;

const puntajeFinal = 10;
const TIEMPO_LIMITE = 60;

let carta1, carta2, resultado, zonaJuego, btnIniciar, simboloCorrecto, btnPausa;

const simbolosDisponibles = ["�", "⚪", "⚫", "🟤", "🟣", "🔵", "🟢", "🟡", "🟠", "1️⃣", 
  "2️⃣", "3️⃣", "4️⃣", "5️⃣", "🟥", "🟪", "🟦", "🟩"];

// === HECHIZO PARA REGISTRAR LA PARTIDA EN EL BACKEND ===
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
            console.log("Partida (Educativo) registrada con éxito:", data.message);
        } else {
            console.error("Error al registrar la partida (Educativo):", data.error);
        }
    } catch (error) {
        console.error("Error de conexión al registrar la partida (Educativo):", error);
    }
}


function generarCartas() {
  const simbolosMezclados = [...simbolosDisponibles].sort(() => 0.5 - Math.random());
  const simboloComun = simbolosMezclados[0];
  const carta1Simbolos = [simboloComun, ...simbolosMezclados.slice(1, 9)];
  const carta2Simbolos = [simboloComun, ...simbolosMezclados.slice(9, 17)];

  const mezclar = arr => arr.sort(() => 0.5 - Math.random());
  renderizarCarta(carta1, mezclar(carta1Simbolos));
  renderizarCarta(carta2, mezclar(carta2Simbolos));

  return simboloComun;
}

function renderizarCarta(cartaElement, simbolos) {
  cartaElement.innerHTML = "";
  simbolos.forEach(simbolo => {
    const span = document.createElement("span");
    span.classList.add("simbolo");
    span.textContent = simbolo;

    const size = Math.floor(Math.random() * 20) + 24;
    span.style.fontSize = `${size}px`;
    span.style.position = "relative";
    span.style.top = `${Math.floor(Math.random() * 10) - 5}px`;
    span.style.left = `${Math.floor(Math.random() * 10) - 5}px`;

    cartaElement.appendChild(span);
  });
}

function iniciarCronometro() {
  clearInterval(intervalo);
  intervalo = setInterval(() => {
    if (!juegoPausado) {
      tiempo += 0.1;
      document.getElementById("tiempo").textContent = tiempo.toFixed(2);
      if (tiempo >= TIEMPO_LIMITE) {
        detenerCronometro();
        resultado.textContent = "⏱ ¡Tiempo agotado! Juego terminado.";
        eliminarListenersSimbolos();
        btnPausa.style.display = "none";
        mostrarBotonesFinJuego();
        
        // === INVOCAR HECHIZO AL PERDER POR TIEMPO ===
        registrarPartida(false); 
      }
    }
  }, 100);
}

function detenerCronometro() {
  clearInterval(intervalo);
  mostrarBotonesFinJuego();
}

function mostrarBotonesFinJuego() {
  document.getElementById("btnReiniciar").style.display = "inline-block";
  document.getElementById("btnMenu").style.display = "inline-block";
}

function pausarJuego() {
  juegoPausado = true;
  document.getElementById("menuPausa").style.display = "block";
  eliminarListenersSimbolos();
}

function reanudarJuego() {
  juegoPausado = false;
  document.getElementById("menuPausa").style.display = "none";
  agregarListenersSimbolos();
}

function siguienteTurno() {
    resultado.classList.remove("resultado-correcto");
    resultado.style.background = "";
    resultado.textContent = "¡Encuentra el símbolo común entre las dos cartas!";

    simboloCorrecto = generarCartas();
    agregarListenersSimbolos();
    procesandoClick = false;
}

function manejarClicSimbolo(e) {
  if (juegoPausado || procesandoClick || !e.target.classList.contains("simbolo")) return;

  procesandoClick = true;
  const seleccion = e.target.textContent;
  eliminarListenersSimbolos();

  if (seleccion === simboloCorrecto) {
    puntaje++;
    document.getElementById("puntaje").textContent = puntaje;
    resultado.textContent = "🎉 ¡Correcto! Has encontrado el símbolo común";
    resultado.classList.add("resultado-correcto"); 
    e.target.classList.add("correcto");

    if (puntaje >= puntajeFinal) {
      detenerCronometro();
      resultado.textContent = "🏆 ¡Has ganado! Juego terminado.";
      
      // === INVOCAR HECHIZO AL GANAR ===
      registrarPartida(true);

      btnPausa.style.display = "none";
      return;
    }

    setTimeout(siguienteTurno, 1200);

  } else {
    resultado.textContent = "❌ Incorrecto. ¡Sigue intentando!";
    resultado.style.background = "rgba(244, 67, 54, 0.2)";
    e.target.classList.add("incorrecto");
    
    setTimeout(() => e.target.classList.remove("incorrecto"), 600);
    setTimeout(siguienteTurno, 1200);
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

// La función 'registrarPuntaje' ya no es necesaria y ha sido reemplazada por 'registrarPartida'

function iniciarJuego() {
  puntaje = 0;
  tiempo = 0;
  juegoPausado = false;
  procesandoClick = false;
  document.getElementById("puntaje").textContent = puntaje;
  document.getElementById("tiempo").textContent = tiempo.toFixed(2);
  
  resultado.classList.remove("resultado-correcto");
  resultado.style.background = "";

  resultado.textContent = "¡Encuentra el símbolo común entre las dos cartas!";
  zonaJuego.style.display = "block";
  btnIniciar.style.display = "none";
  btnPausa.style.display = "inline-block";
  
  simboloCorrecto = generarCartas();
  agregarListenersSimbolos();
  iniciarCronometro();
}

document.addEventListener("DOMContentLoaded", () => {
  carta1 = document.getElementById("carta1");
  carta2 = document.getElementById("carta2");
  resultado = document.getElementById("resultado");
  zonaJuego = document.getElementById("zonaJuego");
  btnIniciar = document.getElementById("btnIniciar");
  btnPausa = document.getElementById("btnPausa");

  btnPausa.addEventListener("click", pausarJuego);
  document.getElementById("btnReanudar").addEventListener("click", reanudarJuego);
  document.getElementById("btnVolverMenu").addEventListener("click", () => {
    window.location.href = "Menu2.0.html";
  });

  const nombre = localStorage.getItem('usuario') || 'Jugador';
  document.getElementById("nombreUsuario").textContent = nombre;

  btnIniciar.addEventListener("click", iniciarJuego);

  document.getElementById("btnReiniciar").addEventListener("click", () => {
    iniciarJuego();
    document.getElementById("btnReiniciar").style.display = "none";
    document.getElementById("btnMenu").style.display = "none";
  });

  document.getElementById("btnMenu").addEventListener("click", () => {
    window.location.href = "menu2.0.html";
  });
});
