var $Util = require('./lib/util');
    moment = require('moment'),
    services = require("./lib/services").connect(),
    log = require('./lib/log');

var util = new $Util();

var parser = {
    procesarDatos: function($cliente, $mensaje) {
        var $datos = $mensaje.toString().trim();
        console.log($datos);
        var regexpNumeros = new RegExp("^[0-9]{10,}$");
        if ($datos.indexOf("imei", 0) === -1 && regexpNumeros.test($datos.replace(";", "")) === false) {
        	console.log("error desconocido");
            $cliente.end();
            return
        }
        var imei = this.getImei($datos);
        var arrayDatos = [];
        if (typeof($datos) === 'string') {
            if ($datos.length > 0) {
                arrayDatos = $datos.split(',');
            }
        }
        if (arrayDatos.length === 1) {

            $cliente.write(new Buffer("ON"));
            console.log("Comando ON Enviado");
        }
        if (arrayDatos && arrayDatos[2] === "A;") {
            $cliente.write(new Buffer("LOAD"));
            console.log("Comando LOAD Enviado");
        }
        if (arrayDatos && arrayDatos[4] && arrayDatos[4] === "F") {
            var datosGps = this.getDatosGps(arrayDatos);
            console.log(datosGps);
        }
    },
    getImei: function($datos) {
        if ($datos.indexOf('imei:', 0) !== -1) {
            var $imei = (/imei\:([0-9]*)/).exec($datos);
            if ($imei[1]) return $imei[1];
        } else {
            var $posibleimei = parseInt($datos);
            if (util.isInt($posibleimei)) return $posibleimei;
        }
    },
    getDatosGps: function(arrayDatos) {
        //Higienização dos dados
        arrayDatos[0] = util.limpiarNumeroEntero(arrayDatos[0]);
        arrayDatos[1] = util.limpiarLetras(arrayDatos[1]);
        arrayDatos[2] = util.limpiarNumeroEntero(arrayDatos[2]);
        //arrayDatos[3]  = arrayDatos[3];
        arrayDatos[4] = util.limpiarLetras(arrayDatos[4]);
        arrayDatos[5] = util.limpiarNumeroDecimal(arrayDatos[5]);
        arrayDatos[6] = util.limpiarLetras(arrayDatos[6]);
        arrayDatos[7] = util.limpiarNumeroDecimal(arrayDatos[7]);
        arrayDatos[8] = util.limpiarLetras(arrayDatos[8]);
        arrayDatos[9] = util.limpiarNumeroDecimal(arrayDatos[9]);
        arrayDatos[10] = util.limpiarLetras(arrayDatos[10]);
        arrayDatos[11] = util.limpiarNumeroDecimal(arrayDatos[11]);
        //Montar obj que sera retornado
        var $objDatos = {
            imei: arrayDatos[0],
            alerta: arrayDatos[1],
            phoneadmin: arrayDatos[3],
            datos: this.fechaGps(arrayDatos[2]),
            senal: arrayDatos[4],
            tiempo: arrayDatos[5],
            latitud: this.getCoordenada(arrayDatos[8]) * this.convertirPunto(parseFloat(arrayDatos[7])),
            longitud: this.getCoordenada(arrayDatos[10]) * this.convertirPunto(parseFloat(arrayDatos[9])),
            velocidad: parseInt(arrayDatos[11], 10) * 1.85,
            orientacion:parseInt(arrayDatos[12], 10),
            creado: moment().format("YYYY-MM-DD HH:mm:ss")
        };
        return $objDatos;
    },
    getCoordenada: function(datos) {
        return datos === "S" || datos === "W" ? -1 : 1;
    },
    convertirPunto: function(datos) {
        var parteEntera = ~~(Math.round(datos) / 100);
        var parteDecimal = (datos - (parteEntera * 100)) / 60;
        return (parteEntera + parteDecimal).toFixed(6);
    },
    fechaGps: function(datos) {
        if (!util.isset(datos) || util.isEmpty(datos)) {
            return '0000-00-00 00:00:00';
        }
        var $dt = moment().get('year') + datos.substr(2, 10);
        console.log(datos)
        var $ano = $dt.substr(0, 4);
        var $mes = $dt.substr(4, 2);
        var $dia = $dt.substr(6, 2);
        var $hor = $dt.substr(8, 2);
        var $min = $dt.substr(10, 2);
        var $seg = $dt.substr(12, 2);
        var datos = $ano + '-' + $mes + '-' + $dia + ' ' + $hor + ':' + $min + ':' + $seg;
        if (moment(datos).isValid()) return moment(datos).format('YYYY-MM-DD HH:mm:ss');
        else return '0000-00-00 00:00:00';
    }
}
exports.parser =parser;