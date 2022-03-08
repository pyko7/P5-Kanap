//function get datas from API
const getProducts = async () =>{
    const res = await fetch("http://localhost:3000/api/products");
    //convert response to json
    const data = await res.json();
    console.log(res);
    //if status 200-299 -> return res.json()
    if(res.ok){
        return data;
    }
}

//function display all products on homepage
const displayProducts = async () =>{
    let products = await getProducts();
    //container of items displayed on the page
    const itemSection = document.getElementById('items');
    //loop on every product of the API
    products.forEach(element => {
        //+= allows to display all products
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

