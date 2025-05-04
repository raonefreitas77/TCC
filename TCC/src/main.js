import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { color } from "three/tsl";
import {scene, camera, renderer} from "./scene.js";


//Carregar o modelo 3D

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
              child.material = new THREE.MeshStandardMaterial({ color: 0xaaaaaa })
            }
          })
          console.log(modeloCaminho)
          scene.add(model)
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

