export class MenuModel {
    static searchTerm = ""
    static sortOption = "highest rating"
    static products = []
    
    static loadProductsFromBackend() {
        return fetch("/menu/products")
            .then(response => response.json())
            .then(receivedProducts => {
                this.products = receivedProducts
            })
    }
    
    static getProductByName(productName) {
        return this.products.find(p => p.name === productName)
    }
    
    static setSearchTerm(searchTerm) {
        this.searchTerm = searchTerm
    }
    
    static setSortOption(sortOption) {
        this.sortOption = sortOption
    }
    
    static getSearchResults() {
        return this.products
            .filter(
                product => this.searchTerm === ""
                || product.name.toLowerCase().includes(this.searchTerm.toLowerCase())
                || product.description.toLowerCase().includes(this.searchTerm.toLowerCase())
                || product.icon == this.searchTerm
            )
            .sort((a, b) => {
                if (this.sortOption == "highest rating") {
                    return b.rating - a.rating;
                } else if (this.sortOption == "lowest rating") {
                    return a.rating - b.rating;
                } else if (this.sortOption == "highest price") {
                    return b.price - a.price;
                } else if (this.sortOption == "lowest price") {
                    return a.price - b.price;
                } 
            })
    }
}

export class MenuController {
    static {
        // Tell the model to load the products from the backend
        MenuModel.loadProductsFromBackend()
            .then(() => this.renderProductList())

        // Setup the input event on the search bar
        document.getElementById("menu-product-search")
            .addEventListener("input", e => {
                MenuModel.setSearchTerm(e.target.value)
                this.renderProductList()
            })

        // Setup the input event on the sort select box
        document.getElementById("menu-product-sort")
            .addEventListener("input", e => {
                MenuModel.setSortOption(e.target.value)
                this.renderProductList()
            })
    }
    
    // Triggered when the user selects a product from the list,
    // loads and displays the products details partial on the side.
    static renderProductDetails(productName) {
        fetch("/menu/products/" + productName)
            .then(response => response.text())
            .then(productPartialHTML => {

                document.getElementById("product-details")
                    .innerHTML = productPartialHTML
            })
    }
    
    // Render the list of products from the model to the page
    static renderProductList() {
        const filteredAndSortedProducts = MenuModel.getSearchResults()
        
        const menuProductList = document.getElementById("menu-product-list")
        menuProductList.innerHTML = ""

        for (const product of filteredAndSortedProducts) {
            menuProductList.innerHTML += `
            <article class="card">
                <span>${product.icon}</span>
                <span>${product.name}</span>
                <span>$ ${product.price}</span>
                <meter 
                    min="0" 
                    max="10" 
                    low="4" 
                    high="8" 
                    optimum="9"
                    value="${product.rating * 10}"
                ></meter>
                <input
                    type="button"
                    value="view"
                    onclick="renderProductDetails('${product.name}')"
                >
            </article>
            `
        }
    }
}

window.renderProductDetails = (productName) => 
    MenuController.renderProductDetails(productName)