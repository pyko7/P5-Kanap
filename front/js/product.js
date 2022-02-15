//function qui récupère tous les produits
const getProducts = async () => {
    //appel à la base de données, récupération de la liste des produits
    const response = await fetch("http://localhost:3000/api/products");
    //verification que la reponse soit correct
    if(response.ok){
        //renvoie de la reponse sous format json
        return await response.json();
    }
}

//function affiche le produit 
const displayProduct = async(e) =>{
    const productName = document.getElementById('title');
    const productPrice = document.getElementById('price');
    const productDescription = document.getElementById('description');
    const productColors = document.getElementById('colors');
    let products = await getProducts();
    productName.textContent = e.name;
    console.log('hello');
};

displayProduct()