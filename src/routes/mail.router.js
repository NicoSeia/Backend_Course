const { Router } = require('express')
const { sendMail } = require('../utils/sendMail')

const router = Router()

router.get('/mail', (req, res) => {
    sendMail()
    res.send('mail sent')
})


module.exports = router