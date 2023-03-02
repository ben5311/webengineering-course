const nameInput = document.getElementById('name');
const submitButton = document.getElementById('submit');
const choicesDiv = document.getElementById('choices');
const choicesButtons = document.querySelectorAll('button.choice');
const infosDiv = document.getElementById('infos');

let name = null;
let socket = null;

function openWebSocket(name) {
    return new Promise(function (resolve, reject) {
        let socket = new WebSocket('ws://localhost');
        socket.onopen = function () {
            console.log('WebSocket Client Connected');
            socket.send(JSON.stringify({name: name}));
            resolve(socket);
        };
        socket.onerror = function (event) {
            reject(event);
        };
    });
}

async function submitButtonHandler(event) {
    if (nameInput.value) {
        event.preventDefault();
        name = nameInput.value;
        submitButton.disabled = true;
        nameInput.disabled = true;
        socket = await openWebSocket(name);
        choicesDiv.style.display = 'block';     // show the choices buttons
        socket.onmessage = function (evt) {
            let message = evt.data;
            console.log(message);
            let infoMessage = document.createElement('p');
            infoMessage.innerText = message;
            infosDiv.appendChild(infoMessage);
            if (message.includes('joined') || message.includes('left')) {
                infoMessage.dataset.highlight = 'info';
            } else if (message.includes('Error')) {
                infoMessage.dataset.highlight = 'error';
            } else if (message.includes('Play again')) {
                infoMessage.dataset.highlight = 'finished';
            }
        };
        socket.onclose = function (evt) {
            choicesDiv.style.display = 'none';     // hide the choices buttons
        };
    }
}

function choiceButtonHandler(event) {
    if (socket !== null) {
        socket.send(JSON.stringify({name: name, choice: this.value}));
    }
}

submitButton.onclick = submitButtonHandler;
choicesButtons.forEach(btn => btn.onclick = choiceButtonHandler);
