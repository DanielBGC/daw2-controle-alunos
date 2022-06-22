const db      = require('../configs/sequelize.js');
const { Op }  = require("sequelize");
const utils   = require('../utils.js');

const Usuario = require('./model.js');

const auth = require('../core/auth');

const senhaController = require('../Autenticação/senha.js')

let api = {}

api.findAll = async (req, res) => {
    try {
        utils.showRequestUrl(req);

        let query = req.query.nome != undefined ? req.query.nome : "";

        let usuarios = await Usuario.findAll({
            where: {
                [Op.or]: [
                  { nome: { [Op.iLike]: `%${query}%` } },
                ]
            },
        });
        
        if(usuarios.length > 0) {
            return res.json(usuarios);
        } else {
            res.set("info", "Ainda nao existem usuarios criados");
            return res.status(204).end();
        }

    }
    catch(error) {
        return res.status(500).json(error);
    }
}

api.findById = async (req, res) => {
    try {
        utils.showRequestUrl(req);

        if(req.params.id == null) {
            return res.status(400).json({info: "Parâmetro inválido. É necessário informar um ID"});
        }

        let regexp = new RegExp(/^(0|[1-9][0-9]*)$/);

        if(regexp.test(req.params.id) == false) {
            return res.status(400).json({info: "Parâmetro inválido. O ID precisa ser um valor numérico"});
        }

        let usuario = await Usuario.findOne({
            where: { id: req.params.id }
        });

        if(usuario != null) {
            return res.json(usuario);
        } else {
            res.set("info", "Esse usuario nao existe");
            return res.status(204).end();
        }

    }
    catch(error) {
        return res.status(500).json(error);
    }
}

api.findByIdAuth = async (userId) => {
    try {
        let usuario = await Usuario.findByPk(userId);
        return usuario;
    } catch (err) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).end("Erro ao buscar usuário por ID");
    }
}

api.findByPerfilId = async (req, res) => {
    try {
        utils.showRequestUrl(req);

        if(req.params.id == null) {
            return res.status(400).json({info: "Parâmetro inválido. É necessário informar o ID do perfil"});
        }

        let regexp = new RegExp(/^(0|[1-9][0-9]*)$/);

        if(regexp.test(req.params.id) == false) {
            return res.status(400).json({info: "Parâmetro inválido. O ID do perfil precisa ser um valor numérico"});
        }

        let usuarios = await Usuario.findAll({
            where: { perfilId: req.params.id }
        });

        if(usuarios.length > 0) {
            return res.json(usuarios);
        } else {
            res.set("info", "Nao existem usuarios vinculados a este perfil");
            return res.status(204).end();
        }
    }
    catch(error) {
        return res.status(500).json(error);
    }
}

api.create = async (req, res) => {
    try {

        utils.showRequestUrl(req);

        if(req.body.nome == null) {
            return res.status(400).json({info: "Parâmetro inválido. É necessário informar um nome."});
        } else if(req.body.nome == "") {
            return res.status(400).json({info: "Parâmetro inválido. Nome do usuário não pode estar vazio."});
        }

        if(req.body.email == null) {
            return res.status(400).json({info: "Parâmetro inválido. É necessário informar um e-mail."});
        } else if(req.body.email == "") {
            return res.status(400).json({info: "Parâmetro inválido. E-mail do usuário não pode estar vazio."});
        }

        if(req.body.senha == null) {
            return res.status(400).json({info: "Parâmetro inválido. É necessário informar uma senha."});
        } else if(req.body.senha == "") {
            return res.status(400).json({info: "Parâmetro inválido. Senha do usuário não pode estar vazio."});
        }

        if(req.body.perfilId != null) {
            let regexp = new RegExp(/^(0|[1-9][0-9]*)$/);

            if(regexp.test(req.body.perfilId) == false) {
                return res.status(400).json({info: "Parâmetro inválido. O ID do perfil precisa ser um valor numérico."});
            }
        }

        //Verifica se existe esse usuário no banco
        let usuario = await Usuario.findOne({
            where: { email: req.body.email } 
        });

        //Se existir, não deixa criar novamente
        if(usuario != null) {
            return res.status(400).json({info: "Esse e-mail já está sendo utilizado."});
        } else {
            //criptografa a senha
            encryptedPassword = await senhaController.encryptPassword(req.body.senha);

            usuario = await Usuario.create({
                nome: req.body.nome,
                email: req.body.email,
                senha: encryptedPassword,
                perfilId: req.body.perfilId
            });
            
            return res.json(usuario);
        }

    } 
    catch(error) {
        return res.status(500).json(error);
    }
}

api.update = async (req, res) => {
    try {
        utils.showRequestUrl(req);

        if(req.body.id == null) {
            return res.status(400).json({info: "Parâmetro inválido. É necessário informar um ID"});
        }
        
        let regexp = new RegExp(/^(0|[1-9][0-9]*)$/);

        if(regexp.test(req.body.id) == false) {
            return res.status(400).json({info: "Parâmetro inválido. O ID do usuário precisa ser um valor numérico"});
        }

        if(req.body.nome != null && req.body.nome == "") {
            return res.status(400).json({info: "Parâmetro inválido. Nome do usuário não pode estar vazio."});
        } 

        if(req.body.email != null && req.body.email == "") {
            return res.status(400).json({info: "Parâmetro inválido. E-mail do usuário não pode estar vazio."});
        } 

        if(req.body.perfilId != null) {
            let regexp = new RegExp(/^(0|[1-9][0-9]*)$/);

            if(regexp.test(req.body.perfilId) == false) {
                return res.status(400).json({info: "Parâmetro inválido. O ID do perfil precisa ser um valor numérico."});
            }
        }

        //Verifica se existe esse usuário no banco
        let usuario = await Usuario.findOne({
            where: { id: req.body.id } 
        });

        //Se existir, atualiza
        if(usuario != null) {
            let affectedRows = await Usuario.update(req.body, {
                where: { id: req.body.id }
            });

            return res.json({info: 'Usuário atualizado com sucesso!', affectedRows: affectedRows[0]});
        } else {
            return res.json({info: 'Esse usuário não existe'});
        }

    } 
    catch(error) {
        return res.status(500).json(error);
    }
}

api.delete = async (req, res) => {
    try {
        utils.showRequestUrl(req);

        if(req.body.id == null) {
            return res.status(400).json({info: "Parâmetro inválido. É necessário informar um ID"});
        }
        
        let regexp = new RegExp(/^(0|[1-9][0-9]*)$/);

        if(regexp.test(req.body.id) == false) {
            return res.status(400).json({info: "Parâmetro inválido. O ID precisa ser um valor numérico"});
        }

        //Verifica se existe esse usuário no banco
        let usuario = await Usuario.findOne({
            where: { id: req.body.id } 
        });

        //Se existir, atualiza
        if(usuario != null) {
            let affectedRows = await Usuario.destroy({
                where: { id: req.body.id }
            });

            return res.json({info: 'Usuário deletado com sucesso!', affectedRows: affectedRows[0]});
        } else {
            return res.json({info: 'Esse usuário não existe'});
        }

    }
    catch(error) {
        return res.status(500).json(error);
    }
}

api.updatePassword = async (req, res) => {
    try {
        utils.showRequestUrl(req);

        if(req.body.id == null) {
            return res.status(400).json({info: "Parâmetro inválido. É necessário informar um ID"});
        }

        if(req.body.senha == null) {
            return res.status(400).json({info: "Parâmetro inválido. É necessário informar um senha."});
        } else if(req.body.senha == "") {
            return res.status(400).json({info: "Parâmetro inválido. Senha do usuário não pode estar vazio."});
        }

        //Verifica se existe esse usuário no banco
        let usuario = await Usuario.findOne({
            where: { id: req.body.id } 
        });

        //Se existir, atualiza
        if(usuario != null) {
            //criptografa a senha
            encryptedPassword = await senhaController.encryptPassword(req.body.senha);

            let affectedRows = await Usuario.update({
                senha: encryptedPassword
            }, {
                where: { id: req.body.id }
            });

            return res.json({info: 'Senha atualizado com sucesso!', affectedRows: affectedRows[0]});
        } else {
            return res.json({info: 'Esse usuário não existe'});
        }

    } 
    catch(error) {
        return res.status(500).json(error);
    }
}

module.exports = api;