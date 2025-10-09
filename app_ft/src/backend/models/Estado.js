const  ftdb= require('../bd/ftdb.js');
const { Sequelize, DataTypes } = require('sequelize');

/** Defino modelo de los datos */
const Estado=ftdb.define('Estado',{
     estadoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true 
      },
      fecha: {
        type:  DataTypes.DATE,
        allowNull: false
      },
     
      tipoEstadoId:{
      type: DataTypes.INTEGER,
      allowNull: false
      },
      valor: {
       type: DataTypes.INTEGER,
        allowNull: false
      },
      dispositivoId: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    }, {
    tableName: 'Estado',
    timestamps: false
});
module.exports = Estado;
