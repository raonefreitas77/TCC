const express = require("express")
const AnimaisMiddleware = require("../middleware/AnimaisMiddleware")
const AnimaisControle = require("../controle/AnimaisControle")


module.exports = class AnimaisRouter {
    constructor(){
        this._router = express.Router()
        this._animaisMiddleware = new AnimaisMiddleware()
        this._controleAnimais = new AnimaisControle()
    }
    
    criarRotasAnimais = () => {
        this._router.post("/",
            this.animaisMiddleware.validar_nomeAnimal,
            this.animaisMiddleware.validar_especie,
            this.animaisMiddleware.validar_animal_existente,
            this.controleAnimais.animais_create_controle
        )

        this._router.get("/",
            this.controleAnimais.animais_readAll_controle
        )
        this._router.get("/:idAnimais",
            this.controleAnimais.animais_readById_controle
        )
        this._router.put("/:idAnimais",
            this.animaisMiddleware.validar_nomeAnimal,
            this.animaisMiddleware.validar_especie,
            this.animaisMiddleware.validar_animal_existente,
            this.controleAnimais.animais_update_controle
        )
        this._router.delete("/:idAnimais",
            this.controleAnimais.animais_delete_controle
        )
        return this._router
    }

    get router() {
        return this._router
    }
    set router(_router) {
        return this._router = _router
    }

    get animaisMiddleware() {
        return this._animaisMiddleware
    }
    set animaisMiddleware(_animaisMiddleware) {
        return this._animaisMiddleware = _animaisMiddleware
    }

    get controleAnimais() {
        return this._controleAnimais
    }
    set controleAnimais(_controleAnimais) {
        return this._controleAnimais = _controleAnimais
    }

}