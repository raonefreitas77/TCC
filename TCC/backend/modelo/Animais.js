const Banco = require("./Banco")

module.exports = class Animais{
    constructor() {
        this._idAnimais = null
        this._nomeAnimal = null
        this._especie = null
    }

    create = async () => {
        const SQL = "insert into animais (nomeAnimal,especie) VALUES (?,?)"
        try {
            const conexao = Banco.getConexao()
            const [resposta] = await conexao.promise().execute(SQL,[this.nomeAnimal,this.especie])
            this.id = resposta.insertId

            return resposta.affectedRows > 0
        }catch(error){
            console.error(error)
            return false
        }
    }

    delete = async () => {
        const SQL = "delete from animais where idAnimais = ?"
        try {
            const conexao = Banco.getConexao()
            const [resposta] = await conexao.promise().execute(SQL,[this.idAnimais])

            return resposta.affectedRows > 0
        }catch(error){
            console.error(error)
            return false
        }
    }

    update = async () => {
        const SQL = "UPDATE animais SET nomeAnimal = ?, especie = ? WHERE idAnimais = ?"
        try {
            const conexao = Banco.getConexao()
            const [resposta] = await conexao.promise().execute(SQL,[this.nomeAnimal,this.especie,this.idAnimais])

            return resposta.affectedRows > 0
        }catch(error){
            console.error(error)
            return false
        }
    }

    readAll = async () => {
        const SQL = "select * from animais"
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
        const SQL = "select * from animais where idAnimais = ?"
        try {
            const conexao = Banco.getConexao()
            const [mRespostas] = await conexao.promise().execute(SQL, [this.idAnimais])
            return mRespostas
        }catch(error){
            console.error(error)
            return []
        }
    }

    isAnimal = async () => {
        const SQL = "select count(*) as qtd from animais where nomeAnimal=? and especie=?"
        try {
            const conexao = Banco.getConexao()
            const [resposta] = await conexao.promise().execute(SQL,[this.nomeAnimal,this.especie])
            console.log(resposta[0].qtd)
            return resposta[0].qtd > 0
        }catch(error){
            console.error(error)
            return false
        }
    }


    get idAnimais(){
        return this._idAnimais
    }
    set idAnimais(novoIdAnimais){
        this._idAnimais = novoIdAnimais
    }

    get nomeAnimal(){
        return this._nomeAnimal
    }
    set nomeAnimal(novoNomeAnimal){
        this._nomeAnimal = novoNomeAnimal
    }

    get especie(){
        return this._especie
    }
    set especie(novaEspecie){
        this._especie = novaEspecie
    }

}
