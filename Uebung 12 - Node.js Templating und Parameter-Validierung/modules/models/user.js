const { Model, DataTypes } = require('sequelize');

const sequelize = require('../sequelize')
const {hash, compare} = require('../hash')

class User extends Model {
    static async register(username, password, note) {
        let hashedPassword = await hash(password);
        await User.create({
            username: username,
            password: hashedPassword,
            note: note
        });
    }

    static async get(username) {
        return await User.findOne({where: {username: username}});
    }

    static async exists(username) {
        return !!await User.get(username);
    }

    async validatePassword(password) {
        return await compare(password, this.password)
    }
}
User.init({
    id: { type: DataTypes.INTEGER, primaryKey: true },
    username: DataTypes.TEXT,
    password: DataTypes.TEXT,
    note: DataTypes.INTEGER
}, { sequelize });

module.exports = User
