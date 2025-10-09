
const  ftdb=require('../bd/ftdb.js');
const { Sequelize, DataTypes } = require('sequelize');


const Usuario=ftdb.define('Usuario',{
    userId:{
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true 
    },
    name:{
        type: DataTypes.STRING,	
        primaryKey: true
    },
    password:{
        type: DataTypes.STRING,	
    },
    descrip:{
        type: DataTypes.STRING,
    },
    lastLogin:{
        type: Sequelize.DATE,
    }
} , {
    tableName: 'Usuario',
    timestamps: false
});

module.exports = Usuario ;
