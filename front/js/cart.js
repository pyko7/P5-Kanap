//function récupère les données
const getProducts = async () =>{
    const res = await fetch("http://localhost:3000/api/products");
    const data = await res.json();
    
    if(res.ok){
        return data;
    }else{
        console.log("error");
    }
}

//function affiche le récapitulatif de la commande
const displayOrder = async () =>{

    let products = await getProducts();
    let cart = JSON.parse(localStorage.getItem('cart'));
    const cartItems = document.getElementById('cart__items');
    const totalQuantity = document.getElementById('totalQuantity');
    const totalPrice = document.getElementById('totalPrice');

    console.log(cart);

    cart.forEach(element => {
        cartItems.innerHTML +=
        `
        <article class="cart__item" data-id="${element.id}" data-color="${element.color}">
            <div class="cart__item__img">
            <img src="${products.imageUrl}" alt="${products.altTxt}">
            </div>
            <div class="cart__item__content">
            <div class="cart__item__content__description">
                <h2>${products.name}</h2>
                <p>${element.color}</p>
                <p>${products.price}</p>
            </div>
            <div class="cart__item__content__settings">
                <div class="cart__item__content__settings__quantity">
                <p>Qté :${element.quantity} </p>
                <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="42">
                </div>
                <div class="cart__item__content__settings__delete">
                <p class="deleteItem">Supprimer</p>
                </div>
            </div>
            </div>
        </article>
        `
    });
}
    
displayOrder();