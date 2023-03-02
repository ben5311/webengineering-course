const { Model, DataTypes } = require('sequelize');

const sequelize = require('../sequelize')

class Session extends Model {
    static async destroySessions(userId) {
        await Session.destroy({where: {userId: userId}});
    }
}
Session.init({
    sid: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    userId: DataTypes.INTEGER,
    expires: DataTypes.DATE,
    data: DataTypes.TEXT,
}, { sequelize });

function extendDefaultFields(defaults, session) {
    return {
        data: defaults.data,
        expires: defaults.expires,
        userId: session.userId,
    };
}

module.exports = {
    Session: Session,
    extendDefaultFields: extendDefaultFields
}
