const Animais = require("../modelo/Animais")

module.exports = class AnimaisControle {

    animais_create_controle = async (request, response) => {
        const animais = new Animais()
        animais.nomeAnimal = request.body.animais.nomeAnimal
        animais.especie = request.body.animais.especie

        const objResposta = {
            status: true,
            msg: "Cadastrado com sucesso"
        }
        const criado = await animais.create()
        if (criado === false) {
            objResposta.status = false
            objResposta.msg = "Erro ao cadastrar animal"
            response.status(500).send(objResposta)
        } else {
            response.status(201).send(objResposta)
        }
    }

    animais_readAll_controle = async (request, response) => {
        const animais = new Animais()

        const objResposta = {
            status: true,
            msg: "Animais lidos com sucesso",
            dados:await animais.readAll(),
        }
        response.status(200).send(objResposta)
    }

    animais_readById_controle = async (request, response) => {
        const animais = new Animais()

        animais.idAnimais = request.params.idAnimais
        const objResposta = {
            status: true,
            msg: "Animal lido com sucesso",
            dados:await animais.readById(),
        }
        response.status(200).send(objResposta)
    }

    animais_update_controle = async (request, response) => {
        const animais = new Animais()

        animais.idAnimais = request.params.idAnimais

        animais.nomeAnimal = request.body.animais.nomeAnimal
        animais.especie = request.body.animais.especie

        const objResposta = {
            status: true,
            msg: "Atualizado com sucesso"
        }
        const atualizado = await animais.update()
        if (atualizado === false) {
            objResposta.status = false
            objResposta.msg = "Erro ao atualizar animal"
            response.status(500).send(objResposta)
        } else {
            response.status(201).send(objResposta)
        }
    }

    animais_delete_controle = async (request, response) => {
        const animais = new Animais()

        animais.idAnimais = request.params.idAnimais

        const objResposta = {
            status: await animais.delete(),
            msg: "Animal deletado com sucesso",
        }
        response.status(200).send(objResposta)
    }
}
