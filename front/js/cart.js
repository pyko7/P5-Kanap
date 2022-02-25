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
const inputController = () =>{
  let form = document.querySelector('.cart__order__form');
  let firstNameMessage = document.getElementById('firstNameErrorMsg')
  let lastNameMessage = document.getElementById('lastNameErrorMsg')
  let cityMessage = document.getElementById('cityErrorMsg')
  let addressMessage = document.getElementById('addressErrorMsg')
  let emailMessage = document.getElementById('emailErrorMsg')

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
      validEmailInput(form.email);
  });

  const validTextInput = (input, error) =>{
    let textRegExp = new RegExp ('^.{2,}$', 'g');
    let testInput = textRegExp.test(input.value);
    if (testInput){
      error.textContent = '';
      return input.value;
    }else{
      console.log(error);
      error.textContent = "Le champ doit contenir au moins 2 caractères";
    }
  }

  const validEmailInput = (input) =>{
    let emailRegExp = new RegExp ('^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$', 'g');
    let testEmail = emailRegExp.test(input.value);
    if (testEmail) {
      emailMessage.textContent = "";
      return input.value;
    }else{
      emailMessage.textContent = 'Veuillez choisir une adresse email valide';
    }
  }

}



displayOrder();
inputController();