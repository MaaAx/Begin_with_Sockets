var io = require('socket.io')
var express = require('express');
var port = 4000;

var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', "jade");
app.engine('jade', require('jade').__express);
app.use(express.favicon(__dirname + '/public/favicon.png'));
app.use(express.static(__dirname + '/public'));

app.get("/", function(req, res){
    res.render("page");
});

app.get("/chat", function(req, res){
    res.render("chat");
    console.log("you're on talking chat");
});

app.get("/canvasocket", function(req, res){
    res.render("canvasocket");
    console.log("you're on drawing chat");
});

var io = require('socket.io').listen(app.listen(port));
console.log("Listening on port " + port);

io.sockets.on('connection', function (socket) {
    socket.emit('message', { message: 'welcome to the chat' });
    socket.on('send', function (data) {
       io.sockets.emit('message', data);
    });
    socket.on('drawClick', function(data) {
      socket.broadcast.emit('draw', {
        x: data.x,
        y: data.y,
        type: data.type
      });
    });
});