const Banco = require('./Banco')
const Modelo3D = require('./Modelo3D')

module.exports = class Estruturas {
    constructor() {
        this._idEstrutura = null
        this._nomeEstrutura = null
        this._descricao = null
        this._modeloID = new Modelo3D()
        this._descricao_resumo = null
    }

    create = async () => {
        const SQL = "INSERT INTO estruturas_anatomicas (nomeEstrutura, descricao, modeloID, descricao_resumo) VALUES (?,?,?,?)"
        try {
            const conexao = Banco.getConexao()
            const [resposta] = await conexao.promise().execute(SQL,[this.nomeEstrutura, this.descricao, this.modeloID.idModelo3D, this.descricao_resumo])
            this.id = resposta.insertId
            return resposta.affectedRows > 0
        }catch(error){
            console.error(error)
            return false
        }
    }

    delete = async () => {
        const SQL = "delete from estruturas_anatomicas where idEstrutura = ?"
        try {
            const conexao = Banco.getConexao()
            const [resposta] = await conexao.promise().execute(SQL,[this.idEstrutura])
            return resposta.affectedRows > 0
        }catch(error){
            console.error(error)
            return false
        }
    }

    update = async () => {
        const SQL = "UPDATE estruturas_anatomicas SET nomeEstrutura = ?, descricao = ?, modeloID = ?, descricao_resumo = ? WHERE idEstrutura = ?"
        try {
            const conexao = Banco.getConexao()
            const [resposta] = await conexao.promise().execute(SQL,[this.nomeEstrutura, this.descricao ,this.modeloID.idModelo3D, this.descricao_resumo, this.idEstrutura])

            return resposta.affectedRows > 0
        }catch(error){
            console.error(error)
            return false
        }
    }

    readAll = async () => {
        const SQL = "select * from estruturas_anatomicas"
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
        const SQL = "select * from estruturas_anatomicas where idEstrutura = ?"
        try {
            const conexao = Banco.getConexao()
            const [mRespostas] = await conexao.promise().execute(SQL, [this.idEstrutura])
            return mRespostas
        }catch(error){
            console.error(error)
            return []
        }
    }

    readByModelo = async () => {
        const SQL = "SELECT * from estruturas_anatomicas WHERE modeloID = ?"
        try {
            const conexao = Banco.getConexao()
            const [mRespostas] = await conexao.promise().execute(SQL, [this.modeloID])
            return mRespostas
        }catch(error){
            console.error(error)
            return []
        }
    }

    isEstrutura = async () => {
        const SQL = "select count(*) as qtd from estruturas_anatomicas where nomeEstrutura = ? "
        try {
            const conexao = Banco.getConexao()
            const [resposta] = await conexao.promise().execute(SQL,[this.nomeEstrutura])
            console.log(resposta[0].qtd)
            return resposta[0].qtd > 0
        }catch(error){
            console.error(error)
            return false
        }
    }

    isChaveEstrangeira = async () => {
        const SQL = "SELECT COUNT(*) AS qtd FROM modelo3d WHERE idModelo3D = ?"
        try {
            const conexao = Banco.getConexao();
            const [resposta] = await conexao.promise().execute(SQL, [this.modeloID.idModelo3D]);
            return resposta[0].qtd > 0
        }catch(error){
            console.error(error)
            return false
        }
    }

    get idEstrutura() {
        return this._idEstrutura;
    }
    set idEstrutura(in_idEstrutura) {
        this._idEstrutura = in_idEstrutura;
    }

    get nomeEstrutura() {
        return this._nomeEstrutura;
    }
    set nomeEstrutura(in_nomeEstrutura) {
        this._nomeEstrutura = in_nomeEstrutura;
    }

    get descricao() {
        return this._descricao;
    }
    set descricao(in_descricao) {
        this._descricao = in_descricao;
    }

    get modeloID() {
        return this._modeloID;
    }
    set modeloID(in_modeloID) {
        this._modeloID = in_modeloID;
    }

     get descricao_resumo() {
        return this._descricao_resumo;
    }
    set descricao_resumo(in_descricao_resumo) {
        this._descricao_resumo = in_descricao_resumo;
    }


}