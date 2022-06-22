require('dotenv').config()

const jwt = require('jsonwebtoken')

exports.createToken = (entity) => {
    return jwt.sign(entity, process.env.JWT_SECRET, {
        expiresIn: "1 day"
    })
}

exports.verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET)
    } 
    catch (error) {
        return Promise.reject({ message: 'Token inválido' })
    }
}
