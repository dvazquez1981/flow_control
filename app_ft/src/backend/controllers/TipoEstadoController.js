// app_ft/src/backend/controllers/tipoEstadoController.js

const TipoEstado = require('../models/TipoEstado.js');
const TipoContador= require('../models/TipoContador.js')
const { sanitize } = require('../utils/sanitize.js');

/** Obtener todos los tipos de estado */
async function getAll(req, res) {
  try {
    console.log('Obtengo todos los tipos de estado');
    const tipos = await TipoEstado.findAll();

    if (tipos && tipos.length > 0) {
      res.status(200).json(sanitize(tipos));
    } else {
      console.log('No se encontraron tipos de estado.');
      res.status(404).json({ message: 'No se encontraron tipos de estado.' });
    }

  } catch (error) {
    console.error('Error al obtener tipos de estado:', error.message);
    res.status(500).json({ error: error.message });
  }
}

/** Obtener un tipo de estado por ID */
async function getOne(req, res) {
  const { tipoEstadoId } = req.params;
  console.log("get tipoEstadoId:", tipoEstadoId);

  if (tipoEstadoId === undefined) {
    console.log('tipoEstadoId es obligatorio');
    return res.status(400).json({ message: 'tipoEstadoId es obligatorio', status: 0 });
  }

  const numeroId = parseInt(tipoEstadoId);
  if (isNaN(numeroId)) {
    console.log('el valor de tipoEstadoId no es un número');
    return res.status(400).json({ message: 'el valor de tipoEstadoId no es un número', status: 0 });
  }

  try {
    const tipo = await TipoEstado.findOne({ where: { tipoEstadoId: numeroId } });
    if (tipo) {
      console.log("Tipo de estado encontrado");
      res.status(200).json(sanitize(tipo));
    } else {
      console.log("No se encontró el tipo de estado");
      res.status(404).json({ message: 'No se encuentra el tipo de estado.' });
    }
  } catch (error) {
    console.error('Error al buscar tipo de estado:', error.message);
    res.status(500).json({ message: 'Algo salió mal', error: error.message });
  }
}

/** Crear un nuevo tipo de estado */
async function crearTipoEstado(req, res) {
  const { descripcion, tipoContadorId } = req.body;
  console.log("crearTipoEstado:", descripcion, tipoContadorId);

  if (!descripcion || !tipoContadorId) {
    console.log('descripcion y tipoContadorId son obligatorios');
    return res.status(400).json({ message: 'descripcion y tipoContadorId son obligatorios', status: 0 });
  }

  const numeroTipoContadorId = parseInt(tipoContadorId);
  if (isNaN(numeroTipoContadorId)) {
    console.log('el valor de tipoContadorId no es un número');
    return res.status(400).json({ message: 'el valor de tipoContadorId debe ser numérico', status: 0 });
  }


  try {

    const existenteTipoContador = await TipoContador.findOne({ where: { TC_Id:numeroTipoContadorId} });
    if (!existenteTipoContador) {
      console.log('El tipo de contador no existe.');
      return res.status(409).json({ message: 'El tipo de contador ya existe.', status: 0 });
    }

    const existente = await TipoEstado.findOne({ where: { descripcion } });
    if (existente) {
      console.log('El tipo de estado ya existe.');
      return res.status(409).json({ message: 'El tipo de estado ya existe.', status: 0 });
    }

    const nuevoTipo = await TipoEstado.create({ descripcion, tipoContadorId });
    console.log('Tipo de estado creado con éxito.');
    res.status(201).json({ message: 'Tipo de estado creado con éxito.', status: 1, data: sanitize(nuevoTipo) });

  } catch (error) {
    console.error('Error al crear tipo de estado:', error);
    res.status(500).json({ message: 'Ocurrió un error inesperado.', status: 0, error: error.message });
  }
}

/** Actualizar un tipo de estado existente */
async function updateTipoEstado(req, res) {
  const { tipoEstadoId } = req.params;
  const { descripcion, tipoContadorId } = req.body;

  if (tipoEstadoId === undefined) {
    console.log('tipoEstadoId es obligatorio');
    return res.status(400).json({ message: 'tipoEstadoId es obligatorio', status: 0 });
  }

  const numeroId = parseInt(tipoEstadoId);
  if (isNaN(numeroId)) {
    console.log('el valor de tipoEstadoId no es un número');
    return res.status(400).json({ message: 'el valor de tipoEstadoId no es un número', status: 0 });
  }

  try {

    let numeroTipoContadorId = undefined;
    if (tipoContadorId !== undefined) {
     numeroTipoContadorId = parseInt(tipoContadorId);
     if (isNaN(numeroTipoContadorId)) {
      return res.status(400).json({ message: 'El valor de tipoContadorId no es un número', status: 0 });
    }

    const existenteTipoContador = await TipoContador.findOne({ where: { TC_Id:numeroTipoContadorId  } });
    if (!existenteTipoContador) {
      console.log('El tipo de contador no existe.');
      return res.status(409).json({ message: 'El tipo de contador ya existe.', status: 0 });
    }
    
}

    const tipo = await TipoEstado.findOne({ where: { tipoEstadoId: numeroId } });
    if (!tipo) {
      console.log("Tipo de estado no encontrado");
      return res.status(404).json({ message: 'Tipo de estado no encontrado.' });
    }

    tipo.descripcion = descripcion ?? tipo.descripcion;
    tipo.tipoContadorId = numeroTipoContadorId ?? tipo.tipoContadorId;
    await tipo.save();

    console.log(`tipoEstadoId: ${numeroId} actualizado correctamente`);
    res.status(200).json({ message: 'Tipo de estado actualizado correctamente.' });

  } catch (error) {
    console.error('Error al actualizar tipo de estado:', error);
    res.status(500).json({ message: 'Hubo un error al actualizar', error: error.message });
  }
}

/** Eliminar un tipo de estado */
async function deleteTipoEstado(req, res) {
  const { tipoEstadoId } = req.params;

  if (tipoEstadoId === undefined) {
    console.log('tipoEstadoId es obligatorio');
    return res.status(400).json({ message: 'tipoEstadoId es obligatorio', status: 0 });
  }

  const numeroId = parseInt(tipoEstadoId);
  if (isNaN(numeroId)) {
    console.log('el valor de tipoEstadoId no es un número');
    return res.status(400).json({ message: 'el valor de tipoEstadoId no es un número', status: 0 });
  }

  try {
    const deleted = await TipoEstado.destroy({ where: { tipoEstadoId: numeroId } });

    if (deleted > 0) {
      console.log(`tipoEstadoId: ${numeroId} se borró correctamente`);
      res.status(200).json({ message: "Se borró correctamente" });
    } else {
      console.log(`tipoEstadoId: ${numeroId} no existe registro`);
      res.status(404).json({ message: "No existe registro" });
    }

  } catch (error) {
    console.error('Error al borrar tipo de estado:', error);
    res.status(500).json({ message: 'Hubo un error al borrar', error: error.message });
  }
}

module.exports = {
  getAll,
  getOne,
  crearTipoEstado,
  updateTipoEstado,
  deleteTipoEstado
};
