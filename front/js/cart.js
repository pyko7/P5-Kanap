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

//function affiche le contenu du panier sur la page panier
const displayOrder = () =>{
  //récupère les données du localeStorage
  let cart = getCart();
  
  //création tableau qui va contenir tous les prix du panier
  let cartQuantity = [];
  let cartPrices = [];
  
  //loop pour chaque produit ajouter dans le panier
  cart.forEach(element => {
    const productId = element.id;
  
    //récupère les données du produit concerné
    fetch(`http://localhost:3000/api/products/${productId}`)
    .then((res)=>res.json())
    .then((product)=>{

      //déclaration des variables
      const cartItems = document.getElementById('cart__items');
      let totalQuantity = document.getElementById('totalQuantity');
      let totalPrice = document.getElementById('totalPrice');

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

    //function affiche total articles et prix total
    const totalOrder = () =>{
      let totalProducts = 0;
      let totalAmount = 0;
      let getTotalPrice = element.quantity * product.price;

      //ajouts des éléments dans leur tableau respectif
      cartQuantity.push(element.quantity);
      cartPrices.push(getTotalPrice);

      for (let i = 0; i < cartQuantity.length; i++){
        totalProducts += cartQuantity[i];
      }
      totalQuantity.textContent = totalProducts;

      for (let i = 0; i < cartPrices.length; i++){
        totalAmount += cartPrices[i];
      }
      totalPrice.textContent = totalAmount.toFixed(2);

    }

totalOrder(product);
changeQuantity(product);
removeProduct(product);
//fin du fetch
  }); 
  //fin de la loop
});

 //function change la quantité depuis l'input
const changeQuantity = (product) =>{
 let inputQuantity = document.querySelectorAll('.itemQuantity');
  
  inputQuantity.forEach(input =>{
    let kanapId = input.closest('[data-id]').dataset.id;
    let kanapColor = input.closest('[data-id]').dataset.color;
    let foundId = cart.find(kanap => kanap.id == kanapId && kanap.color == kanapColor);


    input.addEventListener('change',()=>{
        if(foundId != undefined){
            foundId.quantity = parseInt(input.value);
        }
        saveCart(cart);
        document.location.reload();
      });
  });
}
//function enlève un produit du panier
const removeProduct = (product) =>{
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

}

//function test la validité des inputs
const formSubmit = () =>{
  let form = document.querySelector('.cart__order__form');
  let firstNameMessage = document.getElementById('firstNameErrorMsg')
  let lastNameMessage = document.getElementById('lastNameErrorMsg')
  let cityMessage = document.getElementById('cityErrorMsg')
  let addressMessage = document.getElementById('addressErrorMsg')
  let emailMessage = document.getElementById('emailErrorMsg')

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
    validTextInput(form.address,addressMessage);
  })
  form.email.addEventListener('change', ()=>{
      validEmailInput(form.email,emailMessage);
  });

  //function contrôle validité des inputs text
  const validTextInput = (input, error) =>{
    // let textRegExp = new RegExp ('^.{2,}$', 'g');
    // let testInput = textRegExp.test(input.value);
    if (input.value.length >= 2){
      error.textContent = '';
      return true;
    }else{
      error.textContent = "Le champ doit contenir au moins 2 caractères";
      return false;
    }
  }
  
  //function contrôle validité des inputs email
  const validEmailInput = (input, error) =>{
    let emailRegExp = new RegExp ('^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z]+[.]{1}[a-z]{2,5}$', 'g');
    let testEmail = emailRegExp.test(input.value);
    if (testEmail) {
      emailMessage.textContent = "";
      return true;
    }else{
      emailMessage.textContent = 'Veuillez choisir une adresse email valide';
      return false;
    }
  }

  form.addEventListener('submit', (e)=>{
    e.preventDefault();
      let cart = getCart();
      let products = [];
      cart.forEach(element =>{
        let productId = element.id;
        products.push(productId)
      })
      let order = {
      contact: {
        firstName: form.firstName.value,
        lastName: form.lastName.value,
        address: form.address.value,
        city: form.city.value,
        email: form.email.value
      },
      products: products
  };

  //vérifie si tous les champs sont correctements remplis
    if (validEmailInput(email)===false || Object.values(order).some(obj => obj === false)){
      alert('Veuillez vérifier la validité de vos champs !');
      e.preventDefault();
    //vérifie si le panier est rempli
    }else if(cart == false){
      alert('Votre panier est vide, veuillez le remplir !');
      e.preventDefault();
    }else{ 
      alert('Votre commande a bien été prise en compte !');
      e.preventDefault();
      // form.submit();
    }

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
 sendOrder(order);

})
}


displayOrder();
formSubmit();
