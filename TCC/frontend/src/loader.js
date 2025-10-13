import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { removerTodosMarcadores } from './mapaMarcadores.js';
import { scene, controls, shadowPlane } from './scene.js';
import { salvarEstadoInicial, modelosIniciais, cameraPosInicial, cameraRotInicial, camera, controlsTargetInicial } from './scene.js';

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

    const gltfLoader = new GLTFLoader()
    gltfLoader.load(
      modeloCaminho,
      (gltf) => {
        const model = gltf.scene
        model.name = camada;
        console.log(gltf.scene);
        console.log(gltf.scene.children);
        model.scale.set(2, 2, 2)
        model.updateMatrixWorld(true);     
        const box = new THREE.Box3().setFromObject(model);
        const minY = box.min.y;     
        model.position.y -= minY;
        const nomeAnimal = getAnimalSelecionado();
        const alturaAjuste = alturaPorAnimal[nomeAnimal] ?? -0.5;
        model.position.y -= alturaAjuste;
        const alturaChao = model.position.y + minY;
        shadowPlane.position.y = alturaChao;

        model.traverse((child) => {
          if (child.isMesh) {
            child.material.side = THREE.DoubleSide
            child.material.polygonOffset = true;
            child.material.polygonOffsetUnits = -1;
            child.material.needsUpdate = true;
            child.castShadow = true;
            child.receiveShadow = true;
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
        
        console.log(`Modelo da camada ${camada} carregado e camadaAtiva definida.`);

        if (camada === "ossea") modeloOssea = model;
        if (camada === "muscular") modeloMuscular = model;
        if (camada === "orgaos") modeloOrgaos = model;
        if (camada === "epiderme") modeloEpiderme = model;
        
        setCamadaAtiva(camada);

        requestAnimationFrame(() => {
          sliderFade.dispatchEvent(new Event("input"));
        });

        gltf.scene.traverse(obj => {
          console.log(`${obj.name} | ${obj.type}`);
        });
        
        salvarEstadoInicial();
      },
      undefined,
      (error) => console.error("Erro ao carregar modelo:", error)
    )
  } catch (error) {
    console.error("Erro ao buscar o modelo da API", error)
  }
}

const alturaPorAnimal = {
  Cachorro: 1.5,
  Vaca: 1,
  Cavalo: 1.5,
  Peixe: 0.5,
  Rato: 0.5,
  Papagaio: 1.75,
  Tubarão: 0.5
};

// NOVA FUNÇÃO: Remove todos os modelos da cena
export function removerTodosModelos() {
  console.log("🗑️ Removendo todos os modelos da cena...");
  
  if (modeloOssea) {
    scene.remove(modeloOssea);
    modeloOssea = null;
  }
  if (modeloMuscular) {
    scene.remove(modeloMuscular);
    modeloMuscular = null;
  }
  if (modeloOrgaos) {
    scene.remove(modeloOrgaos);
    modeloOrgaos = null;
  }
  if (modeloEpiderme) {
    scene.remove(modeloEpiderme);
    modeloEpiderme = null;
  }
  
  // Remove marcadores também
  removerTodosMarcadores();
  
  // Reseta camada ativa
  setCamadaAtiva(null);
  
  console.log("✅ Todos os modelos removidos");
}

// NOVA FUNÇÃO: Remove botões ativos das camadas
export function resetarBotoesCamadas() {
  const botoes = ['btnOssea', 'btnOrgaos', 'btnEpiderme', 'btnMuscular'];
  botoes.forEach(id => {
    const btn = document.getElementById(id);
    if (btn) btn.classList.remove('active');
  });
  
  const mapaMarcadores = document.getElementById('mapaMarcadores');
  if (mapaMarcadores) mapaMarcadores.classList.remove('active');
}

export function contarModelosCarregados() {
  let count = 0;
  if (modeloEpiderme) count++;
  if (modeloMuscular) count++;
  if (modeloOrgaos) count++;
  if (modeloOssea) count++;
  return count;
}

let animalSelecionado = null
export let camadaAtiva = null

export function definirAnimalSelecionado(nome) {
  // Se está trocando de animal, remove tudo do anterior
  if (animalSelecionado && animalSelecionado !== nome) {
    console.log(`🔄 Trocando de ${animalSelecionado} para ${nome}`);
    removerTodosModelos();
    resetarBotoesCamadas();
  }
  animalSelecionado = nome;
  console.log(`🐾 Animal selecionado: ${nome}`);
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

export function getModeloAtualDaCamada() {
  if (camadaAtiva === 'ossea') return modeloOssea;
  if (camadaAtiva === 'muscular') return modeloMuscular;
  if (camadaAtiva === 'orgaos') return modeloOrgaos;
  if (camadaAtiva === 'epiderme') return modeloEpiderme;
  return null;
}

export function getTodosModelos() {
  return {
    ossea: modeloOssea,
    muscular: modeloMuscular,
    orgaos: modeloOrgaos,
    epiderme: modeloEpiderme
  };
}

document.getElementById('resetView').addEventListener("click", () => {
  controls.reset()

  const modelos = { modeloOssea, modeloMuscular, modeloOrgaos, modeloEpiderme };

  Object.entries(modelos).forEach(([nome, modelo]) => {
    const estado = modelosIniciais[nome];
    if (modelo && estado) {
      modelo.position.copy(estado.pos);
      modelo.rotation.copy(estado.rot);
    }
  });
});

export function configurarBotoesCamadas(mapaAnimais, getAnimalSelecionado, setCamadaAtiva) {
  const botoes = [
    { id: 'btnOssea', modelo: () => modeloOssea, setModelo: m => modeloOssea = m, camada: 'ossea' },
    { id: 'btnOrgaos', modelo: () => modeloOrgaos, setModelo: m => modeloOrgaos = m, camada: 'orgaos' },
    { id: 'btnEpiderme', modelo: () => modeloEpiderme, setModelo: m => modeloEpiderme = m, camada: 'epiderme' },
    { id: 'btnMuscular', modelo: () => modeloMuscular, setModelo: m => modeloMuscular = m, camada: 'muscular' },
  ];

  const todosBotoes = botoes.map(({ id }) => document.getElementById(id));

  botoes.forEach(({ id, modelo, setModelo, camada }) => {
    const btn = document.getElementById(id);

    btn.addEventListener('click', () => {
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
        btn.classList.remove("active");

        const ativos = Object.entries(getTodosModelos()).filter(([_, m]) => m);
        if (ativos.length === 1) {
          setCamadaAtiva(ativos[0][0]);
          document.getElementById('mapaMarcadores').classList.remove('active');
        } else if (ativos.length === 0) {
          setCamadaAtiva(null);
        }
      } else {
        carregarModelo(idAnimal, camada);
        btn.classList.add("active");
      }
    });
  });
}