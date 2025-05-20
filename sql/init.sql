CREATE DATABASE IF NOT EXISTS unipub_db;
USE unipub_db;

-- Tabla de Usuarios
CREATE TABLE IF NOT EXISTS Usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL,
    rol ENUM('admin', 'usuario') DEFAULT 'usuario',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Universidades
CREATE TABLE IF NOT EXISTS Universidades (
    id_universidad INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    ubicacion VARCHAR(100) NOT NULL,
    ranking VARCHAR(50) NOT NULL,
    imagen_url VARCHAR(255),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Carreras
CREATE TABLE IF NOT EXISTS Carreras (
    id_carrera INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    duracion VARCHAR(50) NOT NULL,
    costo_estimado DECIMAL(10,2),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de relación Universidad-Carrera
CREATE TABLE IF NOT EXISTS UniversidadCarrera (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_universidad INT NOT NULL,
    id_carrera INT NOT NULL,
    requisitos TEXT,
    puntaje_minimo INT,
    FOREIGN KEY (id_universidad) REFERENCES Universidades(id_universidad) ON DELETE CASCADE,
    FOREIGN KEY (id_carrera) REFERENCES Carreras(id_carrera) ON DELETE CASCADE,
    UNIQUE KEY (id_universidad, id_carrera)
);

-- Insertar usuario admin por defecto (contraseña: admin123)
INSERT INTO Usuarios (nombre, correo, contrasena, rol) 
VALUES ('Administrador', 'admin@unipub.com', '$2a$10$N9qo8uLOickgx2ZMRZoMy.MqrqL3LmbrLFj4fQ7.Z7x7yF5hQ9QK.', 'admin');