//console.log('[routesDevice] cargando rutasDevice.js');

const express = require('express');
const {sanitizeMiddlewareInput}  = require('../utils/sanitize.js');

const {

    chequeoToken } =require('../controllers/UsuarioController.js')
    // chequeoGrupoUsuario,
const {
   getAll,
   getOne,
   crearTipoComando,
   updateTipoComando,
   deleteTipoComando,
   getAllByTipoContadorId
} = require('../controllers/TipoComandoController.js');

const router = express.Router();

// APIs
router.get('/tipoComando', /*chequeoToken, */ getAll);
router.get('/tipoComando/:tipoComandId', sanitizeMiddlewareInput,/* chequeoToken, */getOne);
router.post('/tipoComando', sanitizeMiddlewareInput,chequeoToken,crearTipoComando);
router.delete('/tipoComando/:tipoComandId', sanitizeMiddlewareInput,chequeoToken,deleteTipoComando);
router.patch('/tipoComando/:tipoComandId', sanitizeMiddlewareInput,chequeoToken, updateTipoComando);
router.get('/tipoComando/tipoContador/:tipoContadorId', sanitizeMiddlewareInput,/* chequeoToken, */   getAllByTipoContadorId);

module.exports = router;