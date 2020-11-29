class ChatMessage {
    constructor(userid, message, date) {
        this.userid = userid;
        this.message = message;
        this.createdDate = date
    }
    static create(userid, message, date = new Date()) {
        return new ChatMessage(userid, message, date);
    }
}

module.exports = ChatMessage