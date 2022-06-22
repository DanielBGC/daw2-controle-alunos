require('dotenv').config()

const jwt        = require('jsonwebtoken')
const tkn        = require('./jwt')
const httpStatus = require('http-status')

const Usuario    = require('../Usuario/controller.js')
const Perfil     = require('../Perfil/controller.js')

const utils      = require('../utils.js');

exports.verifyUser = async (req, res, next) => {
    try {
        const token = utils.getToken(req);

        if (!token) {
            return res.status(401).send({ auth: false, info: 'No token provided.' });
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(httpStatus.UNAUTHORIZED).end("Operação não permitida");
            }
            
            let user = Usuario.findByIdAuth(decoded.userId)

            req.userId = user.id;

            next();
        })

    } catch (err) {
        return Promise.reject({ 
            status: httpStatus.UNAUTHORIZED, 
            info: "Token inválido!" 
        })
    }
}

exports.verifyPermissao = async (req, res, next) => {
    try {
        const token = utils.getToken(req);

        if (!token) {
            return res.status(401).send({ auth: false, info: 'No token provided.' });
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(httpStatus.UNAUTHORIZED).end("Operação não permitida");
            }
            
            let usuario = Usuario.findByIdAuth(decoded.userId)
            let perfil  = Perfil.findByIdAuth(usuario.perfilId);

            req.userId = user.id;

            next();
        })

    }
    catch(err) {
        return Promise.reject({
            status: httpStatus.UNAUTHORIZED,
            info: "Token inválido"
        })
    }
}


exports.verifyUserProfile = async (token, profile) => {
    try {

        const decoded = await tkn.verifyToken(token);
        console.log("decoded: ", decoded)

        const usuario = await Usuario.findByIdAuth(decoded.userId);
        if (usuario == null) {
            return res.status(401).send({ auth: false, info: 'Operação não permitida' });
        }

        const perfil = await Perfil.findByIdAuth(usuario.perfilId);
        if (perfil == null) {
            return res.status(401).send({ auth: false, info: 'Operação não permitida' });
        }
        console.log(perfil.nome)
        console.log(profile)

        let found = perfil.nome == profile;

        if (found) {
            return Promise.resolve({ userId: usuario.id });
        }
        else {
            return Promise.reject({
                status: httpStatus.FORBIDDEN,
                message: "Usuário não tem permissão para acessar o recurso."
            });
        }

    } 
    catch (err) {
        return Promise.reject({
            status: httpStatus.UNAUTHORIZED,
            info: err.message
        })
    }
}
