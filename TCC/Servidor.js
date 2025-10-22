const express = require("express")
const cors = require("cors")
const UsuarioRouter = require("./backend/roteador/UsuarioRouter")
const AnimaisRouter = require("./backend/roteador/AnimaisRouter")
const Modelo3DRouter = require("./backend/roteador/Modelo3DRouter")
const EstruturasRouter = require("./backend/roteador/EstruturasRouter")


module.exports = class Servidor {
    constructor() {
        this._porta = 8080
        this._app = express()

        this._app.use(cors())
        this._app.use(express.json())
        //this._app.use(express.static('frontend'))

        this._usuarioRouter = new UsuarioRouter()
        this._animaisRouter = new AnimaisRouter()
        this._modelo3dRouter = new Modelo3DRouter()
        this._estruturasRouter = new EstruturasRouter()

        this.configurarRotas()
    }

    configurarRotas = () => {
        this._app.use("/usuario", this._usuarioRouter.criarRotasUsuario())
        this._app.use("/animais", this._animaisRouter.criarRotasAnimais())
        this._app.use("/modelo3d", this._modelo3dRouter.criarRotasModelo3D())
        this._app.use("/estruturas",this._estruturasRouter.criarRotasEstruturas())
    }

    iniciar = () => {
        this._app.listen(this._porta, () => {
            console.log("Api rodando em http://localhost:" + this._porta + "/")
        })
    }
}