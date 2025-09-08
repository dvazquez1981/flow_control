const  awdb=require('../bd/awdb.js');

const { Sequelize, DataTypes } = require('sequelize');

/** Defino modelo de los datos */
const Electrovalvula =awdb.define('Electrovalvulas',{
     electrovalvulaId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true 
      },
      nombre: {
        type: DataTypes.STRING(64),
        allowNull: false
      }
    }, {
    tableName: 'Electrovalvulas',
    timestamps: false
});
module.exports = Electrovalvula;