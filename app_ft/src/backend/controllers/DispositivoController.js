
const Electrovalvula = require('../models/GrupoUsuario.js');
const Dispositivo = require('../models/Dispositivo.js');
const {sanitize}  = require('../utils/sanitize.js');

async function getAll(req, res) {
  try {
    console.log('Obtengo todos los dispositivos');
    const dv = await Dispositivo.findAll();
    if (dv) {
      res.status(200).json(sanitize(dv));
    }
    else {
       console.log('No se encontraron dispositivos.')
       res.status(404).json({ message: 'No se encontraron dispositivos.' });
        }
   
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
}

async function getOne(req, res) {
  const { dispositivoId } = req.params;
  console.log("get device id: " + dispositivoId);

if (dispositivoId===undefined) {
    console.log('dispositivoId es obligatorios');
    return res.status(400).json({
      message: 'dispositivoId es obligatorio',
      status: 0,
    });
  }

  const numeroDispositivoId= parseInt(dispositivoId);
  if( isNaN(numeroDispositivoId)  )
  {
    console.log('el valor de dispositivoId no es un numero');
    return res.status(400).json({
    message: 'el valor de dispositivoId no es un numero',
    status: 0,
    });
  }
  

  try {
    const DeviceFound = await Dispositivo.findOne({
      where: { dispositivoId: dispositivoId }
    });

    if (DeviceFound) {
      console.log("Se encontró");
      res.status(200).json(sanitize(DeviceFound));
    } else {
      console.log("No se encontró");
      res.status(404).json({ message: 'No se encuentra el Dispositivo.' });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Algo salió mal',
      data: { error }
    });
  }
}

async function crearDevice(req, res) {
  const { nombre, ubicacion, electrovalvulaId} = req.body;
  console.log("nombre: " + nombre + " ubicacion: " + ubicacion + " electrovalvulaId: " + electrovalvulaId);


  
   if(nombre===undefined || ubicacion===undefined  || electrovalvulaId===undefined) 
  {
    console.log('el valor de nombre, ubicacion y electrovalvulaid son obligatorios.');
    return res.status(400).json({
      message: 'el valor de nombre, ubicacion y electrovalvulaid son obligatorios.',
      status: 0,
    });
  }
  

 const numeroElectrovalvulaId = parseInt(electrovalvulaId );
  if( isNaN(numeroElectrovalvulaId)  )
  {
    console.log('el valor de electrovalvulaId no es un numero');
    return res.status(400).json({
    message: 'el valor de electrovalvulaId no es un numero',
    status: 0,
    });
  }
  
try {
    
    const existingElectrovalvula= await Electrovalvula.findOne({
      where: { electrovalvulaId: numeroElectrovalvulaId }
    });
    
    if (!existingElectrovalvula) {
        console.log('la electrovalvula: ' + numeroElectrovalvulaId +' no existe.');
      return res.status(409).json({
        message: 'la electrovalvula: ' + numeroElectrovalvulaId+' no existe.',
        status: 0,
      });
    }



    const existingDevice = await Dispositivo.findOne({
      where: { nombre: nombre}
    });

    if (existingDevice) {
      console.log('El Dispositivo ya existe.');
      return res.status(409).json({
        message: 'El Device ya existe. Elige un nombre distinto.',
        status: 0,
      });
    }

    const newDevice = await Dispositivo.create({
      nombre: nombre,
      ubicacion:ubicacion,
      electrovalvulaId:numeroElectrovalvulaId

    });

    console.log('Dispositivo creado con éxito.');
    return res.status(201).json({
      message: 'Dispositivo creado con éxito.',
      status: 1,
      data: sanitize(newDevice)
    });

  } catch (error) {
    console.error('Error al crear el dispositivo:', error);
    return res.status(500).json({
      message: 'Ocurrió un error inesperado.',
      status: 0,
      error: error.message,
    });
  }
}

async function deleteDevice(req, res) {
  const { dispositivoId} = req.params;



  if (dispositivoId==undefined) {
    console.log('dispositivoId es obligatorios');
    return res.status(400).json({
      message: 'dispositivoId es obligatorios',
      status: 0,
    });
  }


  const numeroDispositivoId= parseInt(dispositivoId);
  if( isNaN(numeroDispositivoId)  )
  {
    console.log('el valor de dispositivoId no es un numero');
    return res.status(400).json({
    message: 'el valor de dispositivoId no es un numero',
    status: 0,
    });
  }

  try {
    const deletedRecord = await Dispositivo.destroy({
      where: { dispositivoId: numeroDispositivoId }
    });

    if (deletedRecord > 0) {
      console.log("id: " + numeroDispositivoId + " se borró correctamente");
      res.status(200).json({ message: "Se borró correctamente" });
    } else {
      console.log("id: " + numeroDispositivoId + " no existe registro");
      res.status(404).json({ message: "No existe registro" });
    }

  } catch (error) {
    console.error('Error al borrar: ', error);
    res.status(500).json({
      message: 'Hubo un error',
      data: { error }
    });
  }
}

async function updateDevice(req, res) {
  const { dispositivoId} = req.params;
  const { nombre, ubicacion, electrovalvulaId} = req.body;
  console.log("nombre: " + nombre + " ubicacion: " + ubicacion + " electrovalvulaId: " + electrovalvulaId);


   
  if(dispositivoId===undefined ) 
  {
    console.log('el valor de dispositivoId es obligatorio.');
    return res.status(400).json({
      message: 'el valor de dispositivoId es obligatorio.',
      status: 0,
    });
  }
  
  const numeroDispositivoId= parseInt(dispositivoId);
  if( isNaN(numeroDispositivoId)  )
  {
    console.log('el valor de dispositivoId no es un numero');
    return res.status(400).json({
    message: 'el valor de dispositivoId no es un numero',
    status: 0,
    });
  }
  
 var numeroElectrovalvulaId=undefined;
  if(electrovalvulaId!==undefined)
  {
  numeroElectrovalvulaId = parseInt(electrovalvulaId );
  if( isNaN(numeroElectrovalvulaId)  )
  {
    console.log('el valor de electrovalvulaId no es un numero');
    return res.status(400).json({
    message: 'el valor de electrovalvulaId no es un numero',
    status: 0,
    });
  }
}



try {
    
    const existingElectrovalvula= await Electrovalvula.findOne({
      where: { electrovalvulaId: numeroElectrovalvulaId }
    });
    
    if (!existingElectrovalvula) {
        console.log('la electrovalvula: ' + numeroElectrovalvulaId +' no existe.');
      return res.status(409).json({
        message: 'la electrovalvula: ' + numeroElectrovalvulaId +' no existe.',
        status: 0,
      });
    }

  
    const dv = await Dispositivo.findOne({
      where: { dispositivoId: numeroDispositivoId },
      attributes: ['dispositivoId', 'nombre', 'ubicacion','electrovalvulaId']
    });

    if (!dv) {
      console.log("dispositivoId: " + disposnumeroDispositivoIditivoId + " no encontrado");
      return res.status(404).json({ message: 'Dispositivo no encontrado.' });
    }
    

    await dv.update({
      dispositivoId: numeroDispositivoId,
      nombre: nombre !== undefined ? nombre : dv.nombre,
      ubicacion: ubicacion !== undefined ? ubicacion : dv.ubicacion,
      electrovalvulaId: numeroElectrovalvulaId !== undefined ? numeroElectrovalvulaId : dv.electrovalvulaId

    });

  
    console.log("id: " +  numeroDispositivoId + " se actualizó correctamente");
    res.status(200).json({ message: 'Device se actualizó correctamente.' });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Algo no funcionó',
      data: { error }
    });
  }
}

module.exports = {
  getAll,
  getOne,
  crearDevice,
  deleteDevice,
  updateDevice
};