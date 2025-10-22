import * as THREE from 'three';
import './scene.js';
import './loader.js';
import './mapaMarcadores.js';
import './fade.js'
import { configurarBotoesCamadas, getAnimalSelecionado, setCamadaAtiva, getCamadaAtiva, definirAnimalSelecionado, } from './loader.js';
import { atualizarCardbar, cameraEstrutura, estruturasOsseas } from './mapaMarcadores.js';
import { showNotification } from './notificacao.js';
import { getModeloAtualDaCamada } from './loader.js';
import { getEstruturaAtual } from './mapaMarcadores.js';
import { modeloIDPorAnimalECamada } from './estruturas.js'



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
    definirAnimalSelecionado(animal);
    botoesAnimais.forEach(el => el.classList.remove("active"));
    botao.classList.add("active");
    carregarEstruturasIniciais();
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
    const header = document.querySelector(".card-header");
    const preview = document.getElementById("previewEstrutura");
    const btnVoltar = document.getElementById("voltarCatalogo");
    const btnCamera = document.getElementById("cameraEstrutura");
    const btnOuvir = document.getElementById("lerInfo");
    const btnOuvirResumo = document.getElementById("lerInfoResumo");
    const info = document.getElementById("infoEstrutura");
    const infoResumo = document.getElementById("infoResumo");
    
    const p = document.querySelectorAll(".titulo-info");

    
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

    const nomeAnimal = getAnimalSelecionado();
    if (!nomeAnimal) {
      info.innerHTML = `
        <div style="text-align: center; padding: 40px 20px;">
          <h3 style="color: #f50b26ff; margin-bottom: 15px;">Nenhum animal selecionado</h3>
          <p style="color: #6b7280; font-size: 16px;">
            Por favor, escolha um animal na barra lateral para visualizar as estruturas disponíveis.
          </p>
        </div>
      `;
      return;
    }
    
    const animalID = mapaAnimais[nomeAnimal];
    if (!animalID) {
      console.warn("animal não mapeado:", nomeAnimal);
      return;
    }

    const response = await fetch(`/estruturas/animal/${animalID}`);
    const data = await response.json();
    const estruturas = data.dados;

    
    const responseModelos = await fetch("/modelo3d"); // ou a rota que retorna os modelos
    const dataModelos = await responseModelos.json();
    const modelos = dataModelos.dados;

    
    const mapaCamadas = {};
    modelos.forEach(modelo => {
      mapaCamadas[modelo.idModelo3D] = modelo.camada;
    });

    console.log("Mapa de camadas:", mapaCamadas);


    info.innerHTML = "<h3>Estruturas disponíveis:</h3>";

    const estruturasPorCamada = {};

    estruturas.forEach(est => {
      const camada = mapaCamadas[est.modeloID] || "outras";
      if (!estruturasPorCamada[camada]) {
        estruturasPorCamada[camada] = [];
      }
      estruturasPorCamada[camada].push(est);
    });

    console.log("Estruturas agrupadas:", estruturasPorCamada);

    
    const configuracaoCamadas = [
      { valor: "ossea", nome: "🦴 Estruturas Ósseas" },
      { valor: "orgaos", nome: "🫀 Órgãos Internos" },
      { valor: "muscular", nome: "💪 Estruturas Musculares" },
    ];

    
    configuracaoCamadas.forEach(config => {
      if (estruturasPorCamada[config.valor] && estruturasPorCamada[config.valor].length > 0) {
        
        const subtitulo = document.createElement("h4");
        subtitulo.textContent = config.nome;
        subtitulo.style.marginTop = "20px";
        subtitulo.style.marginBottom = "8px";
        subtitulo.style.color = "#2c3e50";
        subtitulo.style.fontWeight = "bold";
        subtitulo.style.borderBottom = "2px solid #3498db";
        subtitulo.style.paddingBottom = "5px";
        info.appendChild(subtitulo);

        
        const lista = document.createElement("ul");
        lista.style.marginTop = "10px";
        lista.style.marginLeft = "20px";

        estruturasPorCamada[config.valor].forEach(est => {
          const item = document.createElement("li");
          item.textContent = est.nomeEstrutura;
          item.style.cursor = "pointer";
          item.style.padding = "5px";
          item.style.transition = "background-color 0.2s";

          
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
  const infoResumo = document.getElementById("infoResumo");
  const p = document.querySelectorAll(".titulo-info");

  atualizarCardbar(estrutura);

  header.style.display = "flex";
  preview.style.display = "block";
  btnCamera.style.display = "inline-block";
  btnVoltar.style.display = "inline-block";
  infoResumo.style.display = "block";
  p.forEach(p => p.style.display = "flex");

  let pos = estrutura.position;
  if (!pos && estrutura.nomeEstrutura) {
    const achada = estruturasOsseas.find(e => e.nome.toLowerCase() === estrutura.nomeEstrutura.toLowerCase());
    if (achada) pos = achada.position;
  }

  const novoBtnCamera = btnCamera.cloneNode(true);
  btnCamera.parentNode.replaceChild(novoBtnCamera, btnCamera);

  novoBtnCamera.addEventListener("click", () => {
    const camadaAtiva = getCamadaAtiva();
    const animalAtual = getAnimalSelecionado();

    if (!camadaAtiva || !animalAtual) {
      showNotification("warning", "Carregue um modelo antes de visualizar a estrutura.");
      return;
    }

    const modeloAtivo = modeloIDPorAnimalECamada[animalAtual]?.[camadaAtiva];
    const modeloDaEstrutura = estrutura.modeloID;

    if (modeloAtivo !== modeloDaEstrutura) {
      showNotification(
        "erro",
        `O modelo ativo (${camadaAtiva}) não corresponde à camada da estrutura selecionada.`
      );
      return;
    }

    cameraEstrutura(pos);
  });
}



document.getElementById("voltarCatalogo").addEventListener("click", carregarEstruturasIniciais);


document.addEventListener("DOMContentLoaded", carregarEstruturasIniciais);

const botoesConfigs = document.querySelectorAll("#botoesConfigs button");

botoesConfigs.forEach(botao => {
  if (botao.id === "mapaMarcadores" || botao.id === "resetView") return; 

  botao.addEventListener("click", () => {
    botao.classList.toggle("active");
  });
});


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
