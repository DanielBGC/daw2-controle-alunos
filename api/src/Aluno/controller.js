const db     = require('../configs/sequelize.js');
const { Op } = require("sequelize");
const utils  = require('../utils.js');

const Aluno  = require('./model.js');
const Turma  = require('../Turma/model.js');

let api = {}

api.findAll = async (req, res) => {
    try {
        utils.showRequestUrl(req);

        let query = req.query && req.query.nome != undefined ? req.query.nome : "";
        console.log(query)

        let alunos = await Aluno.findAll({
            where: {
                [Op.or]: [
                  { nome: { [Op.iLike]: `%${query}%` } },
                ]
            },
            order: ['createdAt'] 
        })

        if(alunos.length > 0) {
            // Percorre pelo array de alunos, buscando a sua turma e vinculando os dois

            //Opção 1
            // for (const aluno of alunos) {
            //     let turma = await Turma.findOne({
            //         where: { id: aluno.turmaId }
            //     })
            //     aluno.dataValues.turma = turma.dataValues.nome;
            // }

            //Opção 2
            let turmas = await Turma.findAll({});

            for (const turma of turmas) {
                for (const aluno of alunos) {
                    if(aluno.turmaId == turma.id) {
                        aluno.dataValues.turma = turma.dataValues.nome;
                    }
                }
            }
        }

        if(alunos.length > 0) {
            return res.json(alunos);
        } else {
            res.set("info", "Ainda nao existem alunos criados");
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

        let aluno = await Aluno.findOne({
            where: { id: req.params.id }
        })

        if(aluno != null) {

            let turma = await Turma.findOne({
                where: { id: aluno.turmaId }
            })
            aluno.dataValues.turma = turma.dataValues.nome;
           
            return res.json(aluno);
        } else {
            res.set("info", "Esse aluno nao existe");
            return res.status(204).end();
        }

    }
    catch(error) {
        return res.status(500).json(error);
    }
}

api.findByTurmaId = async (req, res) => {
    try {
        utils.showRequestUrl(req);

        if(req.params.id == null) {
            return res.status(400).json({info: "Parâmetro inválido. É necessário informar o ID da turma"});
        }

        let regexp = new RegExp(/^(0|[1-9][0-9]*)$/);

        if(regexp.test(req.params.id) == false) {
            return res.status(400).json({info: "Parâmetro inválido. O ID da turma precisa ser um valor numérico"});
        }

        let alunos = await Aluno.findAll({
            where: { turmaId: req.params.id }
        });

        if(alunos.length > 0) {
            return res.json(alunos);
        } else {
            res.set("info", "Nao existem alunos vinculados a esta turma");
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
            return res.status(400).json({info: "Parâmetro inválido. Nome do aluno não pode estar vazio."});
        }

        if(req.body.data_nascimento == null) {
            return res.status(400).json({info: "Parâmetro inválido. É necessário informar uma data de nascimento."});
        } else if(req.body.data_nascimento == "") {
            return res.status(400).json({info: "Parâmetro inválido. Data de nascimento do aluno não pode estar vazio."});
        }

        if(req.body.turmaId != null) {
            let regexp = new RegExp(/^(0|[1-9][0-9]*)$/);

            if(regexp.test(req.body.turmaId) == false) {
                return res.status(400).json({info: "Parâmetro inválido. O ID da turma precisa ser um valor numérico."});
            }
        }

        //A nome turma veio preenchida do front-end
        //Nesse caso é necessário procurar o id da turma pelo nome
        if(req.body.turma != null) {
            let turma = await Turma.findOne({
                where: { nome: req.body.turma }
            })

            if(turma != null) {
                req.body.turmaId = turma.dataValues.id;
            }
        }

        let aluno = await Aluno.create(req.body)
        
        return res.json({info: 'Aluno cadastrado com sucesso!', aluno: aluno});
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

        if(req.body.nome != null && req.body.nome == "") {
            return res.status(400).json({info: "Parâmetro inválido. Nome do aluno não pode estar vazio."});
        }

        if(req.body.data_nascimento != null && req.body.data_nascimento == "") {
            return res.status(400).json({info: "Parâmetro inválido. Data de nascimento do aluno não pode estar vazio."});
        }

        if(req.body.turmaId != null) {
            let regexp = new RegExp(/^(0|[1-9][0-9]*)$/);

            if(regexp.test(req.body.turmaId) == false) {
                return res.status(400).json({info: "Parâmetro inválido. O ID da turma precisa ser um valor numérico."});
            }
        }
    
        //A nome turma veio preenchida do front-end
        //Nesse caso é necessário procurar o id da turma pelo nome
        if(req.body.turma != null) {
            let turma = await Turma.findOne({
                where: { nome: req.body.turma }
            })

            if(turma != null) {
                req.body.turmaId = turma.dataValues.id;
            }
        }

        //Verifica se existe esse aluno no banco
        let aluno = await Aluno.findOne({
            where: { id: req.body.id } 
        });

        //Se existir, atualiza
        if(aluno != null) {
            let affectedRows = await Aluno.update(req.body, {
                where: { id: req.body.id }
            });

            return res.json({info: 'Aluno atualizado com sucesso!', affectedRows: affectedRows[0]});
        } else {
            return res.json({info: 'Esse aluno não existe'});
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

        //Verifica se existe esse aluno no banco
        let aluno = await Aluno.findOne({
            where: { id: req.body.id } 
        });

        //Se existir, deleta
        if(aluno != null) {
            let affectedRows = await Aluno.destroy({
                where: { id: req.body.id }
            })

            return res.json({info: 'Aluno deletado com sucesso!', affectedRows: affectedRows[0]});
        } else {
            return res.json({info: 'Esse aluno não existe'});
        }

    }
    catch(error) {
        return res.status(500).json(error);
    }
}

module.exports = api;