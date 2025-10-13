const Estruturas = require("../modelo/Estruturas")

module.exports = class EstruturasControle {

    estruturas_create_controle = async (request, response) => {
        const estruturas_anatomicas = new Estruturas()
        estruturas_anatomicas.nomeEstrutura = request.body.estruturas.nomeEstrutura
        estruturas_anatomicas.descricao = request.body.estruturas.descricao
        estruturas_anatomicas.modeloID = request.body.estruturas.modeloID
        estruturas_anatomicas.caminho_imagem = request.body.estruturas.caminho_imagem
        estruturas_anatomicas.descricao_resumo = request.body.estruturas.descricao_resumo

        const objResposta = {
            status: true,
            msg: "Cadastrado com sucesso"
        }
        const criado = await estruturas_anatomicas.create()
        if (criado === false) {
            objResposta.status = false
            objResposta.msg = "Erro ao cadastrar Estrutura"
            response.status(500).send(objResposta)
        } else {
            response.status(201).send(objResposta)
        }
    }


    estruturas_delete_controle = async (request,response) => {
        const estruturas_anatomicas = new Estruturas()

        estruturas_anatomicas.idEstrutura = request.params.idEstrutura

        const objResposta = {
            status: await estruturas_anatomicas.delete(),
            msg: "estrutura removida com sucesso",
        }
        response.status(200).send(objResposta)
    }

     estruturas_update_controle = async (request, response) => {
        const estruturas_anatomicas = new Estruturas()

        estruturas_anatomicas.idEstrutura = request.params.idEstrutura

        estruturas_anatomicas.nomeEstrutura = request.body.estruturas.nomeEstrutura
        estruturas_anatomicas.descricao = request.body.estruturas.descricao
        estruturas_anatomicas.modeloID = request.body.estruturas.modeloID
        estruturas_anatomicas.caminho_imagem = request.body.estruturas.caminho_imagem
        estruturas_anatomicas.descricao_resumo = request.body.estruturas.descricao_resumo


        const objResposta = {
            status: true,
            msg: "Atualizado com sucesso"
        }
        const atualizado = await estruturas_anatomicas.update()
        if (atualizado === false) {
            objResposta.status = false
            objResposta.msg = "Erro ao atualizar estrutura"
            response.status(500).send(objResposta)
        } else {
            response.status(201).send(objResposta)
        }
    }

    estruturas_readAll_controle = async (request, response) => {
        const estruturas_anatomicas = new Estruturas()

        const objResposta = {
            status: true,
            msg: "Estruturas lidas com sucesso",
            dados:await estruturas_anatomicas.readAll(),
        }
        response.status(200).send(objResposta)
    }

    estruturas_readById_controle = async (request, response) => {
        const estruturas_anatomicas = new Estruturas()

        estruturas_anatomicas.idEstrutura = request.params.idEstrutura
        const objResposta = {
            status: true,
            msg: "Estrutura lida com sucesso",
            dados:await estruturas_anatomicas.readById(),
        }
        response.status(200).send(objResposta)
    }

    estruturas_readByModelo_controle = async (request, response) => {
        const estruturas_anatomicas = new Estruturas()

        estruturas_anatomicas.modeloID = request.params.modeloID
        const objResposta = {
            status: true,
            msg: "Estrutura lida com sucesso",
            dados:await estruturas_anatomicas.readByModelo(),
        }
        response.status(200).send(objResposta)
    }


}