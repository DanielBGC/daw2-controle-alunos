require('dotenv').config();
const express   = require('express');
const cors      = require('cors');
const db        = require('./src/configs/sequelize.js');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true}));

//CORS Config
app.use(cors({origin: "*"}))

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    next();
});

//Arquivo de rotas
require('./src/approutes.js')(app)

db.sync();

app.listen(process.env.SERVER_PORT, () => {
    console.log("Servidor rodando na porta " + process.env.SERVER_PORT);
})
