document.getElementById("loginForm").addEventListener("submit", async function (e) {
  e.preventDefault();


document.getElementById("btnRegistro").addEventListener("click", function () {
    window.location.href = "registro.html";
  });



const username = document.getElementById("usuario").value;
const password = document.getElementById("clave").value;

  console.log("Enviando datos:", username, password);

  try {
    const res = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario: username, clave: password })
    });

    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await res.text();
      console.error("Respuesta no es JSON:", text);
      throw new Error("El servidor no devolvió JSON válido");
    }

    const data = await res.json();
    console.log("Respuesta del servidor:", data);

    if (res.ok) {
      //alert("✅ Login correcto: " + data.message);
      

      // Redirección a juego.html
      window.location.href = "menu2.0.html";
      localStorage.setItem('user_id', data.user.id); 
      localStorage.setItem('usuario', data.user.nombres);

    } else {
      alert("❌ Login fallido: " + data.message);
    }

  } catch (error) {
    console.error("Error en login:", error);

    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      alert("❌ Error de conexión: No se pudo conectar al servidor");
    } else if (error.message.includes('JSON')) {
      alert("❌ Error del servidor: Respuesta inválida");
    } else {
      alert("❌ Error inesperado: " + error.message);
    }
  }
});
