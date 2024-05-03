const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let folder = 'documents'

        if (file.fieldname === 'profile') {
            folder = 'profiles'
        } else if (file.fieldname === 'product') {
            folder = 'products'
        }

        const destPath = path.join(__dirname, '..', 'uploads', folder)
        cb(null, destPath)
    },
    filename: function (req, file, cb) {
        const timestamp = Date.now()
        const userId = req.params.uid
        cb(null, `${userId}-${timestamp}-${file.originalname}`)
    },
})

export const upload = multer({ storage })