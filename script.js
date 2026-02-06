
// Remove login salvo ao carregar a página
window.onload = function () {
    localStorage.removeItem("loggedIn");
};

// Credenciais fixas
const USERNAME = "catalogo";
const PASSWORD = "1234";

// Função chamada ao clicar no botão de login
function login() {
    console.log("Botão clicado");
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const error = document.getElementById("error");
   
    // Validação básica
    if (!username || !password) {
        error.innerText = "Preencha usuário e senha!";
        return;
    }

    // Validação do login
    if (username === USERNAME && password === PASSWORD) {
        localStorage.setItem("loggedIn", "true");
        window.location.href = "index.html"; // página após login
    } else {
        error.innerText = "Usuário ou senha incorretos!";
    }
}




