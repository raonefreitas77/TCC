import { camadaAtiva } from './modelos.js';
import * as THREE from 'three';
import { modeloEpiderme, modeloMuscular, modeloOrgaos, modeloOssea } from './modelos.js';
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
import { scene, camera, renderer, renderPreview } from "./scene.js";

const mapaMarcadores = document.getElementById('mapaMarcadores');
let marcadoresAtivos = false;
const marcadoresPorCamada = {
  ossea: [],
  muscular: [],
  orgaos: [],
  epiderme: []
};

mapaMarcadores.addEventListener("click", () => {
  console.log(marcadoresAtivos)

  if (!modeloEpiderme && !modeloMuscular && !modeloOrgaos && !modeloOssea) {
    alert("Nenhum modelo carregado.");
    return;
  }

  const marcadoresDaCamada = camadaAtiva ? marcadoresPorCamada[camadaAtiva] : [];


  if (marcadoresDaCamada.length > 0 || marcadoresAtivos) {
    removerTodosMarcadores();
    return;
  }
  

  if (!marcadoresAtivos) {
    let estruturas = []


    if (camadaAtiva == "ossea") {
       estruturas = [
        { nome: "Costela", position: new THREE.Vector3(0.39, 0.33, -0.04), camada: "ossea" },
        { nome: "Vértebra Caudal", position: new THREE.Vector3(0.01, 0.92, -1.90), camada: "ossea" },
        { nome: "Crânio", position: new THREE.Vector3(0.12, 1.05, 1.67), camada: "ossea" }
      ]
    }


    estruturas.forEach(estruturas => {
      adicionarMarcador(estruturas.position, estruturas.nome, estruturas.camada);
    });

    marcadoresAtivos = true;
  } else {
    removerTodosMarcadores()
  }
});


function adicionarMarcador(posicao, nome, camada) {
  // Criar a esfera
  const esfera = new THREE.Mesh(
    new THREE.SphereGeometry(0.03, 16, 16),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
  );
  esfera.position.copy(posicao);
  esfera.renderOrder = 1000; 
  esfera.userData.camada = camada
  esfera.userData.nome = nome;
  scene.add(esfera);
  marcadoresPorCamada[camada].push(esfera);
}


export function removerTodosMarcadores() {
  Object.values(marcadoresPorCamada).forEach(lista => {
    lista.forEach(obj => scene.remove(obj));
    lista.length = 0;
  });
  marcadoresAtivos = false;
}



//raycaster


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

  const marcadoresDaCamada = camadaAtiva ? marcadoresPorCamada[camadaAtiva] : [];
  const intersects = raycaster.intersectObjects(marcadoresDaCamada, true);

  if (intersects.length > 0) {
    const marcador = intersects[0].object;

    const nome = marcador.userData.nome;

    try {
      const response = await fetch("/estruturas");
      const data = await response.json();
      const estrutura = data.dados.find(item => item.nomeEstrutura.toLowerCase() === nome.toLowerCase());

      if (estrutura) {
        atualizarCardbar(estrutura);
      } else {
        console.warn("Estrutura não encontrada para:", nome);
      }
    } catch (error) {
      console.error('Erro ao buscar info da estrutura:', error);
    }
    return; // impede que vá pro modelo se já achou marcador
  }
}

const tooltip = document.getElementById('tooltip');

window.addEventListener('mousemove', (event) => {
  const rect = renderer.domElement.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const marcadoresDaCamada = camadaAtiva ? marcadoresPorCamada[camadaAtiva] : [];
  const intersects = raycaster.intersectObjects(marcadoresDaCamada, true);

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




function atualizarCardbar(data) {
  const cardbar = document.getElementById('cardbar');
  console.log(data)
  cardbar.querySelector('#nomeEstrutura').textContent = data.nomeEstrutura || 'Título não disponível';

  const info = cardbar.querySelector('#infoEstrutura');
  info.textContent = data.descricao || 'Descrição não disponível';
}

window.addEventListener('click', onClick);