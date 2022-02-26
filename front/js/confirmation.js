const displayOrderId = () =>{
    let orderId = localStorage.getItem('orderId');
    document.getElementById('orderId').textContent = orderId;
    localStorage.clear();
}
displayOrderId();
