import * as THREE from 'three';
import { getAnimalSelecionado, modeloEpiderme, modeloMuscular, modeloOrgaos, modeloOssea } from './loader.js';
import { scene, camera, renderer, controls} from "./scene.js";
import { getCamadaAtiva, getModeloAtualDaCamada, getTodosModelos } from './loader.js';

// Base de dados de estruturas por animal
const estruturasPorAnimal = {
  "Cachorro": {
    ossea: [
      { nome: "Costela", position: new THREE.Vector3(0.29, 0.01, -0.00) },
      { nome: "Vértebra Caudal", position: new THREE.Vector3(0.02, -0.20, -1.60) },
      { nome: "Crânio", position: new THREE.Vector3(0.18, 0.79, 1.18) },
      { nome: "Mandíbula", position: new THREE.Vector3(0.13, 0.48, 1.42) },
      { nome: "Escápula", position: new THREE.Vector3(0.23, 0.17, 0.47) },
      { nome: "Úmero", position: new THREE.Vector3(0.36, -0.28, 0.64) },
      { nome: "Rádio", position: new THREE.Vector3(0.31, -0.81, 0.40) },
      { nome: "Ulna", position: new THREE.Vector3(0.35, -0.82, 0.35) },
      { nome: "Carpo", position: new THREE.Vector3(0.30, -1.28, 0.42) },
      { nome: "MetaCarpo", position: new THREE.Vector3(0.38, -1.40, 0.45) },
      { nome: "Falange", position: new THREE.Vector3(0.37, -1.47, 0.53) },
      { nome: "Vértebra cervical", position: new THREE.Vector3(0.04, 0.47, 0.92) },
      { nome: "Vértebra Torácica", position: new THREE.Vector3(0.02, 0.34, 0.20) },
      { nome: "Vértebra Lombar", position: new THREE.Vector3(0.01, 0.26, -0.59) },
      { nome: "Tíbia", position: new THREE.Vector3(0.34, -0.74, -1.29) },
      { nome: "Ílio", position: new THREE.Vector3(0.13, 0.19, -0.99) },
      { nome: "Ísquio", position: new THREE.Vector3(0.18, 0.03, -1.20) },
      { nome: "Sacro", position: new THREE.Vector3(0.02, 0.24, -1.11) },
      { nome: "Fêmur", position: new THREE.Vector3(0.32, -0.26, -1.21) },
      { nome: "Patela", position: new THREE.Vector3(0.38, -0.60, -1.16) },
      { nome: "Tarso", position: new THREE.Vector3(0.37, -1.05, -1.62) },
      { nome: "MetaTarso", position: new THREE.Vector3(0.36, -1.23, -1.59) },
    ],
    orgaos: [],
    muscular: [],
    epiderme: []
  },
  "Gato": {
    ossea: [
    ],
    orgaos: [],
    muscular: [],
    epiderme: []
  },
  "Vaca": {
    ossea: [
      { nome: "Costela", position: new THREE.Vector3(0.40, 0.51, -0.13) },
      { nome: "Vértebra Caudal", position: new THREE.Vector3(0.02, 0.76, -1.77) },
      { nome: "Crânio", position: new THREE.Vector3(0.15, 0.87, 1.62) },
      { nome: "Mandíbula", position: new THREE.Vector3(0.17, 0.56, 1.45) },
      { nome: "Escápula", position: new THREE.Vector3(0.24, 0.83, 0.34) },
      { nome: "Úmero", position: new THREE.Vector3(0.37, 0.27, 0.36) },
      { nome: "Rádio", position: new THREE.Vector3(0.39, -0.05, 0.33) },
      { nome: "Ulna", position: new THREE.Vector3(0.40, 0.10, 0.25) },
      { nome: "Carpo", position: new THREE.Vector3(0.37, -0.28, 0.34) },
      { nome: "MetaCarpo", position: new THREE.Vector3(0.31, -0.48, 0.31) },
      { nome: "Falanges", position: new THREE.Vector3(0.34, -0.82, 0.38) },
      { nome: "Vértebras cervicais", position: new THREE.Vector3(0.09, 0.75, 0.90) },
      { nome: "Vértebras torácicas", position: new THREE.Vector3(0.02, 0.95, -0.03) },
      { nome: "Vértebras lombares", position: new THREE.Vector3(0.02, 0.95, -0.54) },
      { nome: "Tíbia", position: new THREE.Vector3(0.32, 0.07, -0.99) },
      { nome: "Vértebras sacrais", position: new THREE.Vector3(0.03, 0.89, -1.12) },
      { nome: "Fêmur", position: new THREE.Vector3(0.32, 0.54, -1.07) },
      { nome: "Patela", position: new THREE.Vector3(0.39, 0.36, -0.87) },
      { nome: "Tarso", position: new THREE.Vector3(0.38, -0.13, -1.09) },
      { nome: "MetaTarso", position: new THREE.Vector3(0.37, -0.41, -1.08) }
    ],
    orgaos: [],
    muscular: [],
    epiderme: []
  },
  "Cavalo": {
    ossea: [
      { nome: "Costela", position: new THREE.Vector3(0.43, 0.20, -0.14) },
      { nome: "Vértebra Caudal", position: new THREE.Vector3(0.03, 0.53, -1.73) },
      { nome: "Crânio", position: new THREE.Vector3(0.12, 1.31, 1.52) },
      { nome: "Mandíbula", position: new THREE.Vector3(0.08, 0.84, 1.67) },
      { nome: "Escápula", position: new THREE.Vector3(0.20, 0.58, 0.32) },
      { nome: "Úmero", position: new THREE.Vector3(0.35, 0.08, 0.62) },
      { nome: "Rádio", position: new THREE.Vector3(0.30, -0.42, 0.42) },
      { nome: "Ulna", position: new THREE.Vector3(0.28, -0.54, 0.48) },
      { nome: "Carpo", position: new THREE.Vector3(0.28, -0.86, 0.47) },
      { nome: "MetaCarpo", position: new THREE.Vector3(0.23, -1.10, 0.43) },
      { nome: "Falanges", position: new THREE.Vector3(0.24, -1.36, 0.51) },
      { nome: "Vértebras cervicais", position: new THREE.Vector3(0.03, 0.88, 0.81) },
      { nome: "Vértebras torácicas", position: new THREE.Vector3(0.02, 0.64, -0.09) },
      { nome: "Vértebras lombares", position: new THREE.Vector3(0.01, 0.73, -0.81) },
      { nome: "Pelve", position: new THREE.Vector3(0.23, 0.50, -1.16) },
      { nome: "Tíbia", position: new THREE.Vector3(0.24, -0.34, -1.35) },
      { nome: "Fíbula", position: new THREE.Vector3(0.27, -0.32, -1.42) },
      { nome: "Vértebras sacrais", position: new THREE.Vector3(0.02, 0.73, -1.21) },
      { nome: "Fêmur", position: new THREE.Vector3(0.27, 0.08, -1.30) },
      { nome: "Patela", position: new THREE.Vector3(0.32, -0.15, -1.24) },
      { nome: "Tarso", position: new THREE.Vector3(0.27, -0.73, -1.69) },
      { nome: "MetaTarso", position: new THREE.Vector3(0.22, -1.04, -1.72) },
      { nome: "Falanges", position: new THREE.Vector3(0.23, -1.34, -1.64) }
    ],
    orgaos: [],
    muscular: [],
    epiderme: []
  },
  "Peixe": {
    ossea: [
      { nome: "Órbita", position: new THREE.Vector3(-0.09, 0.02, 1.61) },
      { nome: "Opérculo", position: new THREE.Vector3(0.19, 0.05, 1.33) },
      { nome: "Mandíbula", position: new THREE.Vector3(0.08, -0.11, 1.76) }, 
      { nome: "Occipital", position: new THREE.Vector3(0.10, 0.29, 1.18) },
      { nome: "Frontal", position: new THREE.Vector3(0.11, 0.23, 1.40) },
      { nome: "Escápula", position: new THREE.Vector3(0.11, -0.21, 1.12) },
      { nome: "Clavícula", position: new THREE.Vector3(0.18, -0.00, 1.14) },
      { nome: "Costela", position: new THREE.Vector3(0.13, 0.04, 0.05) },
      { nome: "Vértebra", position: new THREE.Vector3(0.05, 0.24, -0.12) },
      { nome: "Nadadeira Peitoral", position: new THREE.Vector3(0.09, -0.25, 0.80) },
      { nome: "Nadadeira Dorsal", position: new THREE.Vector3(0.01, 0.59, 0.19) },
      { nome: "Nadadeira Ventral", position: new THREE.Vector3(0.15, -0.38, -0.12) },
      { nome: "Nadadeira Anal", position: new THREE.Vector3(0.02, -0.21, -0.94) },
      { nome: "Nadadeira caudal", position: new THREE.Vector3(0.04, 0.30, -1.73) },
    ],
    orgaos: [],
    muscular: [],
    epiderme: []
  },
  "Rato": {
    ossea: [
      { nome: "Costela", position: new THREE.Vector3(0.27, 0.14, 0.65) },
      { nome: "Vértebras Caudais", position: new THREE.Vector3(0.02, -0.13, -0.95) },
      { nome: "Crânio", position: new THREE.Vector3(0.17, 0.58, 1.46) },
      { nome: "Mandíbula", position: new THREE.Vector3(0.11, 0.26, 1.57) },
      { nome: "Escápula", position: new THREE.Vector3(0.20, 0.26, 0.87) },
      { nome: "Úmero", position: new THREE.Vector3(0.35, -0.10, 0.90) },
      { nome: "Rádio", position: new THREE.Vector3(0.42, -0.20, 0.76) },
      { nome: "Ulna", position: new THREE.Vector3(0.43, -0.28, 0.85) },
      { nome: "Carpo", position: new THREE.Vector3(0.46, -0.42, 0.93) },
      { nome: "MetaCarpo", position: new THREE.Vector3(0.48, -0.45, 0.99) },
      { nome: "Falanges", position: new THREE.Vector3(0.57, -0.47, 1.16) },
      { nome: "Vértebras cervicais", position: new THREE.Vector3(0.06, 0.34, 1.11) },
      { nome: "Vértebras torácicas", position: new THREE.Vector3(0.01, 0.39, 0.66) },
      { nome: "Vértebras lombares", position: new THREE.Vector3(0.02, 0.48, 0.15) },
      { nome: "Pelve", position: new THREE.Vector3(0.14, 0.14, -0.43) },
      { nome: "Púbis", position: new THREE.Vector3(0.22, -0.06, -0.61) },
      { nome: "Fêmur", position: new THREE.Vector3(0.24, -0.01, -0.43) },
      { nome: "Patela", position: new THREE.Vector3(0.37, 0.05, -0.25) },
      { nome: "Tíbia", position: new THREE.Vector3(0.36, -0.16, -0.43) },
      { nome: "Tarso", position: new THREE.Vector3(0.34, -0.40, -0.68) },
      { nome: "MetaTarso", position: new THREE.Vector3(0.37, -0.44, -0.57) },
      { nome: "Falanges", position: new THREE.Vector3(0.43, -0.47, -0.43) }],
    orgaos: [],
    muscular: [],
    epiderme: []
  },
  "Papagaio": {
    ossea: [
      { nome: "Órbita", position: new THREE.Vector3(0.05, 1.84, 1.04) },
      { nome: "Crânio", position: new THREE.Vector3(0.19, 1.90, 0.73) },
      { nome: "Vértebras cervicais", position: new THREE.Vector3(0.11, 0.94, 0.81) },
      { nome: "Quilha do esterno", position: new THREE.Vector3(0.17, -0.48, -0.03) },
      { nome: "Esterno", position: new THREE.Vector3(0.36, -0.15, -0.15) },
      { nome: "Úmero", position: new THREE.Vector3(0.71, 0.40, 0.09) },
      { nome: "Cúbito", position: new THREE.Vector3(0.96, 0.22, 0.21) },
      { nome: "Rádio", position: new THREE.Vector3(1.11, 0.08, 0.26) },
      { nome: "Tíbia-tarso", position: new THREE.Vector3(0.76, -0.69, -0.90) },
      { nome: "Tarso-metatarso", position: new THREE.Vector3(0.86, -1.09, -0.78) },
      { nome: "Fêmur", position: new THREE.Vector3(0.61, -0.04, -0.46) },
      { nome: "Pelve", position: new THREE.Vector3(0.34, 0.05, -0.82) },
      { nome: "Sinsacro", position: new THREE.Vector3(0.01, -0.04, -1.06) },
      { nome: "Pigóstilo", position: new THREE.Vector3(0.06, -0.56, -1.74) },
      { nome: "Vértebras caudais", position: new THREE.Vector3(0.04, -0.48, -1.48) },
      { nome: "Vértebras torácicas", position: new THREE.Vector3(0.05, 0.61, -0.08) },
      { nome: "Escápula", position: new THREE.Vector3(0.45, 0.42, 0.30) },
      { nome: "Coracoide", position: new THREE.Vector3(0.53, 0.25, -0.05) },
      { nome: "Costelas", position: new THREE.Vector3(0.36, -0.15, -0.15) }
    ],
    orgaos: [],
    muscular: [],
    epiderme: []
  },
  "Tubarão": {
    ossea: [],
    orgaos: [],
    muscular: [],
    epiderme: []
  }
};


export const estruturasOsseas = estruturasPorAnimal["Cachorro"].ossea;
export const estruturasOrgaos = [];
export const estruturasMusculares = [];

function getEstruturaAtual() {
  const animal = getAnimalSelecionado();
  const camada = getCamadaAtiva();
  
  if (!animal || !camada) {
    console.warn("Animal ou camada não definidos:", { animal, camada });
    return [];
  }
  
  const estruturas = estruturasPorAnimal[animal]?.[camada] || [];
  console.log(`Estruturas encontradas para ${animal} - ${camada}:`, estruturas.length);
  return estruturas;
}

const modeloIDPorAnimalECamada = {
  Cachorro: {
    ossea: 1,
    orgaos: 2,
    muscular: 3,
    epiderme: 4
  },
  Vaca: {
    epiderme: 5,
    ossea: 6
  },
  Cavalo: {
    epiderme: 7,
    ossea: 8
  },
  Peixe: {
    epiderme: 9,
    ossea: 10
  },
  Rato: {
    epiderme: 11
  },
  Papagaio: {
    epiderme: 13,
    ossea: 14
  },
  Tubarão: {
    epiderme: 15
  }
};

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

const mapaMarcadores = document.getElementById('mapaMarcadores');
let marcadoresAtivos = false;
let ultimaPosicaoFoco = null;


const marcadoresPorAnimalCamada = {};

function getMarcadoresAtuais() {
  const animal = getAnimalSelecionado();
  const camada = getCamadaAtiva();
  
  if (!animal || !camada) return [];
  
  const chave = `${animal}_${camada}`;
  if (!marcadoresPorAnimalCamada[chave]) {
    marcadoresPorAnimalCamada[chave] = [];
  }
  
  return marcadoresPorAnimalCamada[chave];
}

mapaMarcadores.addEventListener("click", () => {
  const camadaAtiva = getCamadaAtiva();
  const modeloAtual = getModeloAtualDaCamada();
  const animalAtual = getAnimalSelecionado();

  console.log("marcadoresAtivos:", marcadoresAtivos);
  console.log("Animal atual:", animalAtual);
  console.log("Camada ativa:", camadaAtiva);

  if (!camadaAtiva || !modeloAtual || !animalAtual) {
    alert("Carregue um modelo primeiro para adicionar marcadores.");
    return;
  }

  const marcadoresAtuais = getMarcadoresAtuais();

  if (marcadoresAtuais.length > 0) {
    removerMarcadoresAtuais();
    return;
  }

  const estruturas = getEstruturaAtual();
  
  if (estruturas.length === 0) {
    alert(`Nenhuma estrutura cadastrada para ${animalAtual} na camada ${camadaAtiva}`);
    return;
  }

  estruturas.forEach(estrutura => {
    adicionarMarcador(estrutura.position, estrutura.nome, animalAtual, camadaAtiva);
  });

  marcadoresAtivos = true;
});



function adicionarMarcador(posicao, nome, animal, camada) {
  const esfera = new THREE.Mesh(
    new THREE.SphereGeometry(0.025, 5, 5),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
  );
  esfera.position.copy(posicao);
  esfera.renderOrder = 1000; 
  esfera.userData.camada = camada;
  esfera.userData.animal = animal;
  esfera.userData.nome = nome;
  scene.add(esfera);
  
  const marcadoresAtuais = getMarcadoresAtuais();
  marcadoresAtuais.push(esfera);
}



function removerMarcadoresAtuais() {
  const marcadoresAtuais = getMarcadoresAtuais();
  marcadoresAtuais.forEach(obj => scene.remove(obj));
  marcadoresAtuais.length = 0;
  marcadoresAtivos = false;
}

export function removerTodosMarcadores() {
  Object.values(marcadoresPorAnimalCamada).forEach(lista => {
    lista.forEach(obj => scene.remove(obj));
    lista.length = 0;
  });
  marcadoresAtivos = false;
}


export function limparMarcadoresAoTrocarAnimal() {
  removerTodosMarcadores();
  marcadoresAtivos = false;
}


window.addEventListener('click', (event) => {
  const rect = renderer.domElement.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(scene.children, true);
  if (intersects.length > 0) {
    const pos = intersects[0].point;
    console.log(`Posição clicada: ${pos.x.toFixed(2)}, ${pos.y.toFixed(2)}, ${pos.z.toFixed(2)}`);
  }
});

async function onClick(event) {
  const rect = renderer.domElement.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  
  const marcadoresAtuais = getMarcadoresAtuais();
  const intersects = raycaster.intersectObjects(marcadoresAtuais, true);

  if (intersects.length > 0) {
    const marcador = intersects[0].object;
    ultimaPosicaoFoco = marcador.position.clone();
    const nome = marcador.userData.nome;
    const animal = marcador.userData.animal;

    try {
      const response = await fetch(`/estruturas?animal=${animal}`);
      const data = await response.json();

      const camada = getCamadaAtiva();

      if (!animal || !camada) return;

      const modeloID = modeloIDPorAnimalECamada[animal][camada];

      const estrutura = data.dados.find(item =>
        item.nomeEstrutura.toLowerCase() === nome.toLowerCase() &&
        item.modeloID === modeloID
      );

      if (estrutura) {
        atualizarCardbar(estrutura);
        const btnCamera = document.getElementById("cameraEstrutura");
        const novoBtnCamera = btnCamera.cloneNode(true);
        btnCamera.parentNode.replaceChild(novoBtnCamera, btnCamera);
        novoBtnCamera.addEventListener("click", () => {
          cameraEstrutura(marcador.position);
        });
      } else {
        console.warn("Estrutura não encontrada para:", nome);
      }
    } catch (error) {
      console.error('Erro ao buscar info da estrutura:', error);
    }
    return;
  }
}

const tooltip = document.getElementById('tooltip');

window.addEventListener('mousemove', (event) => {
  const rect = renderer.domElement.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const marcadoresAtuais = getMarcadoresAtuais();
  const intersects = raycaster.intersectObjects(marcadoresAtuais, true);

  if (intersects.length > 0) {
    const marcador = intersects[0].object;
    const nome = marcador.userData.nome;

    tooltip.style.display = 'block';
    tooltip.textContent = nome;
    tooltip.style.left = event.clientX + 10 + 'px';
    tooltip.style.top = event.clientY + 10 + 'px';
  } else {
    tooltip.style.display = 'none';
  }
});

document.getElementById("cameraEstrutura").addEventListener("click", () => {
    cameraEstrutura();
})  

export function cameraEstrutura(posicaoOuNome) {
  let foco = null;
  if (posicaoOuNome && typeof posicaoOuNome.x === 'number') {
    foco = posicaoOuNome;
  } else if (typeof posicaoOuNome === 'string') {
    const estruturas = getEstruturaAtual();
    const achada = estruturas.find(e => e.nome.toLowerCase() === posicaoOuNome.toLowerCase());
    if (achada) foco = achada.position;
  } else if (ultimaPosicaoFoco) {
    foco = ultimaPosicaoFoco;
  }
  if (!foco) return;

  const direcao = foco.clone().sub(camera.position).normalize();
  const distanciaDesejada = 0.005;
  const novaPosicaoCamera = foco.clone().sub(direcao.multiplyScalar(distanciaDesejada));

  gsap.to(camera.position, {
    duration: 1.5,
    x: novaPosicaoCamera.x,
    y: novaPosicaoCamera.y,
    z: novaPosicaoCamera.z,
    onUpdate: () => {
      camera.lookAt(foco);
      controls.target.copy(foco);
      controls.update();
    }
  });
}




export function atualizarCardbar(data) {
  const cardbar = document.getElementById('cardbar');
  console.log(data)
  cardbar.querySelector('#nomeEstrutura').textContent = data.nomeEstrutura || 'Título não disponível';

  const info = cardbar.querySelector('#infoEstrutura');
  info.textContent = data.descricao || 'Descrição não disponível';
  
  const infoResumo = cardbar.querySelector('#infoResumo');
  infoResumo.textContent = data.descricao_resumo || 'Descrição não disponível';
  
  const header = cardbar.querySelector(".card-header");
  const preview = cardbar.querySelector("#previewEstrutura");
  const btnVoltar = cardbar.querySelector("#voltarCatalogo");
  const btnCamera = cardbar.querySelector("#cameraEstrutura");
  const p = document.querySelectorAll(".titulo-info");
  
  infoResumo.style.display = "block";
  header.style.display = "flex";
  preview.style.display = "block";
  btnCamera.style.display = "inline-block";
  btnVoltar.style.display = "inline-block";
  p.forEach(p => {
    p.style.display = "flex";
  });
}

window.addEventListener('click', onClick);