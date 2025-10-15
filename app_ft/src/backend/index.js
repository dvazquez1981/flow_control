//=======[ Settings, Imports & Data ]==========================================
var PORT    = 3000;

var express = require('express')
var mqtt=require('./mqtt/mqttService');

var cors = require('cors')
var morgan = require('morgan')
var logger = require('./utils/logger.js') // Importación del logger

var app = express();

const corsOptions = {
    // Solo para desarrollo
    origin: '*',
}

// to parse application/json
app.use(express.json()); 
// to serve static files
app.use(express.static('/home/node/app/static/'));

app.use(cors(corsOptions))

const rutasDevice = require( './rutas/routesDevice.js')
const rutasMedicion = require( './rutas/routesMedicion.js')
const rutasUsuario= require('./rutas/routesUsuario.js')
const rutasComando= require('./rutas/routesComando.js')
const rutasRespuesta=require('./rutas/routesRespuesta.js')
const rutasTipoComando=require('./rutas/routesTipoComando.js')
//ruta
app.use(rutasRespuesta);
app.use(rutasDevice);
app.use(rutasMedicion);
app.use(rutasUsuario);
app.use(rutasTipoComando);
app.use(rutasComando);


// Ruta simple para comprobar el estado del servidor
app.get('/', function(req, res) {
    res.json({
        "mensaje": "servidor api rest esta corriendo",
        "status": "online",
        "puerto": app.get('port')
    });
});

app.listen(PORT, function(req, res) {
    console.log("Servidor api rest esta corriendo");
});

//=======[ End of file ]=======================================================
