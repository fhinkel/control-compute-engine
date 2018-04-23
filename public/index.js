

var socket = io();

document.getElementById('startButton').onclick = function() {
    if (this.innerText === 'Starting VM...') {
        alert('Patience my friend!');
        return false;
    }
    // alert('hello');
    console.log("Sending start event");
    this.innerText = 'Starting VM...';
    socket.emit('start');
    return false;
};

socket.on('started', function(msg) {
    console.log('something just got started: ' + msg);
    document.getElementById('startButton').innerText = 'Start a new Gameserver.';

    var vm = document.createElement('a');
    vm.setAttribute('href', 'http://' + msg);
    vm.setAttribute('target', '_blank');
    vm.appendChild(document.createTextNode('http://' + msg));

    var node = document.createElement("LI");
    node.appendChild(vm);
    document.getElementById('running').appendChild(node);
})


