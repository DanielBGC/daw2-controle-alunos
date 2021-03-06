const db                   = require('../configs/sequelize.js');
const sequelize            = db.sequelize;
const { Model, DataTypes } = db.Sequelize;

class Aluno extends Model { }

Aluno.init({
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    data_nascimento: {
        type: DataTypes.STRING,
        allowNull: false
    },
    turmaId: { //Foreign Key
        type: DataTypes.INTEGER,
        references: {
            model: 'turmas',  // Nome da tabela que o turmaId faz referĂȘncia
            key: 'id',        // Nome da coluna dentro da tabela de referĂȘncia
        },
        allowNull: true
    }
}, {sequelize, modelName: 'alunos'});

module.exports = Aluno;