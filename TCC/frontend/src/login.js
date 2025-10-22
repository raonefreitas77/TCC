import { showNotification } from "./notificacao";

const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const senhaInput = document.getElementById('password');
const errorMessage = document.getElementById('errorMessage');

console.log("login.js carregado");

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    
    errorMessage.style.display = 'none';

    const dados = {
        email: emailInput.value,
        senha: senhaInput.value
    };

    try {
        const response = await fetch('http://localhost:8080/usuario/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });

        const result = await response.json();

        if (response.ok) {
            
            localStorage.setItem('usuario', JSON.stringify(result.dados));
            window.location.href = 'home.html'; 
            
        } else {
            errorMessage.textContent = `⚠️ ${result.msg || 'Email ou senha incorretos'}`;
            errorMessage.style.display = 'flex';
            
            
            errorMessage.style.animation = 'none';
            setTimeout(() => {
                errorMessage.style.animation = 'shake 0.5s';
            }, 10);
        }

    } catch (err) {
        console.error("Erro na requisição:", err);
        errorMessage.textContent = '⚠️ Erro de conexão com o servidor';
        errorMessage.style.display = 'flex';
    }
});