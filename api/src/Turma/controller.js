const db     = require('../configs/sequelize.js');
const { Op } = require("sequelize");
const Turma  = require('./model.js');
const utils  = require('../utils.js');

let api = {}

api.findAll = async (req, res) => {
    try {
        utils.showRequestUrl(req);

        let query = req.query.nome != undefined ? req.query.nome : "";

        let turmas = await Turma.findAll({
            where: {
                [Op.or]: [
                  { nome: { [Op.iLike]: `%${query}%` } },
                ]
            },
            order: ['createdAt'] 
        })

        if(turmas.length > 0) {
            return res.json(turmas);
        } else {
            res.set("info", "Ainda nao existem turmas criadas");
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

        let turma = await Turma.findOne({
            where: { id: req.params.id }
        })

        if(turma != null) {
            return res.json(turma);
        } else {
            res.set("info", "Essa turma nao existe");
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
            return res.status(400).json({info: "Parâmetro inválido. É necessário informar um nome"});
        } else if(req.body.nome == "") {
            return res.status(400).json({info: "Parâmetro inválido. Nome da turma não pode estar vazio"});
        }

        let turma = await Turma.create(req.body)
        
        return res.json({info: "Turma cadastrada com sucesso!", turma: turma});
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
            return res.status(400).json({info: "Parâmetro inválido. Nome da turma não pode estar vazio"});
        } 

        //Verifica se existe essa turma no banco
        let turma = await Turma.findOne({
            where: { id: req.body.id } 
        });

        //Se existir, atualiza
        if(turma != null) {
            let affectedRows = await Turma.update(req.body, {
                where: { id: req.body.id }
            });

            return res.json({info: 'Turma atualizada com sucesso!', affectedRows: affectedRows[0]});
        } else {
            return res.json({info: 'Essa turma não existe'});
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

        //Verifica se existe essa turma no banco
        let turma = await Turma.findOne({
            where: { id: req.body.id } 
        });

        //Se existir, deleta
        if(turma != null) {
            let affectedRows = await Turma.destroy({
                where: { id: req.body.id }
            });

            return res.json({info: 'Turma deletada com sucesso!', affectedRows: affectedRows[0]});
        } else {
            return res.json({info: 'Essa turma não existe'});
        }

    }
    catch(error) {
        return res.status(500).json(error);
    }
}

module.exports = api;