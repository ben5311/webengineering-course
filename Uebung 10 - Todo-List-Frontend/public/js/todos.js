const todoServerUrl = 'http://192.168.178.10:1001';

const newTodoDescription = document.querySelector('#new-todo input#description');
const newTodoSubmitButton = document.querySelector('#new-todo button#submit');
const todoList = document.getElementById('todo-list');
const progressBar = document.getElementById('progress-bar');
const clearDoneTodosButton = document.getElementById('clear-done-todos');
const clearAllTodosButton = document.getElementById('clear-all-todos');
const errorOutput = document.querySelector('#error #output');

let activeRequests = 0;

function fetchTodoEntries(fetchOptions, urlOptions='') {
    incrementRequests();
    return fetch(todoServerUrl + '/todos' + urlOptions, fetchOptions)
        .then(parseResponse)
        .finally(() => decrementRequests());
}

function fetchTodoEntry(id, fetchOptions, urlOptions='') {
    return fetchTodoEntries(fetchOptions, '/' + id + urlOptions);
}

function incrementRequests() {
    resetError();
    activeRequests++;
    progressBar.style.visibility = 'visible';
}

function decrementRequests() {
    activeRequests--;
    if (activeRequests === 0) {
        progressBar.style.visibility = 'hidden';
    }
}

async function parseResponse(response) {
    if (!response.ok) {
        throw await response.text();
    }
    let contentType = String(response.headers.get('Content-Type'));
    if (contentType.includes('json')) {
        response = await response.json();
    } else {
        response = await response.text();
    }
    return response;
}

async function outputTodoEntries(todoEntries) {
    let response = await fetch('/templates/todoEntries.mustache');
    let template = await response.text();
    todoList.innerHTML = Mustache.to_html(template, {todoEntries: todoEntries});
    todoList.querySelectorAll('.button.delete').forEach(deleteButton => {
        deleteButton.onclick = function () {
            removeTodoEntry(deleteButton.parentNode.id);
        };
    });
    todoList.querySelectorAll('.button.trigger').forEach(triggerButton => {
        triggerButton.onclick = function () {
            let newState = triggerButton.parentNode.dataset.state === 'done' ? 'open' : 'done';
            updateTodoEntry(triggerButton.parentNode.id, newState);
        };
    });
}

function loadTodoEntries() {
    fetchTodoEntries()
        .then(outputTodoEntries)
        .catch(handleError);
}

function removeTodoEntries(state) {
    let queryParams = state ? ('?state=' + state) : '';
    let fetchOptions = { method: 'DELETE' }
    fetchTodoEntries(fetchOptions, queryParams)
        .then(loadTodoEntries)
        .catch(handleError);
}

function addTodoEntry(description) {
    let todoEntry = JSON.stringify({ description: description });
    let fetchOptions = { method: 'POST', body: todoEntry, headers: { 'Content-Type': 'application/json' } }
    fetchTodoEntries(fetchOptions)
        .then(loadTodoEntries)
        .catch(handleError);
}

function removeTodoEntry(id) {
    fetchTodoEntry(id,{ method: 'DELETE' })
        .then(loadTodoEntries)
        .catch(handleError);
}

function updateTodoEntry(id, state) {
    let todoEntry = JSON.stringify({ state: state });
    fetchTodoEntry(id,{ method: 'PATCH', body: todoEntry, headers: { 'Content-Type': 'application/json' } })
        .then(loadTodoEntries)
        .catch(handleError);
}

function handleError(error) {
    errorOutput.innerHTML = String(error);
}

function resetError() {
    errorOutput.innerHTML = '';
}


document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM Content loaded');
    newTodoSubmitButton.addEventListener('click', function (event) {
        addTodoEntry(newTodoDescription.value);
    });
    clearDoneTodosButton.addEventListener('click', function (event) {
        removeTodoEntries('done');
    });
    clearAllTodosButton.addEventListener('click', function (event) {
        removeTodoEntries();
    })
    loadTodoEntries();
});

