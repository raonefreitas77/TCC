import * as THREE from 'three';
import { getAnimalSelecionado, modeloEpiderme, modeloMuscular, modeloOrgaos, modeloOssea } from './loader.js';
import { scene, camera, renderer, controls} from "./scene.js";
import { getCamadaAtiva, getModeloAtualDaCamada, getTodosModelos } from './loader.js';
import { showNotification } from './notificacao.js';
import { estruturasPorAnimal } from './estruturas.js';
import { modeloIDPorAnimalECamada } from './estruturas.js';
import { getSexoSelecionado } from './loader.js';


export const estruturasOsseas = estruturasPorAnimal["Cachorro"].ossea;
export const estruturasOrgaos = [];
export const estruturasMusculares = [];

export function getEstruturaAtual() {
  const animal = getAnimalSelecionado();
  const camada = getCamadaAtiva();
  
  if (!animal || !camada) {
    console.warn("Animal ou camada não definidos:", { animal, camada });
    return [];
  }

  if (camada === 'orgaos') {
    const sexo = getSexoSelecionado();
    const camadaComSexo = sexo === 'F' ? 'orgaosF' : 'orgaos';
    return estruturasPorAnimal[animal]?.[camadaComSexo] || [];
  }
  
  const estruturas = estruturasPorAnimal[animal]?.[camada] || [];
  console.log(`Estruturas encontradas para ${animal} - ${camada}:`, estruturas.length);
  return estruturas;
}

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


  if (!camadaAtiva || !modeloAtual || !animalAtual) {
    showNotification('erro', 'Carregue um modelo primeiro para adicionar marcadores.');
    return;
  }

  const marcadoresAtuais = getMarcadoresAtuais();

  if (marcadoresAtuais.length > 0) {
    removerMarcadoresAtuais();
    mapaMarcadores.classList.remove('active');
    return;
  }

  const estruturas = getEstruturaAtual();
  if (estruturas.length === 0) {
    showNotification('warning', `Nenhuma estrutura cadastrada para ${animalAtual} na camada ${camadaAtiva}`);
    return;
  }

  estruturas.forEach(estrutura => {
    adicionarMarcador(estrutura.position, estrutura.nome, animalAtual, camadaAtiva);
  });

  marcadoresAtivos = true;
  mapaMarcadores.classList.add('active');
});




function adicionarMarcador(posicao, nome, animal, camada) {
  const esfera = new THREE.Mesh(
    new THREE.SphereGeometry(0.025, 5, 5),
    new THREE.MeshBasicMaterial({ color: 0xffff00 })
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


export function atualizarEstruturasOrgaosPorSexo() {
  removerTodosMarcadores();

  if (getCamadaAtiva() !== 'orgaos') return;

  const estruturas = getEstruturaAtual();
  const animal = getAnimalSelecionado();

  if (!estruturas || estruturas.length === 0) return;

  estruturas.forEach(estrutura => {
    adicionarMarcador(estrutura.position, estrutura.nome, animal, 'orgaos');
  });
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
      console.log("animal e camada:", animal, camada);
      const modeloID = modeloIDPorAnimalECamada[animal][camada];
      console.log(modeloID)
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
          const camadaAtiva = getCamadaAtiva(); // já existe no seu sistema
          const modeloAtivo = modeloIDPorAnimalECamada[animal][camadaAtiva];

          if (estrutura.modeloID !== modeloAtivo) {
            showNotification("error", "O modelo atual não corresponde a esta estrutura");
            return;
          }
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
  const distanciaDesejada = 0.03;
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




export async function atualizarCardbar(data) {
  const cardbar = document.getElementById('cardbar');
  console.log(data)
  cardbar.querySelector('#nomeEstrutura').textContent = data.nomeEstrutura || 'Título não disponível';

  const info = cardbar.querySelector('#infoEstrutura');
  info.textContent = data.descricao || 'Descrição não disponível';
  
  const infoResumo = cardbar.querySelector('#infoResumo');
  infoResumo.textContent = data.descricao_resumo || 'Descrição não disponível';
  
  try {
    const responseModelos = await fetch("/modelo3d");
    const dataModelos = await responseModelos.json();
    const modelos = dataModelos.dados;
    
    const modeloEncontrado = modelos.find(m => m.idModelo3D === data.modeloID);
    
    if (modeloEncontrado) {
      const iconeCamada = cardbar.querySelector('.iconeCamada');
      const emojisPorCamada = {
        "ossea": "🦴",
        "muscular": "💪",
        "orgaos": "🫀",
        "epiderme": "🧬"
      };
      
      iconeCamada.textContent = emojisPorCamada[modeloEncontrado.camada] || "🦴";
    }
  } catch (error) {
    console.error("Erro ao buscar camada do modelo:", error);
  }
  
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

  if (!cardbar.classList.contains('open')) {
    cardbar.classList.add('open');
  }
}

window.addEventListener('click', onClick);