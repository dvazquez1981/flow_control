const path = require('path');
const winston = require('winston');
const moment = require('moment-timezone');

// Obtener el entorno actual
const environment = process.env.NODE_ENV || 'development';

// Definir ruta absoluta para la carpeta log
const logDir = path.resolve(__dirname, '..', 'log');

// Formato timestamp
const timestampFormat = () =>
    moment().tz('America/Argentina/Buenos_Aires').format('YYYY-MM-DD HH:mm:ss');

const consoleFormat = winston.format.printf(({ level, message, timestamp }) => {
    return `[${timestamp}] : ${message}`;
});

// Logger Winston
const logger = winston.createLogger({
    level: environment === 'development' ? 'debug' : 'info',
    format: winston.format.combine(
        winston.format.timestamp({ format: timestampFormat }),
        environment === 'development'
            ? winston.format.combine(
                  winston.format.colorize(),
                  consoleFormat
              )
            : winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: path.join(logDir, 'DAM.log'), level: 'debug' }),
        new winston.transports.Console(),
    ],
});

// Redirigir console a logger
console.log = (...args) => logger.info(args.join(' '));
console.error = (...args) => logger.error(args.join(' '));
console.warn = (...args) => logger.warn(args.join(' '));
console.debug = (...args) => logger.debug(args.join(' '));
console.info = (...args) => logger.info(args.join(' '));

module.exports = logger;
