const  ftdb=require('../bd/ftdb.js');
const { Sequelize, DataTypes } = require('sequelize');

/** Defino modelo de los datos */
const TipoComando =ftdb.define('TipoComando',{
     tipoComandId: {
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
        type: DataTypes.INTEGER,
        allowNull: false
      }


    }, {
    tableName: 'TipoComando',
    timestamps: false
});
module.exports = TipoComando;


