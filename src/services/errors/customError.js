class customError {
    static createError({name='Error', cause, message, code=1}){
        let error = new Error(message)

        error.name = name
        error.code = code
        error.cause = cause

        throw error
    }
}

module.exports = customError