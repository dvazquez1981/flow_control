const Medicion = require('../models/Medicion.js');
const Dispositivo= require('../models/Dispositivo.js')
const {sanitize}  = require('../utils/sanitize.js');

async function getAll(req, res) {
    try {

        console.log('Obtengo todas las mediciones')
        const m = await Medicion.findAll();
       
   
    if (m) {
         res.status(200).json(sanitize(m));
         }
    else {

        console.log('No se encontraron mediciones.')
            res.status(404).json({ message: 'No se encontraron mediciones.' });
        }    
           
        
    } catch (error) {
        console.error(error.message )
        res.status(500).json({ error: error.message });
    }
}
/** Crear un nueva medicion */
/*validando los valores del body*/
async function createMedicion(req, res) {

  // Si los datos vienen en formato JSON o vienen en formato URL-encoded es indistito.
    const { fecha, valor, dispositivoId } = req.body;


    console.log("Ingreso: dispositivoId: " + dispositivoId + " fecha: " + fecha + " valor: " + valor);	


 
    // Validar que todos los campos requeridos están presentes
    if (dispositivoId===undefined || fecha===undefined  ||  valor===undefined )  {

    console.log('dispositivoId, valor, fecha son obligatorios')
        return res.status(400).json({ message: 'dispositivoId, valor, fecha son obligatorios',
            status: 0 });
    }



   const numeroDispositivoId= parseInt(dispositivoId);
  if( isNaN(numeroDispositivoId)  )
  {
    console.log('el valor de dispositivoId no es un numero');
    return res.status(400).json({
    message: 'el valor de dispositivoId no es un numero',
    status: 0,
    });
  }
    
   // Verificar que fecha sea una fecha válida
     const parsedDate = new Date(fecha);
     if (isNaN(parsedDate.getTime())) {
          console.log('fecha no válida');
         return res.status(400).json({
            message: 'La fecha no es válida',
        status: 0
    });
     } 


    try {


    const DeviceFound = await Dispositivo.findOne({
        where: {
           dispositivoId: numeroDispositivoId
        }
      });


     if (!DeviceFound)
     {    console.log('El dispositivoId no es correcto.')
        return res.status(422).json(
            { message: 'El dispositivoId no es correcto.',
            status: 0
           
     });

     }


        const MedicionFound = await Medicion.findOne({
        where: {
           fecha: fecha,
           dispositivoId: numeroDispositivoId
        }
      });


     if (MedicionFound)
     {    
        console.log('La medicion ya existe.')
        return res.status(422).json(
            { message: 'La medicion ya existe.',
            status: 0
           
     });

     }

       const newMeasurement = await Medicion.create({
            fecha: fecha,
            valor: valor,
            dispositivoId: numeroDispositivoId
        });

         
        const insertedId = newMeasurement.medicionId;
        console.log('Medicion creado con éxito id:'+ insertedId )
        //return { insertedId };
        return res.status(201).json(
            
        { message: 'Medicion creado con éxito.',  status: 1,data: sanitize(newMeasurement) });
            
    } catch (error) {
        console.error('Error al crear la medicion:', error);
        return res.status(500).json({ message: 'Ocurrió un error inesperado', error: error.message });
    }
}

async function getAllByDeviceId(req,res)
    {
     var {dispositivoId}  = req.params;



 // Validar que todos los campos requeridos están presentes
    if (dispositivoId===undefined)  {

    console.log('dispositivoId es obligatorio')
        return res.status(400).json({ message: 'dispositivoId es obligatorio',
            status: 0 });
    }



   const numeroDispositivoId= parseInt(dispositivoId);
  if( isNaN(numeroDispositivoId)  )
  {
    console.log('el valor de dispositivoId no es un numero');
    return res.status(400).json({
    message: 'el valor de dispositivoId no es un numero',
    status: 0,
    });
  }



     console.log('Obtengo todas las mediciones del dispositivoId: '+numeroDispositivoId)
        try {
    
            const DeviceFound = await Dispositivo.findOne({
                where: {
                    dispositivoId:numeroDispositivoId
                }
            });
    
            if(!DeviceFound){
              
                console.log("dispositivoId: " + numeroDispositivoId +  " no encontrado ")
                return res.status(404).json({
                    message: 'No se encuentra el Device.'      
                   
                });
             
            }

            console.log("dispositivoId: " + numeroDispositivoId + " encontrado ")

            const me = await Medicion.findAll({
              where: {
                dispositivoId: numeroDispositivoId
               }
                  });
            if (me.length > 0) {
                const sanitizedMeasurements = me.map(m => sanitize(JSON.parse(JSON.stringify(m))))

                console.log('Se encontraron mediciones.' )  

                res.status(200).json( sanitizedMeasurements );
            }
            else {
                console.log('No se encontraron mediciones.' )
            res.status(404).json({ message: 'No se encontraron mediciones.' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log( error.message)
    
    }
 }

async function  getUltimaMedicionByDeviceID(req, res) {
  const { dispositivoId } = req.params || {};

  if (!dispositivoId) {
    return res.status(400).json({ status: 0, message: 'dispositivoId es obligatorio' });
  }

  const numeroDispositivoId = Number(dispositivoId);
  if (!Number.isInteger(numeroDispositivoId)) {
    return res.status(400).json({
      status: 0,
      message: 'el valor de dispositivoId no es un número válido'
    });
  }

  try {
    const ultimaMedicion = await Medicion.findOne({
      where: { dispositivoId: numeroDispositivoId },
      order: [['medicionId', 'DESC']] // o [['createdAt', 'DESC']] si tenés timestamps
    });

    if (!ultimaMedicion) {
      return res.status(404).json({
        status: 0,
        message: 'No se encontraron mediciones para este dispositivo.'
      });
    }

    return res.status(200).json({
      status: 1,
      data: sanitize(ultimaMedicion)
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 0,
      message: 'Algo salió mal',
      error: error.message
    });
  }
}

async function getOne(req, res) {
  const { medicionId } = req.params;
  console.log("Get medicionId: " + medicionId);

if (medicionId===undefined) {
    console.log('medicionId es obligatorio');
    return res.status(400).json({
      message: 'medicionId es obligatorio',
      status: 0,
    });
  }

   const numeroMedicionId= parseInt(medicionId);
  if( isNaN(numeroMedicionId)  )
  {
    console.log('el valor de medicionId no es un numero');
    return res.status(400).json({
    message: 'el valor de medicionId no es un numero',
    status: 0,
    });
  }


  try {
    const MedicionFound = await Medicion.findOne({
      where: { medicionId: numeroMedicionId }
    });

    if (MedicionFound) {
      console.log("Se encontró");
      res.status(200).json(sanitize(MedicionFound));
    } else {
      console.log("No se encontró");
      res.status(404).json({ message: 'No se encuentra la medicion.' });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Algo salió mal',
      data: { error }
    });
  }
}

async function deleteMedicion(req, res) {
   const { medicionId } = req.params;


if (medicionId===undefined) {
    console.log('medicionId es obligatorio');
    return res.status(400).json({
      message: 'medicionId es obligatorio',
      status: 0,
    });
  }

   const numeroMedicionId= parseInt(medicionId);
  if( isNaN(numeroMedicionId)  )
  {
    console.log('el valor de medicionId no es un numero');
    return res.status(400).json({
    message: 'el valor de medicionId no es un numero',
    status: 0,
    });
  }


  try {
    const deletedRecord = await Medicion.destroy({
      where: { medicionId : numeroMedicionId  }
    });

    if (deletedRecord > 0) {
      console.log("id: " + numeroMedicionId  + " se borró correctamente");
      res.status(200).json({ message: "Se borró correctamente" });
    } else {
      console.log("id: " + numeroMedicionId  + " no existe registro");
      res.status(404).json({ message: "No existe registro" });
    }

  } catch (error) {
    console.error('Error al borrar: ', error);
    res.status(500).json({
      message: 'Hubo un error',
      data: { error }
    });
  }
}

async function deleteMedicionByDeviceId(req, res) {
  var {dispositivoId}  = req.params;
 console.log('Obtengo todas las mediciones del dispositivoId: '+dispositivoId)


  if (dispositivoId===undefined) {
    console.log('dispositivoId  es obligatorios');
    return res.status(400).json({
      message: 'dispositivoId es obligatorios',
      status: 0,
    });
  }
   const numeroDispositivoId= parseInt(dispositivoId);
  if( isNaN(numeroDispositivoId)  )
  {
    console.log('el valor de dispositivoId no es un numero');
    return res.status(400).json({
    message: 'el valor de dispositivoId no es un numero',
    status: 0,
    });
  }




  try {
    const deletedRecord = await Medicion.destroy({
      where: { dispositivoId : numeroDispositivoId  }
    });

    if (deletedRecord > 0) {
      console.log("id: " + numeroDispositivoId + " se borró correctamente");
      res.status(200).json({ message: "Se borró correctamente" });
    } else {
      console.log("id: " + numeroDispositivoId  + " no existe registro");
      res.status(404).json({ message: "No existe registro" });
    }

  } catch (error) {
    console.error('Error al borrar: ', error);
    res.status(500).json({
      message: 'Hubo un error',
      data: { error }
    });
  }
}

async function updateMedicion(req, res) {
  const { medicionId } = req.params;
  const { fecha, valor, dispositivoId } = req.body;
  console.log("update: medicionId : " + medicionId +" dispositivoId : " + dispositivoId +" fecha: " + fecha + " valor: " + valor);	

    
  if(medicionId===undefined) 
  {
    console.log('el valor de medicionId es obligatorio.');
    return res.status(400).json({
      message: 'el valor de medicionId es obligatorio.',
      status: 0,
    });
  }
  
  const numeroMedicionId= parseInt(medicionId);
  if( isNaN(numeroMedicionId)  )
  {
    console.log('el valor de medicionId no es un numero');
    return res.status(400).json({
    message: 'el valor de medicionId no es un numero',
    status: 0,
    });
  }



  if(fecha!==undefined )
  {
   // Verificar que fecha sea una fecha válida
     const parsedDate = new Date(fecha);
     if (isNaN(parsedDate.getTime())) {
          console.log('Fecha no válida');
         return res.status(400).json({
            message: 'La fecha no es válida',
        status: 0
    });
     } 

    }

  var  numeroDispositivoId=undefined
  if (dispositivoId!==undefined) 
  {
    numeroDispositivoId= parseInt(dispositivoId);
  if( isNaN(numeroDispositivoId)  )
  {
    console.log('el valor de dispositivoId no es un numero');
    return res.status(400).json({
    message: 'el valor de dispositivoId no es un numero',
    status: 0,
    });
  }
  }





try {
    
    const existingDispositivo= await Dispositivo.findOne({
      where: { dispositivoId: dispositivoId }
    });
    
    if (!existingDispositivo) {
        console.log('el Dispositivo con id: ' + dispositivoId +' no existe.');
      return res.status(409).json({
        message: 'el Dispositivo con id: : ' + dispositivoId +' no existe.',
        status: 0,
      });
    }
 

    const m = await Medicion.findOne({
      where: { medicionId: numeroMedicionId  },
      attributes: ['medicionId', 'fecha', 'valor','dispositivoId']
    });

    if (!m) {
      console.log(" medicionId: " +  numeroMedicionId + " no encontrado");
      return res.status(404).json({ message: ' medicion no encontrada.' });
    }
    

    await m.update({
      medicionId: numeroMedicionId,
      fecha: fecha!== undefined ? fecha: m.fecha,
      valor:valor !== undefined ? valor : m.valor,
      dispositivoId: numeroDispositivoId !== undefined ? numeroDispositivoId: m.dispositivoId

    });

  
    console.log("id medicion: " +  numeroMedicionId + " se actualizó correctamente");
    res.status(200).json({ message: 'medicion se actualizó correctamente.' });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Algo no funcionó',
      data: { error }
    });
  }
}

module.exports = {
  getAll,
  getOne,
  createMedicion,
  getAllByDeviceId,
  deleteMedicion,
  deleteMedicionByDeviceId,
  getUltimaMedicionByDeviceID,
  updateMedicion

};