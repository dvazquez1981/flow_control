const TipoComando = require('../models/TipoComando.js');
const TipoContador= require('../models/TipoContador.js')
const { sanitize } = require('../utils/sanitize.js');

/** Obtener todos los tipos de comando */
async function getAll(req, res) {
  try {
    console.log('Obtengo todos los tipos de comando');
    const tipos = await TipoComando.findAll();

    if (tipos && tipos.length > 0) {
      res.status(200).json(sanitize(tipos));
    } else {
      console.log('No se encontraron tipos de comando.');
      res.status(404).json({ message: 'No se encontraron tipos de comando.' });
    }

  } catch (error) {
    console.error('Error al obtener tipos de comando:', error.message);
    res.status(500).json({ error: error.message });
  }
}
async function getAllByTipoContadorId(req, res) {
  const { tipoContadorId } = req.params;
  console.log("get tipoContadorId: ", tipoContadorId);

  if (tipoContadorId=== undefined) {
    console.log('tipoContadorId es obligatorio');
    return res.status(400).json({ message: 'tipoContadorId es obligatorio', status: 0 });
  }

   const numeroTipoContadorId = parseInt(tipoContadorId);

  if (isNaN(numeroTipoContadorId)) {
    console.log('el valor de numeroTipoContadorId no es un número');
    return res.status(400).json({ message: 'el valor de numeroTipoContadorId no es un número', status: 0 });
  }


  try {
    console.log('Obtengo todos los tipos de comando por TipoContadorId: '+ tipoContadorId);
    const tipos = await TipoComando.findAll({ where: {tipoContadorId: tipoContadorId} }) ;
    //console.log(tipos)
    if (tipos) {
      res.status(200).json(sanitize(tipos));
    } else {
      console.log('No se encontraron tipos de comando: '+ tipoContadorId);
      res.status(404).json({ message: 'No se encontraron tipos de comando.' });
    }

  } catch (error) {
    console.error('Error al obtener tipos de comando:', error.message);
    res.status(500).json({ error: error.message });
  }
}

/** Obtener un tipo de comando por ID */
async function getOne(req, res) {
  const { tipoComandId } = req.params;
  console.log("get tipoComandId:", tipoComandId);

  if (tipoComandId === undefined) {
    console.log('tipoComandId es obligatorio');
    return res.status(400).json({ message: 'tipoComandId es obligatorio', status: 0 });
  }

  const numeroTipoComandId = parseInt(tipoComandId);
  if (isNaN(numeroTipoComandId)) {
    console.log('el valor de tipoComandId no es un número');
    return res.status(400).json({ message: 'el valor de tipoComandId no es un número', status: 0 });
  }

  try {
    const tipo = await TipoComando.findOne({ where: { tipoComandId: numeroTipoComandId } });
    if (tipo) {
      console.log("Tipo de comando encontrado");
      res.status(200).json(sanitize(tipo));
    } else {
      console.log("No se encontró el tipo de comando");
      res.status(404).json({ message: 'No se encuentra el tipo de comando.' });
    }
  } catch (error) {
    console.error('Error al buscar tipo de comando:', error.message);
    res.status(500).json({ message: 'Algo salió mal', error: error.message });
  }
}

/** Crear un nuevo tipo de comando */
async function crearTipoComando(req, res) {
  const { descripcion, tipoContadorId } = req.body;
  console.log("crearTipoComando:", descripcion, tipoContadorId);

  if (descripcion === undefined || tipoContadorId === undefined) {
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


    const existente = await TipoComando.findOne({ where: { descripcion } });
    if (existente) {
      console.log('El tipo de comando ya existe.');
      return res.status(409).json({ message: 'El tipo de comando ya existe. Elige otra descripción.', status: 0 });
    }

    const nuevoTipo = await TipoComando.create({ descripcion, tipoContadorId: numeroTipoContadorId });
    console.log('Tipo de comando creado con éxito.');
    res.status(201).json({ message: 'Tipo de comando creado con éxito.', status: 1, data: sanitize(nuevoTipo) });

  } catch (error) {
    console.error('Error al crear tipo de comando:', error);
    res.status(500).json({ message: 'Ocurrió un error inesperado.', status: 0, error: error.message });
  }
}

/** Actualizar un tipo de comando existente */
async function updateTipoComando(req, res) {
  const { tipoComandId } = req.params;
  const { descripcion, tipoContadorId } = req.body;

  if (tipoComandId === undefined) {
    console.log('tipoComandId es obligatorio');
    return res.status(400).json({ message: 'tipoComandId es obligatorio', status: 0 });
  }

  const numeroTipoComandId = parseInt(tipoComandId);
  if (isNaN(numeroTipoComandId)) {
    console.log('el valor de tipoComandId no es un número');
    return res.status(400).json({ message: 'el valor de tipoComandId no es un número', status: 0 });
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


    const tipo = await TipoComando.findOne({ where: { tipoComandId: numeroTipoComandId } });
    if (!tipo) {
      console.log("Tipo de comando no encontrado");
      return res.status(404).json({ message: 'Tipo de comando no encontrado.' });
    }

    tipo.descripcion = descripcion ?? tipo.descripcion;
    tipo.tipoContadorId = numeroTipoContadorId ?? tipo.tipoContadorId;

    await tipo.save();

    console.log(`tipoComandId: ${numeroTipoComandId} actualizado correctamente`);
    res.status(200).json({ message: 'Tipo de comando actualizado correctamente.' });

  } catch (error) {
    console.error('Error al actualizar tipo de comando:', error);
    res.status(500).json({ message: 'Hubo un error al actualizar', error: error.message });
  }
}

/** Eliminar un tipo de comando */
async function deleteTipoComando(req, res) {
  const { tipoComandId } = req.params;

  if (tipoComandId === undefined) {
    console.log('tipoComandId es obligatorio');
    return res.status(400).json({ message: 'tipoComandId es obligatorio', status: 0 });
  }

  const numeroTipoComandId = parseInt(tipoComandId);
  if (isNaN(numeroTipoComandId)) {
    console.log('el valor de tipoComandId no es un número');
    return res.status(400).json({ message: 'el valor de tipoComandId no es un número', status: 0 });
  }

  try {
    const deleted = await TipoComando.destroy({ where: { tipoComandId: numeroTipoComandId } });

    if (deleted > 0) {
      console.log(`tipoComandId: ${numeroTipoComandId} se borró correctamente`);
      res.status(200).json({ message: "Se borró correctamente" });
    } else {
      console.log(`tipoComandId: ${numeroTipoComandId} no existe registro`);
      res.status(404).json({ message: "No existe registro" });
    }

  } catch (error) {
    console.error('Error al borrar tipo de comando:', error);
    res.status(500).json({ message: 'Hubo un error al borrar', error: error.message });
  }
}

module.exports = {
  getAll,
  getOne,
  crearTipoComando,
  updateTipoComando,
  deleteTipoComando,
  getAllByTipoContadorId
};
