const Usuario = require("../modelo/Usuario")


module.exports = class UsuarioMiddleware {
    validar_nome = (request, response, next) => {
        const nome = request.body.usuario.nome

        if(nome.length <= 1) {
            const objResposta = {
                status: false,
                msg: "o nome deve possuir mais de 1 caractere"
            }
            response.status(400).send(objResposta)
        }else{
            next()
        }
    }

    validar_email = (request, response, next) => {
        const email = request.body.usuario.email
        if(email.length <= 11) {
            const objResposta = {
                status: false,
                msg: "email invalido"
            }
            response.status(400).send(objResposta)
        }else{
            next()
        }
    }

    validar_email_existente = async (request, response, next) => {
        const email = request.body.usuario.email

        const usuario = new Usuario()
        usuario.email = email

        const existe = await usuario.isUsuario()

        if(existe === true) {
            const objResposta = {
                status: false,
                msg: "email ja cadastrado"
            }
            response.status(400).send(objResposta)
        }else{
            next()
        }
    }

    validar_senhaHash = (request, response, next) => {
        const senha = request.body.usuario.senha_hash

        if(senha.length < 4) {
            const objResposta = {
                status: false,
                msg: "a senha deve possuir mais de 3 caracteres"
            }
            response.status(400).send(objResposta)
        }else{
            next()
        }
    }
}