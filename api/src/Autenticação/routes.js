module.exports = (app) => {
    const auth            = require("../core/auth.js");
    const loginController = require('./login.js');
    const senhaController = require('./senha.js');

    app.post('/login'           , loginController.login);

    app.post('/register'        , loginController.register);

    app.get('/token'            , loginController.getToken);

    app.post('/force-encrypt'   , senhaController.forceEncrypt);
}