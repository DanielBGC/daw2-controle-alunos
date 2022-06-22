const db                   = require('../configs/sequelize.js');
const sequelize            = db.sequelize;
const { Model, DataTypes } = db.Sequelize;

class Usuario extends Model { }

Usuario.init({
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    senha: {
        type: DataTypes.STRING,
        allowNull: false
    },
    perfilId: { //Foreign Key
        type: DataTypes.INTEGER,
        references: {
            model: 'perfis', // Nome da tabela que o atletaId faz referência
            key: 'id',        // Nome da coluna dentro da tabela de referência
        },
        allowNull: true
    }
}, {sequelize, modelName: 'usuarios'});

module.exports = Usuario;