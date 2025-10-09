const { Sequelize, DataTypes } = require('sequelize');
const ftdb = require('../bd/ftdb.js');

/** Defino modelo de los datos */
const LogEvento = ftdb.define('LogEvento', { // nombre interno del modelo
  logId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true 
  },
 
  fecha: {
    type: DataTypes.DATE,
    allowNull: false
  },     

  tipo: {
    type: DataTypes.ENUM('INFO', 'WARN', 'ERROR', 'COMANDO', 'RESPUESTA', 'ESTADO', 'MEDICION', 'SISTEMA'),
    allowNull: false
  },

  entidad: {
        type: DataTypes.STRING(128),
        allowNull: false
      },

  entidadId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
   mensaje:{
        type: DataTypes.STRING(128),
        allowNull: false
      },

  dispositivoId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },

   userId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },

  
  }, {
  tableName: 'LogEvento', // nombre real de la tabla en la DB
  timestamps: false
});

module.exports = LogEvento ;
