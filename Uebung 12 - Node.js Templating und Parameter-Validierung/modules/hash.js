const bcrypt = require('bcryptjs');

function hash(password, saltRounds=10) {
    return new Promise(function (resolve, reject) {
        bcrypt.genSalt(saltRounds, function(err, salt) {
            bcrypt.hash(password, salt, function(err, hash) {
                if (err) {
                    reject(err);
                } else {
                    resolve(hash);
                }
            });
        });
    })
}

// Alternativ: function hash(password, saltRounds=10) { return bcrypt.hash(password, saltRounds) }

compare = bcrypt.compare;

module.exports = {
    hash: hash,
    compare: compare
};
