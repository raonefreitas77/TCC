import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const container = document.getElementById('modelo3D');

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  45,
  container.clientWidth / container.clientHeight,
  0.1,
  1000
);
camera.position.set(1.5, 0.9, 1.5);


const renderer = new THREE.WebGLRenderer({ 
  antialias: true, 
  alpha: true 
});
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setClearColor(0x000000, 0);


container.appendChild(renderer.domElement);


const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.2);
hemiLight.position.set(0, 10, 0);
scene.add(hemiLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
dirLight.position.set(5, 8, 7);
dirLight.castShadow = true;
dirLight.shadow.mapSize.width = 2048;
dirLight.shadow.mapSize.height = 2048;
scene.add(dirLight);

const fillLight = new THREE.DirectionalLight(0xffffff, 0.8);
fillLight.position.set(-5, -5, -7);
scene.add(fillLight);


const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.autoRotate = true;
controls.autoRotateSpeed = 1.5;
controls.maxDistance = 6;
controls.minDistance = 0.8;
controls.target.set(0, 0.6, 0);
controls.enablePan = false;
controls.enableZoom = false;
controls.enableRotate = true;

async function carregarModelo3D() {
  try {
    const response = await fetch("/modelo3d");
    const data = await response.json();
    
    if (data.status && Array.isArray(data.dados) && data.dados.length > 0) {
      const modeloEncontrado = data.dados.find(m => m.camada === "epiderme") || data.dados[0];
      const modeloCaminho = modeloEncontrado.caminho_arquivo;

      const gltfLoader = new GLTFLoader();
      gltfLoader.load(
        modeloCaminho,
        (gltf) => {
          const model = gltf.scene;
          model.scale.set(2, 2, 2);
          
          
          const box = new THREE.Box3().setFromObject(model);
          const center = box.getCenter(new THREE.Vector3());
          const size = box.getSize(new THREE.Vector3());
          
          model.position.sub(center);
          
          
          const minY = box.min.y;
          model.position.y -= minY;
          model.position.y -= 0.2; 

          model.traverse((child) => {
            if (child.isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;
              child.material.side = THREE.DoubleSide;
            }
          });

          scene.add(model);
          
          const maxDim = Math.max(size.x, size.y, size.z);
          const fov = camera.fov * (Math.PI / 180);
          const cameraDistance = Math.abs(maxDim / Math.tan(fov / 2)) * 1.1;
          
          camera.position.set(cameraDistance * 0.4, cameraDistance * 0.2, cameraDistance * 0.4);
          camera.lookAt(0, size.y / 2.5, 0);
          controls.target.set(0, size.y / 2.5, 0);
          controls.update();
          
          console.log("Modelo carregado com sucesso!");
        },
        undefined,
        (error) => {
          console.error("Erro ao carregar modelo:", error);
        }
      );
    }
  } catch (error) {
    console.error("Erro ao buscar modelo da API:", error);
  }
}


carregarModelo3D();


function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();


window.addEventListener('resize', () => {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
});


document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

const usuario = localStorage.getItem('usuario');
const loginArea = document.getElementById('login-area');
  
  if (usuario) {
    const dadosUsuario = JSON.parse(usuario);
    
  
    loginArea.innerHTML = `
      <span style="color: #4CAF50; font-weight: 500; margin-right: 10px;">
        Olá, ${dadosUsuario.nome}
      </span>
      <a href="#" id="logout-btn" style="color: #ff4444;">Sair</a>
    `;
    
    
    document.getElementById('logout-btn').addEventListener('click', (e) => {
      e.preventDefault();
      if (confirm('Deseja sair?')) {
        localStorage.removeItem('usuario');
        window.location.reload();
      }
    });
    
    
    const linkAdicionarModelos = document.querySelector('a[href="adicionarModelos.html"]');
    if (linkAdicionarModelos) {
      linkAdicionarModelos.style.display = 'inline';
    }
    
  } else {
    
    const linkAdicionarModelos = document.querySelector('a[href="adicionarModelos.html"]');
    if (linkAdicionarModelos) {
      linkAdicionarModelos.style.display = 'none';
    }
  }