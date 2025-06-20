const Banco = require("./Banco")

module.exports = class Usuario {
    constructor(){
        this._idUsuario = null
        this._nome = null
        this._email = null
        this._senha_hash = null
    }

    create = async () => {
        const SQL = "insert into usuario (nome,email,senha_hash) VALUES (?,?,md5(?))"
        try {
            const conexao = Banco.getConexao()
            const [resposta] = await conexao.promise().execute(SQL,[this.nome,this.email,this.senha_hash])
            this.id = resposta.insertId

            return resposta.affectedRows > 0
        }catch(error){
            console.error(error)
            return false
        }
    }

    delete = async () => {
        const SQL = "delete from usuario where idUsuario = ?"
        try {
            const conexao = Banco.getConexao()
            const [resposta] = await conexao.promise().execute(SQL,[this.idUsuario])

            return resposta.affectedRows > 0
        }catch(error){
            console.error(error)
            return false
        }
    }

    update = async () => {
        const SQL = "UPDATE usuario SET nome = ?, email = ?, senha_hash = md5(?) WHERE idUsuario = ?"
        try {
            const conexao = Banco.getConexao()
            const [resposta] = await conexao.promise().execute(SQL,[this.nome,this.email,this.senha_hash,this.idUsuario])

            return resposta.affectedRows > 0
        }catch(error){
            console.error(error)
            return false
        }
    }

    isUsuario = async () => {
        const SQL = "select count(*) as qtd from usuario where email=?"
        try {
            const conexao = Banco.getConexao()
            const [resposta] = await conexao.promise().execute(SQL,[this.email])

            return resposta[0].qtd > 0
        }catch(error){
            console.error(error)
            return false
        }
    }

    readAll = async () => {
        const SQL = "select * from usuario"
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
        const SQL = "select * from usuario where idUsuario = ?"
        try {
            const conexao = Banco.getConexao()
            const [mRespostas] = await conexao.promise().execute(SQL, [this.idUsuario])
            return mRespostas
        }catch(error){
            console.error(error)
            return []
        }
    }

    login = async () => {
        const SQL = "SELECT COUNT(*) AS qtd, idUsuario, nome FROM usuario where email=? and senha_hash = md5(?)"
        try {
            const conexao = Banco.getConexao()
            const [resposta] = await conexao.promise().execute(SQL,[this.email, this.senha_hash])
            if(resposta.length > 0 && resposta[0].qtd === 1){
                this.idUsuario = resultado[0].idUsuario
                this.nome = resultado[0].nome
                return true
            }
            return false
        }catch(error){
            console.error(error)
            return false
        }
    }


    get idUsuario(){
        return this._idUsuario
    }
    set idUsuario(novoIdUsuario){
        this._idUsuario = novoIdUsuario
    }

    get nome(){
        return this._nome
    }
    set nome(novoNome){
        this._nome = novoNome
    }

    get email(){
        return this._email
    }
    set email(novoEmail){
        this._email = novoEmail
    }

    get senha_hash(){
        return this._senha_hash
    }
    set senha_hash(novaSenha){
        this._senha_hash = novaSenha
    }
}