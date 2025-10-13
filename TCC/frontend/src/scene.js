import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { color } from "three/tsl";
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js';
import { modeloOssea, modeloMuscular, modeloOrgaos, modeloEpiderme } from './loader.js';
//Ambiente 3D


const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

document.getElementById("cena3D").appendChild(renderer.domElement);


function redimensionarCena() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 1, 5);


scene.add(new THREE.AmbientLight(0x404040, 2));

const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.6);
hemiLight.position.set(0, 10, 0);

const light = new THREE.DirectionalLight(0xffffff, 2.2);
light.position.set(5, 8, 7);

light.castShadow = true; // 🔑 ativa sombra nesta luz
light.shadow.mapSize.width = 2048;  // aumenta qualidade
light.shadow.mapSize.height = 2048;
light.shadow.bias = 0.0000
light.shadow.normalBias = 0.02;
light.shadow.camera.near = 0.1;
light.shadow.camera.far = 50; // suficiente para cobrir a cena



const light2 = new THREE.DirectionalLight(0xffffff, 2.2);
light2.position.set(-5, 10, -7);

const bottomLight = new THREE.DirectionalLight(0xffffff, 1.8);
bottomLight.position.set(0, -10, 0);
bottomLight.target.position.set(0, 0, 0);


scene.add(hemiLight, light, light2, bottomLight, bottomLight.target);


const shadowPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100),
    new THREE.ShadowMaterial({ opacity: 0.3 }) // sombra suave e sem cor
);
shadowPlane.rotation.x = -Math.PI / 2;
shadowPlane.position.y = -1;
shadowPlane.receiveShadow = true;
scene.add(shadowPlane);


// Canvas para o gradiente
const canvas = document.createElement('canvas');
canvas.width = 2048; // Alta resolução
canvas.height = 2048;
const ctx = canvas.getContext('2d');

function drawGradient() {
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, `hsl(145, 30%, 38%)`); // verde natural
    gradient.addColorStop(1, `hsl(140, 38%, 20%)`);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}
drawGradient();

const texture = new THREE.CanvasTexture(canvas);
scene.background = texture;


let hueShift = 0;
function animateGradient() {
    hueShift = (hueShift + 1) % 360; // Movimento bem suave
    drawGradient(hueShift);
    texture.needsUpdate = true;
}



const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true
controls.dampingFactor = 0.05
controls.screenSpacePanning = false
controls.maxDistance = 10
controls.minDistance = 2
controls.saveState();


export let cameraPosInicial, cameraRotInicial, controlsTargetInicial

export let modelosIniciais = {};

export function salvarEstadoInicial() {
  cameraPosInicial = camera.position.clone();
  controlsTargetInicial = controls.target.clone(); // Mantém só o target

  modelosIniciais = {};

  const modelos = { modeloOssea, modeloMuscular, modeloOrgaos, modeloEpiderme };

  Object.entries(modelos).forEach(([nome, modelo]) => {
    if (modelo) {
      modelosIniciais[nome] = {
        pos: modelo.position.clone(),
        rot: modelo.rotation.clone()
      };
    }
  });
}

let controlesTravados = false;

document.getElementById("lockControls").addEventListener('click', () => {
    controlesTravados = !controlesTravados;
    controls.enabled = !controlesTravados;
})


function renderPreview(objetoOriginal) {
    const canvas = document.getElementById('previewCanvas')

    const previewScene = new THREE.Scene()

    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.set(0, 1, 5)

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    previewScene.add(ambientLight);

    
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.8);
    hemiLight.position.set(0, 10, 0);
    previewScene.add(hemiLight);

    
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
    dirLight.position.set(5, 10, 7);
    previewScene.add(dirLight);

    
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.5);
    fillLight.position.set(-5, -5, -7);
    previewScene.add(fillLight);

    const previewObject = objetoOriginal.clone();
    previewObject.rotation.set(0, Math.PI / 2, 0); 
    previewObject.position.set(0, 0, 0);
    previewObject.scale.set(5, 5, 5);
    previewScene.add(previewObject);

    const box = new THREE.Box3().setFromObject(previewObject);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    previewObject.position.sub(center)

    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = camera.fov * (Math.PI / 180);
    let cameraZ = Math.abs(maxDim / Math.tan(fov / 2));
    cameraZ *= 0.9; 
    camera.position.set(0, 0, cameraZ);
    camera.lookAt(0, 0, 0);

    const previewRenderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    previewRenderer.setSize(canvas.clientWidth, canvas.clientHeight);

    const controls = new OrbitControls(camera, previewRenderer.domElement);
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.screenSpacePanning = false
    controls.maxDistance = 10
    controls.minDistance = 2

    function animate() {
        requestAnimationFrame(animate);
        controls.update(); 
        previewRenderer.render(previewScene, camera);
    }
    animate();
}




window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});


function animate() {
    requestAnimationFrame(animate);
    controls.update(); 
    renderer.render(scene,camera);
    animateGradient()
}

animate();

export {scene, camera, renderer, controls, shadowPlane}