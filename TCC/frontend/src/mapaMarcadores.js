import * as THREE from 'three';
import { modeloEpiderme, modeloMuscular, modeloOrgaos, modeloOssea } from './modelos.js';
import { scene, camera, renderer, controls} from "./scene.js";
import { getCamadaAtiva, getModeloAtualDaCamada, getTodosModelos } from './modelos.js';



const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

const mapaMarcadores = document.getElementById('mapaMarcadores');
let marcadoresAtivos = false;
let ultimaPosicaoFoco = null;
const marcadoresPorCamada = {
  ossea: [],
  muscular: [],
  orgaos: [],
  epiderme: []
};


mapaMarcadores.addEventListener("click", () => {
  const camadaAtiva = getCamadaAtiva();
  const modeloAtual = getModeloAtualDaCamada();
  const todosModelos = getTodosModelos();

  console.log("marcadoresAtivos:", marcadoresAtivos);
  console.log("Modelos:", todosModelos);
  console.log(`Modelo da camada ${camadaAtiva}:`, modeloAtual);

  if (!camadaAtiva || !modeloAtual) {
    alert("Carregue um modelo primeiro para adicionar marcadores.");
    return;
  }

  const marcadoresDaCamada = marcadoresPorCamada[camadaAtiva] || [];


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
        { nome: "Crânio", position: new THREE.Vector3(0.12, 1.05, 1.67), camada: "ossea" },
        { nome: "Mandíbula", position: new THREE.Vector3(0.14, 0.77, 1.60), camada: "ossea" },
        { nome: "Escápula", position: new THREE.Vector3(0.31, 0.51, 0.69), camada: "ossea" },
        { nome: "Úmero", position: new THREE.Vector3(0.36, -0.04, 0.77), camada: "ossea" },
        { nome: "Rádio", position: new THREE.Vector3(0.35, -0.65, 0.63), camada: "ossea" },
        { nome: "Ulna", position: new THREE.Vector3(0.35, -0.62, 0.55), camada: "ossea" },
        { nome: "Carpo", position: new THREE.Vector3(0.32, -1.08, 0.75), camada: "ossea" },
        { nome: "MetaCarpo", position: new THREE.Vector3(0.32, -1.24, 0.83), camada: "ossea" },
        { nome: "Falange", position: new THREE.Vector3(0.32, -1.27, 1.00), camada: "ossea" },
        { nome: "Vértebra cervical", position: new THREE.Vector3(0.03, 0.93, 0.92), camada: "ossea" },
        { nome: "Vértebra Torácica", position: new THREE.Vector3(0.03, 0.67, 0.28), camada: "ossea" },
        { nome: "Vértebra Lombar", position: new THREE.Vector3(0.03, 0.68, -0.57), camada: "ossea" },
        { nome: "Tíbia", position: new THREE.Vector3(0.34, -0.74, -1.29), camada: "ossea" }
        //{ nome: "", position: new THREE.Vector3(), camada: "ossea" },
      ]
    }


    estruturas.forEach(estruturas => {
      adicionarMarcador(estruturas.position, estruturas.nome, estruturas.camada);
    });
    
    console.log(ultimaPosicaoFoco)

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
  const camadaAtiva = getCamadaAtiva();

  const marcadoresDaCamada = camadaAtiva ? marcadoresPorCamada[camadaAtiva] : [];
  const intersects = raycaster.intersectObjects(marcadoresDaCamada, true);

  if (intersects.length > 0) {
    const marcador = intersects[0].object;
    ultimaPosicaoFoco = marcador.position.clone();
    console.log(ultimaPosicaoFoco)
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

  const camadaAtiva = getCamadaAtiva();

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


document.getElementById("cameraEstrutura").addEventListener("click", () => {
  if (!ultimaPosicaoFoco) return;

  const offset = new THREE.Vector3(0, 0.2, 0.5); 
  const novaPosicaoCamera = ultimaPosicaoFoco.clone().add(offset);

  // Anima suavemente:
  gsap.to(camera.position, {
    duration: 1.5,
    x: novaPosicaoCamera.x,
    y: novaPosicaoCamera.y,
    z: novaPosicaoCamera.z,
    onUpdate: () => {
      camera.lookAt(ultimaPosicaoFoco);
      controls.target.copy(ultimaPosicaoFoco);
      controls.update();
    }
  });
});




export function atualizarCardbar(data) {
  const cardbar = document.getElementById('cardbar');
  console.log(data)
  cardbar.querySelector('#nomeEstrutura').textContent = data.nomeEstrutura || 'Título não disponível';

  const info = cardbar.querySelector('#infoEstrutura');
  info.textContent = data.descricao || 'Descrição não disponível';
  

  const img = cardbar.querySelector('#imgCardbar')
  if (data.caminho_imagem) {
    img.src = data.caminho_imagem; 
    img.alt = data.nomeEstrutura || 'Imagem da estrutura';

  } else {
    img.src = '';
    img.alt = 'Imagem não disponível';
  }
  
  const header = cardbar.querySelector(".card-header");
  const preview = cardbar.querySelector("#previewEstrutura");
  const btnVoltar = cardbar.querySelector("#voltarCatalogo");
  const btnCamera = cardbar.querySelector("#cameraEstrutura");
  
  header.style.display = "flex";
  preview.style.display = "block";
  btnCamera.style.display = "inline-block";
  btnVoltar.style.display = "inline-block";
}

window.addEventListener('click', onClick);