const db = require('../configs/sequelize.js');
const { Model, DataTypes } = db.Sequelize;

const sequelize = db.sequelize;

class Turma extends Model { }

Turma.init({
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, { sequelize, modelName: 'turmas' });

module.exports = Turma;