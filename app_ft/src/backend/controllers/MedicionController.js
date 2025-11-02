const Medicion = require('../models/Medicion.js');
const Dispositivo = require('../models/Dispositivo.js');
const { sanitize } = require('../utils/sanitize.js');
const Clasificacion = require('../models/Clasificacion.js');
const  ftdb= require('../bd/ftdb.js');

// Obtener todas las mediciones
async function getAll(req, res) {
  try {
    console.log('Obtengo todas las mediciones');
    const mediciones = await Medicion.findAll();

    if (mediciones && mediciones.length > 0) {
      res.status(200).json(sanitize(mediciones));
    } else {
      console.log('No se encontraron mediciones.');
      res.status(404).json({ message: 'No se encontraron mediciones.' });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
}

// Crear una nueva medición
async function createMedicion(req, res) {
  const { fecha, valor, carril, clasificacionId, dispositivoId } = req.body;

  console.log(`Ingreso: dispositivoId: ${dispositivoId}, fecha: ${fecha}, valor: ${valor}, carril: ${carril}, clasificacionId: ${clasificacionId}`);

  // Validación de campos obligatorios
  if ([fecha, valor, carril, clasificacionId, dispositivoId].includes(undefined)) {
    return res.status(400).json({
      message: 'fecha, valor, carril, clasificacionId y dispositivoId son obligatorios',
      status: 0
    });
  }

  const numDispositivoId = parseInt(dispositivoId);
  if (isNaN(numDispositivoId)) {
    return res.status(400).json({
      message: 'El valor de dispositivoId no es numérico',
      status: 0
    });
  }


  const numClasificacionId= parseInt(clasificacionId);
  if (isNaN(numClasificacionId)) {
    return res.status(400).json({
      message: 'El valor ClasificacionId no es numérico',
      status: 0
    });
  }

  const numCarril= parseInt(carril);
  if (isNaN(numCarril)) {
    return res.status(400).json({
      message: 'El valor carril no es numérico',
      status: 0
    });
  }


  const parsedDate = new Date(fecha);
  if (isNaN(parsedDate.getTime())) {
    return res.status(400).json({
      message: 'La fecha no es válida',
      status: 0
    });
  }

  try {
    // Verificar dispositivo
    const deviceFound = await Dispositivo.findOne({
      where: { dispositivoId: numDispositivoId }
    });

    if (!deviceFound) {
      return res.status(422).json({
        message: 'El dispositivoId no existe',
        status: 0
      });
    }
   

    let tipoContadoIdEncontrado=deviceFound.tipoContadorId;
   // Verificar clasificacion
    const clasificacionFound = await Clasificacion.findOne({
      where: {   clasificacionId: numClasificacionId, tipoContadorId:tipoContadoIdEncontrado }
    });

    if (!clasificacionFound) {
      return res.status(422).json({
        message: 'La clasificacion no existe',
        status: 0
      });
    }

    


    // Evitar duplicados exactos (misma fecha, dispositivo y carril)
    const existing = await Medicion.findOne({
      where: { fecha, dispositivoId: numDispositivoId, carril }
    });

    if (existing ) {
      return res.status(422).json({
        message: 'Ya existe una medición con esos datos',
        status: 0
      });
    }

    // Crear registro
    const newMedicion = await Medicion.create({
      fecha,
      valor,
      carril,
      clasificacionId,
      dispositivoId: numDispositivoId
    });

    console.log('Medición creada con éxito ID:', newMedicion.medicionId);
    res.status(201).json({
      message: 'Medición creada con éxito',
      status: 1,
      data: sanitize(newMedicion)
    });
  } catch (error) {
    console.error('Error al crear la medición:', error);
    res.status(500).json({
      message: 'Ocurrió un error inesperado',
      error: error.message
    });
  }
}

// Obtener mediciones por dispositivo (con rango de fechas opcional)
async function getAllByDeviceId(req, res) {
  try {
    const { dispositivoId } = req.params;
    const { limit = 100, offset = 0, fechaDesde, fechaHasta } = req.query;

    // Validaciones básicas
    if (!dispositivoId) {
      return res.status(400).json({
        message: 'El parámetro dispositivoId es obligatorio.',
        status: 0
      });
    }

    const numDispositivoId = parseInt(dispositivoId, 10);
    if (isNaN(numDispositivoId)) {
      return res.status(400).json({
        message: 'El valor de dispositivoId debe ser numérico.',
        status: 0
      });
    }

    // Construcción dinámica del WHERE
    let whereClause = `WHERE d.dispositivoId = :dispositivoId`;
    const replacements = {
      dispositivoId: numDispositivoId,
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10)
    };

    if (fechaDesde) {
      whereClause += ` AND m.fecha >= :fechaDesde`;
      replacements.fechaDesde = fechaDesde;
    }

    if (fechaHasta) {
      whereClause += ` AND m.fecha <= :fechaHasta`;
      replacements.fechaHasta = fechaHasta;
    }

    console.log(`Buscando mediciones del dispositivoId: ${numDispositivoId} (limit ${limit}, offset ${offset}, desde ${fechaDesde || '-'}, hasta ${fechaHasta || '-'})`);

    const sql = `
      SELECT 
        m.*, 
        c.descripcion AS clasificacionDescripcion
      FROM Medicion m
      JOIN Dispositivo d ON d.dispositivoId = m.dispositivoId
      JOIN Clasificacion c ON c.tipoContadorId = d.tipoContadorId 
                           AND c.clasificacionId = m.clasificacionId
      ${whereClause}
      ORDER BY m.medicionId DESC
      LIMIT :limit OFFSET :offset
    `;

    const mediciones = await ftdb.query(sql, {
      replacements,
      type: ftdb.QueryTypes.SELECT
    });

    if (mediciones.length === 0) {
      return res.status(404).json({ message: 'No se encontraron mediciones.' });
    }

    return res.status(200).json(sanitize(mediciones));
  } catch (error) {
    console.error('Error en getAllByDeviceId:', error);
    return res.status(500).json({ error: error.message });
  }
}


// Obtener la última medición
async function getUltimaMedicionByDeviceID(req, res) {
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

    /*
    const ultima = await Medicion.findOne({
      where: { dispositivoId: numDispositivoId },
      order: [['medicionId', 'DESC']]
    });
*/

    const ultimaMedicionConDescripcion = await ftdb.query(`
      select m.* , c.descripcion as clasificacionDescripcion
      from  Medicion m,
       Clasificacion c, 
       Dispositivo d, 
       TipoContador tc
      WHERE c.tipoContadorId=d.tipoContadorId
      and d.dispositivoId=m.dispositivoId
      and m.dispositivoId=:dispositivoId

      order by medicionId DESC
      `, {
       replacements: { 
         dispositivoId: numDispositivoId
          
       },
       type: ftdb.QueryTypes.SELECT
     });

    console.log('Trato de obtener ultima medicion para este dispositivoId: '+ dispositivoId)
  
    res.status(200).json({ status: 1, data: ultimaMedicionConDescripcion.length>0 ? sanitize(ultimaMedicionConDescripcion.at(0)) : null });
  } catch (error) {
     console.error('Error al obtener la medicion');
     res.status(500).json({ message: 'Algo salió mal', data: { error } });
  }
}

module.exports = {
  getAll,
  createMedicion,
  getAllByDeviceId,
  getUltimaMedicionByDeviceID
};
