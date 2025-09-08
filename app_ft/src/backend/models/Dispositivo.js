const  awdb=require('../bd/awdb.js');


const { Sequelize, DataTypes } = require('sequelize');

/** Defino modelo de los datos */
const Dispositivo =awdb.define('Dispositivos',{
     dispositivoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true 
      },
      nombre: {
        type: DataTypes.STRING(64),
        allowNull: false
      },
      ubicacion: {
        type: DataTypes.STRING(128),
        allowNull: false
      },
      electrovalvulaId: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    }, {
    tableName: 'Dispositivos',
    timestamps: false
});
module.exports = Dispositivo ;