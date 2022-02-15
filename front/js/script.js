//function qui récupère tous les produits
const getProducts = async () => {
    //appel à la base de données, récupération de la liste des produits
    const response = await fetch("http://localhost:3000/api/products");
    //verification que la reponse soit correct
    if(response.ok){
        //renvoie de la reponse sous format json
        return await response.json();
    }
}

//function qui affiche les produits sur la page
const renderProducts = async () => {
    //section où les produits seront visibles
    const itemSection = document.getElementById('items');
    //attendre de récupérer produits avant de faire la loop
    let products = await getProducts();
    //loop qui va selectionner chaque produits du tableau
    products.forEach(e => {
    // += permet afficher tous les éléments
    itemSection.innerHTML +=
            //renvoi vers la page du produit
            `<a href="./product.html?id=${e._id}">
                <article>
                    <img src="${e.imageUrl}" alt="${e.altTxt}">
                    <h3 class="productName">${e.name}</h3>
                    <p class="productDescription">${e.description}</p>
            </article>
          </a>`;
    });
}

renderProducts();
