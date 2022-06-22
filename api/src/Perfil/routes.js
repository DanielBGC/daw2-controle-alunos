module.exports = (app) => {
    const auth       = require("../core/auth.js");
    const controller = require('./controller.js');

    //Busca todos os perfis
    app.get('/perfil'        , auth.verifyUser, controller.findAll);

    //Busca um perfil por ID
    app.get('/perfil/:id'    , auth.verifyUser, controller.findById);
 
    //Criar um novo perfil
    app.post('/perfil'       , auth.verifyUser, controller.create);

    //Atualiza um perfil por ID
    app.put('/perfil'        , auth.verifyUser, controller.update);
    
    //Deleta um perfil por ID
    app.delete('/perfil'     , auth.verifyUser, controller.delete);
}