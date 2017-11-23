// Initialize the database
var Datastores = require('nedb');
dbLogs = new Datastores({ filename: 'db/sales.db', autoload: true });

exports.generateLogEntry = function(){
	//
}