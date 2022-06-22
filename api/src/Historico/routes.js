module.exports = (app) => {
    const auth       = require("../core/auth.js");
    const controller = require('./controller.js');

    //Busca todos os históricos
    app.get('/historico'            , auth.verifyUser, controller.findAll);

    //Busca um histórico pelo ID
    app.get('/historico/:id'        , auth.verifyUser, controller.findById);

    //Busca todos os históricos pelo ID do aluno
    app.get('/historico/aluno/:id'  , auth.verifyUser, controller.findByAlunoId);

    //Criar um novo histórico
    app.post('/historico'           , auth.verifyUser, controller.create);

    //Atualiza um histórico pelo ID
    app.put('/historico'            , auth.verifyUser, controller.update);
    
    //Deleta um histórico pelo ID
    app.delete('/historico'         , auth.verifyUser, controller.delete);
}