const express = require('express')
var gpio = require('rpi-gpio');
var cors = require('cors');

const app = express()
console.log('Heyyyy');

app.use(cors());
app.get('/', function (req, res) {
  res.send('Hello World!')
})


app.get('/led/:status', function (req, res) {
  var status = req.params.status;
  state = status === 'on';
  console.log('This is the state ', state)
  function write() {
    gpio.write(16, state, function(err) {
      if(err) console.log(err);
      console.log('Heyyyyy mannn');
    });
  }
  console.log('This is the status ', status);
  gpio.setup(16, gpio.DIR_OUT, write);
  res.send('Check the light');
})


app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
