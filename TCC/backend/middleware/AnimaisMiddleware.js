const Animais = require("../modelo/Animais")

module.exports = class AnimaisMiddleware {
    validar_nomeAnimal = (request, response, next) => {
        const nomeAnimal = request.body.animais.nomeAnimal

        if(nomeAnimal.length <= 1) {
            const objResposta = {
                status: false,
                msg: "o nome deve possuir mais de 1 caractere"
            }
            response.status(400).send(objResposta)
        }else{
            next()
        }
    }

    validar_especie = (request, response, next) => {
        const especie = request.body.animais.especie

        if(especie.length <= 1) {
            const objResposta = {
                status: false,
                msg: "o nome deve possuir mais de 1 caractere"
            }
            response.status(400).send(objResposta)
        }else{
            next()
        }
    }

    validar_animal_existente = async (request, response, next) => {
        const nomeAnimal = request.body.animais.nomeAnimal
        const especie = request.body.animais.especie

        const animais = new Animais()
        animais.nomeAnimal = nomeAnimal
        animais.especie = especie

        const existe = await animais.isAnimal()

        if(existe === true) {
            const objResposta = {
                status: false,
                msg: "Animal e especie ja cadastrada"
            }
            response.status(400).send(objResposta)
        }else{
            next()
        }
    }



}