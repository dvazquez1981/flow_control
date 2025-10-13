const ftdb = require('../bd/ftdb.js');
const { Sequelize } = require('sequelize');
const UserGroup = require('../models/UserGroup.js');
const { sanitize } = require('../utils/sanitize.js');

/** Controlador de UserGroup */

// Obtener todos los grupos
async function getAll(req, res) {
  try {
    const grupos = await UserGroup.findAll();
    res.status(200).json({ message: 'Listado de grupos obtenido con éxito.', status: 1, data: sanitize(grupos) });
  } catch (error) {
    console.error('Error al obtener los grupos:', error);
    res.status(500).json({ message: 'Hubo un error al obtener los grupos.', status: 0, error: error.message });
  }
}

// Obtener un grupo por su código
async function getOne(req, res) {
  const { cod } = req.params;

  if (!cod) {
    return res.status(400).json({ message: 'El código (cod) es obligatorio.', status: 0 });
  }

  try {
    const grupo = await UserGroup.findByPk(cod);
    if (!grupo) {
      return res.status(404).json({ message: 'Grupo no encontrado.', status: 0 });
    }
    res.status(200).json({ message: 'Grupo obtenido con éxito.', status: 1, data: sanitize(grupo) });
  } catch (error) {
    console.error('Error al obtener el grupo:', error);
    res.status(500).json({ message: 'Hubo un error al obtener el grupo.', status: 0, error: error.message });
  }
}

// Crear un nuevo grupo
async function crearGrupo(req, res) {
  const { cod, nombre } = req.body;

  if (!cod || !nombre) {
    return res.status(400).json({ message: 'cod y nombre son obligatorios.', status: 0 });
  }

  try {
    // Verificar si ya existe
    const existente = await UserGroup.findByPk(cod);
    if (existente) {
      return res.status(409).json({ message: 'Ya existe un grupo con ese código.', status: 0 });
    }

    const nuevoGrupo = await UserGroup.create({ cod, nombre });

    res.status(201).json({
      message: 'Grupo creado con éxito.',
      status: 1,
      data: sanitize(nuevoGrupo),
    });
  } catch (error) {
    console.error('Error al crear el grupo:', error);
    res.status(500).json({ message: 'Hubo un error al crear el grupo.', status: 0, error: error.message });
  }
}

// Actualizar un grupo existente
async function updateGrupo(req, res) {
  const { cod } = req.params;
  const { nombre } = req.body;

  if (!cod) return res.status(400).json({ message: 'cod es obligatorio.', status: 0 });

  try {
    const grupo = await UserGroup.findByPk(cod);
    if (!grupo) {
      return res.status(404).json({ message: 'Grupo no encontrado.', status: 0 });
    }

    await grupo.update({
      nombre: nombre ?? grupo.nombre,
    });

    res.status(200).json({ message: 'Grupo actualizado correctamente.', status: 1, data: sanitize(grupo) });
  } catch (error) {
    console.error('Error al actualizar el grupo:', error);
    res.status(500).json({ message: 'Hubo un error al actualizar el grupo.', status: 0, error: error.message });
  }
}

// Eliminar un grupo
async function deleteGrupo(req, res) {
  const { cod } = req.params;

  if (!cod) return res.status(400).json({ message: 'cod es obligatorio.', status: 0 });

  try {
    const deleted = await UserGroup.destroy({ where: { cod } });

    if (deleted > 0) {
      res.status(200).json({ message: 'Grupo eliminado correctamente.', status: 1 });
    } else {
      res.status(404).json({ message: 'No existe el grupo especificado.', status: 0 });
    }
  } catch (error) {
    console.error('Error al eliminar el grupo:', error);
    res.status(500).json({ message: 'Hubo un error al eliminar el grupo.', status: 0, error: error.message });
  }
}

module.exports = {
  getAll,
  getOne,
  crearGrupo,
  updateGrupo,
  deleteGrupo,
};
