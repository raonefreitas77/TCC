import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import {scene, camera, renderer} from "./scene.js";


//Carregar o modelo 3D
let modeloAtual = null


async function carregarModelo(animal, camada){
  try{
      const response = await fetch("http://localhost:3000/api/modelos")
      const data = await response.json()

      console.log("Dados recebidos da API:", data)

      const modeloCaminho = data[animal]?.camadas[camada]

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
          model.scale.set(2, 2, 2)
          model.position.set(0, 0, 0)

          model.traverse((child) => {
            if (child.isMesh) {
              child.geometry.center()
              if(camada==="ossea"){
                child.material = new THREE.MeshStandardMaterial({ color: 0xaaaaaa })
              }
            }
          })
          console.log(modeloCaminho)
          scene.add(model)
          modeloAtual = model
        },
        undefined,
        (error) => console.error("Erro ao carregar modelo:", error)
      )
  }catch(error){
      console.error("Erro ao buscar o modelo da API",error)
      
  }
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
    carregarModelo(animalSelecionado, "ossea")
})

document.getElementById('btnEpiderme').addEventListener("click", () => {
  if(!animalSelecionado){
      alert("Selecione um animal")
      return
  }
  carregarModelo(animalSelecionado, "epiderme")
})

document.getElementById('btnOrgaos').addEventListener("click", () => {
  if(!animalSelecionado){
      alert("Selecione um animal")
      return
  }
  carregarModelo(animalSelecionado, "orgaos")
})

document.getElementById('btnMuscular').addEventListener("click", () => {
  if(!animalSelecionado){
      alert("Selecione um animal")
      return
  }
  carregarModelo(animalSelecionado, "muscular")
})