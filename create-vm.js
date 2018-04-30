// Imports the Google Cloud client library
const Compute = require('@google-cloud/compute');
const http = require('http');

require('@google-cloud/debug-agent').start();

// Creates a client
const compute = new Compute();

// Create a new VM using the latest OS image of your choice.
const zone = compute.zone('us-central1-a');

function startVM(cb) {
  const name = 'debian-http-battleship-' + Math.floor(Math.random() * 1000);
  console.log("this is the future name: " + name);
  // todo(fhinkel): use async await, Node 8 should be supported
  // const startup_script = require('fs').readFileSync('./setup_and_start_game.sh', 'utf8');
  // console.log(startup_script);

  const config = {
    os: 'debian',
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
    machineType: 'g1-small',
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
    const create_operation = data[1];
    const create_apiResponse = data[2];
    create_operation.on('complete', function () {
      vm.start().then(data => {
        const operation = data[0];
        const apiResponse = data[1];
        operation.on('complete', function () {
          console.log("Start is complete. Now installing Node and starting server.");
          vm.getMetadata().then(data => {
            const metadata = data[0];
            const ip = metadata['networkInterfaces'][0]['accessConfigs'][0]['natIP'];
            console.log(name + ' created, running at ' + ip);
            console.log('Waiting for startup...')

            const timer = setInterval(ip => {
              http.get(ip, res => {
                const { statusCode } = res
                if (statusCode === 200) {
                  clearTimeout(timer);
                  console.log('Ready!');
                  cb(ip);
                }

              }).on('error', () => process.stdout.write('.'))
            }, 2000, 'http://' + ip + ':8080')
          })
            .catch(err => console.error(err))
        })
        console.log(vm.name);

      }).catch(err => {
        console.error('Could not start', err);
      })
    })


    // return create_apiResponse.promise();
  })
    .catch(err => {
      console.error('ERROR: connection did not work', err);
    });
}




const express = require('express');

const path = require('path')

const app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

const ID = Math.floor(Math.random() * 1000);
app.use(express.static(path.join(__dirname, 'public')))

app.get('/hello', (req, res) => {
  res.status(200).send('Hello, world! This is robot #' + ID + '.').end();
});

function sendListOfVMs(socket) {
  zone.getVMs().then(function (data) {
    const vms = data[0];
    console.log("So many vms: " + vms.length);

    vms.forEach(function (vm) {
      vm.get().then(data => {
        const vm = data[0];
        const apiResponse = data[1];
        const ip = apiResponse.networkInterfaces[0].accessConfigs[0].natIP;
        socket.emit('started', ip + ':8080');
      }).catch(err => console.log('Error getting VM data: ' + err))
    })

  }).catch(function (err) {
    console.log('Error, could not get list of VMs ' + err);
  });

}

io.on('connection', function (socket) {

  // send all the existing VMs
  sendListOfVMs(socket);

  socket.on('start', function () {
    startVM(function (ip) {
      io.sockets.emit('started', ip + ':8080');
    });
  })
})

// Start the server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
})



app.get('/', (req, res) => {
  // This should not be called because we serve index.html statically.
  console.log('somebody connected');
})


