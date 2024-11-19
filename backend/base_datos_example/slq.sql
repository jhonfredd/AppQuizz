CREATE DATABASE app_quizz;

CREATE TABLE user (
    id INT AUTO_INCREMENT PRIMARY KEY,        -- ID único para cada usuario
    username VARCHAR(50) NOT NULL,            -- Nombre de usuario
    password VARCHAR(255) NOT NULL,            -- Contraseña (debería ser cifrada)
    email VARCHAR(100) NOT NULL UNIQUE,       -- Correo electrónico, debe ser único
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Fecha de creación de la cuenta
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP -- Fecha de actualización
);

CREATE TABLE preguntas (
    id INT AUTO_INCREMENT PRIMARY KEY,        -- ID único para cada pregunta
    pregunta_texto TEXT NOT NULL,             -- El texto de la pregunta
    categoria VARCHAR(50),                    -- (Opcional) Categoría o tema de la pregunta
    nivel INT DEFAULT 1 CHECK (nivel IN (1, 2, 3)), -- Nivel de dificultad (1, 2, 3)
    status BOOLEAN DEFAULT 1,                 -- Estado de la pregunta (1 = activa, 0 = inactiva)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Fecha de creación
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP -- Fecha de actualización
);


CREATE TABLE respuestas (
    id INT AUTO_INCREMENT PRIMARY KEY,        -- ID único para cada respuesta
    pregunta_id INT,                          -- ID de la pregunta relacionada
    respuesta_texto TEXT NOT NULL,            -- Texto de la respuesta
    es_correcta BOOLEAN DEFAULT FALSE,        -- Indicador si es la respuesta correcta (TRUE o FALSE)
    status BOOLEAN DEFAULT 1,                 -- Estado de la pregunta (1 = activa, 0 = inactiva)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Fecha de creación
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- Fecha de actualización
    FOREIGN KEY (pregunta_id) REFERENCES preguntas(id) -- Relación con la tabla `preguntas`
);




INSERT INTO user (username, password, email)
VALUES ('johndoe', '$2a$12$bhsLODkyzD5GqaL1lTCyA.JYhjVvFCPG1Q9fHndB0u5ucheB48jqy', '123@example.com');

-- Insertar preguntas
INSERT INTO preguntas (pregunta_texto, categoria, nivel, status) VALUES
('¿Cuál es la capital de Francia?', 'Geografía', 1, 1),
('¿Quién pintó la Mona Lisa?', 'Arte', 1, 1),
('¿Qué gas respiramos los seres humanos?', 'Ciencia', 1, 1),
('¿En qué continente se encuentra Egipto?', 'Geografía', 1, 1),
('¿Cuántos continentes existen?', 'Geografía', 1, 1),
('¿Cuál es el símbolo químico del oro?', 'Ciencia', 1, 1),
('¿Quién escribió "Cien años de soledad"?', 'Literatura', 1, 1),
('¿Qué es el ADN?', 'Ciencia', 1, 1),
('¿Cuántos huesos tiene el cuerpo humano?', 'Ciencia', 1, 1),
('¿Quién fue el primer presidente de los Estados Unidos?', 'Historia', 1, 1),
('¿En qué año se llegó a la Luna?', 'Historia', 2 ,1),
('¿Qué es la teoría de la relatividad?', 'Ciencia', 2 ,1),
('¿Cuál es el río más largo del mundo?', 'Geografía', 2 ,1),
('¿Quién descubrió América?', 'Historia', 2 ,1),
('¿Qué animal es conocido como el "rey de la selva"?', 'Animales', 1, 1),
('¿Qué planeta es conocido como el "planeta rojo"?', 'Astronomía', 1, 1),
('¿Cuál es el idioma oficial de Brasil?', 'Lenguas', 1, 1),
('¿Cuántos países tiene África?', 'Geografía', 2 ,1),
('¿En qué país se encuentra el Machu Picchu?', 'Geografía', 1, 1),
('¿Quién fue el primer hombre en viajar al espacio?', 'Historia', 2 ,1),
('¿En qué año comenzó la Segunda Guerra Mundial?', 'Historia', 2 ,1),
('¿Qué es la fotosíntesis?', 'Biología', 1, 1),
('¿Qué tipo de animal es una ballena?', 'Animales', 1, 1),
('¿En qué país se inventó el teléfono?', 'Historia', 2 ,1),
('¿Cuál es la moneda de Japón?', 'Economía', 1, 1),
('¿Qué significa "física"?', 'Ciencia', 1, 1),
('¿Cuántos colores tiene el arcoíris?', 'Ciencia', 1, 1),
('¿Quién fue Albert Einstein?', 'Ciencia', 2 ,1),
('¿Qué continente es el más grande?', 'Geografía', 1, 1),
('¿Cuál es el océano más grande?', 'Geografía', 1, 1),
('¿En qué año terminó la Primera Guerra Mundial?', 'Historia', 2 ,1),
('¿Qué es la teoría del Big Bang?', 'Ciencia', 2 ,1),
('¿En qué país se encuentra la Gran Muralla China?', 'Historia', 1, 1),
('¿Cuál es la capital de España?', 'Geografía', 1, 1),
('¿Quién fue el último emperador de China?', 'Historia', 2 ,1),
('¿Cuál es el elemento más abundante en el universo?', 'Ciencia', 2 ,1),
('¿Qué animal tiene más dientes?', 'Animales', 1, 1),
('¿Qué océano se encuentra entre América y Europa?', 'Geografía', 1, 1),
('¿Cuál es el país más poblado del mundo?', 'Geografía', 1, 1),
('¿Qué es el cambio climático?', 'Ciencia', 2 ,1),
('¿Qué es el sol?', 'Astronomía', 1, 1),
('¿Cuántos planetas hay en nuestro sistema solar?', 'Astronomía', 1, 1),
('¿Cuál es el animal más rápido del mundo?', 'Animales', 1, 1),
('¿Qué ciudad es conocida como la "Gran Manzana"?', 'Geografía', 1, 1),
('¿Qué es el sistema solar?', 'Astronomía', 1, 1),
('¿Qué es la biología?', 'Ciencia', 1, 1),
('¿Cuál es la lengua más hablada en el mundo?', 'Lenguas', 1, 1),
('¿Cuántos jugadores tiene un equipo de fútbol?', 'Deportes', 1, 1),
('¿En qué país nació la pizza?', 'Cultura', 1, 1),
('¿Qué es un huracán?', 'Ciencia', 2 , 1),
('¿Qué es el ciclo del agua?', 'Ciencia', 1 , 1);


INSERT INTO respuestas (pregunta_id, respuesta_texto, es_correcta, status) VALUES
(1, 'París', TRUE,1),
(1, 'Londres', FALSE,1),
(1, 'Madrid', FALSE,1),
(1, 'Roma', FALSE,1),
(2, 'Leonardo da Vinci', TRUE,1),
(2, 'Pablo Picasso', FALSE,1),
(2, 'Vincent van Gogh', FALSE,1),
(2, 'Michelangelo', FALSE,1),
(3, 'Oxígeno', TRUE,1),
(3, 'Nitrógeno', FALSE,1),
(3, 'Carbono', FALSE,1),
(3, 'Hidrógeno', FALSE,1),
(4, 'África', TRUE,1),
(4, 'Asia', FALSE,1),
(4, 'Europa', FALSE,1),
(4, 'América', FALSE,1),
(5, '7', TRUE,1),
(5, '6', FALSE,1),
(5, '5', FALSE,1),
(5, '8', FALSE,1),
(6, 'Au', TRUE,1),
(6, 'Ag', FALSE,1),
(6, 'Cu', FALSE,1),
(6, 'Fe', FALSE,1),
(7, 'Gabriel García Márquez', TRUE,1),
(7, 'Mario Vargas Llosa', FALSE,1),
(7, 'Jorge Luis Borges', FALSE,1),
(7, 'Carlos Fuentes', FALSE,1),
(8, 'Ácido desoxirribonucleico', TRUE,1),
(8, 'Ácido ribonucleico', FALSE,1),
(8, 'Proteína', FALSE,1),
(8, 'Lípido', FALSE,1),
(9, '206', TRUE,1),
(9, '150', FALSE,1),
(9, '250', FALSE,1),
(9, '300', FALSE,1),
(10, 'George Washington', TRUE,1),
(10, 'Abraham Lincoln', FALSE,1),
(10, 'Thomas Jefferson', FALSE,1),
(10, 'Theodore Roosevelt', FALSE,1),
(11, '1969', TRUE,1),
(11, '1959', FALSE,1),
(11, '1975', FALSE,1),
(11, '1985', FALSE,1),
(12, 'Una teoría física que describe la gravedad', TRUE,1),
(12, 'Una teoría sobre la electricidad', FALSE,1),
(12, 'Una teoría sobre la genética', FALSE,1),
(12, 'Una teoría sobre la química', FALSE,1),
(13, 'El Amazonas', TRUE,1),
(13, 'El Nilo', FALSE,1),
(13, 'El Yangtsé', FALSE,1),
(13, 'El Mississippi', FALSE,1),
(14, 'Cristóbal Colón', TRUE,1),
(14, 'Ferdinand Magellan', FALSE,1),
(14, 'Marco Polo', FALSE,1),
(14, 'Juan Sebastián Elcano', FALSE,1),
(15, 'León', TRUE,1),
(15, 'Tigre', FALSE,1),
(15, 'Elefante', FALSE,1),
(15, 'Cebra', FALSE,1),
(16, 'Marte', TRUE,1),
(16, 'Venus', FALSE,1),
(16, 'Júpiter', FALSE,1),
(16, 'Saturno', FALSE,1),
(17, 'Portugués', TRUE,1),
(17, 'Español', FALSE,1),
(17, 'Inglés', FALSE,1),
(17, 'Francés', FALSE,1),
(18, '54', TRUE,1),
(18, '58', FALSE,1),
(18, '50', FALSE,1),
(18, '48', FALSE,1),
(19, 'Perú', TRUE,1),
(19, 'México', FALSE,1),
(19, 'Chile', FALSE,1),
(19, 'Colombia', FALSE,1),
(20, 'Yuri Gagarin', TRUE,1),
(20, 'Neil Armstrong', FALSE,1),
(20, 'Buzz Aldrin', FALSE,1),
(20, 'Valentina Tereshkova', FALSE,1),
(21, '1939', TRUE,1),
(21, '1941', FALSE,1),
(21, '1935', FALSE,1),
(21, '1945', FALSE,1),
(22, 'El proceso mediante el cual las plantas producen su propio alimento', TRUE,1),
(22, 'El proceso mediante el cual los animales obtienen energía', FALSE,1),
(22, 'La conversión de nutrientes en energía', FALSE,1),
(22, 'El proceso de descomposición de organismos', FALSE,1),
(23, 'Mamífero', TRUE,1),
(23, 'Pescado', FALSE,1),
(23, 'Reptil', FALSE,1),
(23, 'Ave', FALSE,1),
(24, 'Estados Unidos', TRUE,1),
(24, 'Canadá', FALSE,1),
(24, 'Alemania', FALSE,1),
(24, 'Francia', FALSE,1),
(25, 'Yen', TRUE,1),
(25, 'Won', FALSE,1),
(25, 'Dólar', FALSE,1),
(25, 'Euro', FALSE,1),
(26, 'El estudio de la materia y la energía', TRUE,1),
(26, 'El estudio de las emociones humanas', FALSE,1),
(26, 'El estudio de las relaciones sociales', FALSE,1),
(26, 'El estudio de los animales', FALSE,1),
(27, '7', TRUE,1),
(27, '6', FALSE,1),
(27, '8', FALSE,1),
(27, '9', FALSE,1),
(28, 'Isaac Newton', TRUE,1),
(28, 'Nikola Tesla', FALSE,1),
(28, 'Albert Einstein', FALSE,1),
(28, 'Galileo Galilei', FALSE,1),
(29, 'Asia', TRUE,1),
(29, 'África', FALSE,1),
(29, 'Europa', FALSE,1),
(29, 'Oceanía', FALSE,1),
(30, 'El Pacífico', TRUE,1),
(30, 'El Atlántico', FALSE,1),
(30, 'El Índico', FALSE,1),
(30, 'El Ártico', FALSE,1),
(31, '1914', TRUE,1),
(31, '1918', FALSE,1),
(31, '1939', FALSE,1),
(31, '1945', FALSE,1),
(32, 'La explicación de cómo comenzó el universo', TRUE,1),
(32, 'La descripción de cómo la Tierra se formó', FALSE,1),
(32, 'La descripción de las primeras estrellas', FALSE,1),
(32, 'La teoría sobre los agujeros negros', FALSE,1),
(33, 'China', TRUE,1),
(33, 'Japón', FALSE,1),
(33, 'Corea del Sur', FALSE,1),
(33, 'India', FALSE,1),
(34, 'Madrid', TRUE,1),
(34, 'Barcelona', FALSE,1),
(34, 'Sevilla', FALSE,1),
(34, 'Valencia', FALSE,1),
(35, 'Pu Yi', TRUE,1),
(35, 'Mao Zedong', FALSE,1),
(35, 'Sun Yat-sen', FALSE,1),
(35, 'Deng Xiaoping', FALSE,1),
(36, 'Hidrógeno', TRUE,1),
(36, 'Helio', FALSE,1),
(36, 'Oxígeno', FALSE,1),
(36, 'Carbono', FALSE,1),
(37, 'Gato', TRUE,1),
(37, 'Perro', FALSE,1),
(37, 'Elefante', FALSE,1),
(37, 'Caballo', FALSE,1),
(38, 'Atlántico', TRUE,1),
(38, 'Pacífico', FALSE,1),
(38, 'Índico', FALSE,1),
(38, 'Ártico', FALSE,1),
(39, 'China', TRUE,1),
(39, 'India', FALSE,1),
(39, 'Estados Unidos', FALSE,1),
(39, 'Indonesia', FALSE,1),
(40, 'Cambio climático', TRUE,1),
(40, 'Contaminación', FALSE,1),
(40, 'Deforestación', FALSE,1),
(40, 'Escasez de agua', FALSE,1),
(41, 'Una estrella', TRUE,1),
(41, 'Un planeta', FALSE,1),
(41, 'Un cometa', FALSE,1),
(41, 'Un satélite', FALSE,1),
(42, '8', TRUE,1),
(42, '7', FALSE,1),
(42, '9', FALSE,1),
(42, '10', FALSE,1),
(43, 'Guepardo', TRUE,1),
(43, 'León', FALSE,1),
(43, 'Tigre', FALSE,1),
(43, 'Elefante', FALSE,1),
(44, 'Nueva York', TRUE,1),
(44, 'Los Ángeles', FALSE,1),
(44, 'Chicago', FALSE,1),
(44, 'Houston', FALSE,1),
(45, 'Sistema planetario', TRUE,1),
(45, 'Estrella', FALSE,1),
(45, 'Cometa', FALSE,1),
(45, 'Nebulosa', FALSE,1),
(46, 'Ciencias naturales', TRUE,1),
(46, 'Filosofía', FALSE,1),
(46, 'Geografía', FALSE,1),
(46, 'Historia', FALSE,1),
(47, 'Inglés', TRUE,1),
(47, 'Español', FALSE,1),
(47, 'Francés', FALSE,1),
(47, 'Alemán', FALSE,1),
(48, '11', TRUE,1),
(48, '10', FALSE,1),
(48, '9', FALSE,1),
(48, '8', FALSE,1),
(49, 'Italia', TRUE,1),
(49, 'Francia', FALSE,1),
(49, 'España', FALSE,1),
(49, 'Portugal', FALSE,1),
(50, 'Un huracán', TRUE,1),
(50, 'Un tornado', FALSE,1),
(50, 'Un terremoto', FALSE,1),
(50, 'Una tormenta eléctrica', FALSE,1);
