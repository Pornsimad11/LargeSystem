var express	= require('express');
var app = express();
var PORT = 8888;

// Routing
app.use('/', express.static(__dirname + '/public'));

var server = require('http').createServer(app);
var io = require('socket.io')(server);

server.listen(PORT, function(){
    console.log('Server listening at port ' + PORT);
});


io.on('connection', function(socket) {

    console.log('A new user has connected: ' + socket.id);


    socket.on('mouse',
      function(data) {
        console.log("Received: 'mouse' " + data.x + " " + data.y);

        socket.broadcast.emit('mouse', data);

    

      }
    );

    socket.on('disconnect', function() {
      console.log("Client has disconnected");
    });
});