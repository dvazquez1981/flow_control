//console.log('[routesDevice] cargando rutasDevice.js');

const express = require('express');
const {sanitizeMiddlewareInput}  = require('../utils/sanitize.js');

const {

    chequeoToken } =require('../controllers/UsuarioController.js')
    // chequeoGrupoUsuario,
const {
    getAll,
    getOne,
    crearComando,
    updateComando,
    deleteComando,
    getUltimoComandoByDeviceId
} = require('../controllers/ComandoController.js');

const router = express.Router();

// APIs
router.get('/comando', /*chequeoToken, */ getAll);
router.get('/comando/:cmdId', sanitizeMiddlewareInput,/* chequeoToken, */getOne);
router.post('/comando', sanitizeMiddlewareInput,chequeoToken,crearComando);
router.delete('/comando/:cmdId', sanitizeMiddlewareInput,chequeoToken,deleteComando);
router.patch('/comando/:cmdId', sanitizeMiddlewareInput,chequeoToken, updateComando);

router.get('/comando/ultima/:dispositivoId', sanitizeMiddlewareInput, /*chequeoToken, */getUltimoComandoByDeviceId);

module.exports = router;