var gpio = require('rpi-gpio');

function write() {
	var state = true;
	setInterval(function() {
		gpio.write(11, state, function(err) {
			if(err) throw err;
			console.log('Heyyyyy mannn');
		});
		state = !state;
	}, 500);
}



gpio.setup(11, gpio.DIR_OUT, write);
