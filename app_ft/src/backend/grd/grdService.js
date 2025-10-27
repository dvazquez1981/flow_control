
const grddb=require('../bd/grddb.js');
const Medicion = require('../models/Medicion'); // tu modelo



async function sincronizarNuevos(grd_id) {
  try {
    // Obtener la fecha más reciente insertada
    const ultimaFecha = await Medicion.max('fecha', {
      where: { dispositivoId: grd_id }
    });

    // Ejecutar el SP
    const results = await grddb.query(
      'EXEC dbo.sp_Obtener_Registros_DTEC_GRDId @grd_id = :id',
      {
        replacements: { id: grd_id },
        type: grddb.QueryTypes.SELECT
      }
    );

    //  Filtrar solo registros más recientes que la última fecha
    const nuevos = results.filter(r => {
      const fecha = new Date(r.ano, r.mes - 1, r.dia, r.hora, r.minutos, r.segundos);
      return !ultimaFecha || fecha > ultimaFecha;
    });

    if (nuevos.length === 0) {
      console.log(' No hay nuevas mediciones para insertar');
      return;
    }

    //Mapear a Medicion
    const mediciones = [];
    for (const r of nuevos) {
      const fecha = new Date(r.ano, r.mes - 1, r.dia, r.hora, r.minutos, r.segundos);

      // Carril 1
      mediciones.push({
        fecha,
        valor: r.liv_1,
        carril: 1,
        clasificacionId: 1,
        dispositivoId: r.grd_id
      });

      // Carril 2 si tiene datos
      
        mediciones.push({
          fecha,
          valor: r.liv_2,
          carril: 2,
          clasificacionId: 1,
          dispositivoId: r.grd_id
        });
     
     
         // Carril 1
      mediciones.push({
        fecha,
        valor: r.pes_1,
        carril: 1,
        clasificacionId: 2,
        dispositivoId: r.grd_id
      });

      // Carril 2 si tiene datos
      
        mediciones.push({
          fecha,
          valor: r.pes_2,
          carril: 2,
          clasificacionId:2 ,
          dispositivoId: r.grd_id
        });
     
     
     
     
     
     
     
     
      }


   
      
    

    // Insertar todos los registros nuevos de golpe
    await Medicion.bulkCreate(mediciones);
    console.log(`Insertadas ${mediciones.length} nuevas mediciones`);

  } catch (err) {
    console.error('Error al sincronizar nuevos registros:', err);
  }
}

setInterval(() => {
  sincronizarNuevos(15); // grd_id = 15
}, 30000); // cada 5 segundos, por ejemplo


module.exports = {
  sincronizarNuevos
};