const Comando = require('../models/Comando.js');
const Dispositivo = require('../models/Dispositivo.js');
const { sanitize } = require('../utils/sanitize.js');

async function getAll(req, res) {
  try {
    console.log('Obtengo todos los comandos');
    const comandos = await Comando.findAll();
    if (comandos && comandos.length > 0) {
      res.status(200).json(sanitize(comandos));
    } else {
      console.log('No se encontraron comandos.');
      res.status(404).json({ message: 'No se encontraron comandos.' });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
}

async function getOne(req, res) {
  const { cmdId } = req.params;
  console.log("get comando id:", cmdId);

  if (cmdId === undefined) {
    console.log('cmdId es obligatorio');
    return res.status(400).json({
      message: 'cmdId es obligatorio',
      status: 0,
    });
  }

  const numeroCmdId = parseInt(cmdId);
  if (isNaN(numeroCmdId)) {
    console.log('El valor de cmdId no es un número');
    return res.status(400).json({
      message: 'El valor de cmdId no es un número',
      status: 0,
    });
  }

  try {
    const comando = await Comando.findOne({ where: { cmdId: numeroCmdId } });
    if (comando) {
      console.log("Comando encontrado");
      res.status(200).json(sanitize(comando));
    } else {
      console.log("No se encontró comando");
      res.status(404).json({ message: 'No se encuentra el Comando.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Algo salió mal',
      data: { error },
    });
  }
}

async function crearComando(req, res) {
  const { fecha, tipoComandId, valor, dispositivoId } = req.body;
  console.log(`fecha: ${fecha}, tipoComandId: ${tipoComandId}, valor: ${valor}, dispositivoId: ${dispositivoId}`);

  if (fecha === undefined || tipoComandId === undefined || valor === undefined || dispositivoId === undefined) {
    console.log('Todos los campos son obligatorios.');
    return res.status(400).json({
      message: 'fecha, tipoComandId, valor y dispositivoId son obligatorios.',
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
    const existingDevice = await Dispositivo.findOne({
      where: { dispositivoId: numeroDispositivoId },
    });

    if (!existingDevice) {
      console.log('El dispositivo no existe.');
      return res.status(409).json({
        message: `El dispositivo con ID ${numeroDispositivoId} no existe.`,
        status: 0,
      });
    }

    const nuevoComando = await Comando.create({
      fecha,
      tipoComandId,
      valor,
      dispositivoId: numeroDispositivoId,
    });

    console.log('Comando creado con éxito.');
    return res.status(201).json({
      message: 'Comando creado con éxito.',
      status: 1,
      data: sanitize(nuevoComando),
    });
  } catch (error) {
    console.error('Error al crear el comando:', error);
    return res.status(500).json({
      message: 'Ocurrió un error inesperado.',
      status: 0,
      error: error.message,
    });
  }
}

async function deleteComando(req, res) {
  const { cmdId } = req.params;

  if (cmdId === undefined) {
    console.log('cmdId es obligatorio');
    return res.status(400).json({
      message: 'cmdId es obligatorio',
      status: 0,
    });
  }

  const numeroCmdId = parseInt(cmdId);
  if (isNaN(numeroCmdId)) {
    console.log('El valor de cmdId no es un número');
    return res.status(400).json({
      message: 'El valor de cmdId no es un número',
      status: 0,
    });
  }

  try {
    const deletedRecord = await Comando.destroy({ where: { cmdId: numeroCmdId } });

    if (deletedRecord > 0) {
      console.log(`cmdId: ${numeroCmdId} se borró correctamente`);
      res.status(200).json({ message: "Se borró correctamente" });
    } else {
      console.log(`cmdId: ${numeroCmdId} no existe registro`);
      res.status(404).json({ message: "No existe registro" });
    }
  } catch (error) {
    console.error('Error al borrar comando:', error);
    res.status(500).json({
      message: 'Hubo un error al intentar borrar',
      data: { error },
    });
  }
}

async function updateComando(req, res) {
  const { cmdId } = req.params;
  const { fecha, tipoComandId, valor, dispositivoId } = req.body;
  console.log(`cmdId: ${cmdId}, fecha: ${fecha}, tipoComandId: ${tipoComandId}, valor: ${valor}, dispositivoId: ${dispositivoId}`);

  if (cmdId === undefined) {
    console.log('cmdId es obligatorio');
    return res.status(400).json({
      message: 'cmdId es obligatorio',
      status: 0,
    });
  }

  const numeroCmdId = parseInt(cmdId);
  if (isNaN(numeroCmdId)) {
    console.log('El valor de cmdId no es un número');
    return res.status(400).json({
      message: 'El valor de cmdId no es un número',
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
    const comando = await Comando.findOne({ where: { cmdId: numeroCmdId } });

    if (!comando) {
      console.log(`cmdId: ${numeroCmdId} no encontrado`);
      return res.status(404).json({ message: 'Comando no encontrado.' });
    }

    if (numeroDispositivoId !== undefined) {
      const existingDevice = await Dispositivo.findOne({
        where: { dispositivoId: numeroDispositivoId },
      });

      if (!existingDevice) {
        console.log(`El dispositivo con ID ${numeroDispositivoId} no existe.`);
        return res.status(409).json({
          message: `El dispositivo con ID ${numeroDispositivoId} no existe.`,
          status: 0,
        });
      }
    }

    await comando.update({
      fecha: fecha !== undefined ? fecha : comando.fecha,
      tipoComandId: tipoComandId !== undefined ? tipoComandId : comando.tipoComandId,
      valor: valor !== undefined ? valor : comando.valor,
      dispositivoId: numeroDispositivoId !== undefined ? numeroDispositivoId : comando.dispositivoId,
    });

    console.log(`cmdId: ${numeroCmdId} se actualizó correctamente`);
    res.status(200).json({ message: 'Comando actualizado correctamente.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Algo no funcionó',
      data: { error },
    });
  }
}

module.exports = {
  getAll,
  getOne,
  crearComando,
  deleteComando,
  updateComando
};
