//function affiche le numéro de commande 
const displayOrderId = () =>{
    let orderId = localStorage.getItem('orderId');
    document.getElementById('orderId').textContent = orderId;
    localStorage.clear();
}
displayOrderId();
