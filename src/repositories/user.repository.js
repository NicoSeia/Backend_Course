class UserRepository {
    constructor(dao){
        this.dao = dao
    }

    getUsers = async() => await this.dao.get()
    getUserBy = async(filter) => await this.dao.getBy(filter)
    createUser = async(newUser) => await this.dao.create(newUser)
    updateUser = async(uid, userUpdate) => await this.dao.update(uid, userUpdate)
    updateRole = async(uid, newRole) => await this.dao.updateRole(uid, newRole)
    updateUserPassword = async(uid, newPassword) => await this.dao.updatePassword(uid, newPassword)

}

module.exports = UserRepository