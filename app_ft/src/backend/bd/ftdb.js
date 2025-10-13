const { Sequelize, DataTypes } = require('sequelize');
const mysql2 = require('mysql2');

const ftdb = new Sequelize('flow_control', 'root', 'userpass', {
    host: 'mysql-server',
    port: 3306,
    dialect: 'mysql',
    dialectModule: mysql2,
    logging: false,
    pool: {
      max: 20,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  });
  
  // Conexión 
  (async () => {
    try {
      await ftdb.authenticate();
      console.log('Conexión a MySQL OK.');
  
    } catch (error) {
      console.error('Error al conectar a MySQL:', error);
    }
  })();
  
  module.exports = ftdb;
