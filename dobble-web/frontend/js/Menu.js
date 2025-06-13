        // Datos del juego simulados
        let gameStats = {
            gamesPlayed: Math.floor(Math.random() * 50) + 10,
            bestScore: Math.floor(Math.random() * 1000) + 500,
            wins: Math.floor(Math.random() * 30) + 5
        };

        // Inicializar estadísticas
        function initStats() {
  const userId = localStorage.getItem('user_id');
  const nombre = localStorage.getItem('usuario') || 'USER';

  document.getElementById('nombreUsuarioMenu').textContent = nombre;

  fetch(`http://localhost:3000/api/auth/estadisticas/${userId}`)
    .then(res => res.json())
    .then(data => {
      document.getElementById('gamesPlayed').textContent = data.gamesPlayed;
      document.getElementById('bestTime').textContent = data.bestTime + "s";
      document.getElementById('winRate').textContent = 
        data.gamesPlayed > 0 
          ? Math.round((data.wins / data.gamesPlayed) * 100) + '%'
          : '0%';
    })
    .catch(err => {
      console.error("Error cargando estadísticas:", err);
    });
}


document.addEventListener("DOMContentLoaded", initStats);

        document.addEventListener("DOMContentLoaded", () => {
        const nombre = localStorage.getItem('usuario') || 'USER';
        document.getElementById('nombreUsuarioMenu').textContent = nombre;
        });


        // Mostrar notificación
        function showNotification(message) {
            const notification = document.getElementById('notification');
            const notificationText = document.getElementById('notificationText');
            
            notificationText.textContent = message;
            notification.classList.add('show');
            
            setTimeout(() => {
                notification.classList.remove('show');
            }, 3000);
        }

        function selectMode(mode) {
            const modeNames = {
                'classic': 'Modo Clásico',
                'educational': 'Modo Educativo',
                'challenge': 'Modo Reto Contrarreloj',
                'collaborative': 'Modo Colaborativo',
                'ranking': 'Ver Ranking'
            };
            
            const modePages = {
                'classic': 'juego.html',
                'educational': 'juegoEdu.html',
                'challenge': 'juegoCR.html',
                'collaborative': 'historia.html',
                'ranking': 'Rankin.html'
            };
            
            // Efecto visual del botón
            event.target.classList.add('pulse');
            setTimeout(() => {
                event.target.classList.remove('pulse');
            }, 1000);
            
            showNotification(`¡${modeNames[mode]} seleccionado!`);
            
            // Redirigir a la página correspondiente
            setTimeout(() => {
                window.location.href = modePages[mode];
            }, 1500);
        }

        // Salir del juego
        function exitGame() {
            event.target.classList.add('pulse');
            setTimeout(() => {
                event.target.classList.remove('pulse');
            }, 1000);
            
            if (confirm('¿Estás seguro de que quieres salir del juego?')) {
                showNotification('¡Gracias por jugar Dobble!');
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            }
        }

        // Efectos adicionales
        function addRandomStats() {
            // Simular actualización de estadísticas en tiempo real
            setInterval(() => {
                if (Math.random() < 0.1) { // 10% de probabilidad cada segundo
                    gameStats.gamesPlayed += 1;
                    if (Math.random() < 0.6) {
                        gameStats.wins += 1;
                    }
                    initStats();
                }
            }, 1000);
        }

        // Inicializar cuando se carga la página
        document.addEventListener('DOMContentLoaded', function() {
            initStats();
            addRandomStats();
            
            // Animación de entrada
            const container = document.getElementById('gameContainer');
            container.style.opacity = '0';
            container.style.transform = 'translateY(50px)';
            
            setTimeout(() => {
                container.style.transition = 'all 0.8s ease';
                container.style.opacity = '1';
                container.style.transform = 'translateY(0)';
            }, 100);
            
            // Mostrar mensaje de bienvenida
            setTimeout(() => {
                showNotification('¡Bienvenido a Dobble!');
            }, 1500);
        });

        // Efectos de hover mejorados
        document.addEventListener('mouseover', function(e) {
            if (e.target.classList.contains('game-mode-btn')) {
                e.target.style.transform = 'translateY(-3px) scale(1.02)';
            }
        });

        document.addEventListener('mouseout', function(e) {
            if (e.target.classList.contains('game-mode-btn')) {
                e.target.style.transform = 'translateY(0) scale(1)';
            }
        });