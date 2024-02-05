const socket = io();
const productForm = document.getElementById('productForm');

productForm.addEventListener('submit', (event) => {
event.preventDefault();


const title = document.getElementById('productTitle').value;
const description = document.getElementById('productDescription').value;
const price = parseFloat(document.getElementById('productPrice').value);


socket.emit('addProduct', { title, description, price });
});

socket.on("updateProducts", (data) => {

console.log("Productos actualizados:", data);

const productList = document.getElementById("productList");


productList.innerHTML = "";


data.forEach((product) => {
const productItem = document.createElement("div");
productItem.innerHTML = `
    <h3>${product.title}</h3>
    <p>${product.description}</p>
    <p>Precio: $${product.price}</p>
`;

productList.appendChild(productItem);
});
});