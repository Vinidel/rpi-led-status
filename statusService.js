'use strict';

const rp = require('request-promise');
const gpio = require('rpi-gpio');

const options = {
  uri: 'https://dt9emlojka.execute-api.ap-southeast-2.amazonaws.com/prod/led?TableName=led',
  headers: {
    'x-api-key': 'key',
    'token': 'hello'
  },
  json: true // Automatically parses the JSON string in the response
};

//parse API Gateway response
function parseResponse(data) {
  const Items = data.Items;
  return {id: Items[0].id, status: Items[0].status};
}


let cachedStatus = 'off';
//read/write to pin
function write(status) {
  //Call to aws
  setInterval(function() {
    console.log('Making the request');
    rp(options)
      .then(function (data) {
        const status = parseResponse(data).status;

        if(status === cachedStatus) {
          console.log('Status hasn\'t changed');
        } else {
          const state = status === 'on';

          gpio.write(11, state, function(err) {
            if(err) throw err;
            console.log('Writen to pin');
          });
          cachedStatus = status;
          return;
        }
      })
      .catch(function (err) {
        console.log('Error', err.message);
      });
  }, 2000)
}


//Prepare pin to read write
gpio.setup(11, gpio.DIR_OUT, write);


