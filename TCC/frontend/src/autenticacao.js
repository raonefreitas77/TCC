import { showNotification } from "./notificacao";

const form = document.getElementById('registerForm');
const verifyForm = document.getElementById('verifyForm');
const nomeInput = document.getElementById('nome');
const emailInput = document.getElementById('email');
const senhaInput = document.getElementById('password');


form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const dados = { 
    usuario: {
      nome: nomeInput.value,
      email: emailInput.value,
      senha_hash: senhaInput.value
    }
  };

  try {
    const response = await fetch('http://localhost:8080/usuario', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    });

    const result = await response.json();

    if (!response.ok) {
      showNotification('erro',result.msg || "Erro ao cadastrar usuário.");
      return;
    }

    showNotification('success',result.msg);


    document.getElementById('registerContainer').classList.add('hidden');
    document.getElementById('verifyContainer').classList.remove('hidden');
    document.getElementById('registeredEmail').textContent = emailInput.value;


    const envioResponse = await fetch('http://localhost:8080/usuario/enviar-codigo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: emailInput.value })
    });

    const envioResult = await envioResponse.json();
    
    if (envioResponse.ok) {
      showNotification('success','Código de verificação enviado para o email!');
    } else {
      showNotification('erro',envioResult.msg || 'Erro ao enviar código');
    }
    
  } catch (err) {
    console.error("Erro na requisição:", err);
    showNotification('erro',"Erro de conexão com o servidor");
  }
});

verifyForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const codigo = document.getElementById('verificationCode').value;

  try {
    const response = await fetch('http://localhost:8080/usuario/verificar-codigo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        email: emailInput.value,
        codigo: codigo 
      })
    });

    const result = await response.json();

    if (response.ok) {
      showNotification('success','Email verificado com sucesso! 🎉');
      window.location.href = '/login.html';
    } else {
      showNotification('erro',result.msg || 'Código inválido');
    }

  } catch (err) {
    console.error("Erro na verificação:", err);
    showNotification('erro',"Erro de conexão com o servidor");
  }
});