// Imports the Google Cloud client library
const Compute = require('@google-cloud/compute');

// Creates a client
const compute = new Compute();

// Create a new VM using the latest OS image of your choice.
const zone = compute.zone('us-central1-a');
const name = 'ubuntu-http-foo-' + Math.floor(Math.random() * 1000);

// console.log(zone)


// zone.createVM(name, {os: 'ubuntu'}, function(err, vm, operation, apiResponse) {
//   if(err) {
//      console.log("Error!");
//   } else {
//     console.log(apiResponse)
//   }
// })

const startup_script = require('fs').readFileSync('setup_and_start_game.sh', 'utf8');
console.log(startup_script);

const config = {
  os: 'debian',
  http: true,
  https: true,
  ssh: true,
  tags: ['debian-server'],
  serviceAccounts: [{
    kind: 'compute#serviceAccount',
    email: 'default',
    scopes: [
      'https://www.googleapis.com/auth/devstorage.read_only'
    ]
  }],
  metadata: [
    {
      items: [{
        key: 'startup-script-url',
        value: 'gs://battleship/setup.sh'
      }]
    }
  ]
};

zone
  .createVM(name, config).then(data => {
    // `operation` lets you check the status of long-running tasks.
    const vm = data[0];
    const operation = data[1];
    console.log('We got data');
    console.log(data)
    vm.start().catch(err => {
      console.error('Could not start', err);
    })
    return operation.promise();
  })
  .then()
  .catch(err => {
    console.error('ERROR:', err);
  });

