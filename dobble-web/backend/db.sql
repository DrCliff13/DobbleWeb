USE dobble_db;
/*Tabla Usuario*/
CREATE TABLE Usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario VARCHAR(50) NOT NULL UNIQUE,
  clave VARCHAR(255) NOT NULL,
  nombres VARCHAR(100),
  apellidos VARCHAR(100),
  cedula VARCHAR(20),
  fecha_nacimiento DATE,
  nivel_escolaridad VARCHAR(50),
  tipo_usuario ENUM('estudiante', 'profesor')
);

/*Tabla Intentos*/
CREATE TABLE intentos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  puntaje INT NOT NULL,
  fecha DATETIME DEFAULT CURRENT_TIMESTAMP
);

/*Tabla Estadistica*/
CREATE TABLE estadisticas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    partidas_jugadas INT DEFAULT 0,
    mejor_tiempo INT DEFAULT 0, 
    victorias INT DEFAULT 0,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

INSERT INTO estadisticas (usuario_id, partidas_jugadas, mejor_tiempo, victorias)
SELECT id, 20, 15, 10 FROM usuarios WHERE usuario = 'mau';







