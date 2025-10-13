const  ftdb=require('../bd/ftdb.js');

const { Sequelize, DataTypes } = require('sequelize');

/** Defino modelo de los datos */
const TipoEstado =ftdb.define('TipoEstado',{
     tipoEstadoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true 
      },
      descripcion: {
        type: DataTypes.STRING(64),
        allowNull: false
      },
      tipoContadorId: {
      type: DataTypes.STRING(64),
       allowNull: false
      }
    }, {
    tableName: 'TipoEstado',
    timestamps: false
});
module.exports = TipoEstado;

