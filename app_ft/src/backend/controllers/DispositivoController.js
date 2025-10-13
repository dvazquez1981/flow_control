const Dispositivo = require('../models/Dispositivo.js');
const { sanitize } = require('../utils/sanitize.js');
const TipoContador = require ('../models/TipoContador.js')

/** Obtener todos los dispositivos */
async function getAll(req, res) {
  try {
    const dispositivos = await Dispositivo.findAll();
    if (dispositivos && dispositivos.length > 0) {
      res.status(200).json(sanitize(dispositivos));
    } else {
      res.status(404).json({ message: 'No se encontraron dispositivos.' });
    }
  } catch (error) {
    console.error('Error al obtener dispositivos:', error);
    res.status(500).json({ error: error.message });
  }
}

/** Obtener un dispositivo por ID */
async function getOne(req, res) {
  const { dispositivoId } = req.params;

  if (dispositivoId === undefined) {
    return res.status(400).json({ message: 'dispositivoId es obligatorio', status: 0 });
  }

  const numeroDispositivoId = parseInt(dispositivoId);
  if (isNaN(numeroDispositivoId)) {
    return res.status(400).json({ message: 'El valor de dispositivoId no es un número', status: 0 });
  }

  try {
    const dispositivo = await Dispositivo.findOne({ where: { dispositivoId: numeroDispositivoId } });
    if (dispositivo) {
      res.status(200).json(sanitize(dispositivo));
    } else {
      res.status(404).json({ message: 'No se encuentra el dispositivo.' });
    }
  } catch (error) {
    console.error('Error al buscar dispositivo:', error);
    res.status(500).json({ message: 'Algo salió mal', error: error.message });
  }
}

/** Crear un nuevo dispositivo */
async function crearDevice(req, res) {
  const { nombre, ubicacion, tipoContadorId } = req.body;

  if (!nombre || !ubicacion || tipoContadorId === undefined) {
    return res.status(400).json({
      message: 'nombre, ubicacion y tipoContadorId son obligatorios',
      status: 0
    });
  }

  const numeroTipoContadorId = parseInt(tipoContadorId);
  if (isNaN(numeroTipoContadorId)) {
    return res.status(400).json({ message: 'El valor de tipoContadorId no es un número', status: 0 });
  }

  try {

    const existenteTipoContador = await TipoContador.findOne({ where: { TC_Id:numeroTipoContadorId  } });
    if (!existenteTipoContador) {
      console.log('El tipo de contador no existe.');
      return res.status(409).json({ message: 'El tipo de contador ya existe.', status: 0 });
    }


    const existingDevice = await Dispositivo.findOne({ where: { nombre } });
    if (existingDevice) {
      return res.status(409).json({ message: 'El dispositivo ya existe. Elige otro nombre.', status: 0 });
    }

    const newDevice = await Dispositivo.create({
      nombre,
      ubicacion,
      tipoContadorId: numeroTipoContadorId
    });

    res.status(201).json({ message: 'Dispositivo creado con éxito.', status: 1, data: sanitize(newDevice) });
  } catch (error) {
    console.error('Error al crear dispositivo:', error);
    res.status(500).json({ message: 'Ocurrió un error inesperado.', status: 0, error: error.message });
  }
}

/** Actualizar un dispositivo existente */
async function updateDevice(req, res) {
  const { dispositivoId } = req.params;
  const { nombre, ubicacion, tipoContadorId } = req.body;

  if (dispositivoId === undefined) {
    return res.status(400).json({ message: 'dispositivoId es obligatorio', status: 0 });
  }

  const numeroDispositivoId = parseInt(dispositivoId);
  if (isNaN(numeroDispositivoId)) {
    return res.status(400).json({ message: 'El valor de dispositivoId no es un número', status: 0 });
  }

  let numeroTipoContadorId = undefined;
  if (tipoContadorId !== undefined) {
    numeroTipoContadorId = parseInt(tipoContadorId);
    if (isNaN(numeroTipoContadorId)) {
      return res.status(400).json({ message: 'El valor de tipoContadorId no es un número', status: 0 });
    }
  }

  try {


    const existenteTipoContador = await TipoContador.findOne({ where: { TC_Id:numeroTipoContadorId  } });
    if (!existenteTipoContador) {
      console.log('El tipo de contador no existe.');
      return res.status(409).json({ message: 'El tipo de contador ya existe.', status: 0 });
    }


    const dispositivo = await Dispositivo.findOne({ where: { dispositivoId: numeroDispositivoId } });
    if (!dispositivo) {
      return res.status(404).json({ message: 'Dispositivo no encontrado.' });
    }

    await dispositivo.update({
      nombre: nombre !== undefined ? nombre : dispositivo.nombre,
      ubicacion: ubicacion !== undefined ? ubicacion : dispositivo.ubicacion,
      tipoContadorId: numeroTipoContadorId !== undefined ? numeroTipoContadorId : dispositivo.tipoContadorId
    });

    res.status(200).json({ message: 'Dispositivo actualizado correctamente.' });
  } catch (error) {
    console.error('Error al actualizar dispositivo:', error);
    res.status(500).json({ message: 'Hubo un error al actualizar', error: error.message });
  }
}

/** Eliminar un dispositivo */
async function deleteDevice(req, res) {
  const { dispositivoId } = req.params;

  if (dispositivoId === undefined) {
    return res.status(400).json({ message: 'dispositivoId es obligatorio', status: 0 });
  }

  const numeroDispositivoId = parseInt(dispositivoId);
  if (isNaN(numeroDispositivoId)) {
    return res.status(400).json({ message: 'El valor de dispositivoId no es un número', status: 0 });
  }

  try {
    const deleted = await Dispositivo.destroy({ where: { dispositivoId: numeroDispositivoId } });
    if (deleted > 0) {
      res.status(200).json({ message: 'Dispositivo eliminado correctamente.' });
    } else {
      res.status(404).json({ message: 'No existe registro.' });
    }
  } catch (error) {
    console.error('Error al eliminar dispositivo:', error);
    res.status(500).json({ message: 'Hubo un error al borrar', error: error.message });
  }
}

module.exports = {
  getAll,
  getOne,
  crearDevice,
  updateDevice,
  deleteDevice
};
