//console.log('[routesDevice] cargando rutasDevice.js');

const express = require('express');
const {sanitizeMiddlewareInput}  = require('../utils/sanitize.js');

const {

    chequeoToken } =require('../controllers/UsuarioController.js')
    // chequeoGrupoUsuario,
const {
   getAll,
   getOne,
   crearTipoContador,
   updateTipoContador,
   deleteTipoContador
} = require('../controllers/TipoContadorController.js');

const router = express.Router();

// APIs
router.get('/tipoContador',getAll);
router.get('/tipoContador/:TC_Id', sanitizeMiddlewareInput, /*chequeoToken,*/ getOne);
router.post('/tipoContador', sanitizeMiddlewareInput,chequeoToken,crearTipoContador);
router.delete('/tipoContador/:TC_Id', sanitizeMiddlewareInput,chequeoToken,deleteTipoContador);
router.patch('/tipoContador/:TC_Id', sanitizeMiddlewareInput,chequeoToken, updateTipoContador);

module.exports = router;