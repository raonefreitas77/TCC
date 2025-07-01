import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { removerTodosMarcadores } from './mapaMarcadores.js';
import { scene } from './scene.js';


export let modeloAtual = null
export let modeloOssea = null;
export let modeloMuscular = null;
export let modeloOrgaos = null;
export let modeloEpiderme = null;

const sliderFade = document.getElementById("sliderFade");



export async function carregarModelo(animalID, camada) {
  try {
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

    if (!modeloCaminho) {
      console.error("Caminho do modelo não encontrado")
      return
    }

    /*if (modeloAtual) {
      modeloAtual.traverse((child) => {
        if (child.isMesh) {
          child.geometry.dispose()
          if (child.material.map) child.material.map.dispose()
          child.material.dispose()
        }
      })
      modeloAtual = null
    }*/

    const gltfLoader = new GLTFLoader()
    gltfLoader.load(
      modeloCaminho,
      (gltf) => {
        const model = gltf.scene
        model.name = camada;
        console.log(gltf.scene);
        console.log(gltf.scene.children);
        model.scale.set(2, 2, 2)
        model.position.set(0, 0, 0)

        model.traverse((child) => {
          if (child.isMesh) {
            child.material.side = THREE.DoubleSide
            child.material.polygonOffset = true;
            child.material.polygonOffsetUnits = -1;
            child.material.needsUpdate = true;
            //child.geometry.center()
            if (camada === "ossea") {
              child.material = new THREE.MeshStandardMaterial({
                color: 0xaaaaaa,
                transparent: true,
              });
            }
          }
        })
        console.log(modeloCaminho)
        if (camada === "ossea" && modeloOssea) scene.remove(modeloOssea);
        if (camada === "muscular" && modeloMuscular) scene.remove(modeloMuscular);
        if (camada === "orgaos" && modeloOrgaos) scene.remove(modeloOrgaos);
        if (camada === "epiderme" && modeloEpiderme) scene.remove(modeloEpiderme);

        scene.add(model)


        /*if (camada === "ossea") {
            model.traverse(obj => { if (obj.isMesh) obj.renderOrder = 1; });
        }
        if (camada === "orgaos") {
            model.traverse(obj => { if (obj.isMesh) obj.renderOrder = 2; });
        }
        if (camada === "muscular") {
            model.traverse(obj => { if (obj.isMesh) obj.renderOrder = 3; });
        }
        if (camada === "epiderme") {
            model.traverse(obj => { if (obj.isMesh) obj.renderOrder = 4; });
        }*/

        if (camada === "ossea") modeloOssea = model;
        if (camada === "muscular") modeloMuscular = model;
        if (camada === "orgaos") modeloOrgaos = model;
        if (camada === "epiderme") modeloEpiderme = model;

        requestAnimationFrame(() => {
          sliderFade.dispatchEvent(new Event("input"));
        });


        gltf.scene.traverse(obj => {
          console.log(`${obj.name} | ${obj.type}`);
        });

      },
      undefined,
      (error) => console.error("Erro ao carregar modelo:", error)

    )
  } catch (error) {
    console.error("Erro ao buscar o modelo da API", error)

  }
}

export function contarModelosCarregados() {
  let count = 0;
  if (modeloEpiderme) count++;
  if (modeloMuscular) count++;
  if (modeloOrgaos) count++;
  if (modeloOssea) count++;
  return count;
}


// carregar o Modelo no ambiente 3D

let animalSelecionado = null
export let camadaAtiva = null


export function definirAnimalSelecionado(nome) {
  animalSelecionado = nome;
}
export function getAnimalSelecionado() {
  return animalSelecionado;
}


export function setCamadaAtiva(camada) {
  camadaAtiva = camada;
}
export function getCamadaAtiva() {
  return camadaAtiva;
}




export function configurarBotoesCamadas(mapaAnimais, getAnimalSelecionado, setCamadaAtiva) {
  const botoes = [
    { id: 'btnOssea', modelo: () => modeloOssea, setModelo: m => modeloOssea = m, camada: 'ossea' },
    { id: 'btnOrgaos', modelo: () => modeloOrgaos, setModelo: m => modeloOrgaos = m, camada: 'orgaos' },
    { id: 'btnEpiderme', modelo: () => modeloEpiderme, setModelo: m => modeloEpiderme = m, camada: 'epiderme' },
    { id: 'btnMuscular', modelo: () => modeloMuscular, setModelo: m => modeloMuscular = m, camada: 'muscular' },
  ];

  botoes.forEach(({ id, modelo, setModelo, camada }) => {
    document.getElementById(id).addEventListener('click', () => {
      const animal = getAnimalSelecionado();
      if (!animal) {
        alert("Selecione um animal");
        return;
      }

      const idAnimal = mapaAnimais[animal];

      if (modelo()) {
        scene.remove(modelo());
        setModelo(null);
        removerTodosMarcadores();
      } else {
        carregarModelo(idAnimal, camada);
        setCamadaAtiva(camada);
      }
    });
  });
}
