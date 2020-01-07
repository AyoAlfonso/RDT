const express = require('express');
const app = express();
const cron = require('./src/cron/startJob');
const routes = require('./src/routes/index');
const adminRoute = require('./src/routes/admin');
const WebSocketServer = require('websocket').server;
const server = require('http').createServer();
const bodyParser = require('body-parser');
const session = require('express-session');
const keys = require('./keys').config;

require('dotenv').config();

app.set('port', (keys.HTTP_SERVER.Port || 4500));

app.set('views', __dirname + '/src/views');
app.set('view engine', 'ejs');

app.use(bodyParser.json({ limit: 1024102420, type: 'application/json' }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/src/public'));

app.use(session({
    secret: 'resin.io',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: false,
        maxAge: 24 * 60 * 60 * 1000
        /* Resin Admin is only allowed to be able to log in at most for a day*/
    }
}));

app.use(bodyParser.json({ limit: 1024102420, type: 'application/json' }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/admin', adminRoute);

app.use('/', routes);

cron.droneCronJob();

app.listen(app.get('port'), function () {
    console.log('Drone app is running on port 🜂', app.get('port'));
});

server.listen(keys.HTTP_SERVER.socketPort, function () {
    console.log('Drone app socket is running on port ䷝', keys.HTTP_SERVER.socketPort);
});

let wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
}); 

wsServer.on('request', function (request) {

    try {
        var connections = [];
        let connection = request.accept('drone-protocol', request.origin);
        var index = connections.push(connection);
        console.log('Drone system ' + ' Connection accepted from' + connection.remoteAddress + '. at' + (new Date()));
        connection.on('message', function (message) {
            if (message.type === 'utf8') {
                /*Brodcasting to lightweight user dashboards listening*/
                wsServer.broadcast(message.utf8Data);
            }
        });

        connection.on('close', function () {
            console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
            connections.splice(index, 1);
        });

    } catch (err) {
        console.error('Error:', err);
    }
});

function stop() {
    server.close();
}

module.exports = {
    app,
    server,
    stop
};
