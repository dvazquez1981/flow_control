// db/sqlserver.js
const {Sequelize } = require('sequelize');

let bd="db_grd"
let usuario="sa"
let password="osql"
let sevidor="10.8.34.57"

const grddb = new Sequelize(bd, usuario,password, {
  host: sevidor,
  dialect: 'mssql',
  dialectOptions: { options: { encrypt: false, trustServerCertificate: true } },
  logging: false
});


 // Conexión 
  (async () => {
    try {
      await grddb.authenticate();
      console.log('Conexión a SQL OK.');
  
    } catch (error) {
      console.error('Error al conectar a SQL:', error);
    }
  })();


module.exports = grddb ;