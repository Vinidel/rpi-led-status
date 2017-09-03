var gpio = require('rpi-gpio');

// setInterval(function() {
//   console.log('Heyyyy');
//   gpio.on('change', function(channel, value) {
//     console.log('Channel ' + channel + ' value is now ' + value);
//   });
// }, 1)

gpio.on('change', function(channel, value) {
  value = value ? 1 : 0;
  console.log('Channel ' + channel + ' value is now ' + value);
});

gpio.setup(7, gpio.DIR_IN, gpio.EDGE_BOTH);
