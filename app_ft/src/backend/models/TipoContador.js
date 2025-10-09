const  ftdb=require('../bd/ftdb.js');

const { Sequelize, DataTypes } = require('sequelize');

/** Defino modelo de los datos */
const TipoContador =ftdb.define('TipoContador',{
     TC_Id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true 
      },
      TC_TipoContador: {
        type: DataTypes.STRING(64),
        allowNull: false
      }
    }, {
    tableName: 'TipoContador',
    timestamps: false
});
module.exports = TipoContador;

