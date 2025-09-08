//console.log('[routesDevice] cargando rutasDevice.js');

const express = require('express');
const {sanitizeMiddlewareInput}  = require('../utils/sanitize.js');
const {

    chequeoToken } =require('../controllers/UsuarioController.js')
const {
   
    getAll,
    getOne,
    crearLog_Riego,
    deleteLog_Riego,
    updateLog_Riego,
    getAllByElectrovalvulaId
} = require('../controllers/Log_RiegoController.js');

const router = express.Router();

// APIs
router.get('/log_riego', chequeoToken, getAll);
router.get('/log_riego/:logRiegoId', sanitizeMiddlewareInput, chequeoToken, getOne);
router.post('/log_riego', sanitizeMiddlewareInput, chequeoToken,crearLog_Riego);
router.delete('/log_riego/:logRiegoId', sanitizeMiddlewareInput, chequeoToken,deleteLog_Riego);
router.patch('/log_riego/:logRiegoId', sanitizeMiddlewareInput, chequeoToken, updateLog_Riego);
router.get('/log_riego/electrovalvula/:electrovalvulaId', sanitizeMiddlewareInput, chequeoToken, getAllByElectrovalvulaId);


module.exports = router;