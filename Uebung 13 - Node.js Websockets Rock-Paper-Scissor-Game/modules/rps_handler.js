const Ajv = require('ajv');

const ajv = new Ajv({allErrors: true});
const playerSchema = require('../schemas/player.schema.json');
const validate = ajv.compile(playerSchema);

let players = new Map();    // Map that holds all Players with their name, choice and socket

async function socketConnectionHandler(socket, req) {
    console.log('Someone connected');
    socket.on('message', function (message) {
        try {
            let player = JSON.parse(message);
            if (validate(player)) {
                console.log('Received message: ' + message);
                if (!player.choice) {
                    addPlayer(player, socket);
                } else {
                    handleChoice(player.name, player.choice, socket);
                }
            } else {
                console.log('Received illegal message: ' + message);
            }
        } catch (e) {
            console.log('Error: ' + e);
        }
    });
}

function addPlayer(player, socket) {
    if (players.size >= 2) {
        socket.send('Error: too many players.');
        socket.close();
        return;
    }
    if (!players.has(player.name)) {
        players.forEach(pl => socket.send('User ' + pl.name + ' joined.'));  // show already joined users
        players.set(player.name, {...player, socket: socket});
        socket.onclose = function (event) {
            players.delete(player.name);
            broadcastMessage('User ' + player.name + ' left.');
        };
        players.forEach(pl => pl.socket.send('User ' + player.name + ' joined.')); // introduce to others
    } else {
        socket.send('Error: user ' + player.name + ' already exists.');
        socket.close();
    }
}

function handleChoice(name, choice, socket) {
    let player = players.get(name);
    if (!player || player.socket !== socket) {
        socket.send('Error: wrong username ' + player.name + '.');
        socket.close();
        return;
    }
    if (!player.choice) {
        player.choice = choice;
        player.socket.send(`${player.name} has chosen ${player.choice}.`);
        if (isRoundComplete()) {
            chooseWinner();
        }
    } else {
        player.socket.send('Error: you already chose ' + player.choice + '.');
    }
}

function isRoundComplete() {
    let result = true;
    if (players.size !== 2) {
        result = false;
    }
    players.forEach(player => {
        if (!player.choice) {
            result = false;
        }
    });
    return result;
}

function chooseWinner() {
    players.forEach(player => {
        players.forEach(other => {
            if (other !== player) {
                player.socket.send(`${other.name} has chosen ${other.choice}.`);    // send choices to other players
            }
        });
    });
    let playersIterator = players.values();
    let player1 = playersIterator.next().value;
    let player2 = playersIterator.next().value;
    let winner = null;
    if (player1.choice === 'Rock' && player2.choice === 'Scissors') {
        winner = player1;
    } else if (player1.choice === 'Rock' && player2.choice === 'Paper') {
        winner = player2;
    } else if (player1.choice === 'Scissors' && player2.choice === 'Rock') {
        winner = player2;
    } else if (player1.choice === 'Scissors' && player2.choice === 'Paper') {
        winner = player1;
    } else if (player1.choice === 'Paper' && player2.choice === 'Rock') {
        winner = player1;
    } else if (player1.choice === 'Paper' && player2.choice === 'Scissors') {
        winner = player2;
    }
    let message = null;
    if (winner) {
        message = `${winner.name} wins!`;
    } else {
        message = 'This round is a draw.';
    }
    broadcastMessage(message + ' Play again.');
    players.forEach(player => delete player.choice);
}

function broadcastMessage(message) {
    players.forEach(player => player.socket.send(message));
}

module.exports = {
    socketConnectionHandler: socketConnectionHandler
};
