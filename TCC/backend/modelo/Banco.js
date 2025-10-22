const mysql = require("mysql2");

module.exports = class Banco {
    
    static HOST = "127.0.0.1"
    static USER = "root"
    static password = "1234"
    static database = "TCC"
    static PORT = 3306
    static CONEXAO = null

    static conectar(){

        Banco.CONEXAO = mysql.createConnection({
            host: Banco.HOST,
            user: Banco.USER,
            password: Banco.password,
            database: Banco.database,
            port: Banco.PORT,
        })
        
        Banco.CONEXAO.connect((erro) => {
            if(erro){
                const objResposta = {
                    msg:"Falha ao conectar ao servidor do banco de dados",
                    erro: erro.message
                }
                console.log(objResposta)
            }
        })
    }

    static getConexao(){
        
        if(Banco.CONEXAO===null || Banco.CONEXAO.state ==='disconnected'){
            Banco.conectar()
        }
        return Banco.CONEXAO
    }
}