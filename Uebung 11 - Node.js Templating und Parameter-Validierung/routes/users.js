const express = require('express');
const {param, query, body, validationResult} = require('express-validator');

const User = require('../modules/models/users');
const {hash, compare} = require('../modules/hash')

const router = express.Router();

router.route('/')
    .get(function (req, res) {
        res.redirect('/');
    });

router.route('/register')
    .get(function (req, res) {
        renderRegisterResponse(res);
    })
    .post(
        body('user').isLength({min: 1}).escape(),
        body('pw').isLength({min: 1}),
        body('note').isInt({min: 1, max: 6}).toInt(),
        validationErrorHandler,
        createUser
    );

router.route('/check-login')
    .post(
        body('user').isLength({min: 1}).escape(),
        body('pw').isLength({min: 1}),
        validationErrorHandler,
        checkUser
    );

function validationErrorHandler (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        renderRegisterResponse(res, 'Bad request: ' + JSON.stringify(errors.array()), 400);
    } else {
        next();
    }
}

function renderRegisterResponse(res, message, statusCode=200) {
    return res.status(statusCode).render('register.mustache.html', {message: message});
}

async function createUser(req, res) {
    let {user, pw, note} = req.body
    try {
        if (await User.findOne({where: {username: user}})) {
            renderRegisterResponse(res, 'Error: user "' + user + '" already exists', 400);
        } else {
            let password = await hash(pw);
            await User.create({
                username: user,
                password: password,
                note: note
            });
            renderRegisterResponse(res, 'Successfully created user "' + user + '"');
        }
    } catch (e) {
        renderRegisterResponse(res, 'Could not create user "' + user + '"', 500);
    }
}

async function checkUser(req, res) {
    let username = req.body.user
    let password = req.body.pw
    let user = await User.findOne({where: {username: username}})
    if (user === null) {
        res.status(401).send('Unauthorized: user not found');
    } else if (!await compare(password, user.password)) {
        res.status(401).send('Unauthorized: invalid password');
    } else {
        res.send('Access permitted');
    }
}

module.exports = router;
