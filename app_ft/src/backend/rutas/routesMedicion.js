const express = require('express');
const {sanitizeMiddlewareInput}  = require('../utils/sanitize.js');
const {

    chequeoToken } =require('../controllers/UsuarioController.js')
const {
   
  getAll,
  //getOne,
  createMedicion,
  getAllByDeviceId,
  //deleteMedicion,
  //deleteMedicionByDeviceId,
  //updateMedicion,
  getUltimaMedicionByDeviceID

} = require('../controllers/MedicionController.js');

const router = express.Router();

// APIs
router.get('/medicion', chequeoToken,getAll);
//router.get('/medicion/:medicionId', sanitizeMiddlewareInput, chequeoToken, getOne);
router.get('/medicion/dispositivo/:dispositivoId', sanitizeMiddlewareInput/*, chequeoToken*/, getAllByDeviceId);

router.get('/medicion/ultima/:dispositivoId', sanitizeMiddlewareInput, chequeoToken, getUltimaMedicionByDeviceID);


router.post('/medicion', sanitizeMiddlewareInput, chequeoToken,createMedicion);
//router.delete('/medicion/:medicionId', sanitizeMiddlewareInput, chequeoToken, deleteMedicion);
//router.delete('/medicion/dispositivo/:dispositivoId', sanitizeMiddlewareInput, chequeoToken,deleteMedicionByDeviceId);

//router.patch('/medicion/:medicionId', sanitizeMiddlewareInput, chequeoToken, updateMedicion);





module.exports = router;