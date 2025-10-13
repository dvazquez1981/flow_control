// src/backend/mqtt/mqttService.js
const mqtt = require('mqtt');
const Medicion = require('../models/Medicion');
const Comando = require('../models/Comando');
const Respuesta = require('../models/Respuesta');
const Dispositivo = require('../models/Dispositivo');
const { sanitize } = require('../utils/sanitize');
const Clasificacion = require('../models/Clasificacion');

//Conexión MQTT sin TLS
//Docker service
const client = mqtt.connect('mqtt://mosquitto:1883'); 

client.on('connect', async () => {
    console.log('MQTT conectado al broker');

    //Obtener todos los dispositivos para suscribirse
    const dispositivos = await Dispositivo.findAll();
    const topicsListen = dispositivos.map(d => `/dispositivo/${d.dispositivoId}/medicion`);
 

    //Suscribirse a mediciones
    client.subscribe(topicsListen, (err) => {
        if (err) console.error('MQTT error al suscribirse a mediciones', err);
        else console.log('MQTT suscrito a topics de medición:', topicsListen);
    });



    //Publicar un comando de ejemplo a cada dispositivo
    for (const d of dispositivos) {
        const cmd = {
            fecha: new Date(),
            tipoComandId: 1,
            valor: "RESET",
            dispositivoId: d.dispositivoId
        };
        const topic = `/dispositivo/${d.dispositivoId}/comando`;
        client.publish(topic, JSON.stringify(cmd), {}, (err) => {
            if (err) console.error('MQTT error al publicar comando', err);
            else console.log(`MQTT comando enviado a ${topic}`);
        });
    }
});

//Escuchar de mensajes MQTT
client.on('message', async (topic, payload) => {
    console.log(`MQTT mensaje recibido: ${topic}`);
    let msg;
    try {
        msg = JSON.parse(payload.toString());
    } catch (err) {
        console.error('MQTT JSON inválido', err);
        return;
    }

    //Identificar dispositivoId desde el topic
    const matchMedicion = topic.match(/\/dispositivo\/(\d+)\/medicion/);
    const matchRespuesta = topic.match(/\/dispositivo\/(\d+)\/respuesta/);

    if (matchMedicion) {
      const dispositivoId = parseInt(matchMedicion[1]);
      //Validar formato del mensaje
      const { fecha, valor, carril, clasificacionId  } = msg;

      console.log(`MQTT Ingreso Medicion : dispositivoId: ${dispositivoId}, fecha: ${fecha}, valor: ${valor}, carril: ${carril}, clasificacionId: ${clasificacionId}`);


     if ([fecha, valor, carril, clasificacionId ].some(v => v === undefined)) {
        console.error(`MQTT mensaje incompleto recibido en /dispositivo/${dispositivoId}/medicion`);
        return;
        }
     
        const numDispositivoId = parseInt(dispositivoId);
        if (isNaN(numDispositivoId)) { 
            console.error(`MQTT error validando medición: el valor de dispositivoId no es numérico`);
            return;
        }  
      
        const numClasificacionId= parseInt(clasificacionId); 
        if (isNaN(numClasificacionId)) {
            console.error(`MQTT error validando medición: el valor ClasificacionId no es numérico`); 
            return;
       
        }
        const numCarril= parseInt(carril); 
        if (isNaN(numCarril)) { 
            
            console.error(`MQTT error validando medición: el valor carril no es numérico`); 
             return;
                    }

       const parsedDate = new Date(fecha); 
       if (isNaN(parsedDate.getTime())) { 
           console.error(`MQTT error validando medición: la fecha no es válida`);
           return;
            }

        
        try {

            // Verificar dispositivo 
            const deviceFound = await Dispositivo.findOne({ where: { dispositivoId: numDispositivoId } });
            
            if (!deviceFound) {
            console.error(`MQTT error validando medición: el Dispositivo no existe`);
            return; 
            }

            let tipoContadoIdEncontrado=deviceFound.tipoContadorId; 

            //Verificar clasificacion 
            const clasificacionFound = await Clasificacion.findOne({ where: { clasificacionId: numClasificacionId, tipoContadorId:tipoContadoIdEncontrado } }); 
           
            if (!clasificacionFound) { 
                  console.error(`MQTT error validando medición: la clasificacion no existe`);
                   return; 
            }

            const newMedicion = await Medicion.create({
                fecha: msg.fecha,
                valor: msg.valor,
                carril: msg.carril,
                clasificacionId: msg.clasificacionId,
                dispositivoId
            });
            console.log(`MQTT medición guardada para dispositivo ${dispositivoId}`);
        } catch (err) {
            console.error('MQTT error guardando medición', err);
        }
    }

    if (matchRespuesta) {
        const dispositivoId = parseInt(matchComando[1]);


            const { fecha, cmdId, valor } = msg;

            console.log(`MQTT Ingreso respuesta :  fecha: ${fecha}, valor: ${valor}, cmdId: ${cmdId}`);

           if ([fecha,cmdId, valor ].some(v => v === undefined)) {
                console.error(`MQTT mensaje incompleto recibido en /dispositivo/${dispositivoId}/respuesta`);
                return;
            }

             const numDispositivoId = parseInt(dispositivoId);
             if (isNaN(numDispositivoId)) { 
                console.error(`MQTT error validando respuesta: el valor de dispositivoId no es numérico`);
                return;
               }  

             const numCmdId = parseInt(cmdId);
             if (isNaN(numCmdId)) {
                 console.error(`MQTT error validando respuesta: el valor de cmdId no es numérico`);
                return;
            }

           const parsedDate = new Date(fecha);
           if (isNaN(parsedDate.getTime())) {
                console.error(`MQTT error validando respuesta: la fecha no es valida`);
                return;
            }

        try {


                // Verificar dispositivo
                  const deviceFound = await Dispositivo.findOne({
                 where: { dispositivoId: numDispositivoId }
                 });

             if (!deviceFound) {
              console.error(`MQTT error validando respuesta: el Dispositivo no existe`);
               return; 
               }
   

                // Verificar cmd
                const cmdFound = await Comando.findOne({
                where: {   cmdId: numCmdId }
                });

                if (!cmdFound ) {
                console.error(`MQTT error validando respuesta: el Comando no existe`);
                return; 
                }

     
            
            const newRespuesta = await Respuesta.create({
                fecha: msg.fecha,
                cmdId: msg.cmdId,
                valor: msg.valor,
                dispositivoId
            });
            console.log(`MQTT respuesta guardada para dispositivo ${dispositivoId}`);
        } catch (err) {
            console.error('MQTT error guardando respuesta', err);
        }
    }
});

module.exports = client;
