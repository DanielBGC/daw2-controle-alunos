const db        = require('../configs/sequelize.js');
const { Op }    = require("sequelize");
const Historico = require('./model.js');
const utils     = require('../utils.js');

let api = {}

api.findAll = async (req, res) => {
    try {
        utils.showRequestUrl(req);

        let query = req.query.observacao != undefined ? req.query.observacao : "";

        let historicos = await Historico.findAll({
            where: {
                [Op.or]: [
                  { observacao: { [Op.iLike]: `%${query}%` } },
                ]
            },
            order: ['createdAt'] 
        });

        if(historicos.length > 0) {
            return res.json(historicos);
        } else {
            res.set("info", "Ainda nao existem historicos registrados");
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

        let historico = await Historico.findOne({
            where: { id: req.params.id }
        })
        
        if(historico != null) {
            return res.json(historico);
        } else {
            res.set("info", "Esse historico nao existe");
            return res.status(204).end();
        }
    }
    catch(error) {
        return res.status(500).json(error);
    }
}

api.findByAlunoId = async (req, res) => {
    try {
        utils.showRequestUrl(req);
        console.log(req.params.id)

        if(req.params.id == null) {
            return res.status(400).json({info: "Parâmetro inválido. É necessário informar o ID do aluno"});
        }

        let regexp = new RegExp(/^(0|[1-9][0-9]*)$/);

        if(regexp.test(req.params.id) == false) {
            return res.status(400).json({info: "Parâmetro inválido. O ID do aluno precisa ser um valor numérico"});
        }

        let historicos = await Historico.findAll({
            where: { alunoId: req.params.id }
        });

        if(historicos.length > 0) {
            return res.json(historicos);
        } else {
            res.set("info", "Nao existem historicos vinculados a este aluno");
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

        if(req.body.observacao == null) {
            return res.status(400).json({info: "Parâmetro inválido. É necessário informar uma observação."});
        } else if(req.body.observacao == "") {
            return res.status(400).json({info: "Parâmetro inválido. Observação do histórico não pode estar vazio."});
        }

        if(req.body.alunoId != null) {
            let regexp = new RegExp(/^(0|[1-9][0-9]*)$/);

            if(regexp.test(req.body.alunoId) == false) {
                return res.status(400).json({info: "Parâmetro inválido. O ID do aluno precisa ser um valor numérico."});
            }
        }

        let historico = await Historico.create(req.body)
        
        return res.json(historico);
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
            return res.status(400).json({info: "Parâmetro inválido. O ID do aluno precisa ser um valor numérico"});
        }

        if(req.body.observacao != null && req.body.observacao == "") {
            return res.status(400).json({info: "Parâmetro inválido. Observação do histórico não pode estar vazio."});
        } 

        if(req.body.alunoId != null) {
            let regexp = new RegExp(/^(0|[1-9][0-9]*)$/);

            if(regexp.test(req.body.alunoId) == false) {
                return res.status(400).json({info: "Parâmetro inválido. O ID do aluno precisa ser um valor numérico."});
            }
        }

        //Verifica se existe esse histórico no banco
        let historico = await Historico.findOne({
            where: { id: req.body.id } 
        });

        //Se existir, atualiza
        if(historico != null) {
            let affectedRows = await Historico.update(req.body, {
                where: { id: req.body.id }
            })

            return res.json({info: 'Histórico atualizado com sucesso!', affectedRows: affectedRows[0]});
        } else {
            return res.json({info: 'Esse histórico não existe'});
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

        //Verifica se existe esse histórico no banco
        let historico = await Historico.findOne({
            where: { id: req.body.id } 
        });

        //Se existir, deleta
        if(historico != null) {
            let affectedRows = await Historico.destroy({
                where: { id: req.body.id }
            })

            return res.json({info: 'Histórico deletado com sucesso!', affectedRows: affectedRows[0]});
        } else {
            return res.json({info: 'Esse histórico não existe'});
        }

    }
    catch(error) {
        return res.status(500).json(error);
    }
}

module.exports = api;