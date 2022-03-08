//récupère l'id du produit
const params = (new URL(document.location)).searchParams;
const productId = params.get("id");

//function récupère les données du produit selon l'id
const getProduct = async () =>{
//récupère le produit
    let res = await fetch(`http://localhost:3000/api/products/${productId}`);
    let data = await res.json();
    if(res.ok){
        return data;
    }else{
        console.log("erreur");
    }
}

//function défini le title de la page
const pageName = async () =>{
        let pageName = await getProduct();
        document.title = pageName.name;
    }
    
    

//function affiche les détails du produit
const displayProduct = async () =>{
    //récupère les données via la fonction
    let product = await getProduct();

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

//function stock élément dans localStorage
const saveCart = (cart) =>{
    localStorage.setItem('cart', JSON.stringify(cart));
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

//function ajoute les éléments au panier
const addCart = (product) =>{
    let cart = getCart();
    //déclaration des variables
    const addToCart = document.getElementById('addToCart');
    const quantity = document.getElementById('quantity');
    const productColors = document.getElementById('colors');

    //event lors du click sur le bouton ajouter au panier
    addToCart.addEventListener('click', (event)=>{
        //creation de l'objet kanap -> produit qui sera ajouté dans le panier
        let kanap = {
            id: product._id,
            color: productColors.value,
            quantity: quantity.value
        }
    let foundId = cart.find(element => element.id == kanap.id && element.color == kanap.color)

    if(kanap.color === ""){
        event.preventDefault();
        alert('Veuillez choisir une couleur');
    }else if(kanap.quantity < 1 || kanap.quantity > 100){
        event.preventDefault();
        alert('La quantité choisie est invalide')
    }else{
        if(foundId != undefined){
            //augmente la qté de la couleur choisie
            foundId.quantity = parseInt(foundId.quantity) + parseInt(quantity.value);
            }else{
            //ajoute un nouveau produit au panier
            kanap.quantity = parseInt(quantity.value);
            cart.push(kanap);
        }
    }        

    saveCart(cart);

    });
}

pageName();
displayProduct();