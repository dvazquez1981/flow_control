const Respuesta = require('../models/Respuesta.js');
const { sanitize } = require('../utils/sanitize.js');

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

/** Crear una nueva respuesta */
async function crearRespuesta(req, res) {
  const { fecha, cmdId, valor, dispositivoId } = req.body;

  if (!fecha || !cmdId || !valor || !dispositivoId) {
    console.log('Faltan datos obligatorios para crear la respuesta');
    return res.status(400).json({ message: 'Faltan datos obligatorios', status: 0 });
  }

  try {
    const nuevaRespuesta = await Respuesta.create({
      fecha,
      cmdId,
      valor,
      dispositivoId
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
  const { fecha, cmdId, valor, dispositivoId } = req.body;

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
    if (!respuesta) {
      console.log("Respuesta no encontrada");
      return res.status(404).json({ message: 'Respuesta no encontrada.' });
    }

    respuesta.fecha = fecha ?? respuesta.fecha;
    respuesta.cmdId = cmdId ?? respuesta.cmdId;
    respuesta.valor = valor ?? respuesta.valor;
    respuesta.dispositivoId = dispositivoId ?? respuesta.dispositivoId;

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
  deleteRespuesta
};
