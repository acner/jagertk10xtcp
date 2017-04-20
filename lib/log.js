var config 		= require('../config.json');
var mailer = require("nodemailer");
	var smtpTransport = mailer.createTransport({
		    service: "gmail",
		    auth: {
		        user: config.smtp_user,
		        pass: config.smtp_pass
		    }
		});

var Log = {
	direccion:'',
	error:function(log,log2){
		var self = this;
		var timestamp = new Date().toLocaleString()
		if(!log2){
			console.error( '[' + timestamp + '-ERROR-'+this.direccion+'] -> ',log );
		}else{
			console.error( '[' + timestamp + '-ERROR-'+this.direccion+'] -> ' + log , " - "+log2 );
		}
		self.email(log,log2);
	},
	info:function(log,log2){
		var timestamp = new Date().toLocaleString()

		if(!log2){
			console.log( '[' + timestamp + '-INFO-'+this.direccion+'] -> ',log );
		}else{
			console.log( '[' + timestamp + '-INFO-'+this.direccion+'] -> ' + log , " - "+log2 );
		}
	},
	id:function(id,log){
		var timestamp = new Date().toLocaleString()
		console.log( '[' + timestamp + '-ID='+id+'-'+this.direccion+'] -> ',log );
	},
	ip:function(ip,puerto){
		self = this;
		this.direccion=ip+':'+puerto;
		return this;
	},
	email:function(subject,mensaje,to){
		// Use Smtp Protocol to send Email
	
		var self = this;
		var a = config.smtp_to;
		if(to){
			a = to;
		}
		var mail = {
		    from: '"'+config.smtp_from_name+' 👻"  <'+config.smtp_from_email+'>',
		    to: a,
		    subject: subject,
		    html:mensaje
		}

		smtpTransport.sendMail(mail, function(error, response){
		    if(error){
		    	console.error(error);
			}else{
		    	self.info("Email Enviado.",subject+' - '+response.message);
		    }
		    smtpTransport.close();
		});

	}
}

module.exports= Log;