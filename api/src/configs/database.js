require('dotenv').config();

module.exports = {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD_HOME,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST_HOME,
    dialect: process.env.DB_DIALECT,
    port: process.env.DB_PORT_HOME
}