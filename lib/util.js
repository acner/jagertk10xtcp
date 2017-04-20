(function(){

var $path = require('path');

function Util() {
   
    this.isset = function($variable) {
        return (typeof $variable !== undefined);
    };
   
    this.isArray = function($array) {
        return Object.prototype.toString.call($array) === '[object Array]';
    };
   
    this.isString = function($string) {
        return Object.prototype.toString.call($string) === '[object String]';
    };
   
    this.isObject = function($obj) {
        return Object.prototype.toString.call($obj) === '[object Object]';
    };
  
    this.isInt = function($variable) {
        return Object.prototype.toString.call($variable === '[object Int]');
    };
    
    this.isEmptyObject = function($obj) {
        for (var property in $obj) {
            return false;
        }
        return true;
    };
    
    this.isEmpty = function($variable) {
        var $vazio = [null, false, 0, '0', '', ' '];
        for (var i = 0; i <= $vazio.length; i++) {
            if ($variable === $vazio[i]) {
                return true;
            }
        }
        return false;
    };
    
    this.limpiarNumeroEntero = function($variable) {
        if (this.isset($variable) && !this.isEmpty($variable)) {
            return $variable.replace(/[^\d ]+/g, "");
        }
        return 0;
    };
    
    this.limpiarNumeroDecimal = function($variable) {
        if (this.isset($variable) && !this.isEmpty($variable)) {
            return $variable.replace(/[^\d. ]+/g, "");
        }
        return 0;
    };
   
    this.limpiarAlfaNumerico = function($variable) {
        if (this.isset($variable) && !this.isEmpty($variable)) {
            return $variable.replace(/[^a-zA-Z0-9 ]+/g, "");
        }
    };
    
    this.limpiarLetras = function($variable) {
        if (this.isset($variable) && !this.isEmpty($variable)) {
            return $variable.replace(/[^a-zA-Z ]+/g, "");
        }
    };
    
    
};
module.exports = Util;

})(this);