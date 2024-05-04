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

        const destPath = path.join(__dirname, '..', 'public', 'uploads', folder)
        cb(null, destPath)
    },
    filename: function (req, file, cb) {
        const timestamp = Date.now()
        const userId = req.params.uid
        cb(null, `${userId}-${timestamp}-${file.originalname}`)
    },
})

const allowedMimeTypes = {
    profile: ['image/jpeg', 'image/png'],
    product: ['image/jpeg', 'image/png'],
    documents: ['application/pdf', 'text/plain']
}

const fileFilter = (req, file, cb) => {
    if (!allowedMimeTypes[file.fieldname].includes(file.mimetype)) {
        return cb(new Error('Tipo de archivo no permitido'), false)
    }
    cb(null, true)
}

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024
    },
    fileFilter
})

const uploadFields = upload.fields([
    { name: 'profile', maxCount: 2 },
    { name: 'product', maxCount: 10 },
    { name: 'documents', maxCount: 10 },
])

module.exports = { upload, uploadFields }