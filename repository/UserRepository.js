const sqlite3 = require('sqlite3').verbose();
const crypto = require('crypto');
const User = require('./User');
const _ = require('lodash');

class UserRepository {
    constructor(dbFilePath) {
        this.db = new sqlite3.Database(dbFilePath, (err) => {
            if (err) {
                console.log('Could not connect to database', err)
            } else {
                console.log('Connected to database')
            }
        });
    }

    findUser =  (username, callback) => {
        const query = 'SELECT id, username, password FROM users WHERE username = ?';
        this.db.get(query, [username], (err, row) => {
            if(err) {
                callback(err);
            } else if(row){
                const user = new User(row.id, row.username, row.password);
                callback(null, user);
            } else {
                callback();
            }
        });
    }

    findById = (id, callback) => {
        const query = 'SELECT id, username, password FROM users WHERE id = ?';
        this.db.get(query, [id], (err, row) => {
            if(err) return callback(err);
            if(_.isNil(row) || _.isUndefined(row)) return callback();
            callback(null, new User(row.id, row.username, row.password));
        });
    }

    createUser = (username, password, callback) => {
        this.findUser(username, (err, user) => {
           if(err) return callback(err);
           if(user) return callback(new Error('username taken'));
           this.db.run("INSERT INTO users (username, password) VALUES (?, ?)", username, password, function (err){
              if(err) return callback(err);
              callback(null, new User(this.lastID, username));
           });
        });
    }

    authenticate = (username, password, callback) => {
        this.findUser(username, (err, user) => {
           if(err) return callback(err);
           if(_.isNil(user) || _.isUndefined(user)) return callback(null, false);
           if(password !== user.password) return callback(null, false);
           callback(null, true, user);
        });
    }

    static newInstance = (dbFilePath) => (new UserRepository(dbFilePath));

}

module.exports = UserRepository;