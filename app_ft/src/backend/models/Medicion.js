const  ftdb= require('../bd/ftdb.js');
const { Sequelize, DataTypes } = require('sequelize');

/** Defino modelo de los datos */
const Medicion=ftdb.define('Medicion',{
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
       type: DataTypes.INTEGER,
        allowNull: false
      },
      carril: {
       type: DataTypes.INTEGER,
      allowNull: false
      },
    clasificacionId: {
      type: DataTypes.INTEGER,
      allowNull: false
      },
      dispositivoId: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    }, {
    tableName: 'Medicion',
    timestamps: true,    // activa timestamps
    createdAt: 'createdAt', // solo createdAt
    updatedAt: false,       // desactiva updatedAt
    freezeTableName: true
    
});
module.exports = Medicion ;

