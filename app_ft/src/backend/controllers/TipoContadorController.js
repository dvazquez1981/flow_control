// app_ft/src/backend/controllers/tipoContadorController.js

const TipoContador = require('../models/TipoContador.js');
const { sanitize } = require('../utils/sanitize.js');

/** Obtener todos los tipos de contador */
async function getAll(req, res) {
  try {
    console.log('Obtengo todos los tipos de contador');
    const tipos = await TipoContador.findAll();

    if (tipos && tipos.length > 0) {
      res.status(200).json(sanitize(tipos));
    } else {
      console.log('No se encontraron tipos de contador.');
      res.status(404).json({ message: 'No se encontraron tipos de contador.' });
    }

  } catch (error) {
    console.error('Error al obtener tipos de contador:', error.message);
    res.status(500).json({ error: error.message });
  }
}

/** Obtener un tipo de contador por ID */
async function getOne(req, res) {
  const { TC_Id } = req.params;
  console.log("get TC_Id:", TC_Id);

  if (TC_Id === undefined) {
    console.log('TC_Id es obligatorio');
    return res.status(400).json({ message: 'TC_Id es obligatorio', status: 0 });
  }

  const numeroTC_Id = parseInt(TC_Id);
  if (isNaN(numeroTC_Id)) {
    console.log('el valor de TC_Id no es un número');
    return res.status(400).json({ message: 'el valor de TC_Id no es un número', status: 0 });
  }

  try {
    const tipo = await TipoContador.findOne({ where: { TC_Id: numeroTC_Id } });
    if (tipo) {
      console.log("Tipo de contador encontrado");
      res.status(200).json(sanitize(tipo));
    } else {
      console.log("No se encontró el tipo de contador");
      res.status(404).json({ message: 'No se encuentra el tipo de contador.' });
    }
  } catch (error) {
    console.error('Error al buscar tipo de contador:', error.message);
    res.status(500).json({ message: 'Algo salió mal', error: error.message });
  }
}

/** Crear un nuevo tipo de contador */
async function crearTipoContador(req, res) {
  const { TC_TipoContador } = req.body;
  console.log("crearTipoContador:", TC_TipoContador);

  if (!TC_TipoContador) {
    console.log('TC_TipoContador es obligatorio');
    return res.status(400).json({ message: 'TC_TipoContador es obligatorio', status: 0 });
  }

  try {
    const existente = await TipoContador.findOne({ where: { TC_TipoContador } });
    if (existente) {
      console.log('El tipo de contador ya existe.');
      return res.status(409).json({ message: 'El tipo de contador ya existe.', status: 0 });
    }

    const nuevoTipo = await TipoContador.create({ TC_TipoContador });
    console.log('Tipo de contador creado con éxito.');
    res.status(201).json({ message: 'Tipo de contador creado con éxito.', status: 1, data: sanitize(nuevoTipo) });

  } catch (error) {
    console.error('Error al crear tipo de contador:', error);
    res.status(500).json({ message: 'Ocurrió un error inesperado.', status: 0, error: error.message });
  }
}

/** Actualizar un tipo de contador existente */
async function updateTipoContador(req, res) {
  const { TC_Id } = req.params;
  const { TC_TipoContador } = req.body;

  if (TC_Id === undefined) {
    console.log('TC_Id es obligatorio');
    return res.status(400).json({ message: 'TC_Id es obligatorio', status: 0 });
  }

  const numeroTC_Id = parseInt(TC_Id);
  if (isNaN(numeroTC_Id)) {
    console.log('el valor de TC_Id no es un número');
    return res.status(400).json({ message: 'el valor de TC_Id no es un número', status: 0 });
  }

  try {
    const tipo = await TipoContador.findOne({ where: { TC_Id: numeroTC_Id } });
    if (!tipo) {
      console.log("Tipo de contador no encontrado");
      return res.status(404).json({ message: 'Tipo de contador no encontrado.' });
    }

    tipo.TC_TipoContador = TC_TipoContador ?? tipo.TC_TipoContador;
    await tipo.save();

    console.log(`TC_Id: ${numeroTC_Id} actualizado correctamente`);
    res.status(200).json({ message: 'Tipo de contador actualizado correctamente.' });

  } catch (error) {
    console.error('Error al actualizar tipo de contador:', error);
    res.status(500).json({ message: 'Hubo un error al actualizar', error: error.message });
  }
}

/** Eliminar un tipo de contador */
async function deleteTipoContador(req, res) {
  const { TC_Id } = req.params;

  if (TC_Id === undefined) {
    console.log('TC_Id es obligatorio');
    return res.status(400).json({ message: 'TC_Id es obligatorio', status: 0 });
  }

  const numeroTC_Id = parseInt(TC_Id);
  if (isNaN(numeroTC_Id)) {
    console.log('el valor de TC_Id no es un número');
    return res.status(400).json({ message: 'el valor de TC_Id no es un número', status: 0 });
  }

  try {
    const deleted = await TipoContador.destroy({ where: { TC_Id: numeroTC_Id } });

    if (deleted > 0) {
      console.log(`TC_Id: ${numeroTC_Id} se borró correctamente`);
      res.status(200).json({ message: "Se borró correctamente" });
    } else {
      console.log(`TC_Id: ${numeroTC_Id} no existe registro`);
      res.status(404).json({ message: "No existe registro" });
    }

  } catch (error) {
    console.error('Error al borrar tipo de contador:', error);
    res.status(500).json({ message: 'Hubo un error al borrar', error: error.message });
  }
}

module.exports = {
  getAll,
  getOne,
  crearTipoContador,
  updateTipoContador,
  deleteTipoContador
};
