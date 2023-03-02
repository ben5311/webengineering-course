const express = require('express');
const ws = require('ws');
const path = require('path');

const {socketConnectionHandler} = require('./modules/rps_handler');

const port = 80;
const app = express();

app.use(express.static(path.join(__dirname, 'public')));

let server = app.listen(port, () => console.log(`Listening on port ${port}`));
let wsServer = new ws.Server({noServer: true});
wsServer.on('connection', socketConnectionHandler);
server.on('upgrade', function (request, socket, head) {
    wsServer.handleUpgrade(request, socket, head, function (socket) {
        wsServer.emit('connection', socket, request);
    });
});
