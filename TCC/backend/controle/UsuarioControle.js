const Usuario = require("../modelo/Usuario")//alt+shift+f identa
const crypto = require("crypto")
const nodemailer = require("nodemailer")
const Banco = require("../modelo/Banco")
const { showNotification } = require("../../frontend/src/notificacao")

const codigosVerificacao = new Map()

module.exports = class UsuarioControle {
    usuario_create_controle = async (request, response) => {
        const usuario = new Usuario()
        usuario.nome = request.body.usuario.nome
        usuario.email = request.body.usuario.email
        usuario.senha_hash = request.body.usuario.senha_hash

        const objResposta = {
            status: true,
            msg: "Cadastrado com sucesso"
        }
        const criado = await usuario.create()
        if (criado === false) {
            objResposta.status = false
            objResposta.msg = "Erro ao cadastrar usuario"
            response.status(500).send(objResposta)
        } else {
            response.status(201).send(objResposta)
        }
    }

    usuario_readAll_controle = async (request, response) => {
        const usuario = new Usuario()

        const objResposta = {
            status: true,
            msg: "Usuarios lidos com sucesso",
            dados:await usuario.readAll(),
        }
        response.status(200).send(objResposta)
    }

    usuario_readById_controle = async (request, response) => {
        const usuario = new Usuario()

        usuario.idUsuario = request.params.idUsuario
        const objResposta = {
            status: true,
            msg: "Usuario lido com sucesso",
            dados:await usuario.readById(),
        }
        response.status(200).send(objResposta)
    }

    usuario_update_controle = async (request, response) => {
        const usuario = new Usuario()

        usuario.idUsuario = request.params.idUsuario

        usuario.nome = request.body.usuario.nome
        usuario.email = request.body.usuario.email
        usuario.senha_hash = request.body.usuario.senha_hash
        usuario.email_verificado = request.body.usuario.email_verificado
        const objResposta = {
            status: await usuario.update(),
            msg: "Usuario atualizado com sucesso",
        }
        response.status(200).send(objResposta)
    }

    usuario_delete_controle = async (request, response) => {
        const usuario = new Usuario()

        usuario.idUsuario = request.params.idUsuario

        const objResposta = {
            status: await usuario.delete(),
            msg: "Usuario deletado com sucesso",
        }
        response.status(200).send(objResposta)
    }

    enviarCodigoVerificacao = async (request, response) => {
        const { email } = request.body;
        const usuario = new Usuario();
        usuario.email = email;

        const existe = await usuario.isUsuario();
        if (!existe) {
            return response.status(400).send({ status: false, msg: "Email não encontrado" });
        }

        const codigo = crypto.randomInt(100000, 999999).toString();
        codigosVerificacao.set(email, codigo);

        const transporter = nodemailer.createTransport({
            host: "mail.gmx.com",
            port: 587,
            secure: false,
            auth: { user: "no-reply-biovision@gmx.com", pass: "ALbertinho25" },
            tls: { rejectUnauthorized: false }
        });

        const mailOptions = {
            from: '"Bio Vision" <no-reply-biovision@gmx.com>',
            to: email,
            subject: "Código de Verificação",
            text: `Seu código de verificação é: ${codigo}`
        };

        try {
            await transporter.sendMail(mailOptions);
            return response.send({ status: true, msg: "Código enviado com sucesso!" });
        } catch (err) {
            console.error(err);
            return response.status(500).send({ status: false, msg: "Erro ao enviar e-mail" });
        }
    };



    verificarCodigo = async (request, response) => {
        const { email, codigo } = request.body
        const codigoEsperado = codigosVerificacao.get(email)

        if (!codigoEsperado || codigoEsperado !== codigo) {
            return response.status(400).send({ status: false, msg: "Código inválido" })
        }

        const usuario = new Usuario()
        usuario.email = email
        usuario.email_verificado = 1

        const SQL = "UPDATE usuario SET email_verificado = 1 WHERE email = ?"
        try {
            const conexao = Banco.getConexao()
            await conexao.promise().execute(SQL, [email])
            codigosVerificacao.delete(email)
            response.send({ status: true, msg: "Email verificado com sucesso" })
        } catch (error) {
            console.error(error)
            response.status(500).send({ status: false, msg: "Erro ao atualizar verificação" })
        }
    }

    usuario_login_controle = async (request, response) => {
        const usuario = new Usuario()
        usuario.email = request.body.email
        usuario.senha_hash = request.body.senha

        const resultado = await usuario.login()

        if (resultado.sucesso) {
            const objResposta = {
                status: true,
                msg: "Login realizado com sucesso",
                dados: {
                    idUsuario: usuario.idUsuario,
                    nome: usuario.nome,
                    email: usuario.email
                }
            }
            response.status(200).send(objResposta)
        } else {
            const objResposta = {
                status: false,
                msg: resultado.motivo === "EMAIL_NAO_VERIFICADO_DELETADO" 
                    ? "Sua conta foi removida por falta de verificação. Cadastre-se novamente e verifique seu email."
                    : resultado.motivo === "CREDENCIAIS_INVALIDAS"
                    ? "Email ou senha incorretos"
                    : "Erro ao realizar login"
            }
            response.status(401).send(objResposta)
        }
    }   

}




