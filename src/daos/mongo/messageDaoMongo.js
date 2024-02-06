const { messageModel } = require('./models/message.model')

class messageDaoMongo {
    constructor() {
        this.model = messageModel 
    }

    async user(user) {
        return await this.model.findOne({ user: user })
    }

    async messages() {
        return await this.model.find({ })
    }

    async addMessageToUser(user, message) {
        try {
            const userDocument = await this.model.findOne({ user: user })
            if (!userDocument) {
                console.error(`User ${user} not found`)
                return null
            }
            userDocument.messages.push(message)
            await userDocument.save()
            return userDocument
        } catch (error) {
            console.error('Error adding message to user:', error)
            throw error
        }
    }

    async createUserWithMessage(user, message) {
        try {
            const newUserDocument = new this.model({
                user: user,
                messages: [message]
            })
            await newUserDocument.save()
            return newUserDocument
        } catch (error) {
            console.error('Error creating user with message:', error)
            throw error
        }
    }
}

module.exports = messageDaoMongo