const Usuario = require("../modelo/Usuario")//alt+shift+f identa

module.exports = class UsuarioControle {
    usuario_create_controle = async (request, response) => {
        const usuario = new Usuario()
        usuario.nome = request.body.usuario.nome
        usuario.email = request.body.usuario.email
        usuario.senha_hash = request.body.usuario.senha_hash

        const objResposta = {
            status: true,
            msg: "Cadastrado com sucesso"
        }
        const criado = await usuario.create()
        if (criado === false) {
            objResposta.status = false
            objResposta.msg = "Erro ao cadastrar usuario"
            response.status(500).send(objResposta)
        } else {
            response.status(201).send(objResposta)
        }
    }

    usuario_readAll_controle = async (request, response) => {
        const usuario = new Usuario()

        const objResposta = {
            status: true,
            msg: "Usuarios lidos com sucesso",
            dados:await usuario.readAll(),
        }
        response.status(200).send(objResposta)
    }

    usuario_readById_controle = async (request, response) => {
        const usuario = new Usuario()

        usuario.idUsuario = request.params.idUsuario
        const objResposta = {
            status: true,
            msg: "Usuario lido com sucesso",
            dados:await usuario.readById(),
        }
        response.status(200).send(objResposta)
    }

    usuario_update_controle = async (request, response) => {
        const usuario = new Usuario()

        usuario.idUsuario = request.params.idUsuario

        usuario.nome = request.body.usuario.nome
        usuario.email = request.body.usuario.email
        usuario.senha_hash = request.body.usuario.senha_hash
        const objResposta = {
            status: await usuario.update(),
            msg: "Usuario atualizado com sucesso",
        }
        response.status(200).send(objResposta)
    }

    usuario_delete_controle = async (request, response) => {
        const usuario = new Usuario()

        usuario.idUsuario = request.params.idUsuario

        const objResposta = {
            status: await usuario.delete(),
            msg: "Usuario deletado com sucesso",
        }
        response.status(200).send(objResposta)
    }
}