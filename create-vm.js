// Imports the Google Cloud client library
const Compute = require('@google-cloud/compute');

require('@google-cloud/debug-agent').start();

// Creates a client
const compute = new Compute();

// Create a new VM using the latest OS image of your choice.
const zone = compute.zone('us-central1-a');

function startVM(cb) {
  const name = 'ubuntu-http-foo-' + Math.floor(Math.random() * 1000);
  console.log("this is the future name: " + name);
  // todo(fhinkel): use async await, Node 8 should be supported
  // const startup_script = require('fs').readFileSync('./setup_and_start_game.sh', 'utf8');
  // console.log(startup_script);
  
  const config = {
    os: 'ubuntu',
    http: true,
    https: true,
    ssh: true,
    tags: ['node-server', 'https-server'],
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
  
  zone.createVM(name, config).then(data => {
    // `operation` lets you check the status of long-running tasks.
    const vm = data[0];
    const apiResponse = data[1];
    console.log('We got data for ' + vm.name);
    // console.log(data)
    vm.start().then(() => {
      console.log(vm.name);
      vm.get(function(err, vm, apiResponse){
        if (err) {
          console.log('error getting vm');
        }

        const ip = apiResponse.networkInterfaces[0].accessConfigs[0].natIP;
        console.log(ip);
        cb(ip);
      })
    }).catch(err => {
      console.error('Could not start', err);
    })
    return apiResponse.promise();
  })
  .catch(err => {
    console.error('ERROR: connection did not work', err);
  });
}




const express = require('express');

const path = require('path')

const app = express();
var server = require('http').Server(app);


const ID = Math.floor(Math.random() * 1000);
app.use(express.static(path.join(__dirname, 'public')))

app.get('/hello', (req, res) => {
  res.status(200).send('Hello, world! This is robot #' + ID + '.').end();
});


// Start the server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
})

app.get('/', (req, res) => {
  console.log('somebody connected');
  startVM(function(ip){
    res.end("Hello, your lucky ip is " + ip + ":8080")
  });
})


