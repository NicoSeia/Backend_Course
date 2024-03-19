const { logger } = require("../../utils/logger")
const { userModel } = require("./models/user.model")

class userDaoMongo {
    constructor(){
        this.userModel = userModel
    }

    async get() {
        return await this.userModel.find({})
    }

    async getBy(filter) {
        return await this.userModel.findOne(filter)
    }

    async create(newUser) {
        return await this.userModel.create(newUser)
    }

    async update(uid, userUpdate) {
        return await this.userModel.findOneAndUpdate({_id: uid}, userUpdate)
    }

    async updateRole(userId, newRole){
        try{
            return await this.userModel.findByIdAndUpdate(userId, { role: newRole }, { new: true })
        }catch (err){
            logger.error('Error updating user role:', err)
        }
    }

    async updatePassword(uid, newPassword) {
        try {
            return await this.userModel.findByIdAndUpdate(uid, { password: newPassword }, { new: true })
        } catch (error) {
            logger.error('Error updating user password:', error)
        }
    }

    async delete(uid) {
        return await this.userModel.findOneAndDelete({_id: uid})
    }


}

module.exports = userDaoMongo