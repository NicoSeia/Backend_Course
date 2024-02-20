const { messageService } = require('../repositories/service')

class messageController {
    constructor(){
        this.messageService = messageService
    }

    async getAllMessages() {
        try {
            return await this.messageService.getAllMessages()
        } catch (error) {
            console.error('Error getting messages:', error)
            throw error
        }
    }

    async getMessagesByUser(user) {
        try {
            return await this.messageService.getMessagesByUser(user)
        } catch (error) {
            console.error('Error getting messages by user:', error)
            throw error
        }
    }

    async addMessageToUser(user, message) {
        try {
            return await this.messageService.addMessageToUser(user, message)
        } catch (error) {
            console.error('Error adding message to user:', error)
            throw error
        }
    }

    async createUserWithMessage(user, message) {
        try {
            return await this.messageService.createUserWithMessage(user, message)
        } catch (error) {
            console.error('Error creating user with message:', error)
            throw error
        }
    }

}

module.exports = messageController