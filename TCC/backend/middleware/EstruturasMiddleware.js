const Estruturas = require("../modelo/Estruturas")

module.exports = class EstruturasMiddleware {
    validar_nome_estrutura = (request,response,next) => {
        const nomeEstrutura = request.body.estruturas.nomeEstrutura

        if (!nomeEstrutura || nomeEstrutura.trim() === "" || nomeEstrutura <= 1) {
            return response.status(400).send({
                status: false,
                msg: "nome da estrutura invalido"
            });
        }
        next()
    }

    validar_descricao = (request, response, next) => {
    const descricao = request.body?.estruturas?.descricao;

    if (typeof descricao !== 'string' || !descricao.trim()) {
        return response.status(400).json({
            status: false,
            msg: "A descrição deve ser uma string não vazia."
        });
    }

    const descricaoLimpa = descricao.trim();

    if (descricaoLimpa.length < 3) {
        return response.status(400).json({
            status: false,
            msg: "A descrição deve conter pelo menos 3 caracteres."
        });
    }

    next();
    };


    validar_ModeloID = async (request,response,next) => {
        const modeloID = request.body.estruturas.modeloID.idModelo3D
        const estrutura = new Estruturas()
        estrutura.modeloID = { idModelo3D: modeloID}

        if (!modeloID || isNaN(modeloID)) {
        return response.status(400).send({
            status: false,
            msg: "id do modelo inválido ou ausente"
        });
        }
        try {
            const modeloExiste = await estrutura.isChaveEstrangeira();
            if (!modeloExiste) {
                return response.status(400).send({
                    status: false,
                    msg: "id do modelo não existe"
                });
            }

            next();
        } catch (error) {
            console.error(error);
            response.status(500).send({
                status: false,
                msg: "Erro ao validar modeloID"
            });
        }
    }
    
}