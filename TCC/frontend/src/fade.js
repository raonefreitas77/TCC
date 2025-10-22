import { modeloEpiderme, modeloMuscular, modeloOrgaos, modeloOssea, contarModelosCarregados } from './loader.js';
import * as THREE from 'three'
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function aplicarOpacidade(modelo, opacidade) {
  if (modelo) {
    modelo.traverse(obj => {
      if (obj.isMesh) {
        obj.material.transparent = true;
        obj.material.opacity = opacidade;
        obj.material.alphaTest = 0.01;

        obj.material.depthWrite = opacidade > 0.99;

        const nome = modelo.name?.toLowerCase?.() || '';

        if (nome.includes("epiderme")) obj.renderOrder = 1;
        else if (nome.includes("muscular")) obj.renderOrder = 2;
        else if (nome.includes("orgaos")) obj.renderOrder = 3;
        else if (nome.includes("ossea")) obj.renderOrder = 4;
        else obj.renderOrder = 5;

        obj.material.needsUpdate = true;
      }
    });
  }
}

function lerp(a, b, t) {
  return a + (b - a) * Math.min(Math.max(t, 0), 1);
}

const sliderFade = document.getElementById("sliderFade");


function calculoOpacidade() {
  const v = parseFloat(sliderFade.value);
  const modelosAtivos = contarModelosCarregados();

  let opMin = 0.06
  let opMax = 1.5;


  let opEpiderme = opMin;
  let opMuscular = opMin;
  let opOrgaos = opMin;
  let opOsseo = opMin;


  if (modelosAtivos === 1) {
    const fade = lerp(opMax, opMin, v);

    if (modeloEpiderme) opEpiderme = fade;
    if (modeloMuscular) opMuscular = fade;
    if (modeloOrgaos) opOrgaos = fade;
    if (modeloOssea) opOsseo = fade;
  }

  else if (modelosAtivos === 2) {
    const modelos = [];
    opMin = 0.09
    if (modeloEpiderme) modelos.push('epiderme');
    if (modeloMuscular) modelos.push('muscular');
    if (modeloOrgaos) modelos.push('orgaos');
    if (modeloOssea) modelos.push('ossea');

    const fadeA = lerp(opMax, opMin, v);
    const fadeB = lerp(opMin, opMax, v);

    if (modelos[0] === 'epiderme') opEpiderme = fadeA;
    if (modelos[0] === 'muscular') opMuscular = fadeA;
    if (modelos[0] === 'orgaos') opOrgaos = fadeA;
    if (modelos[0] === 'ossea') opOsseo = fadeA;

    if (modelos[1] === 'epiderme') opEpiderme = fadeB;
    if (modelos[1] === 'muscular') opMuscular = fadeB;
    if (modelos[1] === 'orgaos') opOrgaos = fadeB;
    if (modelos[1] === 'ossea') opOsseo = fadeB;
  }


  else if (modelosAtivos === 3) {
    const modelos = [];
    if (modeloEpiderme) modelos.push('epiderme');
    if (modeloMuscular) modelos.push('muscular');
    if (modeloOrgaos) modelos.push('orgaos');
    if (modeloOssea) modelos.push('ossea');


    opEpiderme = opMin;
    opMuscular = opMin;
    opOrgaos = opMin;
    opOsseo = opMin;

    if (v < 0.4) {
      const tA = v / 0.4;
      const fadeA = lerp(opMax, opMin, tA);
      const fadeB = lerp(opMin, opMax, tA); 

      if (modelos[0] === 'epiderme') opEpiderme = fadeA;
      if (modelos[0] === 'muscular') opMuscular = fadeA;
      if (modelos[0] === 'orgaos') opOrgaos = fadeA;
      if (modelos[0] === 'ossea') opOsseo = fadeA;

      if (modelos[1] === 'epiderme') opEpiderme = fadeB;
      if (modelos[1] === 'muscular') opMuscular = fadeB;
      if (modelos[1] === 'orgaos') opOrgaos = fadeB;
      if (modelos[1] === 'ossea') opOsseo = fadeB;
    }

    else if (v < 0.7) {
      const tB = (v - 0.4) / 0.3;
      const fadeB = lerp(opMax, opMin, tB);
      const fadeC = lerp(0, opMax * 0.7, tB); 

      if (modelos[1] === 'epiderme') opEpiderme = fadeB;
      if (modelos[1] === 'muscular') opMuscular = fadeB;
      if (modelos[1] === 'orgaos') opOrgaos = fadeB;
      if (modelos[1] === 'ossea') opOsseo = fadeB;

      if (modelos[2] === 'epiderme') opEpiderme = fadeC;
      if (modelos[2] === 'muscular') opMuscular = fadeC;
      if (modelos[2] === 'orgaos') opOrgaos = fadeC;
      if (modelos[2] === 'ossea') opOsseo = fadeC;
    }

    else {
      const tC = (v - 0.7) / 0.3;
      const fadeC = lerp(opMax * 0.7, opMax, tC); 

      if (modelos[2] === 'epiderme') opEpiderme = fadeC;
      if (modelos[2] === 'muscular') opMuscular = fadeC;
      if (modelos[2] === 'orgaos') opOrgaos = fadeC;
      if (modelos[2] === 'ossea') opOsseo = fadeC;
    }
  }

  else if (modelosAtivos === 4) {
    const modelos = [];
    if (modeloEpiderme) modelos.push('epiderme');
    if (modeloMuscular) modelos.push('muscular');
    if (modeloOrgaos) modelos.push('orgaos');
    if (modeloOssea) modelos.push('ossea');

    
    opEpiderme = opMin;
    opMuscular = opMin;
    opOrgaos = opMin;
    opOsseo = opMin;

    if (v < 0.3) {
      const tA = v / 0.3;
      const fadeA = lerp(opMax, opMin, tA);
      const fadeB = lerp(opMin, opMax * 0.6, tA); 

      if (modelos[0] === 'epiderme') opEpiderme = fadeA;
      if (modelos[1] === 'epiderme') opEpiderme = fadeB;
      if (modelos[0] === 'muscular') opMuscular = fadeA;
      if (modelos[1] === 'muscular') opMuscular = fadeB;
      if (modelos[0] === 'orgaos') opOrgaos = fadeA;
      if (modelos[1] === 'orgaos') opOrgaos = fadeB;
      if (modelos[0] === 'ossea') opOsseo = fadeA;
      if (modelos[1] === 'ossea') opOsseo = fadeB;
    }

    else if (v < 0.6) {
      const tB = (v - 0.3) / 0.3;
      const fadeB = lerp(opMax * 0.6, opMin, tB); 
      const fadeC = lerp(opMin, opMax * 0.7, tB); 

      if (modelos[1] === 'epiderme') opEpiderme = fadeB;
      if (modelos[1] === 'muscular') opMuscular = fadeB;
      if (modelos[1] === 'orgaos') opOrgaos = fadeB;
      if (modelos[1] === 'ossea') opOsseo = fadeB;

      if (modelos[2] === 'epiderme') opEpiderme = fadeC;
      if (modelos[2] === 'muscular') opMuscular = fadeC;
      if (modelos[2] === 'orgaos') opOrgaos = fadeC;
      if (modelos[2] === 'ossea') opOsseo = fadeC;
    }

    else if (v < 0.9) {
      const tC = (v - 0.6) / 0.3;
      const fadeC = lerp(opMax * 0.7, opMin, tC);
      const fadeD = lerp(opMin, opMax * 0.9, tC); // D entra levemente

      if (modelos[2] === 'epiderme') opEpiderme = fadeC;
      if (modelos[2] === 'muscular') opMuscular = fadeC;
      if (modelos[2] === 'orgaos') opOrgaos = fadeC;
      if (modelos[2] === 'ossea') opOsseo = fadeC;

      if (modelos[3] === 'epiderme') opEpiderme = fadeD;
      if (modelos[3] === 'muscular') opMuscular = fadeD;
      if (modelos[3] === 'orgaos') opOrgaos = fadeD;
      if (modelos[3] === 'ossea') opOsseo = fadeD;
    }

    else {
      if (modelos[3] === 'epiderme') opEpiderme = opMax;
      if (modelos[3] === 'muscular') opMuscular = opMax;
      if (modelos[3] === 'orgaos') opOrgaos = opMax;
      if (modelos[3] === 'ossea') opOsseo = opMax;
    }
  }


  aplicarOpacidade(modeloEpiderme, opEpiderme);
  aplicarOpacidade(modeloMuscular, opMuscular);
  aplicarOpacidade(modeloOrgaos, opOrgaos);
  aplicarOpacidade(modeloOssea, opOsseo);
}

sliderFade.addEventListener("input",calculoOpacidade)

export function atualizarOpacidade(){
  calculoOpacidade();
}

