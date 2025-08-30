import * as THREE from 'three';
import './scene.js';
import './modelos.js';
import './mapaMarcadores.js';
import './fade.js'
import { configurarBotoesCamadas, getAnimalSelecionado, setCamadaAtiva, getCamadaAtiva, definirAnimalSelecionado, } from './modelos.js';
import { atualizarCardbar } from './mapaMarcadores.js';



// carregar o Modelo no ambiente 3D

document.getElementById('home').addEventListener('click', () => {
  window.location.href = 'home.html';
});


const mapaAnimais = {
  "Cachorro": 1,
  "Gato": 2,
  "Cavalo": 3,
  "Peixe" : 4
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

    const header = document.querySelector(".card-header");
    const preview = document.getElementById("previewEstrutura");
    const btnVoltar = document.getElementById("voltarCatalogo");
    const btnCamera = document.getElementById("cameraEstrutura");
    const info = document.getElementById("infoEstrutura");

    // Esconde detalhes
    header.style.display = "none";
    preview.style.display = "none";
    btnCamera.style.display = "none";
    btnVoltar.style.display = "none";

    // Mostra catálogo
    info.innerHTML = "<h3>Estruturas disponíveis:</h3>";
    const lista = document.createElement("ul");

    estruturas.forEach(est => {
      const item = document.createElement("li");
      item.textContent = est.nomeEstrutura;
      item.style.cursor = "pointer";

      // Clicou em um item -> vai para detalhes
      item.addEventListener("click", () => {
        mostrarDetalhesEstrutura(est);
      });

      lista.appendChild(item);
    });

    info.appendChild(lista);

  } catch (err) {
    console.error("Erro ao carregar estruturas:", err);
  }
}

function mostrarDetalhesEstrutura(estrutura) {
  const header = document.querySelector(".card-header");
  const preview = document.getElementById("previewEstrutura");
  const btnVoltar = document.getElementById("voltarCatalogo");
  const btnCamera = document.getElementById("cameraEstrutura");
  
  atualizarCardbar(estrutura);
  
  header.style.display = "flex"; // mudei para flex
  preview.style.display = "block";
  btnCamera.style.display = "inline-block";
  btnVoltar.style.display = "inline-block";
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

