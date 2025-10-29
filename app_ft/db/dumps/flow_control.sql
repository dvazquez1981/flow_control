-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS `flow_control` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `flow_control`;

-- Configuración inicial
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- DROP TABLES
DROP TABLE IF EXISTS `LogEvento`;
DROP TABLE IF EXISTS `Estado`;
DROP TABLE IF EXISTS `Comando`;
DROP TABLE IF EXISTS `Respuesta`;
DROP TABLE IF EXISTS `Medicion`;
DROP TABLE IF EXISTS `Clasificacion`;
DROP TABLE IF EXISTS `Dispositivo`;
DROP TABLE IF EXISTS `TipoEstado`;
DROP TABLE IF EXISTS `TipoComando`;
DROP TABLE IF EXISTS `TipoContador`;

DROP TABLE IF EXISTS `userGroups`;

-- TABLA userGroups
CREATE TABLE `userGroups` (
  `cod` varchar(20) NOT NULL,
  `denom` varchar(255) NOT NULL,
  PRIMARY KEY (`cod`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `userGroups` (`cod`, `denom`) VALUES
('admin', 'AREA admin'),
('lector', 'AREA lectora'),
('conces', 'AREA CONCESIONARIOS'),
('grupodummie', 'grupo superprueba');

-- TABLA TipoContador
CREATE TABLE `TipoContador` (
  `TC_Id` INT NOT NULL AUTO_INCREMENT,
  `TC_TipoContador` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`TC_Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `TipoContador` (TC_TipoContador)
VALUES ('DTEC'), ('PADR');

-- TABLA Dispositivo
CREATE TABLE `Dispositivo` (
  `dispositivoId` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(200),
  `ubicacion` VARCHAR(200),
  `tipoContadorId` INT NOT NULL,
  PRIMARY KEY (`dispositivoId`),
  FOREIGN KEY (`tipoContadorId`) REFERENCES `TipoContador`(`TC_Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `Dispositivo` (`nombre`, `ubicacion`, `tipoContadorId`) VALUES
('contador 1', 'sarasa', 1),
('contador 2', 'tres arroyos', 2),
('contador 3', 'gorostiaga', 1);

-- TABLA TipoEstado
CREATE TABLE `TipoEstado` (
  `tipoEstadoId` INT NOT NULL AUTO_INCREMENT,
  `descripcion` VARCHAR(50) NOT NULL,
  `tipoContadorId` INT NOT NULL,
  PRIMARY KEY (`tipoEstadoId`),
  FOREIGN KEY (`tipoContadorId`) REFERENCES `TipoContador`(`TC_Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- TABLA Estado
CREATE TABLE `Estado` (
  `estadoId` INT NOT NULL AUTO_INCREMENT,
  `fecha` DATETIME DEFAULT NULL,
  `tipoEstadoId` INT NOT NULL,
  `valor` VARCHAR(50) NOT NULL,
  `dispositivoId` INT NOT NULL,
  PRIMARY KEY (`estadoId`),
  FOREIGN KEY (`tipoEstadoId`) REFERENCES `TipoEstado`(`tipoEstadoId`),
  FOREIGN KEY (`dispositivoId`) REFERENCES `Dispositivo`(`dispositivoId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- TABLA TipoComando
CREATE TABLE `TipoComando` (
  `tipoComandId` INT NOT NULL AUTO_INCREMENT,
  `descripcion` VARCHAR(50) NOT NULL,
  `tipoContadorId` INT NOT NULL,
  PRIMARY KEY (`tipoComandId`),
  FOREIGN KEY (`tipoContadorId`) REFERENCES `TipoContador`(`TC_Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- TABLA Comando
CREATE TABLE `Comando` (
  `cmdId` INT NOT NULL AUTO_INCREMENT,
  `fecha` DATETIME DEFAULT NULL,
  `tipoComandId` INT NOT NULL,
  `valor` VARCHAR(50) NOT NULL,
  `dispositivoId` INT NOT NULL,
  PRIMARY KEY (`cmdId`),
  FOREIGN KEY (`tipoComandId`) REFERENCES `TipoComando`(`tipoComandId`),
  FOREIGN KEY (`dispositivoId`) REFERENCES `Dispositivo`(`dispositivoId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- TABLA Respuesta
CREATE TABLE `Respuesta` (
  `RespId` INT NOT NULL AUTO_INCREMENT,
  `fecha` DATETIME DEFAULT NULL,
  `cmdId` INT NOT NULL,
  `valor` VARCHAR(50) NOT NULL,
  `dispositivoId` INT NOT NULL,
  PRIMARY KEY (`RespId`),
  FOREIGN KEY (`cmdId`) REFERENCES `Comando`(`cmdId`),
  FOREIGN KEY (`dispositivoId`) REFERENCES `Dispositivo`(`dispositivoId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- TABLA Clasificacion
CREATE TABLE `Clasificacion` (
  `clasificacionId` INT NOT NULL AUTO_INCREMENT,
  `descripcion` VARCHAR(50) NOT NULL,
  `tipoContadorId` INT NOT NULL,
  PRIMARY KEY (`clasificacionId`),
  FOREIGN KEY (`tipoContadorId`) REFERENCES `TipoContador`(`TC_Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `Clasificacion` (`descripcion`, `tipoContadorId`) VALUES
('liviano',1),
('pesado',1);

-- TABLA Medicion
CREATE TABLE `Medicion` (
  `medicionId` INT NOT NULL AUTO_INCREMENT,
  `fecha` DATETIME NOT NULL,
  `valor` INT NOT NULL,
  `carril` TINYINT NOT NULL,
  `clasificacionId` INT NOT NULL,
  `dispositivoId` INT NOT NULL,
  PRIMARY KEY (`medicionId`),
  FOREIGN KEY (`clasificacionId`) REFERENCES `Clasificacion`(`clasificacionId`),
  FOREIGN KEY (`dispositivoId`) REFERENCES `Dispositivo`(`dispositivoId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


DROP TABLE IF EXISTS `Usuario`;
-- TABLA Usuario
CREATE TABLE `Usuario` (
  `userId` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(30) NOT NULL,
  `password` VARCHAR(256) NOT NULL,
  `descrip` VARCHAR(30) DEFAULT NULL,
  `lastLogin` DATETIME DEFAULT NULL,
  PRIMARY KEY (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `Usuario` (`name`, `password`, `descrip`, `lastLogin`) VALUES
('admin', '21232f297a57a5a743894a0e4a801fc3', NULL, '2025-08-24 23:07:03');

-- TABLA LogEvento
CREATE TABLE `LogEvento` (
  `logId` INT NOT NULL AUTO_INCREMENT,
  `fecha` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `tipo` ENUM('INFO','WARN','ERROR','COMANDO','RESPUESTA','ESTADO','MEDICION','SISTEMA') NOT NULL,
  `entidad` VARCHAR(50) DEFAULT NULL,
  `entidadId` INT DEFAULT NULL,
  `mensaje` TEXT NOT NULL,
  `dispositivoId` INT DEFAULT NULL,
  `userId` INT DEFAULT NULL,
  PRIMARY KEY (`logId`),
  FOREIGN KEY (`dispositivoId`) REFERENCES `Dispositivo`(`dispositivoId`),
  FOREIGN KEY (`userId`) REFERENCES `Usuario`(`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

COMMIT;
