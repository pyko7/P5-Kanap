//garde seulement l'id du produit
const productId = window.location.search.split("?id=").join("");

const fetchProduct = async () =>{
    //appel à la base de données, récupération les données du produit
    const response = await fetch(`http://localhost:3000/api/products/${productId}`)
    if(response.ok){
        //renvoie de la reponse sous format json
        return await response.json();
    }
}

//function qui affiche les données du produit
const displayProduct = async (e) =>{
    //attendre de récupérer produits avant de faire la loop
    let products = await fetchProduct();
    console.log(products);

    //déclaration des variables
    const productImg = document.querySelector('.item__img')
    const productName = document.getElementById('title');
    const productPrice = document.getElementById('price');
    const productDescription = document.getElementById('description');
    const productColors = document.getElementById('colors');

    //affichage des données du produit
    productImg.innerHTML =
    `<img src="${products.imageUrl}" alt="${products.altTxt}">`;
    productName.textContent = products.name;
    productPrice.textContent = products.price;
    productDescription.textContent = products.description;
    //propose toutes les couleurs du produit
    products.colors.forEach(e =>{
        //création balise option
        let colors = document.createElement('option');
        //place balise option dans balise select
        productColors.appendChild(colors);
        //affichage du nom de la couleur
        colors.innerHTML = `${e}`;
        //donne valeur de la couleur à la balise
        colors.valuproducts = `${e}`;
    });
}

displayProduct();