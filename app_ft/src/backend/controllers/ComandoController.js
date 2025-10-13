// app_ft/src/backend/controllers/estadoController.js

const Estado = require('../models/Estado.js');
const Dispositivo = require('../models/Dispositivo.js');
const { sanitize } = require('../utils/sanitize.js');

async function getAll(req, res) {
  try {
    console.log('Obtengo todos los estados');
    const estados = await Estado.findAll();
    if (estados && estados.length > 0) {
      res.status(200).json(sanitize(estados));
    } else {
      console.log('No se encontraron estados.');
      res.status(404).json({ message: 'No se encontraron estados.' });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
}

async function getOne(req, res) {
  const { estadoId } = req.params;
  console.log("get estadoId:", estadoId);

  if (estadoId === undefined) {
    console.log('estadoId es obligatorio');
    return res.status(400).json({
      message: 'estadoId es obligatorio',
      status: 0,
    });
  }

  const numeroEstadoId = parseInt(estadoId);
  if (isNaN(numeroEstadoId)) {
    console.log('El valor de estadoId no es un número');
    return res.status(400).json({
      message: 'El valor de estadoId no es un número',
      status: 0,
    });
  }

  try {
    const estado = await Estado.findOne({ where: { estadoId: numeroEstadoId } });
    if (estado) {
      console.log("Estado encontrado");
      res.status(200).json(sanitize(estado));
    } else {
      console.log("No se encontró estado");
      res.status(404).json({ message: 'No se encuentra el Estado.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Algo salió mal',
      data: { error },
    });
  }
}

async function crearEstado(req, res) {
  const { fecha, tipoEstadoId, valor, dispositivoId } = req.body;
  console.log(`fecha: ${fecha}, tipoEstadoId: ${tipoEstadoId}, valor: ${valor}, dispositivoId: ${dispositivoId}`);

  if (fecha === undefined || tipoEstadoId === undefined || valor === undefined || dispositivoId === undefined) {
    console.log('Todos los campos son obligatorios.');
    return res.status(400).json({
      message: 'fecha, tipoEstadoId, valor y dispositivoId son obligatorios.',
      status: 0,
    });
  }

  const numeroDispositivoId = parseInt(dispositivoId);
  if (isNaN(numeroDispositivoId)) {
    console.log('El valor de dispositivoId no es un número');
    return res.status(400).json({
      message: 'El valor de dispositivoId no es un número',
      status: 0,
    });
  }

  try {
    const existingDevice = await Dispositivo.findOne({ where: { dispositivoId: numeroDispositivoId } });

    if (!existingDevice) {
      console.log('El dispositivo no existe.');
      return res.status(409).json({
        message: `El dispositivo con ID ${numeroDispositivoId} no existe.`,
        status: 0,
      });
    }

    const nuevoEstado = await Estado.create({
      fecha,
      tipoEstadoId,
      valor,
      dispositivoId: numeroDispositivoId,
    });

    console.log('Estado creado con éxito.');
    return res.status(201).json({
      message: 'Estado creado con éxito.',
      status: 1,
      data: sanitize(nuevoEstado),
    });
  } catch (error) {
    console.error('Error al crear el estado:', error);
    return res.status(500).json({
      message: 'Ocurrió un error inesperado.',
      status: 0,
      error: error.message,
    });
  }
}

async function updateEstado(req, res) {
  const { estadoId } = req.params;
  const { fecha, tipoEstadoId, valor, dispositivoId } = req.body;
  console.log(`estadoId: ${estadoId}, fecha: ${fecha}, tipoEstadoId: ${tipoEstadoId}, valor: ${valor}, dispositivoId: ${dispositivoId}`);

  if (estadoId === undefined) {
    console.log('estadoId es obligatorio');
    return res.status(400).json({
      message: 'estadoId es obligatorio',
      status: 0,
    });
  }

  const numeroEstadoId = parseInt(estadoId);
  if (isNaN(numeroEstadoId)) {
    console.log('El valor de estadoId no es un número');
    return res.status(400).json({
      message: 'El valor de estadoId no es un número',
      status: 0,
    });
  }

  let numeroDispositivoId = undefined;
  if (dispositivoId !== undefined) {
    numeroDispositivoId = parseInt(dispositivoId);
    if (isNaN(numeroDispositivoId)) {
      console.log('El valor de dispositivoId no es un número');
      return res.status(400).json({
        message: 'El valor de dispositivoId no es un número',
        status: 0,
      });
    }
  }

  try {
    const estado = await Estado.findOne({ where: { estadoId: numeroEstadoId } });

    if (!estado) {
      console.log(`estadoId: ${numeroEstadoId} no encontrado`);
      return res.status(404).json({ message: 'Estado no encontrado.' });
    }

    if (numeroDispositivoId !== undefined) {
      const existingDevice = await Dispositivo.findOne({ where: { dispositivoId: numeroDispositivoId } });

      if (!existingDevice) {
        console.log(`El dispositivo con ID ${numeroDispositivoId} no existe.`);
        return res.status(409).json({
          message: `El dispositivo con ID ${numeroDispositivoId} no existe.`,
          status: 0,
        });
      }
    }

    // Actualizo usando ?? para no sobreescribir campos existentes
    estado.fecha = fecha ?? estado.fecha;
    estado.tipoEstadoId = tipoEstadoId ?? estado.tipoEstadoId;
    estado.valor = valor ?? estado.valor;
    estado.dispositivoId = numeroDispositivoId ?? estado.dispositivoId;

    await estado.save();

    console.log(`estadoId: ${numeroEstadoId} se actualizó correctamente`);
    res.status(200).json({ message: 'Estado actualizado correctamente.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Algo no funcionó',
      data: { error },
    });
  }
}

async function deleteEstado(req, res) {
  const { estadoId } = req.params;

  if (estadoId === undefined) {
    console.log('estadoId es obligatorio');
    return res.status(400).json({
      message: 'estadoId es obligatorio',
      status: 0,
    });
  }

  const numeroEstadoId = parseInt(estadoId);
  if (isNaN(numeroEstadoId)) {
    console.log('El valor de estadoId no es un número');
    return res.status(400).json({
      message: 'El valor de estadoId no es un número',
      status: 0,
    });
  }

  try {
    const deletedRecord = await Estado.destroy({ where: { estadoId: numeroEstadoId } });

    if (deletedRecord > 0) {
      console.log(`estadoId: ${numeroEstadoId} se borró correctamente`);
      res.status(200).json({ message: "Se borró correctamente" });
    } else {
      console.log(`estadoId: ${numeroEstadoId} no existe registro`);
      res.status(404).json({ message: "No existe registro" });
    }
  } catch (error) {
    console.error('Error al borrar estado:', error);
    res.status(500).json({
      message: 'Hubo un error al intentar borrar',
      data: { error },
    });
  }
}

module.exports = {
  getAll,
  getOne,
  crearEstado,
  updateEstado,
  deleteEstado
};
