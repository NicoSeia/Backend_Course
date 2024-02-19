class MessageRepository {
    constructor(dao){
        this.dao = dao
    }

    getAllMessages = async() => await this.dao.messages()
    getMessagesByUser = async(user) => await this.dao.user(user)
    addMessageToUser = async(user, message) => await this.dao.add(user, message)
    createUserWithMessage = async(user, message) => await this.dao.create(user, message)

}

module.exports = MessageRepository