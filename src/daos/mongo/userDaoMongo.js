const { userModel } = require("./models/user.model");

class userDaoMongo {
    constructor(){
        this.userModel = userModel
    }

    async getUsers() {
        return await this.userModel.find({})
    }

    async getUserBy(filter) {
        return await this.userModel.findOne(filter)
    }

    async createUser(newUser) {
        return await this.userModel.create(newUser)
    }

    async updateUser(uid, userUpdate) {
        return await this.userModel.findOneAndUpdate({_id: uid}, userUpdate)
    }

    async updateUserRole(userId, newRole){
        try{
            return await this.userModel.findByIdAndUpdate(userId, { role: newRole }, { new: true })
        }catch (err){
            console.error('Error updating user role:', error)
        }
    }

    async deleteUser(uid) {
        return await this.userModel.findOneAndDelete({_id: uid})
    }
}

module.exports = userDaoMongo