//console.log("bienvenidos al script")
const socket = io()

socket.on('update.products', (data) => {
    const productsList = document.getElementById('products')
    productsList.innerHTML = ""
    data.forEach((product) => {
    productsList.innerHTML += `
        <li>
        ${product.title}
        <button onclick="removeProduct(${product.id})">Remove</button>
        </li>
        `
  })
})

const removeProduct = (id) => {
    fetch(`/api/products/${id}`, {
        method: 'DELETE'
        })
        .then((response)=> response.json)
        .then(data=> console.log(data))
    }

const addProduct = () => {
    const title = document.getElementById("title").value
    const description = document.getElementById("description").value
    const price = document.getElementById("price").value
    const thumbnail = document.getElementById("thumbnail").value
    const code = document.getElementById("code").value
    const stock = document.getElementById("stock").value
    const status = document.getElementById("status").value
    const category = document.getElementById("category").value
    const product = {
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
        status,
        category,
    }
    fetch('api/products', {
        method:'POST',
        headers:{
            "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
    })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);
      if (data.status === "error") {
        alert(data.message);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}   

