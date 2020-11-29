const sqlite3 = require('sqlite3').verbose();
const date = require('date-and-time');
const config = require('../configuration');
const ChatMessage = require('./ChatMessage');

class ChatRepository {
    constructor(dbFilePath) {
        this.db = new sqlite3.Database(dbFilePath, (err) => {
            if (err) {
                console.log('Could not connect to database', err)
            } else {
                console.log('Connected to database')
            }
        });
    }
    getAll = (callback) => {
        const query = 'SELECT userid, message, createdDate FROM messages';
        this.db.all(query, (err, rows) => {
            if(err) return callback(err);
            const messages = rows.map(r => (ChatMessage.create(
                r.userid,
                r.message,
                date.parse(r.createdDate, config.dateTimeFormat)))
            );
            callback(null, messages);
        });
    }

    save = (userid, message, callback) => {
        const statement = 'INSERT INTO messages (userid, message, createdDate) VALUES (?, ?, ?)';
        this.db.run(statement, userid, message, date.format(new Date(), config.dateTimeFormat), callback);
    }

    static newInstance = (filePath) => (new ChatRepository(filePath))
}

module.exports = ChatRepository;