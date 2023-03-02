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

const inputNote = document.getElementById('inputNote');
const buttonSubmit = document.getElementById('submitButton');

inputNote.addEventListener('input', function (event) {
    buttonSubmit.style.backgroundColor = getColorCode(inputNote.valueAsNumber);
});
