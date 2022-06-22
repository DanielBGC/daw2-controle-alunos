const db                   = require('../configs/sequelize.js');
const sequelize            = db.sequelize;
const { Model, DataTypes } = db.Sequelize;

class Historico extends Model { }

Historico.init({
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    nota: {
        type: DataTypes.DOUBLE,
        allowNull: true
    },
    path_dir: {
        type: DataTypes.STRING,
        allowNull: true
    },
    nome_arquivo: {
        type: DataTypes.STRING,
        allowNull: true
    },
    observacao: {
        type: DataTypes.STRING,
        allowNull: false
    },
    alunoId: { //Foreign Key
        type: DataTypes.INTEGER,
        references: {
            model: 'alunos',  // Nome da tabela que o atletaId faz referência
            key: 'id',        // Nome da coluna dentro da tabela de referência
        },
        allowNull: false
    }
}, {sequelize, modelName: 'historicos'});

module.exports = Historico;