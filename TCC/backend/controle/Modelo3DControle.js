const Modelo3D = require("../modelo/Modelo3D")
const multer = require('multer')
const nodemailer = require('nodemailer')

module.exports = class Modelo3DControle {

    Modelo3D_create_controle = async (request, response) => {
        const modelo3D = new Modelo3D()
        modelo3D.animalID = request.body.modelo3D.animalID
        modelo3D.sexo = request.body.modelo3D.sexo
        modelo3D.caminho_arquivo = request.body.modelo3D.caminho_arquivo
        modelo3D.camada = request.body.modelo3D.camada

        const objResposta = {
            status: true,
            msg: "Cadastrado com sucesso"
        }
        const criado = await modelo3D.create()
        if (criado === false) {
            objResposta.status = false
            objResposta.msg = "Erro ao cadastrar Modelo"
            response.status(500).send(objResposta)
        } else {
            response.status(201).send(objResposta)
        }
    }

    Modelo3D_readAll_controle = async (request, response) => {
        const modelo3D = new Modelo3D()

        const objResposta = {
            status: true,
            msg: "Modelos lidos com sucesso",
            dados:await modelo3D.readAll(),
        }
        response.status(200).send(objResposta)
    }

    Modelo3D_readById_controle = async (request, response) => {
        const modelo3D = new Modelo3D()

        modelo3D.idModelo3D = request.params.idModelo3D
        const objResposta = {
            status: true,
            msg: "Modelo lido com sucesso",
            dados:await modelo3D.readById(),
        }
        response.status(200).send(objResposta)
    }

    Modelo3D_update_controle = async (request, response) => {
        const modelo3D = new Modelo3D()

        modelo3D.idModelo3D = request.params.idModelo3D

        modelo3D.animalID = request.body.modelo3D.animalID
        modelo3D.sexo = request.body.modelo3D.sexo
        modelo3D.caminho_arquivo = request.body.modelo3D.caminho_arquivo
        modelo3D.camada = request.body.modelo3D.camada

        const objResposta = {
            status: true,
            msg: "Atualizado com sucesso"
        }
        const atualizado = await modelo3D.update()
        if (atualizado === false) {
            objResposta.status = false
            objResposta.msg = "Erro ao atualizar Modelo"
            response.status(500).send(objResposta)
        } else {
            response.status(201).send(objResposta)
        }
    }

    Modelo3D_delete_controle = async (request, response) => {
        const modelo3D = new Modelo3D()

        modelo3D.idModelo3D = request.params.idModelo3D

        const objResposta = {
            status: await modelo3D.delete(),
            msg: "Modelo deletado com sucesso",
        }
        response.status(200).send(objResposta)
    }

    constructor() {
        const storage = multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, 'backend/uploads/')
            },
            filename: (req, file, cb) => {
                const uniqueName = Date.now() + '_' + file.originalname
                cb(null, uniqueName)
            }
        })

        const fileFilter = (req, file, cb) => {
            if (file.originalname.toLowerCase().endsWith('.glb')) {
                cb(null, true)
            } else {
                cb(new Error('Apenas arquivos .glb são permitidos!'), false)
            }
        }

        this._upload = multer({ 
            storage: storage,
            fileFilter: fileFilter,
            limits: { fileSize: 50 * 1024 * 1024 } // 50MB
        })
    }

    // Getter para o middleware do multer
    get uploadMiddleware() {
        return this._upload.single('arquivo')
    }

    
    receberModeloPendente = async (request, response) => {
        try {
            const { nomeModelo, animal, usuarioNome, usuarioEmail } = request.body
            const arquivo = request.file

            if (!arquivo) {
                return response.status(400).send({ 
                    status: false, 
                    msg: "Nenhum arquivo foi enviado" 
                })
            }

            const transporter = nodemailer.createTransport({
                host: "mail.gmx.com",
                port: 587,
                secure: false,
                auth: { user: "no-reply-biovision@gmx.com", pass: "ALbertinho25" },
                tls: { rejectUnauthorized: false }
            });

            const mailOptions = {
                from: '"Bio Vision" <no-reply-biovision@gmx.com>',
                to: '"Bio Vision" <no-reply-biovision@gmx.com>',
                subject: 'Novo Modelo 3D',
                text: `Modelo recebido: ${nomeModelo}\nAnimal: ${animal}\nEnviado por: ${usuarioNome}\n Email: ${usuarioEmail}`,
            }

            await transporter.sendMail(mailOptions)

            const mailOptionsUser = {
                from: '"Bio Vision" <no-reply-biovision@gmx.com>',
                to: usuarioEmail,
                subject: 'Seu modelo 3D foi recebido!',
                text: `Olá ${usuarioNome},\n\nRecebemos seu modelo 3D com sucesso!\n\nNome do Modelo: ${nomeModelo}\nAnimal: ${animal}\n\nObrigado por contribuir com a Bio Vision!`
            };

            await transporter.sendMail(mailOptionsUser);

            response.status(201).send({ 
                status: true, 
                msg: "Modelo enviado com sucesso! confirmação enviada para seu email." 
            })

        } catch (error) {
            console.error('Erro completo:', error)
            response.status(500).send({ 
                status: false, 
                msg: "Erro ao processar o upload: " + error.message 
            })
        }
    }
}