"use strict";
var pg = require('pg'),
    config = require('../config.json');

var Promise = require('bluebird');



var Services = function(){
 // console.log("res",res);
	this.stringConnection        = "postgres://postgres:"+config.dbpass+"@"+config.dbhost+"/"+config.dbname;
}

Services.prototype = {
  postgres : function(callback){
    var self = this;
    return new Promise(function(resolve, reject){
      return pg.connect(self.stringConnection, function(err, client, done) {
        done();
        if (err) {
          self.error({
                       code:'006',
                        message: 'Error en la conexion a la base de datos',
                        type:'error',
                        debug:err
                    },503);
          return false;
        } 
        resolve(client);
      })
    }).then(function(client){
        return  callback(client);
    })
  },
   	query:function(query,callbacks){
      var self = this;
      
      return new Promise(function(resolve, reject){
          return  self.postgres(function(client){
            //console.log(">>preparando para ejecutar",query);
            return client.query(query, [], function(err, result) {  
              if (err) {
                console.error('error running query');
                reject(err);
              }
               resolve(result);
            });
          })

      }).then(function(result) {
           // console.log(result.rows);
            callbacks(result)
      }).error(function(e){
             self.error({
                        code:'002',
                        message: 'Error en el query',
                        debug:e.toString()+' query='+query
                    },500);
             return false;
      }).catch(function(e){
            self.error({
                        code:'003',
                        message: 'Error en el query',
                        debug:e.toString()+' query='+query
                      },500);
            return false;
             
      });
   		
   	},
    
    error:function(error,codigo){
      console.error(error);
        codigo = 500;
      //this.response.status(codigo).json(e);
      return false;
    }

}

exports.Services = Services


exports.connect = function()
{
   return new Services();
};