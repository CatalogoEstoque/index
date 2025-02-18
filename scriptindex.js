let allProducts = [];
    let selectedCategory = "";
    let selectedFormat = "";

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
                renderProducts(allProducts);
            })
            .catch(error => console.error("Erro ao carregar o arquivo:", error));
    });

    function filterCategory(category) {
        selectedCategory = category;
     selectedFormat = "";
        document.getElementById("active-filter").innerText = `Filtro ativo: ${category}`;
        applyFilters();
    }

    function filterFormat(format) {
        selectedFormat = format;
        selectedCategory = "";
        document.getElementById("active-filter").innerText = `Filtro ativo: ${selectedCategory} ${selectedFormat ? '  Formato: ' + selectedFormat : ''}`;
        applyFilters();
    }

    function clearCategory() {
        selectedCategory = "";
        selectedFormat = "";
        applyFilters();
        document.getElementById("active-filter").textContent = "Filtro ativo: Nenhum";
        
    }

    function applyFilters() {
        const codeFilter = document.getElementById("filterCode").value.toLowerCase();
        const descriptionFilter = document.getElementById("filterDescription").value.toLowerCase();
        const locationFilter = document.getElementById("filterLocation").value.toLowerCase();

        let filteredProducts = allProducts;

        if (selectedCategory) {
            filteredProducts = filteredProducts.filter(product => product["Categoria"] === selectedCategory);
        }
        if (selectedFormat) {
            filteredProducts = filteredProducts.filter(product => product["Formato"] && product["Formato"].toLowerCase() === selectedFormat.toLowerCase());
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

        document.getElementById("filtered-count").innerText = `Total Filtro: ${filteredProducts.length}`;

        renderProducts(filteredProducts);
    }

    function renderProducts(products) {
        const productList = document.getElementById("product-list");
        productList.innerHTML = "";

        if (products.length === 0) {
            productList.innerHTML = "<p>Nenhum produto encontrado.</p>";
            return;
        }

        products.forEach(product => {
    const div = document.createElement("div");
    div.classList.add("product");
    div.innerHTML = `
        <img src="${product.Imagem ?? 'placeholder.jpg'}" onclick="zoomImage(this)">
        <h2>${product.Material ?? 'Material não especificado'}</h2>
        <div class="product-details">
            <p>${product.TxtBreveMaterial ?? 'Descrição não disponível'}</p>
            <p><strong>Unidade:</strong> ${product.UMB ?? 'N/A'}</p>
            <p><strong>Posição:</strong> ${product['Pos.dpst.'] ?? 'Localização não informada'}</p>
        </div>
            `;
            productList.appendChild(div);
        });

        console.log("Total de itens na lista:", allProducts.length);
        document.getElementById("total-count").innerText = `Total de itens: ${allProducts.length}`;
    }

    function zoomImage(img) {
        img.classList.toggle("zoom");
    }