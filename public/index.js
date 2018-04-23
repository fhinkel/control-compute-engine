

var socket = io();

document.getElementById('start').onclick = function() {
    // alert('hello');
    console.log("Sending start event");
    socket.emit('start');
    return false;
};

socket.on('started', function(msg) {
    console.log('something just got started: ' + msg);

    var vm = document.createElement('a');
    vm.setAttribute('href', 'http://' + msg)
    vm.appendChild(document.createTextNode('http://' + msg))

    var node = document.createElement("LI");
    node.appendChild(vm);
    document.getElementById('running').appendChild(node);
    

})

