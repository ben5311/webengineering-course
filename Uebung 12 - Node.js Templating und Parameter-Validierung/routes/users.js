const express = require('express');
const {param, query, body, validationResult} = require('express-validator');

const User = require('../modules/models/user');
const Student = require('../modules/models/student')
const {Session} = require('../modules/models/session')

const router = express.Router();

router.route('/')
    .get(function (req, res) {
        res.redirect('/users/login');
    });

router.route('/register')
    .get(function (req, res) {
        sendRegisterResponse(res);
    })
    .post(
        body('user').isLength({min: 1}).escape(),
        body('pw').isLength({min: 1}),
        body('note').isInt({min: 1, max: 6}).toInt(),
        validationErrorHandler,
        handleRegisterPOST
    );

router.route('/login')
    .get(
        handleLoginGET
    )
    .post(
        body('user').isLength({min: 1}).escape(),
        body('pw').isLength({min: 1}),
        validationErrorHandler,
        handleLoginPOST
    );

router.route('/account')
    .get(handleAccountGET)

router.route('/logout')
    .post(handleLogoutPOST);

async function handleRegisterPOST(req, res) {
    let {user, pw, note} = req.body
    try {
        if (await User.exists(user)) {
            sendRegisterResponse(res, `Error: user "${user}" already exists`, 400);
        } else {
            await User.register(user, pw, note);
            sendRegisterResponse(res, `Successfully created user "${user}"`);
        }
    } catch (e) {
        sendRegisterResponse(res, `Could not create user "${user}"`, 500);
    }
}

async function handleLoginGET(req, res) {
    if (req.session.authorized) {
        res.redirect('/users/account');
    } else {
        sendLoginResponse(res);
    }
}

async function handleLoginPOST(req, res) {
    let {user: username, pw} = req.body
    let user = await User.get(username)
    if (user) {
        if (await user.validatePassword(pw)) {  // password matches
            await Session.destroySessions(user.id);  // destroy other open sessions for this user
            req.session.authorized = true;  // create new session for this user
            req.session.userId = user.id;
            req.session.userName = user.username;
            req.session.note = user.note;
            await handleLoginGET(req, res);
        } else {
            sendLoginResponse(res, 'Unauthorized: invalid password', 401);
        }
    } else {
        sendLoginResponse(res, 'Unauthorized: user not found', 401);
    }
}

async function handleAccountGET(req, res) {
    if (req.session.authorized) {
        res.render('account.mustache.html', {...req.session, noteText: Student.getNotenBewertung(req.session.note)});
    } else {
        res.redirect('/users/login');
    }
}

async function handleLogoutPOST(req, res) {
    req.session.destroy();
    res.redirect('/users/login');
}

function validationErrorHandler (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        sendRegisterResponse(res, `Bad request: ${JSON.stringify(errors.array())}`, 400);
    } else {
        next();
    }
}

function sendRegisterResponse(res, message, statusCode=200) {
    return res.status(statusCode).render('register.mustache.html', {message: message});
}

function sendLoginResponse(res, message, statusCode=200) {
    return res.status(statusCode).render('login.mustache.html', {message: message});
}

module.exports = router;
