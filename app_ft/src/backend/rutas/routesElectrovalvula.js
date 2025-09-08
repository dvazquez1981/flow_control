//console.log('[routesDevice] cargando rutasDevice.js');

const express = require('express');
const {sanitizeMiddlewareInput}  = require('../utils/sanitize.js');
const {

    chequeoToken } =require('../controllers/UsuarioController.js')
const {
  
    getAll,
    getOne,
    crearElectrovalvula,
    deleteElectrovalvula,
    updateElectrovalvula,
} = require('../controllers/ElectrovalvulaController.js');

const router = express.Router();

// APIs
router.get('/electrovalvula', chequeoToken, getAll);
router.get('/electrovalvula/:electrovalvulaId', sanitizeMiddlewareInput, chequeoToken, getOne);
router.post('/electrovalvula', sanitizeMiddlewareInput, chequeoToken,crearElectrovalvula);
router.delete('/electrovalvula/:electrovalvulaId', sanitizeMiddlewareInput, chequeoToken, deleteElectrovalvula);
router.patch('/electrovalvula/:electrovalvulaId', sanitizeMiddlewareInput, chequeoToken, updateElectrovalvula);


module.exports = router;