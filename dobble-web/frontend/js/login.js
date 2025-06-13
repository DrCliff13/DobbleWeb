document.getElementById("loginForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const username = document.getElementById("usuario").value;
  const password = document.getElementById("clave").value;

  const API_BASE_URL =
    location.hostname === "localhost" || location.hostname === "127.0.0.1"
      ? "http://localhost:3000"
      : "https://dobbleweb.onrender.com"; // ⚠️ Asegúrate de que esta sea tu URL en Render

  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario: username, clave: password })
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem('user_id', data.user.id);
      localStorage.setItem('usuario', data.user.nombres);
      window.location.href = "menu2.0.html";
    } else {
      alert("❌ Login fallido: " + data.message);
    }
  } catch (error) {
    alert("❌ Error de conexión: " + error.message);
    console.error(error);
  }
});
