const {check} = require('express-validator');
const Student = require('../modules/student');

function parseCookies(req) {
    let cookies = [];
    for (let key in req.cookies) {
        if (req.cookies.hasOwnProperty(key)) {
            cookies.push({key: key, value: req.cookies[key]});
        }
    }
    return cookies;
}

let students = [new Student('Alfred', 2)];

module.exports = function (app) {
    app.get('/students', (req, res) => {
        res.render('students.html', {
            students: students,
            cookies: parseCookies(req)
        });
    });
    app.post('/students', [
            check('name').trim().escape(),
            check('grade').toInt()],
        function (req, res) {
            let student = new Student(req.body.name, req.body.grade);
            students.push(student);
            res.redirect('students');
        }
    );
};
