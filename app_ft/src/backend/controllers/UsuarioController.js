const Usuario  = require('../models/Usuario.js');
const jwt = require('jsonwebtoken');
const moment= require('moment-timezone');
const {sanitize}  = require('../utils/sanitize.js');
const crypto = require('crypto');

//URL del servidor central
var JWT_SECRET = 'key_transito';

/** Obtener todos los Usuarios */
async function getAll(req,res){

    try {

        const usuarios = await Usuario.findAll({
            order: [['name', 'ASC'] ]
          });
        
        if(usuarios){

            res.status(200).json({

                message:'Todos los usuarios registrados son:',
                data:usuarios

            });
        }
     
  
      } catch (error) {
          res.status(500).json({
              message:'Algo salio mal con el pedido de todos los usuarios',
              data:{error}
          });
      } 
}

/** Obtener usuario por id */
 async function getOne(req,res,next)
{
    
   var {userId}  = req.params;
    console.log(`user id: ${userId}`);

  const numeroUserId= parseInt(userId);
  if( isNaN(numeroUserId)  )
  {
    console.log('el valor de userId no es un numero');
    return res.status(400).json({
    message: 'el valor de userId no es un numero',
    status: 0,
    });
  }
        
    try {

        const userFound = await Usuario.findOne({
            where: {
                userId:numeroUserId
            }
        });

        if(userFound){
            res.status(200).json(userFound);

        }else{
            res.status(404).json({
                message: 'No se encuentra registrado el usuario.'      
            })
        }
        
    } catch (error) {
        res.status(500).json({
            message:'Algo salio mal',
            data:{error}
        });
    }
}

/** borra usuario */
async function deleteUsuario(req, res)
{
var {userId}  = req.params;


const numeroUserId= parseInt(userId);
  if( isNaN(numeroUserId)  )
  {
    console.log('el valor de userId no es un numero');
    return res.status(400).json({
    message: 'el valor de userId no es un numero',
    status: 0,
    });
  }

 try {

  await  Usuario.destroy({
        where: {
            userId:numeroUserId
        }})
        .then(function (deletedRecord) {
            if(deletedRecord > 0)
            {
                res.status(200).json({message: "Se borro correctamente"});          
            }
            else
            {
                res.status(404).json({message: "no existe registo"})
            }
        })

} catch (error) {
    res.status(500).json({
        message:'Hubo un error',
        data:{error}
    });
}
}


async function updateUsuario(req, res) {
    var {userId}  = req.params;
    const { password, descrip } = req.body;
    const numeroUserId= parseInt(userId);
    if( isNaN(numeroUserId)  )
    {
    console.log('el valor de userId no es un numero');
    return res.status(400).json({
    message: 'el valor de userId no es un numero',
    status: 0,
    });
    }
    try {
        // Buscar usuario por nombre
        const usuario = await Usuario.findOne({
            where: { userId:numeroUserId} })

        // Si no se encuentra el usuario
        if (!usuario) {
            return res.status(404).json({
                message: 'Usuario no encontrado.',
            });
        }

        // Cifrado de contraseña (opcional, solo si se proporciona una nueva contraseña)
        const hashedPassword = password 
            ? md5(password) 
            : usuario.password;

        // Actualizar campos del usuario
        await Usuario.update({
            password: hashedPassword,
            user_descrip: descrip || usuario._descrip,
        });

        // Respuesta exitosa
        return res.status(200).json({
            message: 'Usuario actualizado correctamente.',
            data:  Usuario,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Algo no funcionó correctamente.',
            error: error.message,
        });
    }
}



 async function login(req, res) {

    const {name,password,token} = req.body;


    console.log(`usuario: ${name}`);
    console.log(`password: ${password}`);
    console.log(`token: ${token}`);
    
    
    
    if (token && token !== -1) {

        // Login con token JWT o red social
        try {
            // Verifica el token JWT
            const decodedToken = jwt.verify(token, JWT_SECRET);
            const userFound = await Usuario.findOne({
               where: { name: decodedToken.name },
                attributes: [
                    'name',
                    'password',
                    'descrip',
                    
                ],

              
            });

            if (userFound) {
                // Actualizar lastLogin
                await userFound.update({ lastLogin: new Date() });
                return res.status(200).json({
                    message: 'Login ok con JWT.',
                    status: 1,
                    token: token,
                    dato: userFound,
                });
            } else {
                return res.status(401).json({
                    message: 'Token inválido o usuario no encontrado.',
                    status: 0,
                });
            }
        } catch (err) {
            console.log('Error al validar el token JWT:', err.message);
            return res.status(401).json({
                message: 'Token JWT inválido.',
                status: 0,
            });
        }
    } else {
        // Login con usuario y contraseña
        try {

             
            const passMD5 =  crypto.createHash('md5').update(password).digest('hex');
            const userFound = await Usuario.findOne({
                where: {
                    name: name,
                    password: passMD5,
                },
                attributes: [
                    'name',
                    'password',
                    'descrip'
                ],
            });
           // console.log(json(userFound))
            if (userFound) {
                // Genera un nuevo token JWT y Actualizar lastLogin
                
                const newToken = jwt.sign({ userFound }, JWT_SECRET);
                console.log(newToken)

                await Usuario.update(
                     { lastLogin: new Date() },
                      { where: { name: userFound.name } }
                            );

                
               

                return res.status(200).json({
                    message: 'Login Success.',
                    status: 1,
                    token: newToken,
                    dato: userFound,
                });
            } else {
                return res.status(401).json({
                    message: 'Fallo al iniciar sesión. Verifica usuario o contraseña.',
                    status: 0,
                });
            }
        } catch (error) {
            console.error('Error durante el login:', error);
            return res.status(500).json({
                message: 'Ocurrió un error inesperado.',
                error: error.message,
            });
        }
    }
}


/* crear usuario */
async function crearUsuario(req, res) 
 {
    const { name, password, descrip } = req.body;

    // Validar que todos los campos requeridos están presentes
    if (name===undefined || password ===undefined ) {
        return res.status(400).json({
            message: 'El nombre de usuario, la contraseña son obligatorios.',
            status: 0,
        });
    }

    try {
        // Verificar si el usuario ya existe
        const existingUser = await Usuario.findOne({ where: { name:name } });
        if (existingUser) {
            return res.status(409).json({
                message: 'El usuario ya existe. Elige un nombre de usuario diferente.',
                status: 0,
            });
        }

        // Crear un nuevo usuario
        const newUser = await Usuario.create({
            name,
            password: md5(user_password).toString(), // Encripta la contraseña
             
            descrip: descrip || '',
        });

        return res.status(201).json({
            message: 'Usuario creado con éxito.',
            status: 1,
            data: newUser,
        });
    } catch (error) {
        console.error('Error al crear el usuario:', error);
        return res.status(500).json({
            message: 'Ocurrió un error inesperado.',
            status: 0,
            error: error.message,
        });
    }
};

/*chequeo del token */
async function chequeoToken(req,res,next){

    
const bearerHeader = req.headers['token'];

    if (!bearerHeader) {
  return res.status(401).json({ message: 'Token no proporcionado.' });
}

// Separar "Bearer" del token
const token = bearerHeader.startsWith('Bearer ') ? bearerHeader.slice(7) : bearerHeader;

console.log("Token en chequeo:", token);

try {
  const decoded = jwt.verify(token, JWT_SECRET);
  req.user = decoded;
  next();
} catch (err) {
  console.error("Error al verificar token:", err);
  return res.status(403).json({ message: 'Token inválido.' });
}

 }
 



module.exports = {
  getAll,
  getOne,
  crearUsuario,
  updateUsuario,
  login,
  deleteUsuario,
  chequeoToken

};