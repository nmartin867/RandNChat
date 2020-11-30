class MartinChat {
    constructor(session) {
        this.session = session;
    }
    static create(session) {
        return new MartinChat(session);
    }
}

module.exports = MartinChat;