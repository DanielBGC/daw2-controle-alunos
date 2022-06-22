module.exports = (app) => {
    const auth       = require("../core/auth.js");
    const controller = require('./controller.js');

    //Busca todos os alunos
    app.get('/aluno'            , auth.verifyUser, controller.findAll);

    //Busca um aluno por ID
    app.get('/aluno/:id'        , auth.verifyUser, controller.findById);

    //Busca todos os alunos pelo ID da turma
    app.get('/aluno/turma/:id'  , auth.verifyUser, controller.findByTurmaId);

    //Criar um novo aluno
    app.post('/aluno'           , auth.verifyUser, controller.create);

    //Atualiza um aluno por ID
    app.put('/aluno'            , auth.verifyUser, controller.update);
    
    //Deleta um aluno por ID
    app.delete('/aluno'         , auth.verifyUser, controller.delete);
}