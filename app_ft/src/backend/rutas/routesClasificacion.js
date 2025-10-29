//console.log('[routesDevice] cargando rutasDevice.js');

const express = require('express');
const {sanitizeMiddlewareInput}  = require('../utils/sanitize.js');

const {

    chequeoToken } =require('../controllers/UsuarioController.js')
    // chequeoGrupoUsuario,
const {
   getAll,
   getOne,
   crearClasificacion,
   updateClasificacion,
   deleteClasificacion
} = require('../controllers/ClasificacionController.js');

const router = express.Router();

// APIs
router.get('/clasificacion',getAll);
router.get('/clasificacion/:clasificacionId/:tipoContadorId', sanitizeMiddlewareInput, /*chequeoToken,*/ getOne);
router.post('/clasificacion', sanitizeMiddlewareInput,chequeoToken,crearClasificacion);
router.delete('/clasificacion/:clasificacionId', sanitizeMiddlewareInput,chequeoToken,deleteClasificacion);
router.patch('/clasificacion/:clasificacionId', sanitizeMiddlewareInput,chequeoToken, updateClasificacion);

module.exports = router;