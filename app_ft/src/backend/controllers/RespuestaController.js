const Respuesta = require('../models/Respuesta.js');
const { sanitize } = require('../utils/sanitize.js');
const Dispositivo = require('../models/Dispositivo.js')
const Comando = require('../models/Comando.js')

/** Obtener todas las respuestas */
async function getAll(req, res) {
  try {
    const respuestas = await Respuesta.findAll();
    if (respuestas) {
      res.status(200).json(sanitize(respuestas));
    } else {
      console.log('No se encontraron respuestas.');
      res.status(404).json({ message: 'No se encontraron respuestas.' });
    }
  } catch (error) {
    console.error('Error al obtener las respuestas:', error);
    res.status(500).json({ error: error.message });
  }
}

/** Obtener una respuesta por ID */
async function getOne(req, res) {
  const { RespId } = req.params;

  if (RespId === undefined) {
    console.log('RespId es obligatorio');
    return res.status(400).json({ message: 'RespId es obligatorio', status: 0 });
  }

  const numeroRespId = parseInt(RespId);
  if (isNaN(numeroRespId)) {
    console.log('el valor de RespId no es un número');
    return res.status(400).json({ message: 'el valor de RespId no es un número', status: 0 });
  }

  try {
    const respuesta = await Respuesta.findOne({ where: { RespId: numeroRespId } });
    if (respuesta) {
      res.status(200).json(sanitize(respuesta));
    } else {
      console.log("Respuesta no encontrada");
      res.status(404).json({ message: 'Respuesta no encontrada.' });
    }
  } catch (error) {
    console.error('Error al obtener la respuesta:', error);
    res.status(500).json({ message: 'Algo salió mal', data: { error } });
  }
}


/** Obtener una respuesta por Cmd ID */
async function getOneByComdId(req, res) {
  const { cmdId } = req.params;

  if (cmdId === undefined) {
    console.log('cmdId es obligatorio');
    return res.status(400).json({ message: 'cmdId es obligatorio', status: 0 });
  }

  const numeroCmdId= parseInt(cmdId);
  if (isNaN(numeroCmdId)) {
    console.log('el valor de CmdId no es un número');
    return res.status(400).json({ message: 'el valor de CmdId no es un número', status: 0 });
  }

  try {
    const respuesta = await Respuesta.findOne({ where: { CmdId: cmdId} });
    console.log('Trato de obtener Respuesta con cmdId: ' +cmdId);
    res.status(200).json({ status: 1, data: respuesta ? sanitize(respuesta) : null });
  
  } catch (error) {
    console.error('Error al obtener la respuesta para CmdId :'+cmdId);
    res.status(500).json({ message: 'Algo salió mal', data: { error } });
  }
}

/** Crear una nueva respuesta */
async function crearRespuesta(req, res) {
  const { fecha, cmdId, valor, dispositivoId } = req.body;
  console.log('fecha:', fecha, 'cmdId:', cmdId, 'valor:', valor, ' dispositivoId:', dispositivoId);

  if (!fecha || !cmdId || !valor || !dispositivoId) {
    console.log('Faltan datos obligatorios para crear la respuesta');
    return res.status(400).json({ message: 'Faltan datos obligatorios', status: 0 });
  }



 const numDispositivoId = parseInt(dispositivoId);
  if (isNaN(numDispositivoId)) {
    return res.status(400).json({
      message: 'El valor de dispositivoId no es numérico',
      status: 0
    });
  }

  const numCmdId = parseInt(cmdId);
  if (isNaN(numCmdId)) {
    return res.status(400).json({
      message: 'El valor de cmdId no es numérico',
      status: 0
    });
  }

const parsedDate = new Date(fecha);
  if (isNaN(parsedDate.getTime())) {
    return res.status(400).json({
      message: 'La fecha no es válida',
      status: 0
    });
  }



  try {


     // Verificar dispositivo
    const deviceFound = await Dispositivo.findOne({
      where: { dispositivoId: numDispositivoId }
    });

    if (!deviceFound) {
      return res.status(422).json({
        message: 'El dispositivoId no existe',
        status: 0
      });
    }
   

      // Verificar cmd
    const cmdFound = await Comando.findOne({
      where: {   cmdId: numCmdId }
    });

    if (!cmdFound ) {
      return res.status(422).json({
        message: 'El cmdFound  no existe',
        status: 0
      });
    }


    const nuevaRespuesta = await Respuesta.create({
      fecha,
      cmdId:numCmdId,
      valor,
      dispositivoId:numDispositivoId
    });

    console.log('Respuesta creada con éxito');
    res.status(201).json({ message: 'Respuesta creada con éxito', status: 1, data: sanitize(nuevaRespuesta) });
  } catch (error) {
    console.error('Error al crear la respuesta:', error);
    res.status(500).json({ message: 'Ocurrió un error inesperado', status: 0, error: error.message });
  }
}

/** Actualizar una respuesta existente */
async function updateRespuesta(req, res) {
  const { RespId } = req.params;
  const { fecha, valor } = req.body;

   if (RespId === undefined) {
    console.log('RespId es obligatorio');
    return res.status(400).json({ message: 'RespId es obligatorio', status: 0 });
  }


   if (fecha !== undefined) {
       const parsedDate = new Date(fecha);
       if (isNaN(parsedDate.getTime())) {
          return res.status(400).json({
          message: 'La fecha no es válida',
          status: 0
         });
       }
      }


  if (valor === undefined) {
    console.log('valor  es obligatorio');
    return res.status(400).json({ message: 'valor es obligatorio', status: 0 });
  }

 

  const numeroRespId = parseInt(RespId);
  if (isNaN(numeroRespId)) {
    console.log('el valor de RespId no es un número');
    return res.status(400).json({ message: 'el valor de RespId no es un número', status: 0 });
  }

  try {
    const respuesta = await Respuesta.findOne({ where: { RespId: numeroRespId } });
    if (!respuesta) {
      console.log("Respuesta no encontrada");
      return res.status(404).json({ message: 'Respuesta no encontrada.' });
    }

    respuesta.fecha = fecha ?? respuesta.fecha;
    respuesta.cmdId = respuesta.cmdId;
    respuesta.valor = valor ?? respuesta.valor;
    respuesta.dispositivoId =  respuesta.dispositivoId;

    await respuesta.save();

    console.log("RespId:", numeroRespId, "actualizado correctamente");
    res.status(200).json({ message: 'Respuesta actualizada correctamente.' });
  } catch (error) {
    console.error('Error al actualizar la respuesta:', error);
    res.status(500).json({ message: 'Hubo un error al actualizar', error: error.message });
  }
}

/** Eliminar una respuesta */
async function deleteRespuesta(req, res) {
  const { RespId } = req.params;

  if (RespId === undefined) {
    console.log('RespId es obligatorio');
    return res.status(400).json({ message: 'RespId es obligatorio', status: 0 });
  }

  const numeroRespId = parseInt(RespId);
  if (isNaN(numeroRespId)) {
    console.log('el valor de RespId no es un número');
    return res.status(400).json({ message: 'el valor de RespId no es un número', status: 0 });
  }

  try {
    const deletedRecord = await Respuesta.destroy({ where: { RespId: numeroRespId } });

    if (deletedRecord > 0) {
      console.log("RespId:", numeroRespId, "se borró correctamente");
      res.status(200).json({ message: "Se borró correctamente" });
    } else {
      console.log("RespId:", numeroRespId, "no existe registro");
      res.status(404).json({ message: "No existe registro" });
    }
  } catch (error) {
    console.error('Error al borrar la respuesta:', error);
    res.status(500).json({ message: 'Hubo un error', data: { error } });
  }
}

module.exports = {
  getAll,
  getOne,
  crearRespuesta,
  updateRespuesta,
  deleteRespuesta,
  getOneByComdId
};
