import { showNotification } from "./notificacao.js";

// ====== PROTEÇÃO - VERIFICAR LOGIN ======
const usuarioLogado = (() => {
    const usuario = localStorage.getItem('usuario');
    if (!usuario) {
        alert('Você precisa estar logado para adicionar modelos!');
        window.location.href = 'login.html';
        return null;
    }
    return JSON.parse(usuario);
})();

if (!usuarioLogado) throw new Error('Acesso negado');

let selectedFile = null;

// ====== ELEMENTOS ======
const modal = document.getElementById('modal');
const closeBtn = document.getElementById('closeBtn');
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const removeFileBtn = document.getElementById('removeFile');
const submitBtn = document.getElementById('submitBtn');
const modelForm = document.getElementById('modelForm');
const fileInfo = document.getElementById('fileInfo');
const fileName = document.getElementById('fileName');
const fileSize = document.getElementById('fileSize');

// ====== FUNÇÕES ======
function closeModal() {
    window.location.href = 'home.html';
}

function closeModalOnOverlay(e) {
    if (e.target === modal) closeModal();
}

function handleFile(file) {
    if (!file.name.toLowerCase().endsWith('.glb')) {
        alert('Por favor, selecione um arquivo .glb');
        return;
    }
    selectedFile = file;
    fileName.textContent = file.name;
    fileSize.textContent = formatFileSize(file.size);
    fileInfo.classList.add('show');
    updateSubmitButton();
}

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) handleFile(file);
}

function removeFile() {
    selectedFile = null;
    fileInput.value = '';
    fileInfo.classList.remove('show');
    updateSubmitButton();
}

function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

function updateSubmitButton() {
    const modelName = document.getElementById('modelName').value;
    const animal = document.getElementById('animal').value;
    submitBtn.disabled = !(modelName && animal && selectedFile);
}

async function handleSubmit(e) {
    e.preventDefault();
    const modelName = document.getElementById('modelName').value;
    const animal = document.getElementById('animal').value;

    const formData = new FormData();
    formData.append('arquivo', selectedFile);
    formData.append('nomeModelo', modelName);
    formData.append('animal', animal);
    formData.append('usuarioNome', usuarioLogado.nome);
    formData.append('usuarioEmail', usuarioLogado.email);

    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';

    try {
        const response = await fetch('http://localhost:8080/modelo3d/upload', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (response.ok) {
            showNotification('success', result.msg);
            submitBtn.textContent = 'Adicionar';
            submitBtn.disabled = false;
        } else {
            showNotification('erro', result.msg || 'Erro ao enviar modelo');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Adicionar';
        }
    } catch (err) {
        console.error('Erro:', err);
        alert('Erro de conexão com o servidor');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Adicionar';
    }
}

// ====== EVENTOS ======

closeBtn.addEventListener('click', closeModal);
modal.addEventListener('click', closeModalOnOverlay);
uploadArea.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', handleFileSelect);
removeFileBtn.addEventListener('click', removeFile);
modelForm.addEventListener('submit', handleSubmit);

// Drag & Drop
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('dragover');
});
uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('dragover');
});
uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    if (e.dataTransfer.files.length > 0) handleFile(e.dataTransfer.files[0]);
});

// Atualizar botão quando inputs mudam
document.getElementById('modelName').addEventListener('input', updateSubmitButton);
document.getElementById('animal').addEventListener('input', updateSubmitButton);

// Fechar modal com ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});
