import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import {scene, camera, renderer, renderPreview} from "./scene.js";
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();


const cardbar = document.getElementById('cardbar');
const toggleBtn = document.getElementById('toggleBtn');
const infoEstrutura = document.getElementById('infoEstrutura')

toggleBtn.addEventListener('click', () => {
  cardbar.classList.toggle('open');

      
  if (cardbar.classList.contains('open')) {
      toggleBtn.textContent = '❯';
  } else {
  toggleBtn.textContent = '❮';
  }
});




//Carregar o modelo 3D
let modeloAtual = null


async function carregarModelo(animalID, camada){
  try{
      const response = await fetch("/modelo3d")
      const data = await response.json()
      console.log(animalID)

      console.log("Dados recebidos da API:", data)

      if (!data.status || !Array.isArray(data.dados)) {
        console.error("Formato de resposta inválido")
        return
      }
      const modeloEncontrado = data.dados.find(modelo => modelo.animalID === animalID && modelo.camada === camada)
      console.log(modeloEncontrado)

      if (!modeloEncontrado) {
        console.error("Modelo não encontrado para o animalID:", animalID)
        return
      }

      const modeloCaminho = modeloEncontrado.caminho_arquivo

      console.log("Caminho do modelo:", modeloCaminho)
      
      if(!modeloCaminho){
        console.error("Caminho do modelo não encontrado")
        return
      }

      if (modeloAtual) {
        scene.remove(modeloAtual)
        modeloAtual.traverse((child) => {
          if (child.isMesh) {
            child.geometry.dispose()
            if (child.material.map) child.material.map.dispose()
            child.material.dispose()
          }
        })
        modeloAtual = null
      }

      const gltfLoader = new GLTFLoader()
      gltfLoader.load(
        modeloCaminho, 
        (gltf) => {
          const model = gltf.scene
          console.log(gltf.scene);
          console.log(gltf.scene.children);
          model.scale.set(2, 2, 2)
          model.position.set(0, 0, 0)

          model.traverse((child) => {
            if (child.isMesh) {
              child.material.side = THREE.DoubleSide
              child.material.needsUpdate = true;
              child.geometry.center()
              if (camada === "ossea") {
                child.material = new THREE.MeshStandardMaterial({ 
                color: 0xaaaaaa,
                transparent: true,
                opacity: 1
              });
              }
            }
          })
          console.log(modeloCaminho)
          scene.add(model)
          modeloAtual = model
          gltf.scene.traverse(obj => {
          console.log(`${obj.name} | ${obj.type}`);
          });

        },
        undefined,
        (error) => console.error("Erro ao carregar modelo:", error)
        
      )
  }catch(error){
      console.error("Erro ao buscar o modelo da API",error)
      
  }
}

const mapaAnimais = {
  "Cachorro": 1
}


// carregar o Modelo no ambiente 3D

let animalSelecionado = null


document.getElementById('previewAnimal').addEventListener("click", () => {
    animalSelecionado = "Cachorro";
})


document.getElementById('btnOssea').addEventListener("click", () => {
    if(!animalSelecionado){
        alert("Selecione um animal")
        return
    }
    const idAnimal = mapaAnimais[animalSelecionado]
    carregarModelo(idAnimal,"ossea")
})

document.getElementById('btnOrgaos').addEventListener("click", () => {
  if(!animalSelecionado){
      alert("Selecione um animal")
      return
  }
  const idAnimal = mapaAnimais[animalSelecionado]
  carregarModelo(idAnimal,"orgaos")
})

document.getElementById('btnEpiderme').addEventListener("click", () => {
  if(!animalSelecionado){
      alert("Selecione um animal")
      return
  }
  const idAnimal = mapaAnimais[animalSelecionado]
  carregarModelo(idAnimal,"epiderme")
})

document.getElementById('btnMuscular').addEventListener("click", () => {
  if(!animalSelecionado){
      alert("Selecione um animal")
      return
  }
  const idAnimal = mapaAnimais[animalSelecionado]
  carregarModelo(idAnimal,"muscular")
})


const sliderOssos = document.getElementById("sliderOssos");

sliderOssos.addEventListener("input", () => {
    const valor = parseFloat(sliderOssos.value);
    if (modeloAtual) {
        modeloAtual.children[0].material.transparent = true;
        modeloAtual.children[0].material.opacity = valor;
    }
});




//raycaster



async function onClick(event) {
  if (!modeloAtual) return;

  const rect = renderer.domElement.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(modeloAtual.children, true);

  if (intersects.length > 0) {
    const objetoClicado = intersects[0].object;
    console.log("Clicado:", objetoClicado.name);

    try {
      const response = await fetch("/estruturas");
      const data = await response.json();
      console.log("Dados recebidos da API:", data);

      const parteClicada = objetoClicado.name.toLowerCase();
      const estrutura = data.dados.find(item => item.nomeEstrutura.toLowerCase() === parteClicada);

      if (estrutura) {
        atualizarCardbar(estrutura);
        renderPreview(objetoClicado);
      } else {
        console.warn("Estrutura não encontrada para:", parteClicada);
      }

    } catch (error) {
      console.error('Erro ao buscar info da parte:', error);
    }
  }
}





function atualizarCardbar(data) {
  const cardbar = document.getElementById('cardbar');
  console.log(data)
  cardbar.querySelector('#nomeEstrutura').textContent = data.nomeEstrutura || 'Título não disponível';

  const info = cardbar.querySelector('#infoEstrutura');
  info.textContent = data.descricao || 'Descrição não disponível';
}


// Adiciona o listener de clique
window.addEventListener('click', onClick);
