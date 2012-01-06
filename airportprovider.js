AirportProvider=function() {};
AirportProvider.prototype.data = [];

AirportProvider.prototype.findAll = function(callback) {
	callback( null, this.data )
};

AirportProvider.prototype.load = function() {
	// this.data[this.data.length] = { code: '---', title= 'Select an Airport' };
	this.data[this.data.length] = { code: 'KIS', name: 'Kisumu' };
	this.data[this.data.length] = { code: 'MYD', name: 'Malindi' };
	this.data[this.data.length] = { code: 'MBA', name: 'Mombasa' };
	this.data[this.data.length] = { code: 'NBO', name: 'Nairobi' }; 
};

new AirportProvider().load();
exports.AirportProvider = AirportProvider;