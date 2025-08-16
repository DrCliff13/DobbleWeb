let simboloCorrecto = null;
let puntaje = 0;
let tiempo = 0; // Variable unificada para el tiempo
let tiempoInicio;
let tiempoTranscurrido = 0;
let intervaloCronometro = null;
let juegoPausado = false;

const simbolosDisponibles = ["🛹", "🌭", "🍔", "🍕", "�", "🧩", "⚽", "🎮", "🖼️", "🌺", "🚌", "💫", "🍀", "🏍️", "☕", "🍪", "🤎", "📜"];
const puntajeFinal = 10;
const TIEMPO_LIMITE = 10; // Límite de tiempo para este modo

// ===   REGISTRA LA PARTIDA EN EL BACKEND ===
async function registrarPartida(gano) {
    const usuario_id = localStorage.getItem('user_id');
    if (!usuario_id) {
        console.error("No se encontró usuario para registrar la partida (JCTime).");
        return;
    }

    // Usamos la variable 'tiempo' que ahora lleva la cuenta total
    const tiempoFinal = parseFloat(tiempo.toFixed(2));

    const datosPartida = {
        usuario_id: parseInt(usuario_id),
        tiempo_partida: tiempoFinal,
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
            console.log("Partida (JCTime) registrada con éxito:", data.message);
        } else {
            console.error("Error al registrar la partida (JCTime):", data.error);
        }
    } catch (error) {
        console.error("Error de conexión al registrar la partida (JCTime):", error);
    }
}


document.addEventListener("DOMContentLoaded", () => {
  const nombre = localStorage.getItem('usuario') || 'Jugador';
  document.getElementById("nombreUsuario").textContent = nombre;

  const carta1 = document.getElementById("carta1");
  const carta2 = document.getElementById("carta2");
  const resultado = document.getElementById("resultado");
  const zonaJuego = document.getElementById("zonaJuego");
  const btnIniciar = document.getElementById("btnIniciar");
  const btnReiniciar = document.getElementById("btnReiniciar");
  const btnMenu = document.getElementById("btnMenu");
  const puntajeSpan = document.getElementById("puntaje");
  const btnPausa = document.getElementById("btnPausa");
  const btnReanudar = document.getElementById("btnReanudar");
  const menuPausa = document.getElementById("menuPausa");
  const btnVolverMenu = document.getElementById("btnVolverMenu");

  if (btnVolverMenu) {
    btnVolverMenu.addEventListener("click", () => {
      window.location.href = "Menu2.0.html";
    });
  }

  function generarCartas() {
    const simbolosMezclados = [...simbolosDisponibles].sort(() => 0.5 - Math.random());
    const simboloComun = simbolosMezclados[0];
    const carta1Simbolos = [simboloComun, ...simbolosMezclados.slice(1, 9)];
    const carta2Simbolos = [simboloComun, ...simbolosMezclados.slice(9, 17)];

    renderizarCarta(carta1, carta1Simbolos.sort(() => 0.5 - Math.random()));
    renderizarCarta(carta2, carta2Simbolos.sort(() => 0.5 - Math.random()));

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
    tiempoInicio = Date.now();
    intervaloCronometro = setInterval(() => {
      if (juegoPausado) return;
      
      tiempo = (Date.now() - tiempoInicio) / 1000 + tiempoTranscurrido;
      document.getElementById("tiempo").textContent = tiempo.toFixed(2);

      if (tiempo >= TIEMPO_LIMITE) {
        detenerCronometro();
        resultado.textContent = "⏱ ¡Tiempo agotado! Juego terminado.";
        resultado.style.background = "rgba(244, 67, 54, 0.2)";
        eliminarListenersSimbolos();
        btnPausa.style.display = "none";
        mostrarBotonesFinJuego();
        
        // === INVOCAR HECHIZO AL PERDER POR TIEMPO ===
        registrarPartida(false);
      }
    }, 100);
  }

  function detenerCronometro() {
    clearInterval(intervaloCronometro);
    intervaloCronometro = null;
    mostrarBotonesFinJuego();
  }

  function mostrarBotonesFinJuego() {
    btnReiniciar.style.display = "inline-block";
    btnMenu.style.display = "inline-block";
  }

  function pausarJuego() {
    if (juegoPausado || !intervaloCronometro) return;
    juegoPausado = true;
    tiempoTranscurrido += (Date.now() - tiempoInicio) / 1000;
    clearInterval(intervaloCronometro);
    eliminarListenersSimbolos();
    menuPausa.style.display = "block";
  }

  function reanudarJuego() {
    if (!juegoPausado) return;
    juegoPausado = false;
    menuPausa.style.display = "none";
    agregarListenersSimbolos();
    iniciarCronometro();
  }

  function manejarClicSimbolo(e) {
    if (juegoPausado || !e.target.classList.contains("simbolo")) return;

    const seleccion = e.target.textContent;

    if (seleccion === simboloCorrecto) {
      puntaje++;
      puntajeSpan.textContent = puntaje;
      resultado.textContent = "🎉 ¡Correcto! Has encontrado el símbolo común";
      resultado.style.background = "linear-gradient(45deg, #4CAF50, #8BC34A)";
      e.target.classList.add("correcto");

      if (puntaje >= puntajeFinal) {
        detenerCronometro();
        resultado.textContent = "🎉 ¡Has ganado! Juego terminado.";
        eliminarListenersSimbolos();
        
        // === INVOCAR HECHIZO AL GANAR ===
        registrarPartida(true);

        btnPausa.style.display = "none";
        return;
      }

    } else {
      resultado.textContent = "❌ Incorrecto. Nuevas cartas...";
      resultado.style.background = "rgba(244, 67, 54, 0.2)";
      e.target.classList.add("incorrecto");
      setTimeout(() => e.target.classList.remove("incorrecto"), 500);
    }

    eliminarListenersSimbolos();
    simboloCorrecto = generarCartas();
    agregarListenersSimbolos();
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

  // Las funciones 'registrarPuntaje' y 'actualizarEstadisticas' ya no son necesarias.

  function iniciarJuego() {
    puntaje = 0;
    tiempo = 0;
    tiempoTranscurrido = 0;
    document.getElementById("tiempo").textContent = "0.00";
    puntajeSpan.textContent = puntaje;
    simboloCorrecto = generarCartas();
    agregarListenersSimbolos();
    iniciarCronometro();
    zonaJuego.style.display = "block";
    btnIniciar.style.display = "none";
    resultado.textContent = "";
    resultado.style.background = "transparent";
    btnPausa.style.display = "inline-block";
    btnReiniciar.style.display = "none";
    btnMenu.style.display = "none";
  }

  // Eventos
  btnIniciar.addEventListener("click", iniciarJuego);
  btnReiniciar.addEventListener("click", iniciarJuego);
  btnMenu.addEventListener("click", () => window.location.href = "Menu2.0.html");
  btnPausa.addEventListener("click", pausarJuego);
  btnReanudar.addEventListener("click", reanudarJuego);
  
});
