//console.log('[routesDevice] cargando rutasDevice.js');

const express = require('express');
const {sanitizeMiddlewareInput}  = require('../utils/sanitize.js');

const {

    chequeoToken } =require('../controllers/UsuarioController.js')
    // chequeoGrupoUsuario,
const {
   getAll,
   getOne,
   crearRespuesta,
   updateRespuesta,
   deleteRespuesta,
   getOneByComdId
} = require('../controllers/RespuestaController.js');

const router = express.Router();

// APIs
router.get('/respuesta', /*chequeoToken, */ getAll);
router.get('/respuesta/:RespId', sanitizeMiddlewareInput,/* chequeoToken, */getOne);
router.post('/respuesta', sanitizeMiddlewareInput,chequeoToken,crearRespuesta);
router.delete('/respuesta/:RespId', sanitizeMiddlewareInput,chequeoToken, deleteRespuesta);
router.patch('/respuesta/:RespId', sanitizeMiddlewareInput,chequeoToken,updateRespuesta);
router.get('/respuesta/comando/:cmdId', sanitizeMiddlewareInput,/* chequeoToken, */  getOneByComdId);

module.exports = router;