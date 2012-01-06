AirportProvider=function() {};
AirportProvider.prototype.data = [];

AirportProvider.prototype.findAll = function(callback) {
	callback( null, this.data )
};

AirportProvider.prototype.load = function() {
	this.data[this.data.length] = { code: '---', title= 'Select an Airport' };
	this.data[this.data.length] = { code: 'KIS', title= 'Kisumu' };
	this.data[this.data.length] = { code: 'MYD', title= 'Malindi' };
	this.data[this.data.length] = { code: 'MBA', title= 'Mombasa' };
	this.data[this.data.length] = { code: 'NBO', title= 'Nairobi' }; 
};

new AirportProvider.load();
exports.AirportProvider = AirportProvider;