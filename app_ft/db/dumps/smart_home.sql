-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Servidor: mysql-server:3306
-- Tiempo de generación: 24-08-2025 a las 23:52:59
-- Versión del servidor: 5.7.44
-- Versión de PHP: 8.2.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- --------------------------------------------------------
-- BORRAR TABLAS SI EXISTEN
-- --------------------------------------------------------
DROP TABLE IF EXISTS `Mediciones`;
DROP TABLE IF EXISTS `Log_Riegos`;
DROP TABLE IF EXISTS `Dispositivos`;
DROP TABLE IF EXISTS `Electrovalvulas`;
DROP TABLE IF EXISTS `Usuario`;


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `DAM`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Dispositivos`
--

CREATE TABLE `userGroups` (
  `cod` varchar(20) NOT NULL DEFAULT '',
  `denom` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`cod`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

INSERT INTO `userGroups` (`cod`, `denom`) VALUES
('admin',	'AREA admin'),
('lector',	'AREA lectora'),
('conces',	'AREA CONCESIONARIOS'),
('grupodummie',	'grupo superprueba');




CREATE TABLE `Dispositivos` (
  `dispositivoId` int(11) NOT NULL,
  `nombre` varchar(200) DEFAULT NULL,
  `ubicacion` varchar(200) DEFAULT NULL,
  `tipoContadorId` INT(11) NOT NULL, 
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `Dispositivos`
--

INSERT INTO `Dispositivos` (`dispositivoId`, `nombre`, `ubicacion`, `electrovalvulaId`) VALUES
(1, 'Sensor 1', 'Patio', 1),
(2, 'Sensor 2', 'Cocina', 2),
(3, 'Sensor 3', 'Jardin Delantero', 3),
(4, 'Sensor 4', 'Living', 4),
(5, 'Sensor 5', 'Habitacion 1', 5),
(6, 'Sensor 6', 'Habitacion 2', 6);


------------------------------------

--
-- Estructura de tabla para la tabla `Log_Riegos`
--

CREATE TABLE `Log` (
  `logId` int(11) NOT NULL,
  `fecha` datetime DEFAULT NULL,
  
  `dispositivoId` INT(11) NOT NULL,         -- referencia al sensor
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `Log_Riegos`
--

INSERT INTO `Log_Riegos` (`logRiegoId`, `apertura`, `fecha`, `electrovalvulaId`) VALUES
(1, 1, '2025-08-24 23:29:38', 1),
(2, 0, '2025-08-24 23:29:48', 1),
(3, 1, '2025-08-24 23:30:04', 1),
(4, 0, '2025-08-24 23:34:13', 1),
(5, 1, '2025-08-24 23:34:15', 1),
(6, 0, '2025-08-24 23:42:41', 1),
(7, 1, '2025-08-24 23:52:07', 1);

-- --------------------------------------------------------
CREATE TABLE [dbo].[tipocontador] ( 
  [TC_Id] INT IDENTITY NOT NULL,                   -- Identificador único autoincremental
  [TC_TipoContador] VARCHAR(50) NOT NULL           -- Nombre o descripción del tipo de contador
  PRIMARY KEY (`TC_Id`)
);


INSERT INTO tipocontador (TC_TipoContador)
VALUES 
  ('DTEC'),
  ('PADR');


--
-- Estructura de tabla para la tabla
--
CREATE TABLE `Clasificacion` (
  `clasificacionId` INT(11) NOT NULL AUTO_INCREMENT,
  `descripcion` VARCHAR(50) NOT NULL,
  `tipoContadorId` INT(11) NOT NULL,             -- referencia al tipo de contador
  PRIMARY KEY (`clasificacionId`),
  FOREIGN KEY (`tipoContadorId`) REFERENCES `tipocontador`(`TC_Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


INSERT INTO Clasificacion (descripcion) VALUES
('liviano',1),
('pesado',1);


CREATE TABLE `Mediciones` (
  `medicionId` INT(11) NOT NULL AUTO_INCREMENT,
  `fecha` DATETIME NOT NULL,
  `valor` INT(11) NOT NULL,                 -- cantidad o conteo de vehículos
  `carril` TINYINT NOT NULL,                -- número de carril
  `clasificacionId` INT(11) NOT NULL,       -- referencia a Clasificacion
  `dispositivoId` INT(11) NOT NULL,         -- referencia al sensor
  PRIMARY KEY (`medicionId`),
  FOREIGN KEY (`clasificacionId`) REFERENCES `Clasificacion` (`clasificacionId`),
  FOREIGN KEY (`dispositivoId`) REFERENCES `Dispositivos` (`dispositivoId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


--
-- Volcado de datos para la tabla `Mediciones`
--

INSERT INTO Mediciones (fecha, valor, carril, clasificacionId, dispositivoId)
VALUES
('2025-10-06 08:00:00', 25, 1, 1, 1),  -- 25 vehículos livianos carril 1
('2025-10-06 08:00:00', 7, 1, 2, 1),   -- 7 vehículos pesados carril 1
('2025-10-06 08:15:00', 28, 2, 1, 1),  -- 28 livianos carril 2
('2025-10-06 08:15:00', 10, 2, 2, 1),  -- 10 pesados carril 2
('2025-10-06 08:30:00', 30, 1, 1, 1),  -- otro momento, carril 1
('2025-10-06 08:30:00', 8, 1, 2, 1),
('2025-10-06 08:45:00', 22, 2, 1, 1),
('2025-10-06 08:45:00', 12, 2, 2, 1),
('2025-10-06 09:00:00', 27, 1, 1, 1),
('2025-10-06 09:00:00', 9, 1, 2, 1);


-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Usuario`
--

CREATE TABLE `Usuario` (
  `userId` int(11) NOT NULL,
  `name` varchar(30) NOT NULL,
  `password` varchar(256) NOT NULL,
  `descrip` varchar(30) DEFAULT NULL,
  `lastLogin` datetime DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `Usuario`
--

INSERT INTO `Usuario` (`userId`, `name`, `password`, `descrip`, `lastLogin`) VALUES
(2, 'admin', '21232f297a57a5a743894a0e4a801fc3', NULL, '2025-08-24 23:07:03');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `Log_Riegos`
--
ALTER TABLE `Log_Riegos`
  ADD PRIMARY KEY (`logRiegoId`);

--
-- Indices de la tabla `Mediciones`
--
ALTER TABLE `Mediciones`
  ADD PRIMARY KEY (`medicionId`);

--
-- Indices de la tabla `Usuario`
--
ALTER TABLE `Usuario`
  ADD PRIMARY KEY (`userId`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `Log_Riegos`
--
ALTER TABLE `Log_Riegos`
  MODIFY `logRiegoId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `Mediciones`
--
ALTER TABLE `Mediciones`
  MODIFY `medicionId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=131;

--
-- AUTO_INCREMENT de la tabla `Usuario`
--
ALTER TABLE `Usuario`
  MODIFY `userId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
