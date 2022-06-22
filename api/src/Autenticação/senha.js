require('dotenv').config();
var crypto = require('crypto');

let api = {}

//Criptografar a senha do usuário
api.encryptPassword = async (password) => {
  try {
  
    const passwordPlainText = password.toString();

    const hmac = crypto.createHmac('sha256', process.env.CRYPTO_KEY);
    hmac.update(passwordPlainText);
    
    const senhaCriptografada = hmac.digest('hex');

    return senhaCriptografada;

  } 
  catch(error) {

    console.error(error)
    throw error

  }
}

api.forceEncrypt = async (req, res) => {
  try {
  
    const passwordPlainText = req.body.senha.toString();

    const hmac = crypto.createHmac('sha256', process.env.CRYPTO_KEY);
    hmac.update(passwordPlainText);
    
    const senhaCriptografada = hmac.digest('hex');

    return res.json({hash: senhaCriptografada});

  } 
  catch(error) {

    console.error(error)
    throw error

  }

}

module.exports = api;