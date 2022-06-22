const Usuario = require('../Usuario/model.js');
const utils   = require('../utils.js');

const auth = require('../core/auth.js')
const tkn  = require('../core/jwt.js')

const senhaController = require('./senha.js')

let api = {}

api.login = async (req, res) => {
    try {
        utils.showRequestUrl(req);

        if(req.body.email == null) {
            return res.status(400).json({info: "Parâmetro inválido. É necessário informar um e-mail."});
        } else if(req.body.email == "") {
            return res.status(400).json({info: "Parâmetro inválido. E-mail não pode estar vazio."});
        } 
        
        else if(req.body.senha == null) {
            return res.status(400).json({info: "Parâmetro inválido. É necessário informar uma senha."});
        } else if(req.body.senha == "") {
            return res.status(400).json({info: "Parâmetro inválido. Senha não pode estar vazia."});
        }

        //Todos os parâmetros estão corretos
        else {

            //Busca o usuário através do email
            let usuario = await Usuario.findOne({
                where: { email: req.body.email }
            });

            //Verifica se existe esse usuário
            if(usuario != null) {

                //criptografa a senha
                encryptedPassword = await senhaController.encryptPassword(req.body.senha);

                //Verifica se a senha informada é igual a senha do usuário
                usuario = await Usuario.findOne({
                    where: { 
                        email: req.body.email, 
                        senha: encryptedPassword
                    }
                });
            
                if(usuario != null) {
                    const token = tkn.createToken({ userId: usuario.id })
                    return res.json({ info: "Autenticação realizada com sucesso!", auth: true, token: token });
                }
                else {
                    return res.status(401).json({info: "Falha na autenticação!", auth: false});
                }
            
            } 
            //Se não existir, retornar mensagem de aviso
            else {
                return res.json({info: "Esse e-mail não está cadastrado!", auth: false });
            }
        }

    } 
    catch(error) {
        console.log(error)
        return res.status(500).json({info: 'Não foi possível realizar o login. Tente novamente', error: error});
    }
}

api.register = async (req, res) => {
    try {
        utils.showRequestUrl(req);

        if(req.body.nome == null) {
            return res.status(400).json({info: "Parâmetro inválido. É necessário informar um nome."});
        } else if(req.body.nome == "") {
            return res.status(400).json({info: "Parâmetro inválido. Nome do usuário não pode estar vazio."});
        }

        if(req.body.email == null) {
            return res.status(400).json({info: "Parâmetro inválido. É necessário informar um e-mail."});
        } else if(req.body.email == "") {
            return res.status(400).json({info: "Parâmetro inválido. E-mail do usuário não pode estar vazio."});
        }

        if(req.body.senha == null) {
            return res.status(400).json({info: "Parâmetro inválido. É necessário informar uma senha."});
        } else if(req.body.senha == "") {
            return res.status(400).json({info: "Parâmetro inválido. Senha do usuário não pode estar vazio."});
        }

        //Verifica se existe esse usuário no banco
        let usuario = await Usuario.findOne({
            where: { email: req.body.email } 
        });

        //Se existir, não deixa criar novamente
        if(usuario != null) {
            return res.status(400).json({info: "Esse e-mail já está sendo utilizado."});
        } else {
            //criptografa a senha
            encryptedPassword = await senhaController.encryptPassword(req.body.senha);

            usuario = await Usuario.create({
                nome: req.body.nome,
                email: req.body.email,
                senha: encryptedPassword
            });
            
            const token = tkn.createToken({ userId: usuario.id })
            return res.json({ info: "Conta registrada com sucesso!", auth: true, token: token });
        }

    } 
    catch(error) {
        return res.status(500).json(error);
    }
}

//Não tá funcionando
api.getToken = async (req, res) => {
    try {
        const token = req.headers['x-access-token'];

        return res.json({token: token});
    } 
    catch(error) {
        console.log(error)
        return res.status(500).json({info: 'Não foi possível obter o token. Tente novamente', error: error});
    }
}

module.exports = api;