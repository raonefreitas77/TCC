const Banco = require("./Banco")
const Animal = require("./Animais")

module.exports = class Modelo3D{
    constructor() {
        this._idModelo3D = null
        this._animalID = new Animal()
        this._sexo = null
        this._caminho_arquivo = null
        this._camada = null
    }


    create = async () => {
        const SQL = "insert into modelo3d (animalID,sexo,caminho_arquivo,camada) VALUES (?,?,?,?)"
        try {
            const conexao = Banco.getConexao()
            const [resposta] = await conexao.promise().execute(SQL,[this.animalID.idAnimais,this.sexo,this.caminho_arquivo,this.camada])
            this.id = resposta.insertId

            return resposta.affectedRows > 0
        }catch(error){
            console.error(error)
            return false
        }
    }
    
    delete = async () => {
        const SQL = "delete from modelo3d where idModelo3D = ?"
        try {
            const conexao = Banco.getConexao()
            const [resposta] = await conexao.promise().execute(SQL,[this.idModelo3D])
            return resposta.affectedRows > 0
        }catch(error){
            console.error(error)
            return false
        }
    }

    update = async () => {
        const SQL = "UPDATE modelo3d SET animalID = ?, sexo = ?, caminho_arquivo = ?, camada = ? WHERE idModelo3D = ?"
        try {
            const conexao = Banco.getConexao()
            const [resposta] = await conexao.promise().execute(SQL,[this.animalID.idAnimais,this.sexo,this.caminho_arquivo,this.camada,this.idModelo3D])

            return resposta.affectedRows > 0
        }catch(error){
            console.error(error)
            return false
        }
    }

    readAll = async () => {
        const SQL = "select * from modelo3d"
        try {
            const conexao = Banco.getConexao()
            const [mRespostas] = await conexao.promise().execute(SQL)
            return mRespostas
        }catch(error){
            console.error(error)
            return []
        }
    }

    readById = async () => {
        const SQL = "select * from modelo3d where idModelo3D = ?"
        try {
            const conexao = Banco.getConexao()
            const [mRespostas] = await conexao.promise().execute(SQL, [this.idModelo3D])
            return mRespostas
        }catch(error){
            console.error(error)
            return []
        }
    }

    isModelo = async () => {
        const SQL = "select count(*) as qtd from modelo3d where animalID=? and sexo=? and camada = ? and caminho_arquivo = ?"
        try {
            const conexao = Banco.getConexao()
            const [resposta] = await conexao.promise().execute(SQL,[this.animalID.idAnimais,this.sexo,this.camada,this.caminho_arquivo])
            console.log(resposta[0].qtd)
            return resposta[0].qtd > 0
        }catch(error){
            console.error(error)
            return false
        }
    }

    /*isModelo2 = async () => {
        const SQL = "select count(*) as qtd from modelo3d where animalID=? and sexo=? and caminho_arquivo=? and camada=?"
        try {
            const conexao = Banco.getConexao()
            const [resposta] = await conexao.promise().execute(SQL,[this.animalID.idAnimais,this.sexo,this.caminho_arquivo])
            console.log(resposta[0].qtd)
            return resposta[0].qtd > 0
        }catch(error){
            console.error(error)
            return false
        }
    }*/

    isChaveEstrangeira = async () => {
        const SQL = "SELECT COUNT(*) AS qtd FROM animais WHERE idAnimais = ?"
        try {
            const conexao = Banco.getConexao();
            const [resposta] = await conexao.promise().execute(SQL, [this.animalID.idAnimais]);
            return resposta[0].qtd > 0
        }catch(error){
            console.error(error)
            return false
        }
    }

    get idModelo3D() {
        return this._idModelo3D;
    }
    set idModelo3D(in_idModelo3D) {
        this._idModelo3D = in_idModelo3D;
    }

    get animalID() {
        return this._animalID;
    }
    set animalID(in_animalID) {
        this._animalID = in_animalID;
    }

    get sexo() {
        return this._sexo;
    }
    set sexo(in_sexo) {
        this._sexo = in_sexo;
    }

    get caminho_arquivo() {
        return this._caminho_arquivo;
    }
    set caminho_arquivo(in_caminho_arquivo) {
        this._caminho_arquivo = in_caminho_arquivo;
    }
    
    get camada() {
        return this._camada;
    }
    set camada(in_camada) {
        this._camada = in_camada;
    }

}