// Criar usuário padrão admin se não existir
    if (!localStorage.getItem("usuarios")) {
      const usuariosPadrao = [{ usuario: "admin", senha: "1234" }];
      localStorage.setItem("usuarios", JSON.stringify(usuariosPadrao));
    }

    // Exibir "logado como" se estiver logado
    function atualizarLogin() {
      const usuarioLogado = localStorage.getItem("usuarioLogado");
      const loginArea = document.getElementById("login-area");

      if (usuarioLogado) {
        loginArea.innerHTML = `Logado como <b>${usuarioLogado}</b> 
          <button onclick="sair()" style="margin-left:10px;">Sair</button>`;
      } else {
        loginArea.innerHTML = `<a href="login.html" id="login-link">Login</a>`;
      }
    }

    function sair() {
      localStorage.removeItem("usuarioLogado");
      atualizarLogin();
    }

    atualizarLogin();