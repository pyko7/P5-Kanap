//récupère seulement l'id du produit 
const productId = window.location.search.split("?id=").join('');

//function récupère les données du produit selon l'id
const getProducts = async () =>{
//récupère le produit
    let res = await fetch(`http://localhost:3000/api/products/${productId}`);
    let data = await res.json();
    return data;
    console.log(data);
}

//function affiche les détails du produit
const displayProducts = async () =>{
    //récupère les données via la fonction
    let product = await getProducts();

    //déclarations des variables
    const productImg = document.querySelector('.item__img');
    const productName = document.getElementById('title');
    const productPrice = document.getElementById('price');
    const productDescription = document.getElementById('description');
    const productColors = document.getElementById('colors');

    //affichage des données du produit
    productImg.innerHTML = `<img src="${product.imageUrl}" alt="${product.altTxt}">`;
    productName.textContent = product.name;
    productPrice.textContent = product.price;
    productDescription.textContent = product.description;
    //loop qui créé une option pour chaque couleur 
    product.colors.forEach(e => {
        let colors = document.createElement('option');
        productColors.appendChild(colors);
        colors.textContent = e;
        colors.value = e;
    });
}

displayProducts();