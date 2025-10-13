// src/backend/mqtt/mqttService.js
const mqtt = require('mqtt');
const Medicion = require('../models/Medicion');
const Comando = require('../models/Comando');
const Respuesta = require('../models/Respuesta');
const Dispositivo = require('../models/Dispositivo');
const { sanitize } = require('../utils/sanitize');

//Conexión MQTT sin TLS
//Docker service
const client = mqtt.connect('mqtt://mosquitto:1883'); 

client.on('connect', async () => {
    console.log('[MQTT] Conectado al broker');

    //Obtener todos los dispositivos para suscribirse
    const dispositivos = await Dispositivo.findAll();
    const topicsListen = dispositivos.map(d => `/dispositivo/${d.dispositivoId}/medicion`);
 

    //Suscribirse a mediciones
    client.subscribe(topicsListen, (err) => {
        if (err) console.error('[MQTT] Error al suscribirse a mediciones', err);
        else console.log('[MQTT] Suscrito a topics de medición:', topicsListen);
    });

    // Publicar un comando de ejemplo a cada dispositivo
    for (const d of dispositivos) {
        const cmd = {
            fecha: new Date(),
            tipoComandId: 1,
            valor: "RESET",
            dispositivoId: d.dispositivoId
        };
        const topic = `/dispositivo/${d.dispositivoId}/comando`;
        client.publish(topic, JSON.stringify(cmd), {}, (err) => {
            if (err) console.error('[MQTT] Error al publicar comando', err);
            else console.log(`[MQTT] Comando enviado a ${topic}`);
        });
    }
});

// Escucha de mensajes MQTT
client.on('message', async (topic, payload) => {
    console.log(`[MQTT] Mensaje recibido: ${topic}`);
    let msg;
    try {
        msg = JSON.parse(payload.toString());
    } catch (err) {
        console.error('[MQTT] JSON inválido', err);
        return;
    }

    // Identificar dispositivoId desde el topic
    const matchMedicion = topic.match(/\/dispositivo\/(\d+)\/medicion/);
    const matchComando = topic.match(/\/dispositivo\/(\d+)\/comando/);

    if (matchMedicion) {
        const dispositivoId = parseInt(matchMedicion[1]);
        try {
            const newMedicion = await Medicion.create({
                fecha: msg.fecha,
                valor: msg.valor,
                carril: msg.carril || 1,
                clasificacionId: msg.clasificacionId || 1,
                dispositivoId
            });
            console.log(`[MQTT] Medición guardada para dispositivo ${dispositivoId}`);
        } catch (err) {
            console.error('[MQTT] Error guardando medición', err);
        }
    }

    if (matchComando) {
        const dispositivoId = parseInt(matchComando[1]);
        try {
            const newRespuesta = await Respuesta.create({
                fecha: msg.fecha,
                cmdId: msg.cmdId,
                valor: msg.valor,
                dispositivoId
            });
            console.log(`[MQTT] Respuesta guardada para dispositivo ${dispositivoId}`);
        } catch (err) {
            console.error('[MQTT] Error guardando respuesta', err);
        }
    }
});

module.exports = client;
