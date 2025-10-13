// app_ft/src/backend/controllers/clasificacionController.js

const Clasificacion = require('../models/Clasificacion.js');
const { sanitize } = require('../utils/sanitize.js');

/** Obtener todas las clasificaciones */
async function getAll(req, res) {
  try {
    console.log('Obtengo todas las clasificaciones');
    const clasificaciones = await Clasificacion.findAll();

    if (clasificaciones && clasificaciones.length > 0) {
      res.status(200).json(sanitize(clasificaciones));
    } else {
      console.log('No se encontraron clasificaciones.');
      res.status(404).json({ message: 'No se encontraron clasificaciones.' });
    }

  } catch (error) {
    console.error('Error al obtener clasificaciones:', error.message);
    res.status(500).json({ error: error.message });
  }
}

/** Obtener una clasificación por ID */
async function getOne(req, res) {
  const { clasificacionId } = req.params;
  console.log("get clasificacion id:", clasificacionId);

  if (clasificacionId === undefined) {
    console.log('clasificacionId es obligatorio');
    return res.status(400).json({
      message: 'clasificacionId es obligatorio',
      status: 0,
    });
  }

  const numeroClasificacionId = parseInt(clasificacionId);
  if (isNaN(numeroClasificacionId)) {
    console.log('el valor de clasificacionId no es un número');
    return res.status(400).json({
      message: 'el valor de clasificacionId no es un número',
      status: 0,
    });
  }

  try {
    const clasificacion = await Clasificacion.findOne({
      where: { clasificacionId: numeroClasificacionId }
    });

    if (clasificacion) {
      console.log("Clasificación encontrada");
      res.status(200).json(sanitize(clasificacion));
    } else {
      console.log("No se encontró la clasificación");
      res.status(404).json({ message: 'No se encuentra la clasificación.' });
    }
  } catch (error) {
    console.error('Error al buscar clasificación:', error.message);
    res.status(500).json({
      message: 'Algo salió mal',
      error: error.message
    });
  }
}

/** Crear una nueva clasificación */
async function crearClasificacion(req, res) {
  const { descripcion, tipoContadorId } = req.body;
  console.log("crearClasificacion:", descripcion, tipoContadorId);

  if (descripcion === undefined || tipoContadorId === undefined) {
    console.log('descripcion y tipoContadorId son obligatorios');
    return res.status(400).json({
      message: 'descripcion y tipoContadorId son obligatorios',
      status: 0,
    });
  }

  const numeroTipoContadorId = parseInt(tipoContadorId);
  if (isNaN(numeroTipoContadorId)) {
    console.log('el valor de tipoContadorId no es un número');
    return res.status(400).json({
      message: 'el valor de tipoContadorId debe ser numérico',
      status: 0,
    });
  }

  try {
    const existente = await Clasificacion.findOne({
      where: { descripcion: descripcion }
    });

    if (existente) {
      console.log('La clasificación ya existe.');
      return res.status(409).json({
        message: 'La clasificación ya existe. Elige otra descripción.',
        status: 0,
      });
    }

    const nuevaClasificacion = await Clasificacion.create({
      descripcion,
      tipoContadorId: numeroTipoContadorId
    });

    console.log('Clasificación creada con éxito.');
    return res.status(201).json({
      message: 'Clasificación creada con éxito.',
      status: 1,
      data: sanitize(nuevaClasificacion)
    });

  } catch (error) {
    console.error('Error al crear la clasificación:', error);
    return res.status(500).json({
      message: 'Ocurrió un error inesperado.',
      status: 0,
      error: error.message,
    });
  }
}

/** Eliminar una clasificación */
async function deleteClasificacion(req, res) {
  const { clasificacionId } = req.params;

  if (clasificacionId === undefined) {
    console.log('clasificacionId es obligatorio');
    return res.status(400).json({
      message: 'clasificacionId es obligatorio',
      status: 0,
    });
  }

  const numeroClasificacionId = parseInt(clasificacionId);
  if (isNaN(numeroClasificacionId)) {
    console.log('el valor de clasificacionId no es un número');
    return res.status(400).json({
      message: 'el valor de clasificacionId no es un número',
      status: 0,
    });
  }

  try {
    const deleted = await Clasificacion.destroy({
      where: { clasificacionId: numeroClasificacionId }
    });

    if (deleted > 0) {
      console.log("clasificacionId:", numeroClasificacionId, "se borró correctamente");
      res.status(200).json({ message: "Se borró correctamente" });
    } else {
      console.log("clasificacionId:", numeroClasificacionId, "no existe registro");
      res.status(404).json({ message: "No existe registro" });
    }

  } catch (error) {
    console.error('Error al borrar clasificación:', error);
    res.status(500).json({
      message: 'Hubo un error al borrar',
      error: error.message
    });
  }
}

/** Actualizar una clasificación existente */
async function updateClasificacion(req, res) {
  const { clasificacionId } = req.params;
  const { descripcion, tipoContadorId } = req.body;

  if (clasificacionId === undefined) {
    console.log('clasificacionId es obligatorio');
    return res.status(400).json({
      message: 'clasificacionId es obligatorio',
      status: 0,
    });
  }

  const numeroClasificacionId = parseInt(clasificacionId);
  if (isNaN(numeroClasificacionId)) {
    console.log('el valor de clasificacionId no es un número');
    return res.status(400).json({
      message: 'el valor de clasificacionId no es un número',
      status: 0,
    });
  }

  try {
    const clasificacion = await Clasificacion.findOne({
      where: { clasificacionId: numeroClasificacionId }
    });

    if (!clasificacion) {
      console.log("Clasificación no encontrada");
      return res.status(404).json({ message: 'Clasificación no encontrada.' });
    }

    await clasificacion.update({
      descripcion: descripcion ?? clasificacion.descripcion,
      tipoContadorId: tipoContadorId ?? clasificacion.tipoContadorId
    });

    console.log("clasificacionId:", numeroClasificacionId, "actualizado correctamente");
    res.status(200).json({ message: 'Clasificación actualizada correctamente.' });

  } catch (error) {
    console.error('Error al actualizar clasificación:', error);
    res.status(500).json({
      message: 'Hubo un error al actualizar',
      error: error.message
    });
  }
}

module.exports = {
  getAll,
  getOne,
  crearClasificacion,
  deleteClasificacion,
  updateClasificacion
};
