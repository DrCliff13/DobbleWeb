document.getElementById("btnVolverInicio").addEventListener("click", function () {
    window.location.href = "index.html";
  });
document.getElementById('formRegistro').addEventListener('submit', async (e) => {
  e.preventDefault();

  const datos = {
    usuario: document.getElementById('usuario').value.trim(),
    clave: document.getElementById('clave').value,
    nombres: document.getElementById('nombres').value.trim(),
    apellidos: document.getElementById('apellidos').value.trim(),
    cedula: document.getElementById('cedula').value.trim(),
    fecha_nacimiento: document.getElementById('fecha_nacimiento').value || null,
    nivel_escolaridad: document.getElementById('nivel_escolaridad').value.trim(),
    tipo_usuario: document.getElementById('tipo_usuario').value
  };

  const mensaje = document.getElementById('mensaje');
  mensaje.textContent = '';

  try {
    const response = await fetch('/api/usuario/registro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    });

    const data = await response.json();

    if (response.ok) {
      mensaje.textContent = '¡Registro exitoso!';
      mensaje.classList.remove('text-red-500');
      mensaje.classList.add('text-green-600');
      document.getElementById('formRegistro').reset();
    } else {
      mensaje.textContent = data.message || 'Error al registrar.';
    }
  } catch (error) {
    mensaje.textContent = 'Error de conexión con el servidor.';
  }
});
