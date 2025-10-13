// app_ft/src/backend/controllers/estadoController.js

const ftdb = require('../bd/ftdb.js');
const { Sequelize, DataTypes } = require('sequelize');
const Estado = require('../models/Estado.js');
const Dispositivo = require('../models/Dispositivo.js');
const TipoEstado = require('../models/TipoEstado.js');

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

async function crearEstado(req, res) {
  const { fecha, tipoEstadoId, valor, dispositivoId } = req.body;

  if (!fecha || tipoEstadoId === undefined || valor === undefined || dispositivoId === undefined) {
    return res.status(400).json({
      message: 'fecha, tipoEstadoId, valor y dispositivoId son obligatorios.',
      status: 0,
    });
  }

  const numeroTipoEstadoId = parseInt(tipoEstadoId);
  const numeroDispositivoId = parseInt(dispositivoId);

  if (isNaN(numeroTipoEstadoId) || isNaN(numeroDispositivoId)) {
    return res.status(400).json({
      message: 'tipoEstadoId y dispositivoId deben ser números.',
      status: 0,
    });
  }

  try {

   const dispositivo = await Dispositivo.findOne({ where: { dispositivoId: numeroDispositivoId } });
    if (!dispositivo) {
      return res.status(404).json({ message: 'Dispositivo id debe estar definido.' });
    }
   
    const  tipoContadorId=dispositivo.tipoContadorId;
    const tipoEstado = await TipoEstado.findOne({ where: { tipoEstadoId: numeroTipoEstadoId, tipoContadorId:tipoContadorId } });
    
    if (!tipoEstado) {
      return res.status(404).json({ message: 'Tipo Estado no esta definido.' });
    }


    const nuevoEstado = await Estado.create({
      fecha,
      tipoEstadoId: numeroTipoEstadoId,
      valor,
      dispositivoId: numeroDispositivoId,
    });

    res.status(201).json({
      message: 'Estado creado con éxito.',
      status: 1,
      data: sanitize(nuevoEstado),
    });
  } catch (error) {
    console.error('Error al crear el estado:', error);
    res.status(500).json({
      message: 'Ocurrió un error inesperado.',
      status: 0,
      error: error.message,
    });
  }

}

async function updateEstado(req, res) {
  const { estadoId } = req.params;
  const { fecha, tipoEstadoId, valor, dispositivoId } = req.body;

  if (!estadoId) return res.status(400).json({ message: 'estadoId es obligatorio', status: 0 });

  const numeroEstadoId = parseInt(estadoId);
  if (isNaN(numeroEstadoId)) return res.status(400).json({ message: 'estadoId no es un número', status: 0 });

  try {
    const estado = await Estado.findByPk(numeroEstadoId);
    if (!estado) return res.status(404).json({ message: 'Estado no encontrado', status: 0 });

    let numeroDispositivoId = estado.dispositivoId;
    let numeroTipoEstadoId = estado.tipoEstadoId;

    //Si cambia dispositivo
    if (dispositivoId !== undefined) {
      numeroDispositivoId = parseInt(dispositivoId);
      if (isNaN(numeroDispositivoId)) return res.status(400).json({ message: 'dispositivoId no es un número', status: 0 });

      const dispositivo = await Dispositivo.findByPk(numeroDispositivoId);
      if (!dispositivo) return res.status(404).json({ message: 'Dispositivo no encontrado', status: 0 });

      // Si también cambia tipoEstadoId, validar que exista para este dispositivo
      if (tipoEstadoId !== undefined) {
        numeroTipoEstadoId = parseInt(tipoEstadoId);
        if (isNaN(numeroTipoEstadoId)) return res.status(400).json({ message: 'tipoEstadoId no es un número', status: 0 });

        const tipoEstado = await TipoEstado.findOne({ where: { tipoEstadoId: numeroTipoEstadoId, tipoContadorId: dispositivo.tipoContadorId } });
        if (!tipoEstado) return res.status(404).json({ message: 'Tipo Estado no definido para este dispositivo', status: 0 });
      }
    } 
    //Solo cambia tipoEstadoId
    else if (tipoEstadoId !== undefined) { 
      numeroTipoEstadoId = parseInt(tipoEstadoId);
      if (isNaN(numeroTipoEstadoId)) return res.status(400).json({ message: 'tipoEstadoId no es un número', status: 0 });

      const tipoEstado = await TipoEstado.findByPk(numeroTipoEstadoId);
      if (!tipoEstado) return res.status(404).json({ message: 'Tipo Estado no definido', status: 0 });
    }

    //Actualizar
    await estado.update({
      fecha: fecha ?? estado.fecha,
      tipoEstadoId: numeroTipoEstadoId ?? estado.tipoEstadoId,
      valor: valor ?? estado.valor,
      dispositivoId: numeroDispositivoId?? estado.dispositivoId
    });

    res.status(200).json({ message: 'Estado actualizado correctamente', status: 1, data: sanitize(estado) });
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
