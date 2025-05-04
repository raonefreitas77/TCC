import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { color } from "three/tsl";

//Ambiente 3D

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(0, 1, 5)


const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth * 0.849, window.innerHeight)
renderer.domElement.id = 'cena3D'

document.body.appendChild(renderer.domElement)

scene.background = new THREE.Color(0xc8c8c8)
scene.add(new THREE.AmbientLight(0x404040, 1))

const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.8)
hemiLight.position.set(0, 10, 0)
scene.add(hemiLight)

const light = new THREE.DirectionalLight(0xffffff, 1.2)
light.position.set(5, 10, 7)
scene.add(light)
const light2 = new THREE.DirectionalLight(0xffffff, 1.2)
light2.position.set(-5, 10, -7)
scene.add(light2)

const bottomLight = new THREE.DirectionalLight(0xffffff, 0.8)
bottomLight.position.set(0,-10,0)
bottomLight.target.position.set(0, 0, 0)
scene.add(bottomLight)
scene.add(bottomLight.target)



const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true
controls.dampingFactor = 0.05
controls.screenSpacePanning = false
controls.maxDistance = 10
controls.minDistance = 2

function animate() {
    requestAnimationFrame(animate)
    controls.update()
    renderer.render(scene, camera)
}
animate();
  
  
window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
});

export {scene, camera, renderer}
