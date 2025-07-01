import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { color } from "three/tsl";
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js';

//Ambiente 3D


const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setClearColor(0xe6f4dc)

renderer.domElement.id = 'cena3D'

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);


camera.position.set(0, 1, 5)


/* const composer = new EffectComposer(renderer);
composer.setSize(window.innerWidth, window.innerHeight);

const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

const outline = new OutlinePass(
    new THREE.Vector2(window.innerWidth, window.innerHeight), 
    scene, 
    camera
);
outline.edgeThickness = 8.0;
outline.edgeStrength = 9.0;
outline.visibleEdgeColor.set(0xffffff);
composer.addPass(outline);

const textureLoader = new THREE.TextureLoader();
textureLoader.load("three/examples/jsm/textures/tri_pattern.jpg", function(texture){
    if (texture) {
        outline.patternTexture = texture;
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
    
    }
            
});

const fxaaShader = new ShaderPass(FXAAShader);
fxaaShader.uniforms['resolution'].value.set(
    1 / window.innerWidth,
    1 / window.innerHeight
);
composer.addPass(fxaaShader);

const selectedObjects = []

function addSelectedObjects(object){
    selectedObjects.length = 0;
    if (object) {
        selectedObjects.push(object);
    }
    outline.selectedObjects = selectedObjects;
    outline.enabled = selectedObjects.length > 0;
}
*/

document.body.appendChild(renderer.domElement)

scene.add(new THREE.AmbientLight(0x404040, 2))

const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.6)
hemiLight.position.set(0, 10, 0)

const light = new THREE.DirectionalLight(0xffffff, 2.2)
light.position.set(5, 10, 7)

const light2 = new THREE.DirectionalLight(0xffffff, 2.2)
light2.position.set(-5, 10, -7)

const bottomLight = new THREE.DirectionalLight(0xffffff, 1.8)
bottomLight.position.set(0, -10, 0)
bottomLight.target.position.set(0, 0, 0)

scene.add(hemiLight)
scene.add(light)
scene.add(light2)
scene.add(bottomLight)
scene.add(bottomLight.target)




const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true
controls.dampingFactor = 0.05
controls.screenSpacePanning = false
controls.maxDistance = 10
controls.minDistance = 2






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
}

animate();

export {scene, camera, renderer, renderPreview}