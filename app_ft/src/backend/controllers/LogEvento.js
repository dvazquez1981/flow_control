const LogEvento = require('../models/LogEvento.js');
const { sanitize } = require('../utils/sanitize.js');

/** Obtener todos los logs de evento */
async function getAll(req, res) {
  try {
    const logs = await LogEvento.findAll();
    if (logs) {
      res.status(200).json(sanitize(logs));
    } else {
      console.log('No se encontraron logs de evento.');
      res.status(404).json({ message: 'No se encontraron logs de evento.' });
    }
  } catch (error) {
    console.error('Error al obtener los logs de evento:', error);
    res.status(500).json({ error: error.message });
  }
}

/** Obtener un log de evento por ID */
async function getOne(req, res) {
  const { logId } = req.params;

  if (logId === undefined) {
    console.log('logId es obligatorio');
    return res.status(400).json({ message: 'logId es obligatorio', status: 0 });
  }

  const numeroLogId = parseInt(logId);
  if (isNaN(numeroLogId)) {
    console.log('el valor de logId no es un número');
    return res.status(400).json({ message: 'el valor de logId no es un número', status: 0 });
  }

  try {
    const log = await LogEvento.findOne({ where: { logId: numeroLogId } });
    if (log) {
      res.status(200).json(sanitize(log));
    } else {
      console.log("Log de evento no encontrado");
      res.status(404).json({ message: 'Log de evento no encontrado.' });
    }
  } catch (error) {
    console.error('Error al obtener el log de evento:', error);
    res.status(500).json({ message: 'Algo salió mal', data: { error } });
  }
}

/** Crear un nuevo log de evento */
async function crearLogEvento(req, res) {
  const { fecha, tipo, entidad, entidadId, mensaje, dispositivoId, userId } = req.body;

  if (!fecha || !tipo || !entidad || !entidadId || !mensaje || !dispositivoId || !userId) {
    console.log('Faltan datos obligatorios para crear el log de evento');
    return res.status(400).json({ message: 'Faltan datos obligatorios', status: 0 });
  }

  try {
    const newLog = await LogEvento.create({
      fecha,
      tipo,
      entidad,
      entidadId,
      mensaje,
      dispositivoId,
      userId
    });

    console.log('Log de evento creado con éxito');
    res.status(201).json({ message: 'Log creado con éxito', status: 1, data: sanitize(newLog) });
  } catch (error) {
    console.error('Error al crear el log de evento:', error);
    res.status(500).json({ message: 'Ocurrió un error inesperado', status: 0, error: error.message });
  }
}

/** Actualizar un log de evento existente */
async function updateLogEvento(req, res) {
  const { logId } = req.params;
  const { fecha, tipo, entidad, entidadId, mensaje, dispositivoId, userId } = req.body;

  if (logId === undefined) {
    console.log('logId es obligatorio');
    return res.status(400).json({ message: 'logId es obligatorio', status: 0 });
  }

  const numeroLogId = parseInt(logId);
  if (isNaN(numeroLogId)) {
    console.log('el valor de logId no es un número');
    return res.status(400).json({ message: 'el valor de logId no es un número', status: 0 });
  }

  try {
    const log = await LogEvento.findOne({ where: { logId: numeroLogId } });
    if (!log) {
      console.log("Log de evento no encontrado");
      return res.status(404).json({ message: 'Log de evento no encontrado.' });
    }

    log.fecha = fecha ?? log.fecha;
    log.tipo = tipo ?? log.tipo;
    log.entidad = entidad ?? log.entidad;
    log.entidadId = entidadId ?? log.entidadId;
    log.mensaje = mensaje ?? log.mensaje;
    log.dispositivoId = dispositivoId ?? log.dispositivoId;
    log.userId = userId ?? log.userId;

    await log.save();

    console.log("logId:", numeroLogId, "actualizado correctamente");
    res.status(200).json({ message: 'Log de evento actualizado correctamente.' });
  } catch (error) {
    console.error('Error al actualizar el log de evento:', error);
    res.status(500).json({ message: 'Hubo un error al actualizar', error: error.message });
  }
}

/** Eliminar un log de evento */
async function deleteLogEvento(req, res) {
  const { logId } = req.params;

  if (logId === undefined) {
    console.log('logId es obligatorio');
    return res.status(400).json({ message: 'logId es obligatorio', status: 0 });
  }

  const numeroLogId = parseInt(logId);
  if (isNaN(numeroLogId)) {
    console.log('el valor de logId no es un número');
    return res.status(400).json({ message: 'el valor de logId no es un número', status: 0 });
  }

  try {
    const deletedRecord = await LogEvento.destroy({ where: { logId: numeroLogId } });

    if (deletedRecord > 0) {
      console.log("logId:", numeroLogId, "se borró correctamente");
      res.status(200).json({ message: "Se borró correctamente" });
    } else {
      console.log("logId:", numeroLogId, "no existe registro");
      res.status(404).json({ message: "No existe registro" });
    }
  } catch (error) {
    console.error('Error al borrar el log de evento:', error);
    res.status(500).json({ message: 'Hubo un error', data: { error } });
  }
}

module.exports = {
  getAll,
  getOne,
  crearLogEvento,
  updateLogEvento,
  deleteLogEvento
};
