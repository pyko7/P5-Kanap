let totalProducts = 0;
let totalAmount = 0;

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

//function récupère les données du produit 
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
    }else{
      console.log("Erreur");
    }
  })
}

//function affichage de la commande et de ses modifications (modifications de quantité, suppression d'articles)
const displayOrder = (product,element) =>{
  const cartItems = document.getElementById('cart__items');
    //affichage de chaque produit sur la page
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

  //function change la quantité depuis l'input
  const changeQuantity = () =>{
    let cart = getCart();
    let inputQuantity = document.querySelectorAll('.itemQuantity');
    
    inputQuantity.forEach(input =>{
      let kanapId = input.closest('[data-id]').dataset.id;
      let kanapColor = input.closest('[data-id]').dataset.color;
      let foundId = cart.find(kanap => kanap.id == kanapId && kanap.color == kanapColor);
  
  
    input.addEventListener('change',()=>{
      if(input.value < 1 || input.value > 100){
        //la valeur de l'input est la même que la quantité choisie avant
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
  
  //function enlève un produit du panier
  const removeProduct = () =>{
    const deleteBtn = document.querySelectorAll('.deleteItem')
      deleteBtn.forEach(button =>{
        button.addEventListener('click', ()=>{
          let cart = getCart();
          const targetProductId = button.closest('[data-id]').dataset.id;
          const  targetProductColor= button.closest('[data-id]').dataset.color;
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




//function affiche total articles et prix total
const totalOrder = (product,element) =>{
  let totalQuantity = document.getElementById('totalQuantity');
  let totalPrice = document.getElementById('totalPrice');
  //création tableau qui va contenir tous les prix du panier
  let cartQuantity = [];
  let cartPrices = [];    

  //ajouts des éléments dans leur tableau respectif
  cartPrices.push(element.quantity * product.price);
  cartQuantity.push(element.quantity);
    
  //somme des quantités de chaque produit - la somme sera affichée
  for (let i = 0; i < cartQuantity.length; i++){
    totalProducts += cartQuantity[i];
  }
  totalQuantity.textContent = totalProducts;
  
  //somme des prix du nombre de produits - la somme sera affichée
  for (let i = 0; i < cartPrices.length; i++){
    totalAmount += cartPrices[i];
  }
  totalPrice.textContent = totalAmount.toFixed(2);
}


//function test la validité des inputs
const formSubmit = () =>{
  let form = document.querySelector('.cart__order__form');
  let firstNameMessage = document.getElementById('firstNameErrorMsg');
  let lastNameMessage = document.getElementById('lastNameErrorMsg');
  let cityMessage = document.getElementById('cityErrorMsg');
  let addressMessage = document.getElementById('addressErrorMsg');
  let emailMessage = document.getElementById('emailErrorMsg');

  //contrôle de la validité des inputs
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

  //function contrôle validité des inputs text
  const validTextInput = (input,error) =>{
    let textRegExp = new RegExp (/^([A-Za-z]+[\.\-_'\s]?){2,}$/, 'g'); //([A-Za-z]+[\. \-_\s]?)+ A CHANGER
    let testInput = textRegExp.test(input.value);
    if (testInput){
      error.textContent = '';
      console.log(input.value + " le test est bon");
      return true;
    }else{
      error.textContent = "Le texte saisi n'est pas valide.";
      console.log(input.value + " le test est pas bon");
      return false;
    }
  }

  const validAddressInput = (input) =>{
    let addressRegExp = new RegExp (/^([A-Za-z0-9]+[\.\-_'\s]?){2,}$/, 'g');
    let testAddress = addressRegExp.test(input.value);
    if(testAddress){
      addressMessage.textContent = '';
      console.log(input.value + " address bon");
      return true;
    }else{
      addressMessage.textContent = "Le texte saisi n'est pas valide."
      console.log(input.value + " address pas bon");
      return false;
    }
  }
  
  //function contrôle validité des inputs email
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

  //event lors de la confirmation de commande - click sur le bouton commander
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


  //vérifie si tous les champs sont correctements remplis
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
//function envoie données à l'API
const sendOrder = (order) =>{
  fetch("http://localhost:3000/api/products/order",{
      method: 'POST',
      headers:{
        "Content-Type": "application/json"
      },
      body: JSON.stringify(order),
    })
    .then((res)=>{
      return res.json();
    })
    .then((data)=>{
      localStorage.clear();
      localStorage.setItem('orderId', data.orderId);
      document.location.href = "confirmation.html";
    });
};


getProduct();
formSubmit();

