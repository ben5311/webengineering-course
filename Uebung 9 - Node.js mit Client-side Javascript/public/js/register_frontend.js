function getColorCode(note) {
    switch (note) {
        case 1:
        case 2:
            return '#5cb85c';
        case 3:
        case 4:
            return '#f0ad4e';
        case 5:
        case 6:
            return '#d9534f';
    }
}

const formRegister = document.getElementById('register');
const inputName = document.getElementById('inputName');
const inputPassword = document.getElementById('inputPasswort');
const inputNote = document.getElementById('inputNote');
const buttonSubmit = document.getElementById('submit');
const buttonPrint = document.getElementById('print');
const divOutput = document.getElementById('output');

inputNote.addEventListener('input', function (event) {
    buttonSubmit.style.backgroundColor = getColorCode(inputNote.valueAsNumber);
});
formRegister.addEventListener('submit', function (event) {
    if (!(inputName.value && inputPassword.value && inputNote.value)) {
        divOutput.innerHTML = 'Fehler: Name, Passwort und Note müssen angegeben werden!';
        event.preventDefault();
    }
});
buttonPrint.addEventListener('click', function (event) {
    let table = document.createElement('table');
    let rows = [{name: 'Feld', value: 'Wert'}, inputName, inputPassword, inputNote];
    rows.forEach(row => {
        let tableRow = table.insertRow();
        tableRow.insertCell().innerHTML = row.name;
        tableRow.insertCell().innerHTML = row.value;
    });
    divOutput.innerHTML = '';
    divOutput.append(table);
});

document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM Content loaded');
});
window.addEventListener('load', function () {
    console.log('Window loaded');
});
