//get product ID
const params = (new URL(window.location)).searchParams;
const productId = params.get('id');

//function get data of product displayed on page
const getProduct = async () =>{
    let res = await fetch(`http://localhost:3000/api/products/${productId}`);
    let data = await res.json();
    if(res.ok){
        return data;
    }
}

//function defines page name
const pageName = async () =>{
        let pageName = await getProduct();
        document.title = pageName.name;
    }
    

//function displays product details
const displayProduct = async () =>{
    //get data with getProduct()
    let product = await getProduct();

    //variables declaration
    const productImg = document.querySelector('.item__img');
    const productName = document.getElementById('title');
    const productPrice = document.getElementById('price');
    const productDescription = document.getElementById('description');
    const productColors = document.getElementById('colors');

    //display of product details
    productImg.innerHTML = `<img src="${product.imageUrl}" alt="${product.altTxt}">`;
    productName.textContent = product.name;
    productPrice.textContent = product.price;
    productDescription.textContent = product.description;

    //loop create a new option for each color
    product.colors.forEach(element => {
        let colors = document.createElement('option');
        //new color is now child of the select element
        productColors.appendChild(colors);
        //give name and value of the color
        colors.textContent = element;
        colors.value = element;
    });
}

//function stocks element in localStorage
const saveCart = (cart) =>{
    localStorage.setItem('cart', JSON.stringify(cart));
}

//function gets element in localStorage
const getCart = () =>{
    let cart = JSON.parse(localStorage.getItem('cart'));
        if(cart == null){
            return [];
        }else{
            return cart;
        }
}

//function adds product to cart
const addCart = async () =>{
    let product = await getProduct();
    let cart = getCart();
    //variables declaration
    const addToCart = document.getElementById('addToCart');
    const quantity = document.getElementById('quantity');
    const productColors = document.getElementById('colors');

    //click event on add to cart button
    addToCart.addEventListener('click', (event)=>{
        //creation of kanap object -> product store into localStorage
        let kanap = {
            id: product._id,
            color: productColors.value,
            quantity: quantity.value
        }
    let foundId = cart.find(element => element.id == kanap.id && element.color == kanap.color)
    
    //check for existing color or invalid quantity
    if(kanap.color === ""){
        event.preventDefault();
        alert('Veuillez choisir une couleur');
    }else if(kanap.quantity < 1 || kanap.quantity > 100){
        event.preventDefault();
        alert('La quantité choisie est invalide')
    }else{
        if(foundId != undefined){
            //increase quantity of product
            foundId.quantity = parseInt(foundId.quantity) + parseInt(quantity.value);
            }else{
            //add new product to cart
            kanap.quantity = parseInt(quantity.value);
            cart.push(kanap);
        }
    }        
    //save new cart to localStorage
    saveCart(cart);
    });
}

pageName();
displayProduct();
addCart();
