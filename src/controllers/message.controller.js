const { messageService } = require('../repositories/service')

class messageController {
    constructor(){
        this.messageService = messageService
    }

    async getAllMessages() {
        try {
            return await this.messageService.messages()
        } catch (error) {
            console.error('Error getting messages:', error)
            throw error
        }
    }

    async getMessagesByUser(user) {
        try {
            return await this.messageService.user(user)
        } catch (error) {
            console.error('Error getting messages by user:', error)
            throw error
        }
    }

    async addMessageToUser(user, message) {
        try {
            return await this.messageService.add(user, message)
        } catch (error) {
            console.error('Error adding message to user:', error)
            throw error
        }
    }

    async createUserWithMessage(user, message) {
        try {
            return await this.messageService.create(user, message)
        } catch (error) {
            console.error('Error creating user with message:', error)
            throw error
        }
    }

}

module.exports = messageController