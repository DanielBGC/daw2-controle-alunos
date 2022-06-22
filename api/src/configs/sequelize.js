const dbConfig = require('./database.js');
const Sequelize = require('sequelize');

const sequelize = new Sequelize(dbConfig);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.sync = async () => {
    //{force: true} Apaga e cria as tabelas sempre que o servidor rodar
    //{alter: true} Verifica se foi feita alguma modificação na estrutura da tabela, mas não apaga se existir
    await db.sequelize.sync({ alter: true });
    console.log("BD sincronizado!");
}

module.exports = db;