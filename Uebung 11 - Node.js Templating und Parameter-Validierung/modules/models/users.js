const { Model, DataTypes } = require('sequelize');
const sequelize = require('./sequelize')

class User extends Model {}
User.init({
    id: { type: DataTypes.INTEGER, primaryKey: true },
    username: DataTypes.TEXT,
    password: DataTypes.TEXT,
    note: DataTypes.INTEGER
}, { sequelize, timestamps: false });

module.exports = User
