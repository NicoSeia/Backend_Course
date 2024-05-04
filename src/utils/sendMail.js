const nodemailer = require('nodemailer')
const { configObject } = require('../config/config')

const transport = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: configObject.gmail_user_app,
        pass: configObject.gmail_password_app
    }
})

async function sendEmail(to, subject, html) {
    try {
        await transport.sendMail({
            from: 'Your App Name <your_email@example.com>',
            to,
            subject,
            html
        })
        console.log(`Email sent to ${to}`)
    } catch (error) {
        console.error(`Error sending email to ${to}:`, error)
    }
}

module.exports = {
    sendEmail
}