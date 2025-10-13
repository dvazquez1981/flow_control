
const { Sequelize } = require('sequelize');
const Comando = require('../models/Comando.js');
const Dispositivo = require('../models/Dispositivo.js');
const TipoComando = require('../models/TipoComando.js'); 
const { sanitize } = require('../utils/sanitize.js');

/** Controlador de Comando */
async function getAll() {
  try {
    return await Comando.findAll();
  } catch (error) {
    console.error('Error al obtener los comandos:', error);
    throw error;
  }
}

async function getOne(id) {
  try {
    return await Comando.findByPk(id);
  } catch (error) {
    console.error('Error al obtener el comando:', error);
    throw error;
  }
}

async function crearComando(req, res) {
  const { fecha, tipoComandId, valor, dispositivoId } = req.body;

  if (!fecha || tipoComandId === undefined || valor === undefined || dispositivoId === undefined) {
    return res.status(400).json({
      message: 'fecha, tipoComandId, valor y dispositivoId son obligatorios.',
      status: 0,
    });
  }


  
  const parsedDate = new Date(fecha);
  if (isNaN(parsedDate.getTime())) {
    return res.status(400).json({
      message: 'La fecha no es válida',
      status: 0
    });
  }

  const numeroTipoComandId = parseInt(tipoComandId);
  const numeroDispositivoId = parseInt(dispositivoId);

  if (isNaN(numeroTipoComandId) || isNaN(numeroDispositivoId)) {
    return res.status(400).json({
      message: 'tipoComandId y dispositivoId deben ser números.',
      status: 0,
    });
  }




  try {
    const dispositivo = await Dispositivo.findByPk(numeroDispositivoId);
    if (!dispositivo) {
      return res.status(404).json({ message: 'Dispositivo no encontrado.', status: 0 });
    }

    // validar tipo de comando asociado al tipo de contador del dispositivo
    const tipoComando = await TipoComando.findOne({
      where: { tipoComandId: numeroTipoComandId, tipoContadorId: dispositivo.tipoContadorId },
    });

    if (!tipoComando) {
      return res.status(404).json({ message: 'Tipo de comando no válido para este dispositivo.', status: 0 });
    }

    const nuevoComando = await Comando.create({
      fecha,
      tipoComandId: numeroTipoComandId,
      valor,
      dispositivoId: numeroDispositivoId,
    });

    res.status(201).json({
      message: 'Comando creado con éxito.',
      status: 1,
      data: sanitize(nuevoComando),
    });
  } catch (error) {
    console.error('Error al crear el comando:', error);
    res.status(500).json({
      message: 'Ocurrió un error inesperado.',
      status: 0,
      error: error.message,
    });
  }
}

async function updateComando(req, res) {
  const { cmdId } = req.params;
  const { fecha, tipoComandId, valor, dispositivoId } = req.body;

  if (!cmdId) return res.status(400).json({ message: 'cmdId es obligatorio', status: 0 });

  const numeroCmdId = parseInt(cmdId);
  if (isNaN(numeroCmdId)) return res.status(400).json({ message: 'cmdId no es un número', status: 0 });

  try {
    const comando = await Comando.findByPk(numeroCmdId);
    if (!comando) return res.status(404).json({ message: 'Comando no encontrado', status: 0 });

    let numeroDispositivoId = comando.dispositivoId;
    let numeroTipoComandId = comando.tipoComandId;

    if (fecha !== undefined) {
       const parsedDate = new Date(fecha);
       if (isNaN(parsedDate.getTime())) {
          return res.status(400).json({
          message: 'La fecha no es válida',
          status: 0
         });
       }

                   }
    // Si cambia el dispositivo
    if (dispositivoId !== undefined) {
      numeroDispositivoId = parseInt(dispositivoId);
      if (isNaN(numeroDispositivoId)) return res.status(400).json({ message: 'dispositivoId no es un número', status: 0 });

      const dispositivo = await Dispositivo.findByPk(numeroDispositivoId);
      if (!dispositivo) return res.status(404).json({ message: 'Dispositivo no encontrado', status: 0 });

      // Si también cambia el tipo de comando
      if (tipoComandId !== undefined) {
        numeroTipoComandId = parseInt(tipoComandId);
        if (isNaN(numeroTipoComandId)) return res.status(400).json({ message: 'tipoComandId no es un número', status: 0 });

        const tipoComando = await TipoComando.findOne({
          where: { tipoComandId: numeroTipoComandId, tipoContadorId: dispositivo.tipoContadorId },
        });

        if (!tipoComando) return res.status(404).json({ message: 'Tipo de comando no válido para este dispositivo', status: 0 });
      }
    }
    // Solo cambia tipoComandId
    else if (tipoComandId !== undefined) {
      numeroTipoComandId = parseInt(tipoComandId);
      if (isNaN(numeroTipoComandId)) return res.status(400).json({ message: 'tipoComandId no es un número', status: 0 });

      const dispositivo = await Dispositivo.findByPk(comando.dispositivoId);
      if (!dispositivo) return res.status(404).json({ message: 'Dispositivo actual del comando no encontrado', status: 0 });

      const tipoComando = await TipoComando.findOne({
        where: { tipoComandId: numeroTipoComandId, tipoContadorId: dispositivo.tipoContadorId },
      });

      if (!tipoComando) return res.status(404).json({ message: 'Tipo de comando no válido para el dispositivo actual', status: 0 });
    }

    await comando.update({
      fecha: fecha ?? comando.fecha,
      tipoComandId: numeroTipoComandId ?? comando.tipoComandId,
      valor: valor ?? comando.valor,
      dispositivoId: numeroDispositivoId ?? comando.dispositivoId,
    });

    res.status(200).json({ message: 'Comando actualizado correctamente', status: 1, data: sanitize(comando) });
  } catch (error) {
    console.error('Error al actualizar comando:', error);
    res.status(500).json({ message: 'Hubo un error', error: error.message });
  }
}

async function deleteComando(req, res) {
  const { cmdId } = req.params;

  if (cmdId === undefined) {
    return res.status(400).json({ message: 'cmdId es obligatorio', status: 0 });
  }

  const numeroCmdId = parseInt(cmdId);
  if (isNaN(numeroCmdId)) {
    return res.status(400).json({ message: 'cmdId no es un número', status: 0 });
  }

  try {
    const deletedRecord = await Comando.destroy({ where: { cmdId: numeroCmdId } });

    if (deletedRecord > 0) {
      res.status(200).json({ message: 'Comando borrado correctamente', status: 1 });
    } else {
      res.status(404).json({ message: 'Comando no encontrado', status: 0 });
    }
  } catch (error) {
    console.error('Error al borrar comando:', error);
    res.status(500).json({ message: 'Hubo un error', error: error.message });
  }
}

module.exports = {
  getAll,
  getOne,
  crearComando,
  updateComando,
  deleteComando,
};
