import fs from 'fs/promises'
import express from "express"
import cors from "cors"

const app = express()
app.use(cors())
const PORT = 3000

let modelos = null

async function lerModelos() {
    try {
        const dados = await fs.readFile('../dadosJSON/modelos.json', 'utf-8');
        modelos = JSON.parse(dados);
        
    } catch (erro) {
        console.error("Erro ao ler o JSON:", erro);
        return null;
    }
    return modelos;
}


app.get('/api/modelos', async (req,res) =>{
    const modelos = await lerModelos()
    if(modelos){
        res.json(modelos)
    }else{
        res.status(500).json({ erro: "Erro ao carregar modelo"})
    }

})

app.listen(PORT, () => console.log("Servidor rodando"))
