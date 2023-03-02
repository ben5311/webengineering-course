const Student = require('../modules/student');

const createStudentFactory = function (note) {
    return function (name) {
        let student = new Student(name);
        student.note = note;
        return student;
    };
};

let studentFactory = createStudentFactory(3);

module.exports = function (app) {
    app.get('/studentFactory', function (req, res, next) {
        let student = studentFactory(req.query.name);
        res.send(student.toString());
        next();
    });
};
