const {param, query} = require('express-validator');
const {Validator} = require('express-json-validator-middleware');
const {validationErrorHandler} = require('../middlewares/errorHandler');
const todoEntrySchema = require('../schemas/todoEntry.schema.json');

const schemaValidator = new Validator({allErrors: true});
const validateSchema = schemaValidator.validate;
let todoEntryWithoutIdSchema = {...todoEntrySchema};
delete todoEntryWithoutIdSchema.properties.id;
let newTodoEntrySchema = {...todoEntryWithoutIdSchema, required: ['description']};
let TodoList = require('../modules/models/todoList');

function returnEntryNotFound(res) {
    res.status(404).json({ error: 'TodoEntry not found' })
}

module.exports = function (app) {
    app.route('/todos')
        .get(function (req, res) {
            res.json(TodoList.getTodoEntries());
        })
        .post(
            validateSchema({ body: newTodoEntrySchema }),
            function (req, res) {
                let result = TodoList.addTodoEntry(req.body.description, req.body.state);
                res.json(result);
            })
        .delete(
            query('state').optional().isIn(['open', 'done']),
            validationErrorHandler,
            function (req, res) {
                TodoList.removeTodos(req.query.state);
                res.json(TodoList.getTodoEntries());
            });
    app.route('/todos/:id')
        .get(
            param('id').isInt({ min: 1 }).toInt(),
            validationErrorHandler,
            function (req, res) {
                let result = TodoList.getTodoEntry(req.params.id);
                result === null ? returnEntryNotFound(res) : res.json(result);
            })
        .delete(
            param('id').isInt({ min: 1 }).toInt(),
            validationErrorHandler,
            function (req, res) {
                let result = TodoList.removeTodoEntry(req.params.id);
                result === null ? returnEntryNotFound(res) : res.send();
            })
        .patch(
            param('id').isInt({ min: 1 }).toInt(),
            validationErrorHandler,
            validateSchema({ body: todoEntryWithoutIdSchema }),
            function (req, res) {
                let entry = TodoList.getTodoEntry(req.params.id);
                if (entry == null) {
                    returnEntryNotFound(res);
                    return;
                }
                entry.description = req.body.description || entry.description;
                entry.state = req.body.state || entry.state;
                res.json(entry);
            }
        );
};
