        class DobbleStoryMode {
            constructor() {
                this.symbols = ['🌟', '🔥', '💎', '🌙', '⚡', '🌊', '🌸', '🍀', '🦋', '🐉', '🗝️', '👑', '⚔️', '🛡️', '🏺', '📜', '🔮', '🌺', '🦅', '🐺'];
                this.currentChapter = 1;
                this.score = 0;
                this.matches = 0;
                this.startTime = Date.now();
                this.chapterProgress = 0;
                this.maxProgress = 5;
                this.hintUsed = false;
                
                this.chapters = {
                    1: {
                        title: "Capítulo 1: El Bosque Encantado",
                        description: "Has llegado al Bosque Encantado. Los símbolos mágicos están dispersos y debes encontrar las conexiones entre ellos para avanzar.",
                        story: "Bienvenido, valiente explorador. El reino está en peligro y solo tú puedes salvarlo encontrando los símbolos mágicos perdidos. Cada símbolo que encuentres te acercará más a tu destino. ¡Busca las coincidencias entre las cartas para continuar tu aventura!"
                    },
                    2: {
                        title: "Capítulo 2: La Montaña de Cristal",
                        description: "Has ascendido a la Montaña de Cristal, donde los símbolos brillan con una luz especial. La magia es más fuerte aquí.",
                        story: "El aire se vuelve más puro mientras asciendes. Los cristales de la montaña reflejan los símbolos mágicos, creando ilusiones. Debes ser más astuto para distinguir las verdaderas conexiones de los espejismos."
                    },
                    3: {
                        title: "Capítulo 3: El Templo Perdido",
                        description: "Has descubierto el antiguo Templo Perdido. Aquí los símbolos guardan secretos milenarios que podrían cambiar el destino del reino.",
                        story: "Las paredes del templo están cubiertas de símbolos antiguos. Cada coincidencia que encuentres desbloquea una parte del misterio ancestral. Los guardianes del templo observan tu progreso con interés."
                    },
                    4: {
                        title: "Capítulo 4: El Reino de las Sombras",
                        description: "Has cruzado al Reino de las Sombras, donde la oscuridad desafía tu habilidad para encontrar los símbolos ocultos.",
                        story: "La oscuridad envuelve todo, pero tu habilidad para encontrar conexiones se ha fortalecido. Los símbolos brillan débilmente en la penumbra, esperando ser descubiertos por un explorador experto como tú."
                    },
                    5: {
                        title: "Capítulo 5: La Confrontación Final",
                        description: "Has llegado al corazón del mal. Aquí debes usar todo lo aprendido para encontrar los últimos símbolos y salvar el reino.",
                        story: "El destino del reino está en tus manos. Los símbolos finales te darán el poder necesario para derrotar las fuerzas oscuras. Cada coincidencia que encuentres debilita a tu enemigo. ¡Es tu momento de gloria!"
                    }
                };

                this.init();
            }

            init() {
                this.createFloatingParticles();
                this.updateChapterInfo();
                this.generateCards();
                this.updateTimer();
                this.setupEventListeners();
                this.showWelcomeToast();
            }

            createFloatingParticles() {
                const particles = document.getElementById('particles');
                const particleSymbols = ['✨', '🌟', '💫', '⭐', '🔮', '💎'];
                
                for (let i = 0; i < 20; i++) {
                    const particle = document.createElement('div');
                    particle.className = 'particle';
                    particle.textContent = particleSymbols[Math.floor(Math.random() * particleSymbols.length)];
                    particle.style.left = Math.random() * 100 + '%';
                    particle.style.top = Math.random() * 100 + '%';
                    particle.style.animationDelay = Math.random() * 6 + 's';
                    particle.style.animationDuration = (Math.random() * 3 + 4) + 's';
                    particles.appendChild(particle);
                }
            }

            showWelcomeToast() {
                const toast = document.createElement('div');
                toast.className = 'toast-container position-fixed top-0 end-0 p-3';
                toast.innerHTML = `
                    <div class="toast show" role="alert">
                        <div class="toast-header bg-primary text-white">
                            <i class="fas fa-magic me-2"></i>
                            <strong class="me-auto">¡Bienvenido Explorador!</strong>
                        </div>
                        <div class="toast-body bg-dark text-white">
                            Tu aventura ha comenzado. ¡Encuentra los símbolos mágicos!
                        </div>
                    </div>
                `;
                document.body.appendChild(toast);
                
                setTimeout(() => {
                    toast.remove();
                }, 5000);
            }

            setupEventListeners() {
                document.getElementById('hint-btn').addEventListener('click', () => this.showHint());
                document.getElementById('next-btn').addEventListener('click', () => this.nextRound());
                document.getElementById('restart-btn').addEventListener('click', () => this.restartChapter());
            }

            updateChapterInfo() {
                const chapter = this.chapters[this.currentChapter];
                document.getElementById('chapter-title').innerHTML = `
                    <i class="fas fa-book-open me-2"></i>
                    ${chapter.title}
                `;
                document.getElementById('chapter-description').textContent = chapter.description;
                document.getElementById('story-text').textContent = chapter.story;
                
                const progressPercent = (this.chapterProgress / this.maxProgress) * 100;
                document.getElementById('progress-fill').style.width = `${progressPercent}%`;
                document.getElementById('progress-text').textContent = `${this.chapterProgress}/${this.maxProgress}`;
            }

            generateCards() {
                const card1 = document.getElementById('card1');
                const card2 = document.getElementById('card2');
                
                card1.innerHTML = '';
                card2.innerHTML = '';
                
                // Generar símbolos para cada carta asegurando que tengan exactamente uno en común
                const commonSymbol = this.symbols[Math.floor(Math.random() * this.symbols.length)];
                const shuffledSymbols = [...this.symbols].sort(() => Math.random() - 0.5);
                
                const card1Symbols = [commonSymbol];
                const card2Symbols = [commonSymbol];
                
                // Añadir símbolos únicos a cada carta
                let symbolIndex = 0;
                while (card1Symbols.length < 8) {
                    if (shuffledSymbols[symbolIndex] !== commonSymbol) {
                        card1Symbols.push(shuffledSymbols[symbolIndex]);
                    }
                    symbolIndex++;
                }
                
                while (card2Symbols.length < 8) {
                    if (shuffledSymbols[symbolIndex] !== commonSymbol && !card1Symbols.includes(shuffledSymbols[symbolIndex])) {
                        card2Symbols.push(shuffledSymbols[symbolIndex]);
                    }
                    symbolIndex++;
                }
                
                // Mezclar símbolos en cada carta
                card1Symbols.sort(() => Math.random() - 0.5);
                card2Symbols.sort(() => Math.random() - 0.5);
                
                this.renderCard(card1, card1Symbols, commonSymbol);
                this.renderCard(card2, card2Symbols, commonSymbol);
                
                this.commonSymbol = commonSymbol;
                this.hintUsed = false;
                document.getElementById('hint-btn').disabled = false;
            }

            renderCard(cardElement, symbols, commonSymbol) {
                symbols.forEach(symbol => {
                    const symbolElement = document.createElement('div');
                    symbolElement.className = 'symbol';
                    symbolElement.textContent = symbol;
                    symbolElement.addEventListener('click', () => this.checkSymbol(symbol, symbolElement));
                    cardElement.appendChild(symbolElement);
                });
            }

            checkSymbol(symbol, element) {
                if (symbol === this.commonSymbol) {
                    this.foundMatch(element);
                } else {
                    this.wrongMatch(element);
                }
            }

            foundMatch(element) {
                element.classList.add('matched');
                document.querySelectorAll('.symbol').forEach(sym => {
                    if (sym.textContent === this.commonSymbol) {
                        sym.classList.add('matched');
                    }
                });
                
                document.getElementById('card1').classList.add('found-match');
                document.getElementById('card2').classList.add('found-match');
                
                this.matches++;
                this.chapterProgress++;
                this.score += this.hintUsed ? 50 : 100;
                
                this.updateStats();
                this.updateChapterInfo();
                this.showSuccessMessage();
                this.createSuccessEffect();
                
                setTimeout(() => {
                    if (this.chapterProgress >= this.maxProgress) {
                        this.completeChapter();
                    } else {
                        document.getElementById('next-btn').disabled = false;
                    }
                }, 1500);
            }

            wrongMatch(element) {
                element.style.background = '#ff4757';
                element.style.color = 'white';
                element.style.transform = 'scale(1.2) rotate(-5deg)';
                
                // Vibración del elemento
                element.style.animation = 'shake 0.5s';
                
                setTimeout(() => {
                    element.style.background = '';
                    element.style.color = '';
                    element.style.transform = '';
                    element.style.animation = '';
                }, 500);
            }

            createSuccessEffect() {
                // Crear efecto de confetti
                for (let i = 0; i < 20; i++) {
                    const confetti = document.createElement('div');
                    confetti.innerHTML = '🎉';
                    confetti.style.position = 'fixed';
                    confetti.style.left = Math.random() * 100 + '%';
                    confetti.style.top = '-50px';
                    confetti.style.fontSize = '20px';
                    confetti.style.pointerEvents = 'none';
                    confetti.style.zIndex = '9999';
                    confetti.style.animation = `fall ${Math.random() * 2 + 2}s linear forwards`;
                    
                    document.body.appendChild(confetti);
                    
                    setTimeout(() => {
                        confetti.remove();
                    }, 4000);
                }
            }

            showHint() {
                document.querySelectorAll('.symbol').forEach(sym => {
                    if (sym.textContent === this.commonSymbol) {
                        sym.style.background = 'rgba(255, 215, 0, 0.6)';
                        sym.style.transform = 'scale(1.2)';
                        sym.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.8)';
                        sym.style.border = '2px solid #ffd700';
                    }
                });
                
                this.hintUsed = true;
                document.getElementById('hint-btn').disabled = true;
                
                // Mostrar toast de pista
                this.showToast('💡 Pista Activada', 'Los símbolos dorados son las coincidencias', 'warning');
                
                setTimeout(() => {
                    document.querySelectorAll('.symbol').forEach(sym => {
                        if (!sym.classList.contains('matched')) {
                            sym.style.background = '';
                            sym.style.transform = '';
                            sym.style.boxShadow = '';
                            sym.style.border = '';
                        }
                    });
                }, 3000);
            }

            showSuccessMessage() {
                const messages = [
                    "¡Excelente! Has encontrado la conexión mágica. Los antiguos símbolos responden a tu sabiduría.",
                    "¡Increíble! Los símbolos revelan sus secretos ante ti. Tu poder de observación es excepcional.",
                    "¡Fantástico! Tu habilidad para descifrar los misterios ancestrales te acerca a la victoria.",
                    "¡Maravilloso! Los guardianes de los símbolos te reconocen como un verdadero explorador.",
                    "¡Extraordinario! Tu destino como salvador del reino se va cumpliendo paso a paso."
                ];
                
                const randomMessage = messages[Math.floor(Math.random() * messages.length)];
                document.getElementById('story-text').textContent = randomMessage;
                
                // Efecto visual en el texto de historia
                const storyCard = document.querySelector('.story-card');
                storyCard.style.background = 'linear-gradient(135deg, rgba(0, 255, 0, 0.3) 0%, rgba(0, 200, 0, 0.2) 100%)';
                storyCard.style.borderLeft = '4px solid #00ff00';
                
                // Mostrar toast de éxito
                this.showToast('🎉 ¡Coincidencia Encontrada!', 'Has ganado ' + (this.hintUsed ? '50' : '100') + ' puntos', 'success');
                
                setTimeout(() => {
                    storyCard.style.background = 'linear-gradient(135deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.6) 100%)';
                    storyCard.style.borderLeft = '4px solid #ffd700';
                }, 2000);
            }

            showToast(title, message, type = 'info') {
                const toastContainer = document.createElement('div');
                toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
                
                const bgClass = type === 'success' ? 'bg-success' : type === 'warning' ? 'bg-warning' : 'bg-info';
                
                toastContainer.innerHTML = `
                    <div class="toast show" role="alert">
                        <div class="toast-header ${bgClass} text-white">
                            <strong class="me-auto">${title}</strong>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast"></button>
                        </div>
                        <div class="toast-body bg-dark text-white">
                            ${message}
                        </div>
                    </div>
                `;
                
                document.body.appendChild(toastContainer);
                
                setTimeout(() => {
                    toastContainer.remove();
                }, 4000);
            }

            nextRound() {
                document.getElementById('card1').classList.remove('found-match');
                document.getElementById('card2').classList.remove('found-match');
                document.getElementById('next-btn').disabled = true;
                
                // Animación de transición
                const cards = document.querySelectorAll('.game-card');
                cards.forEach(card => {
                    card.style.transform = 'scale(0)';
                    card.style.opacity = '0';
                });
                
                setTimeout(() => {
                    this.generateCards();
                    
                    cards.forEach(card => {
                        card.style.transform = 'scale(1)';
                        card.style.opacity = '1';
                        card.style.transition = 'all 0.5s ease';
                    });
                    
                    const chapter = this.chapters[this.currentChapter];
                    document.getElementById('story-text').textContent = chapter.story;
                }, 300);
            }

            completeChapter() {
                const modal = new bootstrap.Modal(document.getElementById('completion-modal'));
                const finalScore = document.getElementById('final-score');
                const finalTime = document.getElementById('final-time');
                
                finalScore.textContent = this.score;
                finalTime.textContent = Math.floor((Date.now() - this.startTime) / 1000) + 's';
                
                if (this.currentChapter >= 5) {
                    document.getElementById('modal-title').innerHTML = `
                        <i class="fas fa-crown me-2"></i>
                        ¡AVENTURA COMPLETADA!
                    `;
                    document.getElementById('modal-text').textContent = '¡Felicitaciones! Has salvado el reino y te has convertido en una leyenda. Tu nombre será recordado por siempre como el Gran Explorador de Símbolos.';
                    document.getElementById('continue-btn').innerHTML = `
                        <i class="fas fa-trophy me-2"></i>
                        Finalizar Aventura
                    `;
                    document.getElementById('continue-btn').onclick = () => this.restartGame();
                } else {
                    document.getElementById('modal-title').innerHTML = `
                        <i class="fas fa-medal me-2"></i>
                        ¡Capítulo Completado!
                    `;
                    document.getElementById('modal-text').textContent = `Has completado ${this.chapters[this.currentChapter].title}. Tu aventura continúa hacia nuevos desafíos más emocionantes.`;
                }
                
                modal.show();
                this.createSuccessEffect();
            }

            nextChapter() {
                this.currentChapter++;
                this.chapterProgress = 0;
                this.startTime = Date.now();
                
                const modal = bootstrap.Modal.getInstance(document.getElementById('completion-modal'));
                modal.hide();
                
                // Efecto de transición entre capítulos
                document.body.style.animation = 'fadeIn 1s ease-in-out';
                
                setTimeout(() => {
                    this.updateChapterInfo();
                    this.generateCards();
                    document.body.style.animation = '';
                    
                    this.showToast('🌟 Nuevo Capítulo', `¡Bienvenido a ${this.chapters[this.currentChapter].title}!`, 'info');
                }, 500);
            }

            restartChapter() {
                // Mostrar confirmación con Bootstrap modal
                const confirmModal = document.createElement('div');
                confirmModal.className = 'modal fade';
                confirmModal.innerHTML = `
                    <div class="modal-dialog modal-dialog-centered">
                        <div class="modal-content bg-dark text-white">
                            <div class="modal-header border-secondary">
                                <h5 class="modal-title">
                                    <i class="fas fa-exclamation-triangle text-warning me-2"></i>
                                    Confirmar Reinicio
                                </h5>
                            </div>
                            <div class="modal-body">
                                ¿Estás seguro de que quieres reiniciar el capítulo? Perderás 50 puntos y tu progreso actual.
                            </div>
                            <div class="modal-footer border-secondary">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                                <button type="button" class="btn btn-danger" onclick="confirmRestart()">
                                    <i class="fas fa-redo me-2"></i>Reiniciar
                                </button>
                            </div>
                        </div>
                    </div>
                `;
                
                document.body.appendChild(confirmModal);
                const modal = new bootstrap.Modal(confirmModal);
                modal.show();
                
                window.confirmRestart = () => {
                    this.chapterProgress = 0;
                    this.score = Math.max(0, this.score - 50);
                    this.matches = 0;
                    this.startTime = Date.now();
                    
                    this.updateChapterInfo();
                    this.updateStats();
                    this.generateCards();
                    
                    document.getElementById('next-btn').disabled = true;
                    
                    modal.hide();
                    confirmModal.remove();
                    
                    this.showToast('🔄 Capítulo Reiniciado', 'Has perdido 50 puntos. ¡Inténtalo de nuevo!', 'warning');
                };
            }

            restartGame() {
                this.currentChapter = 1;
                this.chapterProgress = 0;
                this.score = 0;
                this.matches = 0;
                this.startTime = Date.now();
                
                const modal = bootstrap.Modal.getInstance(document.getElementById('completion-modal'));
                if (modal) modal.hide();
                
                this.updateChapterInfo();
                this.updateStats();
                this.generateCards();
                
                this.showToast('🎮 Nueva Aventura', '¡Tu épica aventura comienza de nuevo!', 'info');
            }

            updateStats() {
                document.getElementById('score').textContent = this.score;
                document.getElementById('matches').textContent = this.matches;
                
                // Animación en las estadísticas
                document.querySelectorAll('.stat-card').forEach(card => {
                    card.style.animation = 'pulse 0.3s ease';
                    setTimeout(() => {
                        card.style.animation = '';
                    }, 300);
                });
            }

            updateTimer() {
                const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
                document.getElementById('time').textContent = elapsed + 's';
                
                setTimeout(() => this.updateTimer(), 1000);
            }
        }

        // Función global para el botón del modal
        function nextChapter() {
            window.game.nextChapter();
        }

        // Agregar estilos adicionales para animaciones
        const additionalStyles = document.createElement('style');
        additionalStyles.textContent = `
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                20%, 40%, 60%, 80% { transform: translateX(5px); }
            }
            
            @keyframes fall {
                0% { transform: translateY(-50px) rotate(0deg); opacity: 1; }
                100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
            }
            
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); }
                100% { transform: scale(1); }
            }
        `;
        document.head.appendChild(additionalStyles);

        // Inicializar el juego cuando se carga la página
        document.addEventListener('DOMContentLoaded', () => {
            window.game = new DobbleStoryMode();
        });