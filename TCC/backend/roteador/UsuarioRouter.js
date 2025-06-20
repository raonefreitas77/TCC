const express = require("express")
const UsuarioMiddleware = require("../middleware/UsuarioMiddleware")
const UsuarioControle = require("../controle/UsuarioControle")

module.exports = class UsuarioRouter {
    constructor() {
        this._router = express.Router()
        this._usuarioMiddleware = new UsuarioMiddleware()
        this._controleUsuario = new UsuarioControle()
    }

    criarRotasUsuario = () => {
        this._router.post("/",
            this.usuarioMiddleware.validar_nome,
            this.usuarioMiddleware.validar_email,
            this.usuarioMiddleware.validar_email_existente,
            this.usuarioMiddleware.validar_senhaHash,
            this.controleUsuario.usuario_create_controle
        )

        this._router.get("/",
            this.controleUsuario.usuario_readAll_controle
        )
        this._router.get("/:idUsuario",
            this.controleUsuario.usuario_readById_controle
        )

        this._router.put("/:idUsuario",
            this.usuarioMiddleware.validar_nome,
            this.usuarioMiddleware.validar_email,
            this.usuarioMiddleware.validar_email_existente,
            this.usuarioMiddleware.validar_senhaHash,
            this.controleUsuario.usuario_update_controle
        )
        this._router.delete("/:idUsuario",
            this.controleUsuario.usuario_delete_controle
        )
        return this._router
    }


    get controleUsuario() {
        return this._controleUsuario
    }
    set controleUsuario(_controleUsuario) {
        return this._controleUsuario = _controleUsuario
    }

    get usuarioMiddleware() {
        return this._usuarioMiddleware
    }
    set usuarioMiddleware(_usuarioMiddleware) {
        return this._usuarioMiddleware = _usuarioMiddleware
    }

    get router() {
        return this._router
    }
    set router(_router) {
        return this._router = _router
    }
}