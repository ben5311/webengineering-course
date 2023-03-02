// USED IN PART 2
const Sequelize = require('sequelize');
const bcrypt = require('bcryptjs');

class Database{

    constructor(database) {
        if (typeof database === 'undefined') {
            throw new Error('Cannot be called directly');
        }
        this._database = database;
    }

    static async _init() {
        //TODO: Connection to database 
        //const database = ...

        //TODO: Testing the connection with database.authenticate()


        // TODO: return database-Object
        
    }

    static async getInstance() {
        // check if Database instance already exists
        if(!Database.instance){
            // TODO: call _init
            
            // TODO: initialize Database.instance with constructor
            
        }
        // TODO: return database instance

    }

    async validateUser(user, passwd){
        // TODO
    }

    async userExists(user){
        // TODO
    }

    async registerUser(user, passwd, note){
        // TODO
    }
}

module.exports = Database
