
const grddb=require('../bd/grddb.js');
const Medicion = require('../models/Medicion'); // tu modelo



async function sincronizarNuevos(grd_id) {
  try {
    // Obtener la fecha más reciente insertada
    const ultimaFecha = await Medicion.max('fecha', {
      where: { dispositivoId: grd_id }
    });
    const ultimaUTC = ultimaFecha ? ultimaFecha.getTime() : 0;

    // Ejecutar el SP
    const results = await grddb.query(
      'EXEC dbo.sp_Obtener_Registros_DTEC_GRDId @grd_id = :id',
      {
        replacements: { id: grd_id },
        type: grddb.QueryTypes.SELECT
      }
    );

    // Filtrar solo registros más recientes que la última fecha
    const nuevos = results.filter(r => {
      const fechaUTC = Date.UTC(r.ano, r.mes - 1, r.dia, r.hora + 3, r.minutos, r.segundos);
      return fechaUTC > ultimaUTC;
    });

    if (nuevos.length === 0) {
      console.log('No hay nuevas mediciones para insertar');
      return;
    }

    // Mapear a Medicion
    const mediciones = [];
    for (const r of nuevos) {
      // Convertir a hora local de Buenos Aires
      const fechaLocal = Date.UTC(r.ano, r.mes - 1, r.dia, r.hora + 3, r.minutos, r.segundos);

      // Carril 1
      mediciones.push({
        fecha: fechaLocal,
        valor: r.liv_1,
        carril: 1,
        clasificacionId: 1,
        dispositivoId: r.grd_id
      });

      // Carril 2
      mediciones.push({
        fecha: fechaLocal,
        valor: r.liv_2,
        carril: 2,
        clasificacionId: 1,
        dispositivoId: r.grd_id
      });

      // Carril 1 peso
      mediciones.push({
        fecha: fechaLocal,
        valor: r.pes_1,
        carril: 1,
        clasificacionId: 2,
        dispositivoId: r.grd_id
      });

      // Carril 2 peso
      mediciones.push({
        fecha: fechaLocal,
        valor: r.pes_2,
        carril: 2,
        clasificacionId: 2,
        dispositivoId: r.grd_id
      });
    }

    // Insertar todos los registros nuevos por bloques
    const BATCH_SIZE = 250;
    for (let i = 0; i < mediciones.length; i += BATCH_SIZE) {
      const batch = mediciones.slice(i, i + BATCH_SIZE);
      try {
        await Medicion.bulkCreate(batch);
        console.log(`Insertadas ${batch.length} mediciones (bloque ${i / BATCH_SIZE + 1})`);
      } catch (error) {
        console.error(`Error insertando el bloque ${i / BATCH_SIZE + 1}:`, error.message);
      }
    }

  } catch (err) {
    console.error('Error al sincronizar nuevos registros:', err);
  }
}

setInterval(() => {
  sincronizarNuevos(15); // grd_id = 15
}, 60000); // cada 60 segundos, por ejemplo


module.exports = {
  sincronizarNuevos
};