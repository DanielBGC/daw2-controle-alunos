
module.exports = (app) => {
    const auth       = require("../core/auth.js")
    const controller = require('./controller.js');

    //Busca todos os usuarios
    app.get('/usuario'              , auth.verifyUser, controller.findAll);

    //Busca um usuario por ID
    app.get('/usuario/:id'          , auth.verifyUser, controller.findById);

    //Busca todos os usuarios pelo ID do perfil
    app.get('/usuario/perfil/:id'   , auth.verifyUser, controller.findByPerfilId);
    
    //Criar um novo usuario
    app.post('/usuario'             , auth.verifyUser, controller.create);

    //Atualiza um usuario por ID 
    app.put('/usuario'              , auth.verifyUser, controller.update);

    //Remove um usuario por ID 
    app.delete('/usuario'           , auth.verifyUser, controller.delete);

    //Altera a senha de um usuario pelo ID 
    app.put('/usuario/senha'        , auth.verifyUser, controller.updatePassword);
}