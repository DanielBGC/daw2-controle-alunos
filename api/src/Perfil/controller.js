const db     = require('../configs/sequelize.js');
const { Op } = require("sequelize");
const Perfil = require('./model.js');
const utils  = require('../utils.js');

const auth   = require('../core/auth.js');

let api = {}

api.findAll = async (req, res) => {
    try {
        utils.showRequestUrl(req);

        let query = req.query.nome != undefined ? req.query.nome : "";

        let perfis = await Perfil.findAll({
            where: {
                [Op.or]: [
                  { nome: { [Op.iLike]: `%${query}%` } },
                ]
            },
            order: ['createdAt'] 
        });

        if(perfis.length > 0) {
            return res.json(perfis);
        } else {
            res.set("info", "Ainda nao existem perfis criados");
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

        let perfil = await Perfil.findOne({
            where: { id: req.params.id }
        });

        if(perfil != null) {
            return res.json(perfil);
        } else {
            res.set("info", "Esse perfil nao existe");
            return res.status(204).end();
        }

    }
    catch(error) {
        return res.status(500).json(error);
    }
}

api.findByIdAuth = async (perfilId) => {
    try {
        let perfil = await Perfil.findByPk(perfilId);
        return perfil;
    } catch (err) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).end("Erro ao buscar perfil por ID");
    }
}

api.create = async (req, res) => {
    try {
        utils.showRequestUrl(req);

        const token = utils.getToken(req);
        await auth.verifyUserProfile(token, "Administrador");

        if(req.body.nome == null) {
            return res.status(400).json({info: "Parâmetro inválido. É necessário informar um nome"});
        } else if(req.body.nome == "") {
            return res.status(400).json({info: "Parâmetro inválido. Nome do perfil não pode estar vazio"});
        }

        let perfil = await Perfil.create(req.body)
    
        return res.json(perfil);
     
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
            return res.status(400).json({info: "Parâmetro inválido. O ID precisa ser um valor numérico"});
        }
        
        if(req.body.nome != null && req.body.nome == "") {
            return res.status(400).json({info: "Parâmetro inválido. Nome do perfil não pode estar vazio"});
        } 

        //Verifica se existe esse perfil no banco
        let perfil = await Perfil.findOne({
            where: { id: req.body.id } 
        });

        //Se existir, atualiza
        if(perfil != null) {
            let affectedRows = await Perfil.update(req.body, {
                where: { id: req.body.id }
            });

            return res.json({info: 'Perfil atualizado com sucesso!', affectedRows: affectedRows[0]});
        } else {
            return res.json({info: 'Esse perfil não existe'});
        }

    } 
    catch(error) {
        return res.status(500).json(error);
    }
}

api.delete = async (req, res) => {
    try {
        utils.showRequestUrl(req);

        const token = utils.getToken(req);
        await auth.verifyUserProfile(token, "Administrador");

        if(req.body.id == null) {
            return res.status(400).json({info: "Parâmetro inválido. É necessário informar um ID"});
        }

        let regexp = new RegExp(/^(0|[1-9][0-9]*)$/);

        if(regexp.test(req.body.id) == false) {
            return res.status(400).json({info: "Parâmetro inválido. O ID precisa ser um valor numérico"});
        }

        //Verifica se existe esse perfil no banco
        let perfil = await Perfil.findOne({
            where: { id: req.body.id }
        });

        //Se existir, deleta
        if(perfil != null) {
            let affectedRows = await Perfil.destroy({
                where: { id: req.body.id }
            });

            return res.json({info: 'Perfil deletado com sucesso!', affectedRows: affectedRows});
        } else {
            return res.json({info: 'Esse perfil não existe'});
        }

    }
    catch(error) {
        return res.status(500).json(error);
    }
}

module.exports = api;