const Electrovalvula = require('../models/Electrovalvula.js');
const {sanitize}  = require('../utils/sanitize.js');

async function getAll(req, res) {
  try {
    console.log('Obtengo todos las electrovalvulas');
    const ev = await Electrovalvula.findAll();
    if (ev) {
      res.status(200).json(sanitize(ev));
    }
    else {

        console.log('No se encontraron electrovalvulas.')
            res.status(404).json({ message: 'No se encontraron electrovalvulas.' });
        }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
}


async function getOne(req, res) {
  const { electrovalvulaId} = req.params;
  console.log("get electrovalvula id: " + electrovalvulaId);

if (electrovalvulaId===undefined) {
    console.log('electrovalvulaId es obligatorios');
    return res.status(400).json({
      message: 'electrovalvulaId es obligatorio',
      status: 0,
    });
  }

  const numeroElectrovalvulaId= parseInt(electrovalvulaId);
  if( isNaN(numeroElectrovalvulaId)  )
  {
    console.log('el valor de electrovalvulaId no es un numero');
    return res.status(400).json({
    message: 'el valor de electrovalvulaId no es un numero',
    status: 0,
    });
  }


  try {
    const ElectrovalvulaFound = await Electrovalvula.findOne({
      where: { electrovalvulaId: numeroElectrovalvulaId}
    });

    if (ElectrovalvulaFound ) {
      console.log("Se encontró");
      res.status(200).json(sanitize(ElectrovalvulaFound));
    } else {
      console.log("No se encuentra la electrovalvula.");
      res.status(404).json({ message: 'No se encuentra la electrovalvula.' });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Algo salió mal',
      data: { error }
    });
  }
}


async function crearElectrovalvula(req, res) {
  const { nombre} = req.body;
  console.log("nombre: " + nombre);

  
   
  if(nombre===undefined) 
  {
    console.log('el valor de nombre debe estar definido.');
    return res.status(400).json({
      message: 'el valor de nombre debe estar definido.',
      status: 0,
    });
  }
  
  try {
    const existingElectrovalvula = await Electrovalvula.findOne({
      where: { nombre: nombre}
    });

    if (existingElectrovalvula) {
      console.log('el nombre de Electrovalvula ya existe.');
      return res.status(409).json({
        message: 'el nombre de Electrovalvula ya existe.',
        status: 0,
      });
    }

    const newElectrovalvula = await Electrovalvula.create({
      nombre: nombre
    });

    console.log('Electrovalvula creado con éxito.');
    return res.status(201).json({
      message: 'Electrovalvula creado con éxito.',
      status: 1,
      data: sanitize(newElectrovalvula)
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

async function deleteElectrovalvula(req, res) {
  const {electrovalvulaId} = req.params;


  if (electrovalvulaId===undefined) {
    console.log('electrovalvulaId es obligatorios');
    return res.status(400).json({
      message: 'electrovalvulaId es obligatorios',
      status: 0,
    });
  }

  const numeroElectrovalvulaId= parseInt(electrovalvulaId);
  if( isNaN(numeroElectrovalvulaId)  )
  {
    console.log('el valor de electrovalvulaId no es un numero');
    return res.status(400).json({
    message: 'el valor de electrovalvulaId no es un numero',
    status: 0,
    });
  }


  try {
    const deletedRecord = await Electrovalvula.destroy({
      where: { electrovalvulaId: numeroElectrovalvulaId }
    });

    if (deletedRecord > 0) {
      console.log("id: " + electrovalvulaId + " se borró correctamente");
      res.status(200).json({ message: "Se borró correctamente" });
    } else {
      console.log("id: " + electrovalvulaId + " no existe registro");
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



async function updateElectrovalvula(req, res) {
  const { electrovalvulaId } = req.params;
  const { nombre} = req.body;
  console.log("electrovalvulaId : " + electrovalvulaId  + " nombre: " + nombre );

 if(electrovalvulaId===undefined ) 
  {
 console.log('electrovalvulaId es obligatorios');
    return res.status(400).json({
      message: 'electrovalvulaId es obligatorios',
      status: 0,
    });

  }

  const numeroElectrovalvulaId= parseInt(electrovalvulaId);
  if( isNaN(numeroElectrovalvulaId)  )
  {
    console.log('el valor de electrovalvulaId no es un numero');
    return res.status(400).json({
    message: 'el valor de electrovalvulaId no es un numero',
    status: 0,
    });
  }


  try {
    const ev = await Electrovalvula.findOne({
      where: { electrovalvulaId: numeroElectrovalvulaId },
      attributes: ['electrovalvulaId', 'nombre']
    });

    if (!ev ) {
      console.log("electrovalvulaId: " + electrovalvulaId+ " no encontrado");
      return res.status(404).json({ message: 'electrovalvula no encontrado.' });
    }
    

    await ev.update({
      electrovalvulaId: numeroElectrovalvulaId,
      nombre: nombre !== undefined ? nombre : ev.nombre

    });

  
    console.log("electrovalvulaId: " + electrovalvulaId + " se actualizó correctamente");
    res.status(200).json({ message: 'Electrovalvula se actualizó correctamente.' });

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
  crearElectrovalvula,
  deleteElectrovalvula,
  updateElectrovalvula
};