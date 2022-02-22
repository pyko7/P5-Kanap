//récupère seulement l'id du produit
const params = (new URL(document.location)).searchParams;
const productId = params.get("id");

//function récupère les données du produit selon l'id
const getProduct = async () =>{
//récupère le produit
    let res = await fetch(`http://localhost:3000/api/products/${productId}`);
    let data = await res.json();
    return data;
}

//function défini le title de la page
const pageName = async () =>{
        let pageName = await getProduct();
        document.title = pageName.name;
    }
    
    

//function affiche les détails du produit
const displayProduct = async () =>{
    //récupère les données via la fonction
    var product = await getProduct();

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
    product.colors.forEach(element => {
        let colors = document.createElement('option');
        productColors.appendChild(colors);
        colors.textContent = element;
        colors.value = element;
    });

    addCart(product);
}

//function récupère élément dans localStorage
const getCart = () =>{
    let cart = JSON.parse(localStorage.getItem('cart'));
        if(cart == null){
            return [];
        }else{
            return cart;
        }
}

const addCart = (product) =>{
    //déclaration des variables
    const addToCart = document.getElementById('addToCart');
    const productColors = document.getElementById('colors');

    //event lors du click sur le bouton ajouter au panier
    addToCart.addEventListener('click', ()=>{
        //creation de l'objet kanap -> produit qui sera ajouté dans le panier
        let kanap = {
            id: product._id,
            color: productColors.value,
            quantity: quantity.value
        }

        let cart = getCart();

    //vérification de la présence de l'id dans l'array
    let findProduct = cart.find(element => element.id == kanap.id)
    let findColor = cart.find(element => element.color == kanap.color)

        //condition si article déjà dans le panier --> augmente la quantité
        if(findProduct != undefined && findColor !=undefined){
        //augmente la qté de la couleur choisie
            findColor.quantity = parseInt(findProduct.quantity) + parseInt(quantity.value);
        }else{
        //ajoute un nouveau produit au panier
            kanap.quantity = quantity.value ;
            cart.push(kanap);
        }        

    //stock élément dans localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    });
}

pageName();
displayProduct();
