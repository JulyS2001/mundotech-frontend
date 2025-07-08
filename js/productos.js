const API_URL_PRODUCTOS = "http://localhost:8080/api/productos";
const API_URL_CATEGORIAS = "http://localhost:8080/api/categorias";

document.addEventListener("DOMContentLoaded", () => {
  listarProductos();
  listarCategorias();
  listarProductosDestacados();

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  if (id) {
    mostrarProductoIndividual(id);
  }
});

document.getElementById("form-producto")?.addEventListener("submit", guardarProducto);

document.getElementById("cancelar")?.addEventListener("click", () => {
  limpiarFormulario();
});

// === Listar productos en tabla (CRUD) ===
function listarProductos() {
  fetch(API_URL_PRODUCTOS)
    .then(res => res.json())
    .then(data => {
      const tbody = document.getElementById("tabla-productos");
      if (!tbody) return; 
      tbody.innerHTML = "";
      data.forEach(p => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
          <td>${p.idProducto}</td>
          <td>${p.nombre}</td>
          <td>$${p.precio.toFixed(2)}</td>
          <td>${p.stock}</td>
          <td>${p.descripcion}</td>
          <td>
            <button class="btn btn-warning btn-sm" onclick="editarProducto(${p.idProducto})">Editar</button>
            <button class="btn btn-danger btn-sm" onclick="eliminarProducto(${p.idProducto})">Eliminar</button>
          </td>
        `;
        tbody.appendChild(fila);
      });
    })
    .catch(error => console.error("Error al listar productos:", error));
}

// === Listar categorías para el select ===
function listarCategorias() {
  fetch(API_URL_CATEGORIAS)
    .then(res => res.json())
    .then(data => {
      const select = document.getElementById("idCategoria");
      if (!select) return;
      select.innerHTML = '<option disabled selected>Seleccione una categoría</option>';
      data.forEach(cat => {
        const option = document.createElement("option");
        option.value = cat.idCategoria;
        option.textContent = cat.nombre;
        select.appendChild(option);
      });
    })
    .catch(error => console.error("Error al listar categorías:", error));
}

// === Guardar producto nuevo o actualizar existente ===
function guardarProducto(event) {
  event.preventDefault();

  const id = document.getElementById("idProducto").value;
  const nombre = document.getElementById("nombre").value.trim();
  const descripcion = document.getElementById("descripcion").value.trim();
  const precio = parseFloat(document.getElementById("precio").value);
  const stock = parseInt(document.getElementById("stock").value);
  const categoriaId = document.getElementById("idCategoria").value;
  const imagenFile = document.getElementById("imagen").files[0];

  if (!nombre || !descripcion || isNaN(precio) || isNaN(stock) || !categoriaId) {
    alert("Por favor completa todos los campos correctamente.");
    return;
  }

  const formData = new FormData();
  formData.append("nombre", nombre);
  formData.append("descripcion", descripcion);
  formData.append("precio", precio);
  formData.append("stock", stock);
  formData.append("categoriaId", categoriaId);

  if (imagenFile) {
    formData.append("imagen", imagenFile); // Solo si se eligió nueva imagen
  }

  const url = id ? `${API_URL_PRODUCTOS}/${id}` : API_URL_PRODUCTOS;
  const method = id ? "PUT" : "POST";

  fetch(url, {
    method,
    body: formData
  })
    .then(res => {
      if (!res.ok) throw new Error("Error al guardar producto");
      return res.json();
    })
    .then(() => {
      alert("Producto guardado correctamente.");
      limpiarFormulario();
      listarProductos();
    })
    .catch(error => console.error("Error al guardar producto:", error));
}


// === Cargar producto para editar ===
function editarProducto(id) {
  fetch(`${API_URL_PRODUCTOS}/${id}`)
    .then(res => {
      if (!res.ok) throw new Error("Producto no encontrado");
      return res.json();
    })
    .then(p => {
      document.getElementById("idProducto").value = p.idProducto;
      document.getElementById("nombre").value = p.nombre;
      document.getElementById("descripcion").value = p.descripcion;
      document.getElementById("precio").value = p.precio;
      document.getElementById("stock").value = p.stock;
      document.getElementById("idCategoria").value = p.categoria.idCategoria;
    })
    .catch(error => console.error("Error al cargar producto:", error));
}

// === Eliminar producto ===
function eliminarProducto(id) {
  if (confirm("¿Seguro que querés eliminar este producto?")) {
    fetch(`${API_URL_PRODUCTOS}/${id}`, { method: "DELETE" })
      .then(res => {
        if (!res.ok) throw new Error("Error al eliminar producto");
        listarProductos();
      })
      .catch(error => console.error("Error al eliminar producto:", error));
  }
}

// === Limpiar formulario ===
function limpiarFormulario() {
  document.getElementById("form-producto")?.reset();
  document.getElementById("idProducto").value = "";
}

// === Mostrar productos en cards limitando a 'limite' (por defecto 6) ===
function mostrarProductosLimitados(productos, limite = 6) {
  const contenedor = document.getElementById("productos-destacados");
  if (!contenedor) return; // No hacer nada si no existe el contenedor

  contenedor.innerHTML = ""; // Limpiar contenedor

  const productosAMostrar = productos.slice(0, limite);

  productosAMostrar.forEach(producto => {
    const card = document.createElement("div");
    card.className = "col";
    

    card.innerHTML = `
      <a href="/verDetalleProducto.html?id=${producto.idProducto}" style="text-decoration: none; color: inherit;">
        <div class="card h-100">
          <img src="http://localhost:8080/images/${producto.imagen}" class="card-img-top" alt="${producto.nombre}" />
          <div class="card-body">
            <h5 class="card-title">${producto.nombre}</h5>
          </div>
          <div class="card-footer">
            <strong>$${producto.precio.toFixed(2)}</strong>
          </div>
        </div>
      </a>
    `;

    contenedor.appendChild(card);
  });
}

// === Listar productos destacados para index ===
function listarProductosDestacados() {
  fetch(API_URL_PRODUCTOS)
    .then(res => res.json())
    .then(productos => {
      mostrarProductosLimitados(productos, 6);  // Mostrar solo 6
    })
    .catch(error => console.error("Error al listar productos destacados:", error));
}

function mostrarProductoIndividual(id) {
  const contenedor = document.getElementById("detalle-container");
  if (!contenedor) return;

  fetch(`${API_URL_PRODUCTOS}/${id}`)
    .then(res => {
      if (!res.ok) throw new Error("Producto no encontrado");
      return res.json();
    })
    .then(producto => {
      contenedor.innerHTML = "";

      const card = document.createElement("div");
      card.className = "card mx-auto mt-4";
      card.style.maxWidth = "600px";

      card.innerHTML = `
        <img src="http://localhost:8080/images/${producto.imagen}" class="card-img-top" alt="${producto.nombre}" />
        <div class="card-body">
          <h5 class="card-title">${producto.nombre}</h5>
          <p class="card-text">${producto.descripcion}</p>
          <p class="card-text">Stock: ${producto.stock}</p>
          <div class="card-footer">
          <p class="card-text"><strong>Precio:</strong> $${producto.precio.toFixed(2)}</p>
          </div>
        </div>
      `;

      contenedor.appendChild(card);
    })
    .catch(error => {
      console.error("Error al mostrar producto:", error);
      contenedor.innerHTML = "<p class='text-danger'>Error al cargar el producto.</p>";
    });
}