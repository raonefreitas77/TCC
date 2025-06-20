const express = require("express")
const Modelo3DMiddleware = require("../middleware/Modelo3DMiddleware")
const Modelo3DControle = require("../controle/Modelo3DControle")

module.exports = class Modelo3DRouter {
    constructor() {
        this._router = express.Router()
        this._modelo3DMiddleware = new Modelo3DMiddleware()
        this._modelo3DControle = new Modelo3DControle()
    }

    criarRotasModelo3D = () => {
        this._router.post("/",
            this.modelo3DMiddleware.validar_AnimalID,
            this.modelo3DMiddleware.validar_camada,
            this.modelo3DMiddleware.validar_ModeloCreate,
            this.modelo3DMiddleware.validar_caminho_arquivo,
            this.modelo3DMiddleware.validar_sexo,
            this.modelo3DControle.Modelo3D_create_controle
        )
        this._router.get("/",
            this.modelo3DControle.Modelo3D_readAll_controle
        )
        this._router.get("/:idModelo3D",
            this.modelo3DControle.Modelo3D_readById_controle
        )
        this._router.put("/:idModelo3D",
            this.modelo3DMiddleware.validar_AnimalID,
            this.modelo3DMiddleware.validar_camada,
            this.modelo3DMiddleware.validar_caminho_arquivo,
            this.modelo3DMiddleware.validar_sexo,
            this.modelo3DControle.Modelo3D_update_controle
        )
        this._router.delete("/:idModelo3D",
            this.modelo3DControle.Modelo3D_delete_controle
        )
        return this._router
    }

    get router() {
        return this._router;
    }
    set router(in_router) {
        this._router = in_router;
    }

    get modelo3DMiddleware() {
        return this._modelo3DMiddleware;
    }
    set modelo3DMiddleware(in_modelo3DMiddleware) {
        this._modelo3DMiddleware = in_modelo3DMiddleware;
    }

    get modelo3DControle() {
        return this._modelo3DControle;
    }
    set modelo3DControle(in_modelo3DControle) {
        this._modelo3DControle = in_modelo3DControle;
    }

}