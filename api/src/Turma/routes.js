module.exports = (app) => {
    const auth       = require("../core/auth.js");
    const controller = require('./controller.js');

    //Busca todas as turmas
    app.get('/turma'        , auth.verifyUser, controller.findAll);

    //Busca uma turma por ID
    app.get('/turma/:id'    , auth.verifyUser, controller.findById);

    //Criar uma nova turma
    app.post('/turma'       , auth.verifyUser, controller.create);

    //Atualiza uma turma por ID
    app.put('/turma'        , auth.verifyUser, controller.update);
    
    //Deleta uma turma por ID
    app.delete('/turma'     , auth.verifyUser, controller.delete);
}