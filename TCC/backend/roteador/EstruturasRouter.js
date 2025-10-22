const express = require("express")
const EstruturasMiddleware = require("../middleware/EstruturasMiddleware")
const EstruturasControle = require("../controle/EstruturasControle") 

module.exports = class EstruturasRouter {
    constructor() {
        this._router = express.Router()
        this._estruturasMiddleware = new EstruturasMiddleware()
        this._estruturasControle = new EstruturasControle()
    }

    criarRotasEstruturas = () => {
        this._router.post("/",
            this.estruturasMiddleware.validar_ModeloID,
            this.estruturasMiddleware.validar_descricao,
            this.estruturasMiddleware.validar_nome_estrutura,
            this.estruturasControle.estruturas_create_controle
        )
        this._router.get("/",
            this.estruturasControle.estruturas_readAll_controle
        )
        this._router.get("/:idEstrutura",
            this.estruturasControle.estruturas_readById_controle
        )
        this._router.get("/animal/:animalID",
            this.estruturasControle.estruturas_readByAnimal_controle
        );

        this._router.put("/:idEstrutura",
            this.estruturasMiddleware.validar_ModeloID,
            this.estruturasMiddleware.validar_descricao,
            this.estruturasMiddleware.validar_nome_estrutura,
            this.estruturasControle.estruturas_update_controle
        )
        this._router.delete("/:idEstrutura",
            this.estruturasControle.estruturas_delete_controle
        )

        return this._router
    }
    
    get router() {
        return this._router;
    }
    set router(in_router) {
        this._router = in_router;
    }

    get estruturasMiddleware() {
        return this._estruturasMiddleware;
    }
    set estruturasMiddleware(in_estruturasMiddleware) {
        this._estruturasMiddleware = in_estruturasMiddleware;
    }

    get estruturasControle() {
        return this._estruturasControle;
    }
    set estruturasControle(in_estruturasControle) {
        this._estruturasControle = in_estruturasControle;
    }

}