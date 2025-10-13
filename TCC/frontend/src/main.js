import * as THREE from 'three';
import './scene.js';
import './loader.js';
import './mapaMarcadores.js';
import './fade.js'
import { configurarBotoesCamadas, getAnimalSelecionado, setCamadaAtiva, getCamadaAtiva, definirAnimalSelecionado, } from './loader.js';
import { atualizarCardbar, cameraEstrutura, estruturasOsseas } from './mapaMarcadores.js';



// carregar o Modelo no ambiente 3D

document.getElementById('home').addEventListener('click', () => {
  window.location.href = 'home.html';
});




const mapaAnimais = {
  "Cachorro": 1,
  "Gato": 2,
  "Vaca": 3,
  "Cavalo": 4,
  "Peixe" : 5,
  "Rato": 6,
  "Papagaio": 7,
  "Tubarão": 8,
}

const botoesAnimais = document.querySelectorAll("#escolherAnimal p");

botoesAnimais.forEach(botao => {
  botao.addEventListener("click", () => {
    const animal = botao.dataset.animal;

    // define no sistema qual animal foi selecionado (carregamento do modelo 3D)
    definirAnimalSelecionado(animal);

    // remove active de todos
    botoesAnimais.forEach(el => el.classList.remove("active"));
    // adiciona active no clicado
    botao.classList.add("active");
  });
});


configurarBotoesCamadas(
  mapaAnimais,
  getAnimalSelecionado,
  setCamadaAtiva
);



const cardbar = document.getElementById('cardbar');
const toggleBtn = document.getElementById('toggleBtn');

toggleBtn.addEventListener('click', () => {
  cardbar.classList.toggle('open');

  if (cardbar.classList.contains('open')) {
    toggleBtn.textContent = '❯';
  } else {
    toggleBtn.textContent = '❮';
  }
});


async function carregarEstruturasIniciais() {
  try {
    const response = await fetch("/estruturas");
    const data = await response.json();
    const estruturas = data.dados;

    // BUSCAR OS MODELOS TAMBÉM
    const responseModelos = await fetch("/modelo3d"); // ou a rota que retorna os modelos
    const dataModelos = await responseModelos.json();
    const modelos = dataModelos.dados;

    // CRIAR UM MAPA DE modeloID -> camada
    const mapaCamadas = {};
    modelos.forEach(modelo => {
      mapaCamadas[modelo.idModelo3D] = modelo.camada;
    });

    console.log("Mapa de camadas:", mapaCamadas);

    const header = document.querySelector(".card-header");
    const preview = document.getElementById("previewEstrutura");
    const btnVoltar = document.getElementById("voltarCatalogo");
    const btnCamera = document.getElementById("cameraEstrutura");
    const btnOuvir = document.getElementById("lerInfo");
    const btnOuvirResumo = document.getElementById("lerInfoResumo");
    const infoResumo = document.getElementById("infoResumo");
    const info = document.getElementById("infoEstrutura");
    const p = document.querySelectorAll(".titulo-info");

    // Esconde detalhes
    header.style.display = "none";
    preview.style.display = "none";
    btnCamera.style.display = "none";
    btnVoltar.style.display = "none";
    btnOuvir.style.display = "none";
    btnOuvirResumo.style.display = "none";
    infoResumo.style.display = "none";
    p.forEach(p => {
      p.style.display = "none";
    });

    // Mostra catálogo ORGANIZADO POR CAMADA
    info.innerHTML = "<h3>Estruturas disponíveis:</h3>";

    // Agrupar estruturas por camada USANDO O MAPA
    const estruturasPorCamada = {};

    estruturas.forEach(est => {
      const camada = mapaCamadas[est.modeloID] || "outras";
      if (!estruturasPorCamada[camada]) {
        estruturasPorCamada[camada] = [];
      }
      estruturasPorCamada[camada].push(est);
    });

    console.log("Estruturas agrupadas:", estruturasPorCamada);

    // Definir ordem e nomes amigáveis das camadas
    const configuracaoCamadas = [
      { valor: "ossea", nome: "🦴 Estruturas Ósseas" },
      { valor: "muscular", nome: "💪 Estruturas Musculares" },
      { valor: "orgaos", nome: "🫀 Órgãos Internos" },
      { valor: "epiderme", nome: "🧬 Sistema Tegumentar" }
    ];

    // Criar seções para cada camada
    configuracaoCamadas.forEach(config => {
      if (estruturasPorCamada[config.valor] && estruturasPorCamada[config.valor].length > 0) {
        // Criar subtítulo da camada
        const subtitulo = document.createElement("h4");
        subtitulo.textContent = config.nome;
        subtitulo.style.marginTop = "20px";
        subtitulo.style.marginBottom = "8px";
        subtitulo.style.color = "#2c3e50";
        subtitulo.style.fontWeight = "bold";
        subtitulo.style.borderBottom = "2px solid #3498db";
        subtitulo.style.paddingBottom = "5px";
        info.appendChild(subtitulo);

        // Criar lista para essa camada
        const lista = document.createElement("ul");
        lista.style.marginTop = "10px";
        lista.style.marginLeft = "20px";

        estruturasPorCamada[config.valor].forEach(est => {
          const item = document.createElement("li");
          item.textContent = est.nomeEstrutura;
          item.style.cursor = "pointer";
          item.style.padding = "5px";
          item.style.transition = "background-color 0.2s";

          // Efeito hover
          item.addEventListener("mouseenter", () => {
            item.style.backgroundColor = "#e8f4f8";
          });
          
          item.addEventListener("mouseleave", () => {
            item.style.backgroundColor = "transparent";
          });

          item.addEventListener("click", () => {
            mostrarDetalhesEstrutura(est);
          });

          lista.appendChild(item);
        });

        info.appendChild(lista);
      }
    });

  } catch (err) {
    console.error("Erro ao carregar estruturas:", err);
  }
}

function mostrarDetalhesEstrutura(estrutura) {
  const header = document.querySelector(".card-header");
  const preview = document.getElementById("previewEstrutura");
  const btnVoltar = document.getElementById("voltarCatalogo");
  const btnCamera = document.getElementById("cameraEstrutura");
  const btnOuvir = document.getElementById("lerInfo");
  const btnOuvirResumo = document.getElementById("lerInfoResumo");
  const infoResumo = document.getElementById("infoResumo");
  const p = document.querySelectorAll(".titulo-info");

  atualizarCardbar(estrutura);

  header.style.display = "flex";
  preview.style.display = "block";
  btnCamera.style.display = "inline-block";
  btnVoltar.style.display = "inline-block";
  btnOuvir.style.display = "inline-block";
  btnOuvirResumo.style.display = "inline-block";
  infoResumo.style.display = "block";
  p.forEach(p => {
      p.style.display = "flex";
    });

  // Busca a posição pelo nome se não vier no objeto
  let pos = estrutura.position;
  if (!pos && estrutura.nomeEstrutura) {
    const achada = estruturasOsseas.find(e => e.nome.toLowerCase() === estrutura.nomeEstrutura.toLowerCase());
    if (achada) pos = achada.position;
  }
  // Remove event listener antigo para evitar duplicidade
  const novoBtnCamera = btnCamera.cloneNode(true);
  btnCamera.parentNode.replaceChild(novoBtnCamera, btnCamera);
  novoBtnCamera.addEventListener("click", () => {
    cameraEstrutura(pos);
  });

}


// Botão voltar
document.getElementById("voltarCatalogo").addEventListener("click", carregarEstruturasIniciais);

// Inicializa
document.addEventListener("DOMContentLoaded", carregarEstruturasIniciais);

const botoesConfigs = document.querySelectorAll("#botoesConfigs button");

botoesConfigs.forEach(botao => {
  botao.addEventListener("click", () => {
    botao.classList.toggle("active");
  })
})


let lendo = false; 

function toggleLeitura() {
  if (!lendo) {
    const texto = document.getElementById("infoEstrutura").innerText;
    const fala = new SpeechSynthesisUtterance(texto);
    fala.lang = "pt-BR";
    fala.rate = 1.5;
    fala.pitch = 2;

    fala.onend = () => { 
      lendo = false;
      document.getElementById("lerInfo").innerText = "🔊 Ouvir";
    };

    speechSynthesis.speak(fala);

    lendo = true;
    document.getElementById("lerInfo").innerText = "⏹️ Parar";

  } else {
    speechSynthesis.cancel(); 
    lendo = false;
    document.getElementById("lerInfo").innerText = "🔊 Ouvir";
  }
}
window.toggleLeitura = toggleLeitura;

const btnHolograma = document.getElementById("btnHolograma");
const janelaHolograma = document.getElementById("janelaHolograma");
const fecharHolograma = document.getElementById("fecharHolograma");

btnHolograma.addEventListener("click", () => {
  janelaHolograma.style.display = "block";
});

fecharHolograma.addEventListener("click", () => {
  janelaHolograma.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target === janelaHolograma) {
    janelaHolograma.style.display = "none";
  }
});
