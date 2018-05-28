'use strict';

const rp = require('request-promise');
const gpio = require('rpi-gpio');
const pinNumber = 37;
const URL = 'https://s59jp649x3.execute-api.ap-southeast-2.amazonaws.com/dev/led';
const options = {
  uri: URL,
  headers: {
    'x-api-key': 'key',
    'token': 'hello'
  },
  json: true // Automatically parses the JSON string in the response
};
const FIVE_SECONDS = 50000;

//parse API Gateway response
function parseResponse(data) {
  const status  = data;
  return {id: status.id, status: status.status};
}

//update status when it is closed
function updateLedStatus(status) {
  const data = {
    status
  };

  const options = {
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST',
    uri: URL,
    body: JSON.stringify(data)
  }
  
  return rp(options)
    .then(() => console.log('Success'))
    .catch((e) => console.log('Error', e));
}


let cachedStatus = 'off';
//read/write to pin
function write(status) {
  //Call to aws
  setInterval(function() {
    console.log('Fetching status');
    rp(options)
      .then(function (data) {
        const status = parseResponse(data).status;

        if(status === cachedStatus) {
          console.log('Status hasn\'t changed, nothing to do');
        } else {
          console.log('Status has changed, writing to pin');
          const state = status === 'on';

          gpio.write(pinNumber, state, function(err) {
            if(err) throw err;
          });

            if(status === 'on') {
              setTimeout(() => {
                updateLedStatus('off')
              }, FIVE_SECONDS);
            }
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
gpio.setup(pinNumber, gpio.DIR_OUT, write);


