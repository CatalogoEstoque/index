    let allProducts = [];
    let filteredProductsGlobal = [];
    let selectedCategory = "";
    let selectedFormat = "";
    let selectedSector = "";
    let itemsPerLoad = 20;
    let currentIndex = 0;

    document.addEventListener("DOMContentLoaded", function () {

// Verifique se o item 'loggedIn' está presente
console.log("Verificando login...", localStorage.getItem("loggedIn"));
if (!localStorage.getItem("loggedIn")) {
    console.log("Usuário não logado, redirecionando...");
    window.location.href = "login.html"; // Redireciona se não estiver logado
} else {
    console.log("Usuário logado, mantendo na index.");
}
	    
if (!localStorage.getItem("loggedIn")) {
        window.location.href = "login.html"; // Redireciona se não estiver logado
    }     
       // URL do arquivo no GitHub
        const fileUrl = "https://raw.githubusercontent.com/CatalogoEstoque/index/main/json.xlsx";

        fetch(fileUrl)
            .then(response => response.arrayBuffer())
            .then(data => {
                const workbook = XLSX.read(new Uint8Array(data), { type: "array" });

                // Pegando a primeira aba do arquivo
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];

                // Convertendo os dados para JSON
                allProducts = XLSX.utils.sheet_to_json(sheet);

                // Exibir os produtos assim que o arquivo for carregado
                filteredProductsGlobal = allProducts;

loadMoreProducts();
            })
            .catch(error => console.error("Erro ao carregar o arquivo:", error));
    });


    function filterSector(sector) {
    // Verifica se o filtro já está ativo
    if (selectedSector === sector) {
        // Se o filtro já estiver ativo, desfaça o filtro
        selectedSector = "";
        document.getElementById("active-filter").innerText = "Filtro ativo: Nenhum";
    } else {
        // Caso contrário, ative o filtro
        selectedSector = sector;
        selectedCategory = "";
        selectedFormat = "";
        document.getElementById("active-filter").innerText = `Filtro ativo: ${sector}`;
    }

    // Remove a classe 'selected' de todos os botões de setor
    document.querySelectorAll(".category").forEach(button => {
        button.classList.remove("selected");
    });

    // Adiciona a classe 'selected' ao botão clicado
    document.querySelectorAll(".category").forEach(button => {
        if (button.innerText === selectedSector) {
            button.classList.add("selected");
        }
    });

    applyFilters();
}


    function filterCategory(category) {
    // Verifica se o filtro já está ativo
    if (selectedCategory === category) {
        // Se o filtro já estiver ativo, desfaça o filtro
        selectedCategory = "";
        document.getElementById("active-filter").innerText = "Filtro ativo: Nenhum";
    } else {
        // Caso contrário, ative o filtro
        selectedSector = "";
        selectedFormat = "";
        selectedCategory = category;
        document.getElementById("active-filter").innerText = `Filtro ativo: ${category}`;
    }

    // Remove a classe 'selected' de todos os botões de categoria
    document.querySelectorAll(".category").forEach(button => {
        button.classList.remove("selected");
    });

    // Adiciona a classe 'selected' ao botão clicado
    document.querySelectorAll(".category").forEach(button => {
        if (button.innerText === selectedCategory) {
            button.classList.add("selected");
        }
    });

    applyFilters();
}


    function filterFormat(format) {
    // Verifica se o filtro já está ativo
    if (selectedFormat === format) {
        // Se o filtro já estiver ativo, desfaça o filtro
        selectedFormat = "";
        document.getElementById("active-filter").innerText = "Filtro ativo: Nenhum";
    } else {
        // Caso contrário, ative o filtro
        selectedSector = "";
        selectedCategory = "";
        selectedFormat = format;
        document.getElementById("active-filter").innerText = `${selectedCategory} ${selectedFormat ? '  Formato: ' + selectedFormat : ''}`;
    }

    // Remove a classe 'selected' de todos os botões de formato
    document.querySelectorAll(".category").forEach(button => {
        button.classList.remove("selected");
    });

    // Adiciona a classe 'selected' ao botão clicado
    document.querySelectorAll(".category").forEach(button => {
        if (button.innerText === selectedFormat) {
            button.classList.add("selected");
        }
    });

    applyFilters();
}

   function applyFilters() {
    const codeFilter = document.getElementById("filterCode").value.toLowerCase();
    const descriptionFilter = document.getElementById("filterDescription").value.toLowerCase();
    const locationFilter = document.getElementById("filterLocation").value.toLowerCase();
    const equipamentoFilter = document.getElementById("filterEquipamento").value.toLowerCase();

    let filteredProducts = allProducts;

    if (selectedCategory) {
        filteredProducts = filteredProducts.filter(product => product["Categoria"] === selectedCategory);
    }
    if (selectedFormat) {
        filteredProducts = filteredProducts.filter(product => product["Formato"] && product["Formato"].toLowerCase() === selectedFormat.toLowerCase());
    }
    if (selectedSector) {
        filteredProducts = filteredProducts.filter(product => product["Setor"] && product["Setor"].toLowerCase() === selectedSector.toLowerCase());
    }
    if (codeFilter) {
        filteredProducts = filteredProducts.filter(product => String(product.Material).toLowerCase().includes(codeFilter));
    }
    if (descriptionFilter) {
        filteredProducts = filteredProducts.filter(product => String(product.TxtBreveMaterial).toLowerCase().includes(descriptionFilter));
    }
    if (locationFilter) {
        filteredProducts = filteredProducts.filter(product => String(product["Pos.dpst."]).toLowerCase().includes(locationFilter));
    }
    if (equipamentoFilter) {
        filteredProducts = filteredProducts.filter(product => String(product.Equipamento).toLowerCase().includes(equipamentoFilter));
    }

    // Ordena os produtos em ordem alfabética pelo campo TxtBreveMaterial
    filteredProducts.sort((a, b) => {

    const nomeA =
    (a.TxtBreveMaterial || "").toString();

    const nomeB =
    (b.TxtBreveMaterial || "").toString();

    return nomeA.localeCompare(
        nomeB,
        undefined,
        { sensitivity: 'base' }
    );
});

	   
    document.getElementById("filtered-count").innerText = `Total Filtro: ${filteredProducts.length}`;

    filteredProductsGlobal = filteredProducts;

currentIndex = 0;

document.getElementById("product-list").innerHTML = "";

loadMoreProducts();
}

function loadMoreProducts() {

    const nextItems = filteredProductsGlobal.slice(
        currentIndex,
        currentIndex + itemsPerLoad
    );

    renderProducts(nextItems, true);

    currentIndex += itemsPerLoad;
}
    function renderProducts(products, append = false) {
    console.log(products);
    const productList =
    document.getElementById("product-list");

    if (!append) {
        productList.innerHTML = "";
    }

    if (products.length === 0 && !append) {
        productList.innerHTML =
        "<p>Nenhum produto encontrado.</p>";
        return;
    }

    products.forEach(product => {

        const div =
        document.createElement("div");

        div.classList.add("product");

        div.innerHTML = `
            <img src="${product.Imagem ?? 'placeholder.jpg'}"
                 onclick="zoomImage(this)">

            <div class="product-details">

                <h2>
                    ${product.Material ?? 'Código'} -
                    ${product.TxtBreveMaterial ?? 'Descrição'}
                </h2>

                <div class="info-row">

                    <span>
                        <strong>Unidade:</strong>
                        ${product.UMB ?? 'N/A'}
                    </span>

                    <span>
                        <strong>Posição:</strong>
                        ${product['Pos.dpst.'] ?? 'N/A'}
                    </span>

                </div>

                <div class="equipamento">
                    ${product.Equipamento ??
                    'Equipamento não cadastrado'}
                </div>

            </div>
        `;

        productList.appendChild(div);

    });

    document.getElementById("total-count")
    .innerText =
    `Total de itens: ${allProducts.length}`;
}

    function zoomImage(img) {

    // remove zoom antigo
    const existente =
    document.querySelector(".zoom-overlay");

    if (existente) {
        existente.remove();
        return;
    }

    // cria fundo escuro
    const overlay =
    document.createElement("div");

    overlay.classList.add("zoom-overlay");

    // cria imagem ampliada
    const zoomedImg =
    document.createElement("img");

    zoomedImg.src = img.src;

    overlay.appendChild(zoomedImg);

    // fecha ao clicar
    overlay.onclick = () => {
        overlay.remove();
    };

    document.body.appendChild(overlay);
}

    // CARREGA A LISTA DE EQUIPAMENTOS PARA SEREM SELECIONADOS
async function carregarEquipamentos() {
        try {
            // URL do arquivo Excel no GitHub
            let url = "https://raw.githubusercontent.com/CatalogoEstoque/index/main/json.xlsx";

            // Buscar o arquivo como um ArrayBuffer
            let response = await fetch(url);
            let data = await response.arrayBuffer();

            // Ler o arquivo Excel
            let workbook = XLSX.read(data, { type: "array" });

            // Seleciona a primeira aba da planilha
            let sheetName = workbook.SheetNames[0];
            let sheet = workbook.Sheets[sheetName];

            // Converte a planilha em JSON
            let jsonData = XLSX.utils.sheet_to_json(sheet);

            // Verifica se os dados estão corretos
            if (!Array.isArray(jsonData)) {
                console.error("Erro ao processar o arquivo XLSX!");
                return;
            }

            let select = document.getElementById("filterEquipamento");

            // Obtém os valores únicos da coluna "Equipamento", remove duplicatas e ordena
            let equipamentos = [...new Set(jsonData.map(item => item.Equipamento))].sort();

            // Preenche a caixa de seleção
            equipamentos.forEach(equipamento => {
                let option = document.createElement("option");
                option.value = equipamento;
                option.textContent = equipamento;
                select.appendChild(option);
            });

        } catch (error) {
            console.error("Erro ao carregar os dados:", error);
        }
    }

    // Chama a função ao carregar a página
    window.addEventListener("load", carregarEquipamentos);

/////////////////////////////////////////////////////////////////////////////////////////
function clearFilters() {

    selectedCategory = "";
    selectedFormat = "";
    selectedSector = "";

    document.getElementById("filterCode").value = "";
    document.getElementById("filterDescription").value = "";
    document.getElementById("filterLocation").value = "";
    document.getElementById("filterEquipamento").value = "";

    document.getElementById("active-filter").innerText =
    "Filtro ativo: Nenhum";

    document.getElementById("filtered-count").innerText =
    `Total Filtro: ${allProducts.length}`;

    document.querySelectorAll(".category").forEach(button => {
        button.classList.remove("selected");
    });

    let filterEquipamento =
    document.getElementById("filterEquipamento");

    if (filterEquipamento) {
        filterEquipamento.selectedIndex = 0;
    }

    filteredProductsGlobal = allProducts;

    currentIndex = 0;

    document.getElementById("product-list").innerHTML = "";

    loadMoreProducts();
}
   

window.addEventListener("scroll", () => {

    if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 500
    ) {

        if (
            currentIndex <
            filteredProductsGlobal.length
        ) {

            loadMoreProducts();
        }
    }
});