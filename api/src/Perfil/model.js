const db = require('../configs/sequelize.js');
const { Model, DataTypes } = db.Sequelize;

const sequelize = db.sequelize;

class Perfil extends Model { }

Perfil.init({
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, { sequelize, modelName: 'perfis' });

module.exports = Perfil;