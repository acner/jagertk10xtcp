var Servidor = require('./socket.js'),
    config = require('./config.json');

Servidor.socket.setHost('0.0.0.0');
Servidor.socket.setPuerto(config.puerto);
Servidor.socket.iniciarServidor();