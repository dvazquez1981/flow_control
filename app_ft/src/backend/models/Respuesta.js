
const  ftdb=require('../bd/ftdb.js');

const { Sequelize, DataTypes } = require('sequelize');

/** Defino modelo de los datos */
const Respuesta =ftdb.define('Respuesta',{
     RespId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true 
      },
      fecha: {
        type:  DataTypes.DATE,
        allowNull: false
      },
       cmdId: {
        type: DataTypes.INTEGER,
        allowNull: false
      }, 
      valor: {
        type: DataTypes.STRING(64),
        allowNull: false
      },
      dispositivoId: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    }, {
    tableName: 'Respuesta',
    timestamps: true,    // activa timestamps
    createdAt: 'createdAt', // solo createdAt
    updatedAt: false,       // desactiva updatedAt
    freezeTableName: true
});
module.exports = Respuesta;