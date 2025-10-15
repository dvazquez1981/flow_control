
const { Sequelize } = require('sequelize');
const Comando = require('../models/Comando.js');
const Dispositivo = require('../models/Dispositivo.js');
const TipoComando = require('../models/TipoComando.js'); 
const { sanitize } = require('../utils/sanitize.js');

const client= require('../mqtt/mqttService.js');
const mqtt = require('mqtt');
////const client = mqtt.connect('mqtt://test.mosquitto.org:1883');
/** Controlador de Comando */
async function getAll(req, res) {
  try {

    let  c = await Comando.findAll();
  if (c && c.length > 0) {
      res.status(200).json(sanitize(c));
    } else {
      console.log('No se encontraron comandos.');
      res.status(404).json({ message: 'No se encontraron comandos.' });
    }

  } catch (error) {
    console.error('Error al obtener comandos:', error.message);
    res.status(500).json({ error: error.message });
  }
}

async function getOne(req, res) {
  const { cmdId } = req.params;

  if (cmdId=== undefined) {
    console.log('cmdId es obligatorio');
    return res.status(400).json({ message: 'cmdId es obligatorio', status: 0 });
  }

  const numerocmdId = parseInt(cmdId);
  if (isNaN(numerocmdId)) {
    console.log('el valor de cmdId no es un número');
    return res.status(400).json({ message: 'el valor de cmdId  no es un número', status: 0 });
  }

  try {
    const c = await  Comando.findOne({ where: { cmdId: numerocmdId } });
    if (c) {
      res.status(200).json(sanitize(c));
    } else {
      console.log("Comando no encontrado");
      res.status(404).json({ message: 'Comando no encontrado.' });
    }
  } catch (error) {
    console.error('Error al obtener el Comando no encontrado:', error);
    res.status(500).json({ message: 'Algo salió mal', data: { error } });
  }



}

async function crearComando(req, res) {
  const { fecha, tipoComandId, valor, dispositivoId } = req.body;

  console.log('fecha:', fecha, 'tipoComandId:', tipoComandId, 'valor:', valor, ' dispositivoId:', dispositivoId);


  if (!fecha || tipoComandId === undefined  || dispositivoId === undefined) {
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

   // Publicar el comando por MQTT
    const topic = `/dispositivo/${dispositivoId}/comando`;
    const payload = JSON.stringify({
      cmdId: nuevoComando.cmdId,
      tipoComandId,
      valor,
      fecha: nuevoComando.fecha
    });

    client.publish(topic, payload, { retain: true }, (err) => {
      if (err) console.error('Error al publicar comando MQTT:', err);
      else console.log(`Comando publicado en ${topic}: ${payload}`);
    });


    res.status(201).json({
      message: 'Comando creado con éxito y publicado.',
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



// Obtener la última medición
async function getUltimoComandoByDeviceID(req, res) {
  const { dispositivoId } = req.params;

  if (!dispositivoId) {
    return res.status(400).json({ message: 'dispositivoId es obligatorio', status: 0 });
  }

  const numDispositivoId = parseInt(dispositivoId);
  if (isNaN(numDispositivoId)) {
    return res.status(400).json({
      message: 'El valor de dispositivoId no es numérico',
      status: 0
    });
  }

  try {
    const ultimo= await Comando.findOne({
      where: { dispositivoId: numDispositivoId },
      order: [['cmdId', 'DESC']]
    });
    
    if (!ultimo) {
      console.error('no se encontro:', error);
  
      return res.status(404).json({ message: 'No se encontraron Comandos para este dispositivo.' });
    }
   
    res.status(200).json({ status: 1, data: sanitize(ultimo) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los coamndos', error: error.message });
  }
}

module.exports = {
  getAll,
  getOne,
  crearComando,
  updateComando,
  deleteComando,
  getUltimoComandoByDeviceID
};
