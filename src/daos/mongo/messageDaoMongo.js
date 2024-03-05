const { logger } = require('../../utils/logger')
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

    async add(user, message) {
        try {
            const userDocument = await this.model.findOne({ user: user })
            if (!userDocument) {
                logger.error(`User ${user} not found`)
                return null
            }
            userDocument.messages.push(message)
            await userDocument.save()
            return userDocument
        } catch (error) {
            logger.error('Error adding message to user:', error)
            throw error
        }
    }

    async create(user, message) {
        try {
            const newUserDocument = new this.model({
                user: user,
                messages: [message]
            })
            await newUserDocument.save()
            return newUserDocument
        } catch (error) {
            logger.error('Error creating user with message:', error)
            throw error
        }
    }
}

module.exports = messageDaoMongo