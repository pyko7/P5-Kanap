//function qui récupère les données
const getProducts = async () =>{
    const res = await fetch("http://localhost:3000/api/products");
    //transforme la réponse en json
    const data = await res.json();
    
    if(res.ok){
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
    products.forEach(element => {
        //+= permet avoir plusieurs éléments affiché
        itemSection.innerHTML +=
        `
        <a href="./product.html?id=${element._id}">
        <article>
          <img src="${element.imageUrl}" alt="${element.altTxt}">
          <h3 class="productName">${element.name}</h3>
          <p class="productDescription">${element.description}</p>
        </article>
      </a>
        `
        })
    };


displayProducts();

