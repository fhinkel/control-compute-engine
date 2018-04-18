// Imports the Google Cloud client library
const Compute = require('@google-cloud/compute');

// Creates a client
const compute = new Compute();

// Create a new VM using the latest OS image of your choice.
const zone = compute.zone('us-central1-a');
const name = 'ubuntu-http-foo-1';

// console.log(zone)


// zone.createVM(name, {os: 'ubuntu'}, function(err, vm, operation, apiResponse) {
//   if(err) {
//      console.log("Error!");
//   } else {
//     console.log(apiResponse)
//   }
// })

zone
  .createVM(name, {os: 'ubuntu'}).then(data => {
    // `operation` lets you check the status of long-running tasks.
    const vm = data[0];
    const operation = data[1];
    console.log('we got data');
    console.log(data)
    return operation.promise();
  })
  .then(() => {
    console.log('created!');
    // Virtual machine created!
  })
  .catch(err => {
    console.error('ERROR:', err);
  });
