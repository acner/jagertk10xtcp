    var $net = require('net');
    var $Util = require('./lib/util.js');
    var tk = require("./parser.js");

    var $util = new $Util();

    //Exporta a classe
    exports.socket = {
        socketpuerto: '',
        moduloIsntancia: '',
        socketHost: '',
        setPuerto: function($ppuerto) {
            if (!$util.isset($ppuerto) || $util.isEmpty($ppuerto)) {
                throw new Error('Ingrese un Puerto');
            }
            this.socketpuerto = $ppuerto;
        },
        getPuerto: function() {
            return this.socketpuerto;
        },
        setHost: function($pHost) {
            if (!$util.isset($pHost) || $util.isEmpty($pHost)) {
                throw new Error('Es necesario Ingresar el host');
            }
            this.socketHost = $pHost;
        },
        getHost: function() {
            return this.socketHost;
        },
        setModuloInstancia: function($pInstancia) {
            if (!$util.isset($pInstancia) || $util.isEmpty($pInstancia)) {
                throw new Error('Es necesario ingresar el nombre de instancia');
            }
            this.moduloIsntancia = $pInstancia;
        },
        getModuloInstancia: function() {
            return this.moduloIsntancia;
        },
        iniciarServidor: function() {
            $self = this;
            var $servidor = $net.createServer();
            $servidor.on('connection', function(cliente) {
                cliente.on('data', function(mensaje) {
                    tk.parser.procesarDatos(cliente, mensaje);
                });
                cliente.on('end', function() {
                    console.log("El cliente se desconecto");
                });
            });
            $servidor.on('error', function(error) {
                console.log(error);
                if (error.code === 'EADDRINUSE') {
                    console.log('La direccion: ' + $self.getHost() + ':' + $self.getPuerto() + ' Esta en uso.')
                    $servidor.close();
                }
            });
            var $confServ = {
                port: $self.getPuerto(),
                host: $self.getHost()
            };
            $servidor.listen($confServ, function() {
                console.log('Servidor iniciando en: ' + $self.getHost() + ':' + $self.getPuerto());
            });
        }
    };