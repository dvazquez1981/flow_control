const express = require('express');


/** Rutas */
const router = express.Router();



const  {  
    getAll,
    login,
    chequeoGrupoUsuario,
    chequeoToken,
    getOne,
    crearUsuario,
    deleteUsuario,
    updateUsuario
    } = require('../controllers/UsuarioController.js');

/** Controladores */

/** Obtener todos  los  usuarios */
router.get('/usuario',chequeoToken, chequeoGrupoUsuario(['admin']),getAll);

/** loguearse */
router.post('/usuario/login',login);

/** Obtener datos de un usuario */
//name
router.get('/usuario/:userId',chequeoToken, chequeoGrupoUsuario(['admin']),getOne);

/** crear un usuario */
//body:
//user_name
//user_pass
//grupo
/** Crear un nuevo usuario */
router.post('/usuario', chequeoToken,chequeoGrupoUsuario(['admin']), crearUsuario);

/** borra usuario */
//:user_name
router.delete('/usuario/:userId' ,chequeoToken,chequeoGrupoUsuario(['admin']),  deleteUsuario);

/** update usuario */
//user_name
/*user_password,
  user_group,
  concesionario,
  email,
  user_descrip
*/
router.patch('/usuario/:userId',chequeoToken,  updateUsuario);

/** Exporto */
module.exports = router;
