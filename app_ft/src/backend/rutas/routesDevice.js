//console.log('[routesDevice] cargando rutasDevice.js');

const express = require('express');
const {sanitizeMiddlewareInput}  = require('../utils/sanitize.js');

const {

    chequeoToken } =require('../controllers/UsuarioController.js')
    // chequeoGrupoUsuario,
const {

  
    getAll,
    getOne,
    crearDevice,
    deleteDevice,
    updateDevice,
} = require('../controllers/DispositivoController.js');

const router = express.Router();

// APIs
router.get('/device', chequeoToken,  getAll);
router.get('/device/:dispositivoId', sanitizeMiddlewareInput, chequeoToken, getOne);
router.post('/device', sanitizeMiddlewareInput,chequeoToken,crearDevice);
router.delete('/device/:dispositivoId', sanitizeMiddlewareInput,chequeoToken,deleteDevice);
router.patch('/device/:dispositivoId', sanitizeMiddlewareInput,chequeoToken, updateDevice);


module.exports = router;