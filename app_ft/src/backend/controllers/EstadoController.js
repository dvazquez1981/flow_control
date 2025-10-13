// app_ft/src/backend/controllers/estadoController.js

const ftdb = require('../bd/ftdb.js');
const { Sequelize, DataTypes } = require('sequelize');
const Estado = require('../models/Estado.js');

/** Controlador de Estado */
async function getAll() {
  try {
    return await Estado.findAll();
  } catch (error) {
    console.error('Error al obtener los estados:', error);
    throw error;
  }
}

async function getOne(id) {
  try {
    return await Estado.findByPk(id);
  } catch (error) {
    console.error('Error al obtener el estado:', error);
    throw error;
  }
}

async function crearEstado(datos) {
  try {
    return await Estado.create({
      fecha: datos.fecha,
      tipoEstadoId: datos.tipoEstadoId,
      valor: datos.valor,
      dispositivoId: datos.dispositivoId
    });
  } catch (error) {
    console.error('Error al crear el estado:', error);
    throw error;
  }
}

async function updateEstado(req, res) {
  const { estadoId } = req.params;
  const { fecha, tipoEstadoId, valor, dispositivoId } = req.body;

  if (estadoId === undefined) {
    return res.status(400).json({ message: 'estadoId es obligatorio', status: 0 });
  }

  const numeroEstadoId = parseInt(estadoId);
  if (isNaN(numeroEstadoId)) {
    return res.status(400).json({ message: 'el valor de estadoId no es un número', status: 0 });
  }

  const numeroDispositivoId = dispositivoId !== undefined ? parseInt(dispositivoId) : undefined;
  if (dispositivoId !== undefined && isNaN(numeroDispositivoId)) {
    return res.status(400).json({ message: 'dispositivoId no es un número', status: 0 });
  }

  try {
    const estado = await Estado.findOne({ where: { estadoId: numeroEstadoId } });
    if (!estado) {
      return res.status(404).json({ message: 'Estado no encontrado.', status: 0 });
    }

    await estado.update({
      fecha: fecha ?? estado.fecha,
      tipoEstadoId: tipoEstadoId ?? estado.tipoEstadoId,
      valor: valor ?? estado.valor,
      dispositivoId: numeroDispositivoId ?? estado.dispositivoId
    });

    res.status(200).json({ message: 'Estado actualizado correctamente.', status: 1, data: sanitize(estado) });
  } catch (error) {
    console.error('Error al actualizar estado:', error);
    res.status(500).json({ message: 'Hubo un error', error: error.message });
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
    console.log('el valor de estadoId no es un número');
    return res.status(400).json({
      message: 'el valor de estadoId no es un número',
      status: 0,
    });
  }

  try {
    const deletedRecord = await Estado.destroy({
      where: { estadoId: numeroEstadoId }
    });

    if (deletedRecord > 0) {
      console.log("id:", numeroEstadoId, "se borró correctamente");
      res.status(200).json({ message: "Se borró correctamente" });
    } else {
      console.log("id:", numeroEstadoId, "no existe registro");
      res.status(404).json({ message: "No existe registro" });
    }
  } catch (error) {
    console.error('Error al borrar:', error);
    res.status(500).json({
      message: 'Hubo un error',
      data: { error }
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
