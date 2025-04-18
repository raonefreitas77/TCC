import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";


const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 1, 5); // Posição inicial da câmera


const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 7);
scene.add(light);
scene.add(new THREE.AmbientLight(0x404040)); // Luz ambiente fraca


const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Suaviza a rotação
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
controls.maxDistance = 10; // Limita o zoom
controls.minDistance = 2;

async function carregarModelo(animal, camada){
  try{
      const response = await fetch("http://localhost:3000/api/modelos")
      const data = await response.json()

      console.log("Dados recebidos da API:", data);

      const modeloCaminho = data[animal]?.camadas[camada]

      console.log("Caminho do modelo:", modeloCaminho)
      
      if(!modeloCaminho){
        console.error("Caminho do modelo não encontrado")
        return
      }
      const gltfLoader = new GLTFLoader();
      gltfLoader.load(
        modeloCaminho, 
        (gltf) => {
          const model = gltf.scene;
          model.scale.set(2, 2, 2);
          model.position.set(0, 0, 0);

          model.traverse((child) => {
            if (child.isMesh) {
              child.geometry.center(); 
              child.material = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
            }
          });
          console.log(modeloCaminho)
          scene.add(model);
        },
        undefined,
        (error) => console.error("Erro ao carregar modelo:", error)
      );
  }catch(error){
      console.error("Erro ao buscar o modelo da API",error)
      
  }
}

carregarModelo("Cachorro", "ossea")

function animate() {
  requestAnimationFrame(animate);
  controls.update(); 
  renderer.render(scene, camera);
}
animate();


window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

