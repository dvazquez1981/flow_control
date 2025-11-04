-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Servidor: mysql-server:3306
-- Tiempo de generación: 02-11-2025 a las 01:08:34
-- Versión del servidor: 5.7.44
-- Versión de PHP: 8.3.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `flow_control`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Clasificacion`
--
-- 🔥 BORRADO PREVIO DE TABLAS (manteniendo integridad referencial)
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `Respuesta`;
DROP TABLE IF EXISTS `Comando`;
DROP TABLE IF EXISTS `Estado`;
DROP TABLE IF EXISTS `Medicion`;
DROP TABLE IF EXISTS `LogEvento`;
DROP TABLE IF EXISTS `Clasificacion`;
DROP TABLE IF EXISTS `Dispositivo`;
DROP TABLE IF EXISTS `TipoComando`;
DROP TABLE IF EXISTS `TipoEstado`;
DROP TABLE IF EXISTS `TipoContador`;
DROP TABLE IF EXISTS `Usuario`;
DROP TABLE IF EXISTS `userGroups`;

SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE `Clasificacion` (
  `clasificacionId` int(11) NOT NULL,
  `descripcion` varchar(50) NOT NULL,
  `tipoContadorId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `Clasificacion`
--

INSERT INTO `Clasificacion` (`clasificacionId`, `descripcion`, `tipoContadorId`) VALUES
(1, 'liviano', 1),
(1, 'livianos', 4),
(2, 'pesado', 1),
(2, 'pesado', 4);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Comando`
--

CREATE TABLE `Comando` (
  `cmdId` int(11) NOT NULL,
  `fecha` datetime DEFAULT NULL,
  `tipoComandId` int(11) NOT NULL,
  `valor` varchar(50) NOT NULL,
  `dispositivoId` int(11) NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `Comando`
--

INSERT INTO `Comando` (`cmdId`, `fecha`, `tipoComandId`, `valor`, `dispositivoId`, `createdAt`) VALUES
(1, '2025-10-16 21:43:35', 1, 'mando comando reset', 1, '2025-11-02 00:52:16'),
(2, '2025-10-16 21:44:18', 2, 'comando valor bateria interna', 1, '2025-11-02 00:52:16'),
(3, '2025-10-27 15:04:02', 2, 'prueba', 1, '2025-11-02 00:52:16'),
(4, '2025-11-01 19:50:14', 2, 'bateria', 1, '2025-11-02 00:52:16'),
(5, '2025-11-01 21:09:13', 2, 's', 1, '2025-11-02 00:52:16'),
(6, '2025-11-01 21:23:17', 2, 's', 2, '2025-11-02 00:52:16'),
(7, '2025-11-02 00:54:29', 2, 'bateria???', 1, '2025-11-02 00:54:29'),
(8, '2025-11-01 22:01:26', 2, 'd', 1, '2025-11-01 22:01:27'),
(9, '2025-11-01 22:06:34', 2, 'saracatunga', 1, '2025-11-01 22:06:34');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Dispositivo`
--

CREATE TABLE `Dispositivo` (
  `dispositivoId` int(11) NOT NULL,
  `nombre` varchar(200) DEFAULT NULL,
  `ubicacion` varchar(200) DEFAULT NULL,
  `tipoContadorId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `Dispositivo`
--

INSERT INTO `Dispositivo` (`dispositivoId`, `nombre`, `ubicacion`, `tipoContadorId`) VALUES
(1, 'contador 1', 'Padre Buodo', 1),
(2, 'contador 2', 'Tres Arroyos', 2),
(3, 'contador 3', 'Gorostiaga', 1),
(15, 'contador 4', 'Petion', 4);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Estado`
--

CREATE TABLE `Estado` (
  `estadoId` int(11) NOT NULL,
  `fecha` datetime DEFAULT NULL,
  `tipoEstadoId` int(11) NOT NULL,
  `valor` varchar(50) NOT NULL,
  `dispositivoId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `LogEvento`
--

CREATE TABLE `LogEvento` (
  `logId` int(11) NOT NULL,
  `fecha` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `tipo` enum('INFO','WARN','ERROR','COMANDO','RESPUESTA','ESTADO','MEDICION','SISTEMA') NOT NULL,
  `entidad` varchar(50) DEFAULT NULL,
  `entidadId` int(11) DEFAULT NULL,
  `mensaje` text NOT NULL,
  `dispositivoId` int(11) DEFAULT NULL,
  `userId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Medicion`
--

CREATE TABLE `Medicion` (
  `medicionId` int(11) NOT NULL,
  `fecha` datetime NOT NULL,
  `valor` int(11) NOT NULL,
  `carril` tinyint(4) NOT NULL,
  `clasificacionId` int(11) NOT NULL,
  `dispositivoId` int(11) NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `Medicion`
--

INSERT INTO `Medicion` (`medicionId`, `fecha`, `valor`, `carril`, `clasificacionId`, `dispositivoId`, `createdAt`) VALUES
(24, '2025-10-15 17:55:00', 45, 2, 2, 1, '2025-11-02 00:48:36'),
(25, '2025-10-15 18:00:00', 49, 1, 1, 1, '2025-11-02 00:48:36'),
(26, '2025-10-15 18:05:00', 10, 2, 2, 1, '2025-11-02 00:48:36'),
(305146, '2025-10-31 15:00:00', 413, 1, 1, 15, '2025-11-02 00:48:36'),
(305147, '2025-10-31 15:00:00', 0, 2, 1, 15, '2025-11-02 00:48:36'),
(305148, '2025-10-31 15:00:00', 10, 1, 2, 15, '2025-11-02 00:48:36'),
(305149, '2025-10-31 15:00:00', 0, 2, 2, 15, '2025-11-02 00:48:36'),
(305150, '2025-10-31 16:00:00', 451, 1, 1, 15, '2025-11-02 00:48:36'),
(305151, '2025-10-31 16:00:00', 0, 2, 1, 15, '2025-11-02 00:48:36'),
(305152, '2025-10-31 16:00:00', 15, 1, 2, 15, '2025-11-02 00:48:36'),
(305153, '2025-10-31 16:00:00', 0, 2, 2, 15, '2025-11-02 00:48:36'),
(305154, '2025-10-31 17:00:00', 536, 1, 1, 15, '2025-11-02 00:48:36'),
(305155, '2025-10-31 17:00:00', 0, 2, 1, 15, '2025-11-02 00:48:36'),
(305156, '2025-10-31 17:00:00', 10, 1, 2, 15, '2025-11-02 00:48:36'),
(305157, '2025-10-31 17:00:00', 0, 2, 2, 15, '2025-11-02 00:48:36');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Respuesta`
--

CREATE TABLE `Respuesta` (
  `RespId` int(11) NOT NULL,
  `fecha` datetime DEFAULT NULL,
  `cmdId` int(11) NOT NULL,
  `valor` varchar(50) NOT NULL,
  `dispositivoId` int(11) NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `Respuesta`
--

INSERT INTO `Respuesta` (`RespId`, `fecha`, `cmdId`, `valor`, `dispositivoId`, `createdAt`) VALUES
(1, '2025-10-16 21:43:35', 1, 'OK', 1, '2025-11-02 00:52:59'),
(2, '2025-10-16 21:44:18', 2, 'OK', 1, '2025-11-02 00:52:59');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `TipoComando`
--

CREATE TABLE `TipoComando` (
  `tipoComandId` int(11) NOT NULL,
  `descripcion` varchar(50) NOT NULL,
  `tipoContadorId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `TipoComando`
--

INSERT INTO `TipoComando` (`tipoComandId`, `descripcion`, `tipoContadorId`) VALUES
(1, 'Reset', 1),
(1, 'Reset', 2),
(2, 'Val bateria', 1),
(2, 'Comando 2', 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `TipoContador`
--

CREATE TABLE `TipoContador` (
  `TC_Id` int(11) NOT NULL,
  `TC_TipoContador` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `TipoContador`
--

INSERT INTO `TipoContador` (`TC_Id`, `TC_TipoContador`) VALUES
(1, 'DTEC'),
(2, 'PADR'),
(4, 'DTEC_GRD');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `TipoEstado`
--

CREATE TABLE `TipoEstado` (
  `tipoEstadoId` int(11) NOT NULL,
  `descripcion` varchar(50) NOT NULL,
  `tipoContadorId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `userGroups`
--

CREATE TABLE `userGroups` (
  `cod` varchar(20) NOT NULL,
  `denom` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `userGroups`
--

INSERT INTO `userGroups` (`cod`, `denom`) VALUES
('admin', 'AREA admin'),
('grupodummie', 'grupo superprueba'),
('lector', 'AREA lectora');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Usuario`
--

CREATE TABLE `Usuario` (
  `userId` int(11) NOT NULL,
  `name` varchar(30) NOT NULL,
  `password` varchar(256) NOT NULL,
  `descrip` varchar(30) DEFAULT NULL,
  `lastLogin` datetime DEFAULT NULL,
  `userGroup` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `Usuario`
--

INSERT INTO `Usuario` (`userId`, `name`, `password`, `descrip`, `lastLogin`, `userGroup`) VALUES
(1, 'admin', '21232f297a57a5a743894a0e4a801fc3', NULL, '2025-11-01 19:07:33', 'admin');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `Clasificacion`
--
ALTER TABLE `Clasificacion`
  ADD PRIMARY KEY (`clasificacionId`,`tipoContadorId`) USING BTREE,
  ADD KEY `tipoContadorId` (`tipoContadorId`);

--
-- Indices de la tabla `Comando`
--
ALTER TABLE `Comando`
  ADD PRIMARY KEY (`cmdId`),
  ADD KEY `tipoComandId` (`tipoComandId`),
  ADD KEY `dispositivoId` (`dispositivoId`);

--
-- Indices de la tabla `Dispositivo`
--
ALTER TABLE `Dispositivo`
  ADD PRIMARY KEY (`dispositivoId`),
  ADD KEY `tipoContadorId` (`tipoContadorId`);

--
-- Indices de la tabla `Estado`
--
ALTER TABLE `Estado`
  ADD PRIMARY KEY (`estadoId`),
  ADD KEY `tipoEstadoId` (`tipoEstadoId`),
  ADD KEY `dispositivoId` (`dispositivoId`);

--
-- Indices de la tabla `LogEvento`
--
ALTER TABLE `LogEvento`
  ADD PRIMARY KEY (`logId`),
  ADD KEY `dispositivoId` (`dispositivoId`),
  ADD KEY `userId` (`userId`);

--
-- Indices de la tabla `Medicion`
--
ALTER TABLE `Medicion`
  ADD PRIMARY KEY (`medicionId`),
  ADD KEY `clasificacionId` (`clasificacionId`),
  ADD KEY `dispositivoId` (`dispositivoId`);

--
-- Indices de la tabla `Respuesta`
--
ALTER TABLE `Respuesta`
  ADD PRIMARY KEY (`RespId`),
  ADD KEY `cmdId` (`cmdId`),
  ADD KEY `dispositivoId` (`dispositivoId`);

--
-- Indices de la tabla `TipoComando`
--
ALTER TABLE `TipoComando`
  ADD PRIMARY KEY (`tipoComandId`,`tipoContadorId`) USING BTREE,
  ADD KEY `tipoContadorId` (`tipoContadorId`);

--
-- Indices de la tabla `TipoContador`
--
ALTER TABLE `TipoContador`
  ADD PRIMARY KEY (`TC_Id`);

--
-- Indices de la tabla `TipoEstado`
--
ALTER TABLE `TipoEstado`
  ADD PRIMARY KEY (`tipoEstadoId`),
  ADD KEY `tipoContadorId` (`tipoContadorId`);

--
-- Indices de la tabla `userGroups`
--
ALTER TABLE `userGroups`
  ADD PRIMARY KEY (`cod`);

--
-- Indices de la tabla `Usuario`
--
ALTER TABLE `Usuario`
  ADD PRIMARY KEY (`userId`),
  ADD KEY `fk_user_userGroup` (`userGroup`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `Clasificacion`
--
ALTER TABLE `Clasificacion`
  MODIFY `clasificacionId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `Comando`
--
ALTER TABLE `Comando`
  MODIFY `cmdId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `Dispositivo`
--
ALTER TABLE `Dispositivo`
  MODIFY `dispositivoId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `Estado`
--
ALTER TABLE `Estado`
  MODIFY `estadoId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `LogEvento`
--
ALTER TABLE `LogEvento`
  MODIFY `logId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `Medicion`
--
ALTER TABLE `Medicion`
  MODIFY `medicionId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=305158;

--
-- AUTO_INCREMENT de la tabla `Respuesta`
--
ALTER TABLE `Respuesta`
  MODIFY `RespId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `TipoComando`
--
ALTER TABLE `TipoComando`
  MODIFY `tipoComandId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `TipoContador`
--
ALTER TABLE `TipoContador`
  MODIFY `TC_Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `TipoEstado`
--
ALTER TABLE `TipoEstado`
  MODIFY `tipoEstadoId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `Usuario`
--
ALTER TABLE `Usuario`
  MODIFY `userId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `Clasificacion`
--
ALTER TABLE `Clasificacion`
  ADD CONSTRAINT `Clasificacion_ibfk_1` FOREIGN KEY (`tipoContadorId`) REFERENCES `TipoContador` (`TC_Id`);

--
-- Filtros para la tabla `Comando`
--
ALTER TABLE `Comando`
  ADD CONSTRAINT `Comando_ibfk_1` FOREIGN KEY (`tipoComandId`) REFERENCES `TipoComando` (`tipoComandId`),
  ADD CONSTRAINT `Comando_ibfk_2` FOREIGN KEY (`dispositivoId`) REFERENCES `Dispositivo` (`dispositivoId`);

--
-- Filtros para la tabla `Dispositivo`
--
ALTER TABLE `Dispositivo`
  ADD CONSTRAINT `Dispositivo_ibfk_1` FOREIGN KEY (`tipoContadorId`) REFERENCES `TipoContador` (`TC_Id`);

--
-- Filtros para la tabla `Estado`
--
ALTER TABLE `Estado`
  ADD CONSTRAINT `Estado_ibfk_1` FOREIGN KEY (`tipoEstadoId`) REFERENCES `TipoEstado` (`tipoEstadoId`),
  ADD CONSTRAINT `Estado_ibfk_2` FOREIGN KEY (`dispositivoId`) REFERENCES `Dispositivo` (`dispositivoId`);

--
-- Filtros para la tabla `LogEvento`
--
ALTER TABLE `LogEvento`
  ADD CONSTRAINT `LogEvento_ibfk_1` FOREIGN KEY (`dispositivoId`) REFERENCES `Dispositivo` (`dispositivoId`),
  ADD CONSTRAINT `LogEvento_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `Usuario` (`userId`);

--
-- Filtros para la tabla `Medicion`
--
ALTER TABLE `Medicion`
  ADD CONSTRAINT `Medicion_ibfk_1` FOREIGN KEY (`clasificacionId`) REFERENCES `Clasificacion` (`clasificacionId`),
  ADD CONSTRAINT `Medicion_ibfk_2` FOREIGN KEY (`dispositivoId`) REFERENCES `Dispositivo` (`dispositivoId`);

--
-- Filtros para la tabla `Respuesta`
--
ALTER TABLE `Respuesta`
  ADD CONSTRAINT `Respuesta_ibfk_1` FOREIGN KEY (`cmdId`) REFERENCES `Comando` (`cmdId`),
  ADD CONSTRAINT `Respuesta_ibfk_2` FOREIGN KEY (`dispositivoId`) REFERENCES `Dispositivo` (`dispositivoId`);

--
-- Filtros para la tabla `TipoComando`
--
ALTER TABLE `TipoComando`
  ADD CONSTRAINT `TipoComando_ibfk_1` FOREIGN KEY (`tipoContadorId`) REFERENCES `TipoContador` (`TC_Id`);

--
-- Filtros para la tabla `TipoEstado`
--
ALTER TABLE `TipoEstado`
  ADD CONSTRAINT `TipoEstado_ibfk_1` FOREIGN KEY (`tipoContadorId`) REFERENCES `TipoContador` (`TC_Id`);

--
-- Filtros para la tabla `Usuario`
--
ALTER TABLE `Usuario`
  ADD CONSTRAINT `fk_user_userGroup` FOREIGN KEY (`userGroup`) REFERENCES `userGroups` (`cod`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
