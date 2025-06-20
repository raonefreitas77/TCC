const Modelo3D = require("../modelo/Modelo3D")

module.exports = class Modelo3DControle {

    Modelo3D_create_controle = async (request, response) => {
        const modelo3D = new Modelo3D()
        modelo3D.animalID = request.body.modelo3D.animalID
        modelo3D.sexo = request.body.modelo3D.sexo
        modelo3D.caminho_arquivo = request.body.modelo3D.caminho_arquivo
        modelo3D.camada = request.body.modelo3D.camada

        const objResposta = {
            status: true,
            msg: "Cadastrado com sucesso"
        }
        const criado = await modelo3D.create()
        if (criado === false) {
            objResposta.status = false
            objResposta.msg = "Erro ao cadastrar Modelo"
            response.status(500).send(objResposta)
        } else {
            response.status(201).send(objResposta)
        }
    }

    Modelo3D_readAll_controle = async (request, response) => {
        const modelo3D = new Modelo3D()

        const objResposta = {
            status: true,
            msg: "Modelos lidos com sucesso",
            dados:await modelo3D.readAll(),
        }
        response.status(200).send(objResposta)
    }

    Modelo3D_readById_controle = async (request, response) => {
        const modelo3D = new Modelo3D()

        modelo3D.idModelo3D = request.params.idModelo3D
        const objResposta = {
            status: true,
            msg: "Modelo lido com sucesso",
            dados:await modelo3D.readById(),
        }
        response.status(200).send(objResposta)
    }

    Modelo3D_update_controle = async (request, response) => {
        const modelo3D = new Modelo3D()

        modelo3D.idModelo3D = request.params.idModelo3D

        modelo3D.animalID = request.body.modelo3D.animalID
        modelo3D.sexo = request.body.modelo3D.sexo
        modelo3D.caminho_arquivo = request.body.modelo3D.caminho_arquivo
        modelo3D.camada = request.body.modelo3D.camada

        const objResposta = {
            status: true,
            msg: "Atualizado com sucesso"
        }
        const atualizado = await modelo3D.update()
        if (atualizado === false) {
            objResposta.status = false
            objResposta.msg = "Erro ao atualizar Modelo"
            response.status(500).send(objResposta)
        } else {
            response.status(201).send(objResposta)
        }
    }

    Modelo3D_delete_controle = async (request, response) => {
        const modelo3D = new Modelo3D()

        modelo3D.idModelo3D = request.params.idModelo3D

        const objResposta = {
            status: await modelo3D.delete(),
            msg: "Modelo deletado com sucesso",
        }
        response.status(200).send(objResposta)
    }

}