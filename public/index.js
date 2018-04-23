

var socket = io();

document.getElementById('start').onclick = function() {
    // alert('hello');
    console.log("Sending start event");
    socket.emit('start');
    return false;
};

socket.on('started', function(msg) {
    console.log('something just got started: ' + msg);
})

