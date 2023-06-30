const socket = io();

const formulario = document.getElementById("formulario");
formulario.addEventListener("submit", (e) => {
  e.preventDefault();

  const nameInput = document.getElementById("nombre").value;
  const priceInput = document.getElementById("precio").value;
  const codigoInput = document.getElementById("codigo").value;

  const newProduct = {
    title: nameInput,
    description: "descripcion de prueba",
    price: priceInput,
    code: codigoInput,
    stock: 10,
    category: "category Prueba",
    status: true,
  };
  socket.emit("message", { product: newProduct });
});

socket.on("paraTodos", (data) => {
  const productos = data.products;

  const lista = document.getElementById("lista");
  lista.innerHTML = "";

  productos.forEach((element) => {
    const li = document.createElement("li");
    li.className = "container";
    li.innerHTML = `
    <p>id:${element.id}</p>
    <p>Nombre:${element.title}</p>
    <p>Descripción:${element.description}</p>
    <p>Precio:${element.price}</p>
    <p>Código: ${element.code}</p>
    <p>Stock: ${element.stock}</p>
    <p>Categoría: ${element.category}</p>
    <p>Status: ${element.status}</p>`;
    lista.appendChild(li);
  });
});

const formRemove = document.getElementById("formRemove");
formRemove.addEventListener("submit", (e) => {
  e.preventDefault();

  const idInput = document.getElementById("idProduct").value;
  socket.emit("message", { remove: idInput });
});
