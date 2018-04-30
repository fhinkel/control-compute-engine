

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
    document.getElementById('startButton').innerText = 'Start new Gameserver';

    var vm = document.createElement('a');
    console.log(msg);
    vm.setAttribute('href', 'http://' + msg);
    vm.setAttribute('target', '_blank');
    vm.appendChild(document.createTextNode(msg));

    var icon = document.createElement('i');
    icon.setAttribute('class', "material-icons mdl-list__item-icon");
    icon.appendChild(document.createTextNode('directions_boat'));

    var node = document.createElement("LI");
    node.setAttribute('class', "mdl-list__item")

    node.appendChild(icon);
    node.appendChild(vm);
    document.getElementById('running').appendChild(node);
})


