const TodoEntry = require('../models/todoEntry')


let list = [
    new TodoEntry(1, 'Buy flowers'),
    new TodoEntry(2, 'Cook dinner'),
    new TodoEntry(3, 'Clean the bathroom', "done")
];
let index = list.length + 1;

let todoList = {

    getTodoEntries: function () {
        return list;
    },

    findTodoEntry: function(id) {
        return list.findIndex(entry => entry.id === id);
    },

    getTodoEntry: function (id) {
        let index = todoList.findTodoEntry(id);
        return index !== -1 ? list[index] : null;
    },

    addTodoEntry: function (description, state) {
        let newEntry = new TodoEntry(index++, description, state);
        list.push(newEntry);
        return newEntry;
    },

    removeTodoEntry: function (id) {
        if (todoList.findTodoEntry(id) === -1) { return null; }
        list = list.filter(entry => entry.id !== id);
    },

    removeTodos: function (state) {
        if (state) {
            list = list.filter(entry => entry.state !== state);
        } else{
            list = [];
        }

    }

};

module.exports = todoList
