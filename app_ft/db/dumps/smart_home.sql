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

CREATE TABLE `Dispositivos` (
  `dispositivoId` int(11) NOT NULL,
  `nombre` varchar(200) DEFAULT NULL,
  `ubicacion` varchar(200) DEFAULT NULL,
  `electrovalvulaId` int(11) NOT NULL
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

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Electrovalvulas`
--

CREATE TABLE `Electrovalvulas` (
  `electrovalvulaId` int(11) NOT NULL,
  `nombre` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `Electrovalvulas`
--

INSERT INTO `Electrovalvulas` (`electrovalvulaId`, `nombre`) VALUES
(1, 'eLPatio'),
(2, 'eLCocina'),
(3, 'eLJardinDelantero'),
(4, 'eLLiving'),
(5, 'eLHabitacion1'),
(6, 'eLHabitacion2');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Log_Riegos`
--

CREATE TABLE `Log_Riegos` (
  `logRiegoId` int(11) NOT NULL,
  `apertura` tinyint(4) DEFAULT NULL,
  `fecha` datetime DEFAULT NULL,
  `electrovalvulaId` int(11) NOT NULL
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

--
-- Estructura de tabla para la tabla `Mediciones`
--

CREATE TABLE `Mediciones` (
  `medicionId` int(11) NOT NULL,
  `fecha` datetime DEFAULT NULL,
  `valor` varchar(100) DEFAULT NULL,
  `dispositivoId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `Mediciones`
--

INSERT INTO `Mediciones` (`medicionId`, `fecha`, `valor`, `dispositivoId`) VALUES
(1, '2025-08-24 23:32:04', '16.44', 1),
(2, '2025-08-24 23:32:09', '63', 1),
(3, '2025-08-24 23:32:14', '81.6', 1),
(4, '2025-08-24 23:32:19', '45.04', 1),
(5, '2025-08-24 23:33:09', '16.65', 1),
(6, '2025-08-24 23:33:29', '54.9', 1),
(7, '2025-08-24 23:33:34', '7.99', 1),
(8, '2025-08-24 23:33:39', '55.34', 1),
(9, '2025-08-24 23:33:44', '20.95', 1),
(10, '2025-08-24 23:33:49', '82.19', 1),
(11, '2025-08-24 23:33:54', '61.59', 1),
(12, '2025-08-24 23:33:59', '70.92', 1),
(13, '2025-08-24 23:34:04', '12.82', 1),
(14, '2025-08-24 23:34:09', '69.57', 1),
(15, '2025-08-24 23:34:20', '60.66', 1),
(16, '2025-08-24 23:34:25', '0.81', 1),
(17, '2025-08-24 23:34:30', '7.21', 1),
(18, '2025-08-24 23:34:35', '65.63', 1),
(19, '2025-08-24 23:34:40', '51.11', 1),
(20, '2025-08-24 23:34:45', '12.29', 1),
(21, '2025-08-24 23:34:50', '59.33', 1),
(22, '2025-08-24 23:34:55', '43.23', 1),
(23, '2025-08-24 23:35:00', '6.49', 1),
(24, '2025-08-24 23:35:05', '89.47', 1),
(25, '2025-08-24 23:35:10', '74.07', 1),
(26, '2025-08-24 23:35:15', '82.18', 1),
(27, '2025-08-24 23:35:20', '80.97', 1),
(28, '2025-08-24 23:35:25', '14.46', 1),
(29, '2025-08-24 23:35:30', '86.94', 1),
(30, '2025-08-24 23:36:09', '33.45', 1),
(31, '2025-08-24 23:37:09', '49.8', 1),
(32, '2025-08-24 23:37:52', '2.54', 1),
(33, '2025-08-24 23:37:55', '45', 1),
(34, '2025-08-24 23:38:00', '24.97', 1),
(35, '2025-08-24 23:38:03', '27.04', 1),
(36, '2025-08-24 23:38:05', '52.45', 1),
(37, '2025-08-24 23:38:06', '60.65', 1),
(38, '2025-08-24 23:38:08', '82.01', 1),
(39, '2025-08-24 23:38:10', '73.96', 1),
(40, '2025-08-24 23:38:11', '21.56', 1),
(41, '2025-08-24 23:38:14', '70.43', 1),
(42, '2025-08-24 23:38:15', '96.08', 1),
(43, '2025-08-24 23:38:16', '89.89', 1),
(44, '2025-08-24 23:38:19', '31.04', 1),
(45, '2025-08-24 23:38:20', '42.76', 1),
(46, '2025-08-24 23:38:21', '70.85', 1),
(47, '2025-08-24 23:38:24', '98.08', 1),
(48, '2025-08-24 23:38:25', '20.41', 1),
(49, '2025-08-24 23:38:26', '80.35', 1),
(50, '2025-08-24 23:38:29', '73.62', 1),
(51, '2025-08-24 23:38:30', '73.1', 1),
(52, '2025-08-24 23:38:31', '72.51', 1),
(53, '2025-08-24 23:38:34', '53.62', 1),
(54, '2025-08-24 23:38:35', '73.73', 1),
(55, '2025-08-24 23:38:36', '79.61', 1),
(56, '2025-08-24 23:38:39', '91.2', 1),
(57, '2025-08-24 23:38:40', '96.4', 1),
(58, '2025-08-24 23:38:41', '50.23', 1),
(59, '2025-08-24 23:38:44', '86.86', 1),
(60, '2025-08-24 23:38:45', '71.45', 1),
(61, '2025-08-24 23:38:46', '6.51', 1),
(62, '2025-08-24 23:38:49', '59.83', 1),
(63, '2025-08-24 23:38:50', '99.05', 1),
(64, '2025-08-24 23:38:51', '90.37', 1),
(65, '2025-08-24 23:38:54', '98.77', 1),
(66, '2025-08-24 23:38:55', '40.89', 1),
(67, '2025-08-24 23:38:56', '25.41', 1),
(68, '2025-08-24 23:38:59', '44.24', 1),
(69, '2025-08-24 23:39:00', '25.93', 1),
(70, '2025-08-24 23:39:01', '0.42', 1),
(71, '2025-08-24 23:39:18', '61.27', 1),
(72, '2025-08-24 23:39:24', '43.27', 1),
(73, '2025-08-24 23:39:29', '96.77', 1),
(74, '2025-08-24 23:39:34', '72.38', 1),
(75, '2025-08-24 23:39:39', '97.14', 1),
(76, '2025-08-24 23:39:44', '85.61', 1),
(77, '2025-08-24 23:39:49', '31.45', 1),
(78, '2025-08-24 23:39:54', '66.35', 1),
(79, '2025-08-24 23:39:59', '31.74', 1),
(80, '2025-08-24 23:40:04', '57.74', 1),
(81, '2025-08-24 23:40:09', '92.81', 1),
(82, '2025-08-24 23:40:14', '70.16', 1),
(83, '2025-08-24 23:40:19', '31.12', 1),
(84, '2025-08-24 23:41:09', '79.83', 1),
(85, '2025-08-24 23:41:19', '37.34', 1),
(86, '2025-08-24 23:41:23', '49.26', 1),
(87, '2025-08-24 23:41:28', '84.84', 1),
(88, '2025-08-24 23:41:33', '24.61', 1),
(89, '2025-08-24 23:41:38', '25.93', 1),
(90, '2025-08-24 23:41:47', '40.79', 1),
(91, '2025-08-24 23:41:52', '76.86', 1),
(92, '2025-08-24 23:41:57', '63.9', 1),
(93, '2025-08-24 23:42:02', '1.26', 1),
(94, '2025-08-24 23:42:07', '68.76', 1),
(95, '2025-08-24 23:42:12', '23.64', 1),
(96, '2025-08-24 23:42:17', '46.44', 1),
(97, '2025-08-24 23:42:22', '69.63', 1),
(98, '2025-08-24 23:42:27', '6.65', 1),
(99, '2025-08-24 23:42:32', '29.46', 1),
(100, '2025-08-24 23:42:37', '9.31', 1),
(101, '2025-08-24 23:42:42', '70.94', 1),
(102, '2025-08-24 23:42:47', '4.08', 1),
(103, '2025-08-24 23:42:52', '38.23', 1),
(104, '2025-08-24 23:42:57', '22.91', 1),
(105, '2025-08-24 23:43:02', '6.48', 1),
(106, '2025-08-24 23:43:07', '96.54', 1),
(107, '2025-08-24 23:43:12', '96.98', 1),
(108, '2025-08-24 23:43:17', '70.74', 1),
(109, '2025-08-24 23:43:22', '39.05', 1),
(110, '2025-08-24 23:43:27', '98.11', 1),
(111, '2025-08-24 23:43:32', '36.55', 1),
(112, '2025-08-24 23:43:37', '96.43', 1),
(113, '2025-08-24 23:43:42', '68.49', 1),
(114, '2025-08-24 23:43:47', '36.43', 1),
(115, '2025-08-24 23:43:52', '41.74', 1),
(116, '2025-08-24 23:43:57', '43.14', 1),
(117, '2025-08-24 23:44:02', '74.93', 1),
(118, '2025-08-24 23:44:07', '40.33', 1),
(119, '2025-08-24 23:44:41', '34.13', 1),
(120, '2025-08-24 23:44:42', '33.26', 1),
(121, '2025-08-24 23:52:12', '78.61', 1),
(122, '2025-08-24 23:52:17', '45.5', 1),
(123, '2025-08-24 23:52:22', '96.8', 1),
(124, '2025-08-24 23:52:28', '49.87', 1),
(125, '2025-08-24 23:52:33', '32.68', 1),
(126, '2025-08-24 23:52:38', '67.05', 1),
(127, '2025-08-24 23:52:43', '75.79', 1),
(128, '2025-08-24 23:52:48', '6.48', 1),
(129, '2025-08-24 23:52:53', '63.34', 1),
(130, '2025-08-24 23:52:58', '49.29', 1);

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
