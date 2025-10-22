const Banco = require("./Banco")
const bcrypt = require("bcrypt");

module.exports = class Usuario {
    constructor(){
        this._idUsuario = null
        this._nome = null
        this._email = null
        this._senha_hash = null
        this._email_verificado = 0
    }

    create = async () => {
        const SQL = "INSERT INTO usuario (nome, email, senha_hash) VALUES (?, ?, ?)";
        try {
            const conexao = Banco.getConexao();
            const hashSeguro = await bcrypt.hash(this.senha_hash, 10); // 10 rounds de sal
            console.log("Hash que vai pro banco:", hashSeguro);
            const [resposta] = await conexao.promise().execute(SQL, [this.nome, this.email, hashSeguro]);
            this.id = resposta.insertId;
            return resposta.affectedRows > 0;
        } catch (error) {
            console.error(error);
            return false;
        }
    };

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
        const SQL = "UPDATE usuario SET nome = ?, email = ?, senha_hash = ?, email_verificado = ? WHERE idUsuario = ?"
        try {
            const conexao = Banco.getConexao()
            const hashSeguro = await bcrypt.hash(this.senha_hash, 10); // hash novo
            const [resposta] = await conexao.promise().execute(SQL,[this.nome,this.email,hashSeguro,this._email_verificado,this.idUsuario])
            return resposta.affectedRows > 0
        } catch(error){
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
        const SQL = "SELECT idUsuario, nome, email_verificado, senha_hash FROM usuario WHERE email = ?";
        try {
            const conexao = Banco.getConexao();
            const [resposta] = await conexao.promise().execute(SQL, [this.email]);

            if (resposta.length === 0) {
                return { sucesso: false, motivo: "CREDENCIAIS_INVALIDAS" };
            }

            const user = resposta[0];
            const senhaCorreta = await bcrypt.compare(this.senha_hash, user.senha_hash);

            if (!senhaCorreta) {
                return { sucesso: false, motivo: "CREDENCIAIS_INVALIDAS" };
            }

            // Se não verificado, deleta
            if (user.email_verificado === 0) {
                this.idUsuario = user.idUsuario;
                await this.delete();
                return { sucesso: false, motivo: "EMAIL_NAO_VERIFICADO_DELETADO" };
            }

            this.idUsuario = user.idUsuario;
            this.nome = user.nome;
            return { sucesso: true };
        } catch (error) {
            console.error(error);
            return { sucesso: false, motivo: "ERRO_INTERNO" };
        }
    };


    isEmailVerificado = async () => {
    const SQL = "SELECT email_verificado FROM usuario WHERE email = ?"
    try {
        const conexao = Banco.getConexao()
        const [resposta] = await conexao.promise().execute(SQL, [this.email])

        if (resposta.length > 0 && resposta[0].email_verificado === 1) {
            return true
        }
        return false
    } catch (error) {
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
    
    get email_verificado() {
    return this._email_verificado
    }
    set email_verificado(valor) {
        this._email_verificado = valor
    }
}