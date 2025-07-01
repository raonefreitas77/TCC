import * as THREE from 'three';
import { configurarBotoesCamadas, getAnimalSelecionado, setCamadaAtiva, getCamadaAtiva, definirAnimalSelecionado, } from './modelos.js';

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



const mapaAnimais = {
  "Cachorro": 1
}


// carregar o Modelo no ambiente 3D


document.getElementById('previewAnimal').addEventListener("click", () => {
  definirAnimalSelecionado("Cachorro");
})


configurarBotoesCamadas(
  mapaAnimais,
  getAnimalSelecionado,
  setCamadaAtiva
);
