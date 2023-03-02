const Student = require('../modules/student');

module.exports = function (app) {
    let students = [new Student('Alfred', 2)];
    app.get('/student', (req, res, next) => {
        res.type('text/plain');
        res.send(students.map(s => s.toString()).join('\n'));
        next();
    });
    app.post('/student', (req, res, next) => {
        let student = new Student(req.body.name, parseInt(req.body.grade));
        students.push(student);
        res.type('text/plain');
        res.send('Created ' + student.toString());
        next();
    });
};


