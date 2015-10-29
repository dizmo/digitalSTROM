//= compat
//= require flab/Namespace
//= require flab/Class
//= require flab/digitalstrom/connector

flab.Namespace.create('flab');

flab.HomeAutomation = flab.Class.extend(Object, {
	constructor: function() {
	},
	
	getConnector : function() {
		return new flab.digitalstrom.connector();
	}
});
