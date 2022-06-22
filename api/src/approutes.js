module.exports = (app) => {
    require('./Autenticação/routes.js')(app);
    require('./Perfil/routes.js')(app);
    require('./Usuario/routes.js')(app);
    require('./Turma/routes.js')(app);
    require('./Aluno/routes.js')(app);
    require('./Historico/routes.js')(app);

    app.get("/", (req, res, next) => {
        let json = {
            "Meire": "Controle de alunos"
        }
        res.json(json)
    })    
}