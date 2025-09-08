const { Sequelize, DataTypes } = require('sequelize');
const awdb = require('../bd/awdb.js');

/** Defino modelo de los datos */
const Log_Riego = awdb.define('Log_Riego', { // nombre interno del modelo
  logRiegoId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true 
  },
  apertura: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  fecha: {
    type: DataTypes.DATE,
    allowNull: false
  },     
  electrovalvulaId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
}, {
  tableName: 'Log_Riegos', // nombre real de la tabla en la DB
  timestamps: false
});

module.exports = Log_Riego;
