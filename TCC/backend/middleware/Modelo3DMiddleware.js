const Modelo3D = require("../modelo/Modelo3D")
const Animal = require("../modelo/Animais")

module.exports = class Modelo3DMiddleware {
    validar_sexo = (request,response,next) => {
        const sexo = request.body.modelo3D.sexo

        if(sexo!="M" && sexo!="F"){
            const objResposta = {
                status: false,
                msg: "É aceito apenas M ou F"
            }
            response.status(400).send(objResposta)
        }else{
            next()
        }
    }
    validar_camada = (request,response,next) => {
        const camada = request.body.modelo3D.camada

        if(camada!="ossea" && camada!="muscular" && camada!="epiderme" && camada!="orgaos"){
            const objResposta = {
                status: false,
                msg: "Camada não aceita"
            }
            response.status(400).send(objResposta)
        }else{
            next()
        }
    }

    validar_ModeloCreate = async (request,response,next) => {
        const animalID = request.body.modelo3D.animalID
        const sexo = request.body.modelo3D.sexo
        const camada = request.body.modelo3D.camada
        const caminho_arquivo = request.body.modelo3D.caminho_arquivo

        const modelo = new Modelo3D()
        modelo.animalID = animalID
        modelo.sexo = sexo
        modelo.camada = camada
        modelo.caminho_arquivo = caminho_arquivo

        const existe = await modelo.isModelo()

        if(existe === true){
            const objResposta = {
                status: false,
                msg: "Modelo ja cadastrado"
            }
            response.status(400).send(objResposta)
        }else{
            next()
        }
    }

    /*validar_ModeloUpdate = async (request,response,next) => {
        const animalID = request.body.modelo3D.animalID
        const sexo = request.body.modelo3D.sexo
        const caminho_arquivo = request.body.modelo3D.caminho_arquivo
        const camada = request.body.modelo3D.camada

        const modelo = new Modelo3D()
        modelo.animalID = animalID
        modelo.sexo = sexo
        modelo.caminho_arquivo = caminho_arquivo
        modelo.camada = camada

        const existe = await modelo.isModelo2()

        if(existe === true){
            const objResposta = {
                status: false,
                msg: "Modelo ja cadastrado"
            }
            response.status(400).send(objResposta)
        }else{
            next()
        }
    }*/

    validar_AnimalID = async (request,response,next) => {
        const animalID = request.body.modelo3D.animalID.idAnimais
        const modelo = new Modelo3D()
        modelo.animalID = { idAnimais: animalID}

        if (!animalID || isNaN(animalID)) {
        return response.status(400).send({
            status: false,
            msg: "animalID inválido ou ausente"
        });
        }
        try {
            const animalExiste = await modelo.isChaveEstrangeira();
            if (!animalExiste) {
                return response.status(400).send({
                    status: false,
                    msg: "animalID não existe"
                });
            }

            next();
        } catch (error) {
            console.error(error);
            response.status(500).send({
                status: false,
                msg: "Erro ao validar animalID"
            });
        }
    }

    validar_caminho_arquivo = (request,response,next) => {
        const caminho_arquivo = request.body.modelo3D.caminho_arquivo

        if (!caminho_arquivo || caminho_arquivo.trim() === "") {
            return response.status(400).send({
                status: false,
                msg: "Caminho do arquivo não pode ser vazio"
            });
        }
        next();
    }
}