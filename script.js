
// Remover login salvo ao carregar a página
window.onload = function () {
    localStorage.removeItem("loggedIn"); // Garante que a sessão seja apagada
};

// Função para carregar o arquivo CSV via proxy (evita bloqueios de CORS)
async function loadCSV(url) {
    try {
        const response = await fetch(url);
        const data = await response.text();
        return parseCSV(data);
    } catch (error) {
        console.error('Erro ao carregar o arquivo CSV:', error);
        return {};
    }
}

// Função para converter o CSV em um objeto
function parseCSV(csvData) {
    const users = {};
    const rows = csvData.split('\n');

    rows.forEach(row => {
        const columns = row.replace(/\r/g, '').split(/[,;]/); // Aceita separador ',' ou ';'
        if (columns.length === 2) {
            const username = columns[0].trim();
            const password = columns[1].trim();
            if (username && password && username !== "username" && password !== "password") {
                users[username] = password;
            }
        }
    });

    return users;
}

// Função chamada ao clicar no botão de login

function login() {
    const user = document.getElementById("username").value;
    const pass = document.getElementById("password").value;
    const error = document.getElementById("error");

    if (user === "catalogo" && pass === "catalogo") {
        error.style.color = "green";
        error.textContent = "Login bem-sucedido!";
        // redirecionar se quiser:
        // window.location.href = "home.html";
    } else {
        error.style.color = "red";
        error.textContent = "Usuário ou senha incorretos!";
    }
}
 

// Função de validação de login
async function validateLogin(username, password) {
    const users = await loadCSV("https://api.allorigins.win/raw?url=https://raw.githubusercontent.com/CatalogoEstoque/index/main/User.csv");
    
    console.log("Usuários carregados:", users); // Depuração no console
    console.log("Usuário digitado:", username, "Senha digitada:", password);

    if (users[username] && users[username] === password) {
        console.log("Login validado com sucesso!");
        localStorage.setItem("loggedIn", "true");
        window.location.href = "index.html";  // Redireciona para a página index
    } else {
        console.log("Login falhou! Usuário ou senha incorretos.");
        document.getElementById("error").innerText = "Usuário ou senha incorretos!";
    }
}





