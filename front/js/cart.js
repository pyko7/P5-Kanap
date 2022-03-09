//variables declaration - use for total price and total quantity in function totalOrder()
let totalProducts = 0;
let totalAmount = 0;

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

//function gets products data
const getProduct = () =>{
  let cart = getCart();
  cart.forEach(async (element) =>{
    const productId = element.id;
    let res = await fetch(`http://localhost:3000/api/products/${productId}`);
    let product = await res.json();
    if(res.ok){
      displayOrder(product,element)
      totalOrder(product,element);
      return product;
    }
  })
}

//function displays order and its modifications (quantity number/deletion)
const displayOrder = (product,element) =>{
  const cartItems = document.getElementById('cart__items');
    //display each product
    cartItems.innerHTML +=
    `
    <article class="cart__item" data-id="${element.id}" data-color="${element.color}">
    <div class="cart__item__img">
    <img src="${product.imageUrl}" alt="${product.altTxt}">
    </div>
    <div class="cart__item__content">
    <div class="cart__item__content__description">
    <h2>${product.name}</h2>
    <p>${element.color}</p>
    <p>${product.price} €</p>
    </div>
    <div class="cart__item__content__settings">
    <div class="cart__item__content__settings__quantity">
    <p>Qté :${element.quantity} </p>
    <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${element.quantity}">
    </div>
    <div class="cart__item__content__settings__delete">
    <p class="deleteItem">Supprimer</p>
    </div>
    </div>
    </div>
    </article>
    `

  //function changes quantity by the input
  const changeQuantity = () =>{
    let cart = getCart();
    let inputQuantity = document.querySelectorAll('.itemQuantity');
    
    inputQuantity.forEach(input =>{
      let kanapId = input.closest('[data-id]').dataset.id;
      let kanapColor = input.closest('[data-id]').dataset.color;
      let foundId = cart.find(kanap => kanap.id == kanapId && kanap.color == kanapColor);
  
  
    input.addEventListener('change',()=>{
      if(input.value < 1 || input.value > 100){
        //input value doesn't change 
        input.value = element.quantity;
        alert("La quantité choisie doit être comprise entre 1 et 100")
      }
      if(foundId != undefined){
          foundId.quantity = parseInt(input.value);
      }
      saveCart(cart);
      document.location.reload();
      });
  });
}
  
  //function remove a product
  const removeProduct = () =>{
    const deleteBtn = document.querySelectorAll('.deleteItem')
      deleteBtn.forEach(button =>{
        button.addEventListener('click', ()=>{
          let cart = getCart();
          const targetProductId = button.closest('[data-id]').dataset.id;
          const  targetProductColor= button.closest('[data-id]').dataset.color;
          //create new cart with every product that has a different id of targetProductId
          cart = cart.filter(kanap => kanap.id != targetProductId || kanap.color != targetProductColor);
          alert('Votre produit a été supprimé du panier')
          saveCart(cart)
        document.location.reload();
      })
    })
  }
  
changeQuantity();
removeProduct();
}




//function display total quantity and final price
const totalOrder = (product,element) =>{
  let totalQuantity = document.getElementById('totalQuantity');
  let totalPrice = document.getElementById('totalPrice');
  //arrays contain total quantity and total price
  let cartQuantity = [];
  let cartPrices = [];    

  //push element inside the arrays
  cartPrices.push(element.quantity * product.price);
  cartQuantity.push(element.quantity);
    
  //sum of quantity of each product - amount will be display
  for (let i = 0; i < cartQuantity.length; i++){
    //totalProducts starts at 0
    totalProducts += cartQuantity[i];
  }
  totalQuantity.textContent = totalProducts;
  
  //sum of prices of each product - price will be display
  for (let i = 0; i < cartPrices.length; i++){
    //totalAmount starts at 0
    totalAmount += cartPrices[i];
  }
  totalPrice.textContent = totalAmount.toFixed(2);
}


//function test inputs validity
const formSubmit = () =>{
  let form = document.querySelector('.cart__order__form');
  let firstNameMessage = document.getElementById('firstNameErrorMsg');
  let lastNameMessage = document.getElementById('lastNameErrorMsg');
  let cityMessage = document.getElementById('cityErrorMsg');
  let addressMessage = document.getElementById('addressErrorMsg');
  let emailMessage = document.getElementById('emailErrorMsg');

  //check inputs validity
  form.firstName.addEventListener('change', ()=>{
      validTextInput(form.firstName, firstNameMessage);
  });

  form.lastName.addEventListener('change', ()=>{
      validTextInput(form.lastName, lastNameMessage);
  });
  form.city.addEventListener('change', ()=>{
      validTextInput(form.city, cityMessage);
  });

  form.address.addEventListener('change', ()=>{
    validAddressInput(form.address,addressMessage);
  })
  form.email.addEventListener('change', ()=>{
      validEmailInput(form.email,emailMessage);
  });

  //function check firstName lastName city inputs validity
  const validTextInput = (input,error) =>{
    let textRegExp = new RegExp (/^([A-Za-z]+[\-'\s]?){2,}$/, 'g'); //([A-Za-z]+[\. \-_\s]?)+ A CHANGER
    let testInput = textRegExp.test(input.value);
    if (testInput){
      error.textContent = '';
      return true;
    }else{
      error.textContent = "Le texte saisi n'est pas valide.";
      return false;
    }
  }
  //function check address input validity
  const validAddressInput = (input) =>{
    let addressRegExp = new RegExp (/^([A-Za-z0-9]+[\-'\s]?){2,}$/, 'g');
    let testAddress = addressRegExp.test(input.value);
    if(testAddress){
      addressMessage.textContent = '';
      return true;
    }else{
      addressMessage.textContent = "Le texte saisi n'est pas valide."
      return false;
    }
  }
  
  //function check email input validity
  const validEmailInput = (input) =>{
    let emailRegExp = new RegExp (/^[a-zA-Z0-9\.\-\_]+[@]{1}[a-zA-Z]+[.]{1}[a-z]{2,}$/, 'g');
    let testEmail = emailRegExp.test(input.value);
    if (testEmail) {
      emailMessage.textContent = "";
      return true;
    }else{
      emailMessage.textContent = 'Veuillez choisir une adresse email valide.';
      return false;
    }
  }

  //submit event when user click "commander" button 
  form.addEventListener('submit', (event)=>{
      let cart = getCart();
      let products = [];
      cart.forEach(element =>{
        let productId = element.id;
        products.push(productId)
      })
      let order = {
      contact : {
        firstName: form.firstName.value,
        lastName: form.lastName.value,
        address: form.address.value,
        city: form.city.value,
        email: form.email.value
      },
      products: products
  };


  //check inputs validity -- if input value === false --> alert, else send order
    if (validEmailInput(email) === false || validAddressInput(address) === false){
      event.preventDefault();
      alert('Veuillez vérifier la validité de vos champs !');
    }else if(validTextInput(firstName,firstNameMessage) === false || validTextInput(lastName, lastNameMessage) === false || validTextInput(city,cityMessage) === false){
      event.preventDefault();
      alert('Veuillez vérifier la validité de vos champs !');
      //vérifie si le panier est rempli
    }else if(cart.length === 0){
      event.preventDefault();
      alert('Votre panier est vide, veuillez le remplir !');
    }else{ 
      alert('Votre commande a bien été prise en compte !');
      sendOrder(order);
    }
})
}
//function push data to API
const sendOrder = (order) =>{
  fetch("http://localhost:3000/api/products/order",{
      method: 'POST',
      headers:{
        "Content-Type": "application/json"
      },
      body: JSON.stringify(order),
    })
    .then(res => res.json())
    .then((data)=>{
      localStorage.clear();
      localStorage.setItem('orderId', data.orderId);
      document.location.href = "confirmation.html";
    });
};


getProduct();
formSubmit();

