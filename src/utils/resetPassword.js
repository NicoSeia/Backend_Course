const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const { configObject } = require('../config/config')
const { logger } = require('./logger')

// Configurar el transporte de nodemailer
const transport = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: configObject.gmail_user_app,
        pass: configObject.gmail_password_app
    }
})

// Función para generar y enviar el correo electrónico con el enlace de restablecimiento de contraseña
exports.sendPasswordResetEmail = async (userId, userEmail) => {
    // Generar un token JWT con el ID de usuario y una expiración de 1 hora
    const token = jwt.sign({ userId }, 'secreto', { expiresIn: '1h' })

    // Construir la URL de restablecimiento de contraseña con el token como parámetro de consulta
    const resetUrl = `https://localhost:4000/api/reset-password?token=${token}`

    // Crear y enviar el correo electrónico
    await transport.sendMail({
        from: 'Tu aplicación <Ecommerce>',
        to: userEmail,
        subject: 'Restablecer contraseña',
        html: `
            <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
            <a href="${resetUrl}">Restablecer contraseña</a>
        `
    })
}

// Función para verificar y decodificar el token JWT
exports.verifyResetToken = (token) => {
    try {
        // Verificar y decodificar el token
        const decoded = jwt.verify(token, 'secreto')
        return decoded
    } catch (error) {
        // Manejar errores de token inválido o expirado
        logger.error('Token not found')
        return null
    }
}