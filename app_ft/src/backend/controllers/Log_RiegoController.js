const Log_Riego= require('../models/Log_Riego.js');
const Electrovalvula = require('../models/GrupoUsuario.js');
const {sanitize}  = require('../utils/sanitize.js');

async function getAll(req, res) {
  try {
    console.log('Obtengo todos los Log_Riego');
    const e = await Log_Riego.findAll();
    if (e) {
      res.status(200).json(sanitize(e));
    }
    else {

        console.log('No se encontraron Log_Riegos.')
            res.status(404).json({ message: 'No se encontraron Log_Riego.' });
        }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
}

async function getAllByElectrovalvulaId(req, res) {
  const {electrovalvulaId} = req.params;
  
  try {
   const e = await Log_Riego.findAll({
  where: { electrovalvulaId: electrovalvulaId },
  order: [['fecha', 'DESC']],
  limit: 20
});

    if (e) {
      res.status(200).json(sanitize(e));
    }
    else {

        console.log('No se encontraron Log_Riegos.')
            res.status(404).json({ message: 'No se encontraron Log_Riego.' });
        }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
}



async function getOne(req, res) {
  const {logRiegoId} = req.params;
  console.log("Get logRiegoId: " + logRiegoId)

if (logRiegoId===undefined) {
    console.log('logRiegoId es obligatorios');
    return res.status(400).json({
      message: 'logRiegoId es obligatorio',
      status: 0,
    });
  }

   const numeroLogRiegoId= parseInt(logRiegoId);
  if( isNaN(numeroLogRiegoId)  )
  {
    console.log('el valor de LogRiegoId no es un numero');
    return res.status(400).json({
    message: 'el valor de LogRiegoId no es un numero',
    status: 0,
    });
  }




  try {
    const l= await Log_Riego.findOne({
      where: { logRiegoId: numeroLogRiegoId }
    });

    if (l) {
      console.log("Se encontró");
      res.status(200).json(sanitize(l));
    } else {
      console.log("No se encuentra Log_Riego.");
      res.status(404).json({ message: 'No se encuentra Log_Riego.' });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Algo salió mal',
      data: { error }
    });
  }
}

async function crearLog_Riego(req, res) {
  const { apertura, fecha ,electrovalvulaId } = req.body;
  console.log("ingreso: electrovalvulaId: " + electrovalvulaId+ " fecha: " +fecha + " apertura: "+apertura );

   
  if(apertura===undefined || fecha===undefined || electrovalvulaId===undefined) 
  {
    console.log('los valores apertura, fecha y electrovalvulaid son obligatorios.');
    return res.status(400).json({
      message: 'los valores apertura, fecha y electrovalvulaid son obligatorios.',
      status: 0,
    });
  }
  
    // Verificar que fecha sea una fecha válida
  const parsedDate = new Date(fecha);
     if (isNaN(parsedDate.getTime())) {
          console.log('fecha no válida');
         return res.status(400).json({
            message: 'La fecha no es válida',
        status: 0
    });
     } 

  
  const numeroElectrovalvulaId= parseInt(electrovalvulaId);
  if( isNaN(numeroElectrovalvulaId)  )
  {
    console.log('el valor de electrovalvulaId no es un numero');
    return res.status(400).json({
    message: 'el valor de electrovalvulaId no es un numero',
    status: 0,
    });
  }

  
  const numeroApertura = parseInt(apertura);
  if( isNaN(numeroApertura)  || !(numeroApertura==0 || numeroApertura==1) )
  {
    console.log('el valor de apertura esta mal definido debe ser 0 o 1');
    return res.status(400).json({
    message: 'el valor de apertura esta mal definido debe ser 0 o 1',
    status: 0,
    });
  }


  try {
      const existingElectrovalvula = await Electrovalvula.findOne({
      where: {electrovalvulaId: numeroElectrovalvulaId}
    });

    if (!existingElectrovalvula) {
      console.log('la Electrovalvula no existe.');
      return res.status(409).json({
        message: 'la Electrovalvula no existe.',
        status: 0,
      });
    }

  

    const newLog_Riego = await Log_Riego.create({
      fecha: fecha,
      electrovalvulaId:numeroElectrovalvulaId,
      apertura:apertura
    });

    console.log('Log_Riego creado con éxito.');
    return res.status(201).json({
      message: 'Log_Riego creado con éxito.',
      status: 1,
      data: sanitize(newLog_Riego)
    });

  } catch (error) {
    console.error('Error al crear el Log_Riego:', error);
    return res.status(500).json({
      message: 'Ocurrió un error inesperado.',
      status: 0,
      error: error.message,
    });
  }





}

async function deleteLog_Riego(req, res) {
  const {logRiegoId} = req.params;


 if (logRiegoId===undefined) {
    console.log('logRiegoId es obligatorios');
    return res.status(400).json({
      message: 'logRiegoId es obligatorio',
      status: 0,
    });
  }

   const numeroLogRiegoId= parseInt(logRiegoId);
  if( isNaN(numeroLogRiegoId)  )
  {
    console.log('el valor de LogRiegoId no es un numero');
    return res.status(400).json({
    message: 'el valor de LogRiegoId no es un numero',
    status: 0,
    });
  }

  try {
    const deletedRecord = await Log_Riego.destroy({
      where: { elogRiegoId: numeroLogRiegoId }
    });

    if (deletedRecord > 0) {
      console.log("id: " + numeroLogRiegoId + " se borró correctamente");
      res.status(200).json({ message: "Se borró correctamente" });
    } else {
      console.log("id: " + numeroLogRiegoId + " no existe registro");
      res.status(404).json({ message: "No existe registro" });
    }

  } catch (error) {
    console.error('Error al borrar: ', error);
    res.status(500).json({
      message: 'Hubo un error',
      data: { error }
    });
  }
}



async function updateLog_Riego(req, res) {
  const { logRiegoId } = req.params;
  const { apertura, fecha ,electrovalvulaId} = req.body;
  console.log("update logRiegoId: " +logRiegoId + " electrovalvulaId: " + electrovalvulaId+ " fecha: " + fecha + " apertura: "+apertura );
  
  if(logRiegoId===undefined) 
  {
    console.log('logRiegoId  es obligatorio.');
    return res.status(400).json({
      message: 'logRiegoId  es obligatorio.',
      status: 0,
    });
  }


  
  numeroLogRiegoId= parseInt(logRiegoId);
  if( isNaN(numeroLogRiegoId) )
  {
    console.log('numeroLogRiegoId debe ser un numero');
    return res.status(400).json({
    message: 'numeroLogRiegoId debe ser un numero',
    status: 0,
    });
  }
  

  
  if(fecha!==undefined)
  {
    // Verificar que fecha sea una fecha válida
  const parsedDate = new Date(fecha);
     if (isNaN(parsedDate.getTime())) {
          console.log('fecha no válida');
         return res.status(400).json({
            message: 'La fecha no es válida',
        status: 0
    });
     } 
  }
  
  var numeroElectrovalvulaId=undefined;
  if(electrovalvulaId!==undefined)
  {
   numeroElectrovalvulaId= parseInt(electrovalvulaId);
  if( isNaN(numeroElectrovalvulaId) )
  {
    console.log('ElectrovalvulaId debe ser un numero');
    return res.status(400).json({
    message: 'ElectrovalvulaId debe ser un numero',
    status: 0,
    });
  }
  }

  var numeroApertura=undefined;
  if(apertura!==undefined)
  {
   numeroApertura= parseInt(apertura);
  if( isNaN(numeroApertura)  ||   !(numeroApertura==0 || numeroApertura==1) )
  {
    console.log('el valor de apertura esta mal definido debe ser 0 o 1');
    return res.status(400).json({
    message: 'el valor de apertura esta mal definido debe ser 0 o 1',
    status: 0,
    });
  }
  }

  try {

      const existingElectrovalvula= await Electrovalvula.findOne({
      where: { electrovalvulaId: numeroElectrovalvulaId }
        });
    
        if (!existingElectrovalvula) {
            console.log('la electrovalvula: ' + numeroElectrovalvulaId +' no existe.');
          return res.status(409).json({
           message: 'la electrovalvula: ' + numeroElectrovalvulaId +' no existe.',
           status: 0,
         });
        }

      const l = await Log_Riego.findOne({
      where: { logRiegoId: numeroLogRiegoId},
      attributes: ['logRiegoId', 'fecha',  'apertura', 'electrovalvulaId']
    });

       if (!l ) {
      console.log("logRiegoId: " + numeroLogRiegoId+ " no encontrado");
      return res.status(404).json({ message: "logRiegoId: " + logRiegoId+ " no encontrado" });
      }
    

    await l.update({
      logRiegoId: numeroLogRiegoId,
      fecha:fecha !== undefined ?   fecha:l.fecha,
      apertura:apertura !== undefined ?   apertura:l.apertura,
      electrovalvulaId:numeroElectrovalvulaId  !== undefined ?   numeroElectrovalvulaId:l.electrovalvulaId
    });

  
    console.log(" logRiegoId: " +  logRiegoId+ " se actualizó correctamente");
    res.status(200).json({ message: ' Log_Riego se actualizó correctamente.' });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Algo no funcionó',
      data: { error }
    });
  }
}

module.exports = {
  getAll,
  getOne,
  crearLog_Riego,
  deleteLog_Riego,
  updateLog_Riego,
  getAllByElectrovalvulaId,
};