const { EErrors } = require("../../services/errors/enum")

exports.handleError = ( err, req, res, next ) => {
    console.log(err)
    switch (err.code) {
        case EErrors.DATABASE_ERROR:
            return res.send({status: 'error', error: err.message})
            break;
    
        default:
            return res.status(500).send({status: 'error', error: 'error server'})
            break;
    }
}