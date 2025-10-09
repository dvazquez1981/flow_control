const  ftdb=require('../bd/ftdb.js');

const { Sequelize, DataTypes } = require('sequelize');

/** Defino modelo de los datos */
const UserGroup =ftdb.define('userGroups',{
     cod: {
        type:  DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      nombre: {
        type: DataTypes.STRING(64),
        allowNull: false
      }
    }, {
    tableName: 'userGroups',
    timestamps: false
});
module.exports = UserGroup;