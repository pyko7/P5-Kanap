//function qui récupère les données
const getProducts = async () =>{
    const response = await fetch("http://localhost:3000/api/products");
    //transforme la réponse en json
    const data = await response.json();
    
    if(response.ok){
        console.log(data);
        return data;
    }else{
        console.log("error");
    }
}

//function qui affiche les produits sur la page
const displayProducts = async () =>{
    let products = await getProducts();
    //container de tous les produits
    const itemSection = document.getElementById('items');
    //loop va prendre chaque élément du tableau
    products.forEach(e => {
        //+= permet avoir plusieurs éléments affiché
        itemSection.innerHTML +=
        `
        <a href="./product.html?id=${e._id}">
        <article>
          <img src="${e.imageUrl}" alt="${e.altTxt}">
          <h3 class="productName">${e.name}</h3>
          <p class="productDescription">${e.description}</p>
        </article>
      </a>
        `
        })
    };


displayProducts();

