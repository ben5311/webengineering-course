const { Sequelize, Model, DataTypes } = require('sequelize');

const db_path = 'database/database.sqlite'
const sequelize = new Sequelize('sqlite:' + db_path);

module.exports = sequelize
