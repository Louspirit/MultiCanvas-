// HTTP server

var express = require('express');
var app = express();
var cpt = 0;
var listeId = [];
app.listen(3000);

console.log('HTTP server started on port 3000');

serve('/', '/index.html');
serve('/canvas.js');

function serve(path, file) {
    app.get(path, function(req, res) {
        res.sendfile(__dirname + (file || path));
    });
}

// WebSocket server
var WebSocketServer = require('ws').Server;

var ws = new WebSocketServer({
    port: 8080
});

ws.broadcast = function(data) {
    for (var c in this.clients)
        this.clients[c].send(data);
};

ws.on('connection', function(socket) {
    //quelqun se connecte
    cpt++;
    var data = {
        type: 'serverInfo',
        id: cpt,
        listeIds: listeId
    }
    console.log("Nouvel arrivant avec id: " + data.id);
    listeId.push(cpt);
    socket.send(JSON.stringify(data));
    socket.on('message', function(message) {
        //ce quelqu'un a envoyé un message
        ws.broadcast(message);
    });
});

console.log('WebSocket server started on port 8080');