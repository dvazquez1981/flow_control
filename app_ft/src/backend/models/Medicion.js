const  awdb=require('../bd/awdb.js');
const { Sequelize, DataTypes } = require('sequelize');

/** Defino modelo de los datos */
const Medicion=awdb.define('Mediciones',{
     medicionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true 
      },
      fecha: {
        type:  DataTypes.DATE,
        allowNull: false
      },
      valor: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      dispositivoId: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    }, {
    tableName: 'Mediciones',
    timestamps: false
});
module.exports = Medicion ;

