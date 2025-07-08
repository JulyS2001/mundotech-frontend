// URL base de la API para categorías
const API_URL = "http://localhost:8080/api/categorias";

// Al cargar la página, mostramos el listado
document.addEventListener("DOMContentLoaded", listarCategorias);

// Manejador del formulario para guardar o actualizar
document.getElementById("form-categoria").addEventListener("submit", guardarCategoria);

// Botón para cancelar edición
document.getElementById("cancelar").addEventListener("click", () => {
  document.getElementById("form-categoria").reset();
  document.getElementById("idCategoria").value = "";
});

// === Listar todas las categorías ===
function listarCategorias() {
  fetch(API_URL)
    .then(response => response.json())
    .then(data => {
      const tbody = document.getElementById("tabla-categorias");
      tbody.innerHTML = ""; // Limpiar tabla
      data.forEach(cat => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
          <td>${cat.idCategoria}</td>
          <td>${cat.nombre}</td>
          <td>
            <button class="btn btn-warning btn-sm" onclick="editarCategoria(${cat.idCategoria})">Editar</button>
            <button class="btn btn-danger btn-sm" onclick="eliminarCategoria(${cat.idCategoria})">Eliminar</button>
          </td>
        `;
        tbody.appendChild(fila);
      });
    })
    .catch(error => console.error("Error al listar categorías:", error));
}

// === Guardar nueva categoría o actualizar existente ===
function guardarCategoria(event) {
  event.preventDefault();

  const id = document.getElementById("idCategoria").value;
  const nombre = document.getElementById("nombre").value.trim();

  if (!nombre) {
    alert("Por favor ingresa un nombre para la categoría.");
    return;
  }

  const categoria = { nombre };
  const url = id ? `${API_URL}/${id}` : API_URL;
  const method = id ? "PUT" : "POST";

  fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(categoria)
  })
    .then(response => {
      if (!response.ok) throw new Error("Error al guardar la categoría");
      return response.json();
    })
    .then(() => {
      alert(id ? "Categoría actualizada correctamente" : "Categoría creada correctamente");
      document.getElementById("form-categoria").reset();
      document.getElementById("idCategoria").value = "";
      listarCategorias();
    })
    .catch(error => console.error("Error al guardar categoría:", error));
}

// === Cargar categoría en el formulario para edición ===
function editarCategoria(id) {
  fetch(`${API_URL}/${id}`)
    .then(response => {
      if (!response.ok) throw new Error("Error al obtener categoría");
      return response.json();
    })
    .then(cat => {
      document.getElementById("idCategoria").value = cat.idCategoria;
      document.getElementById("nombre").value = cat.nombre;
      // Opcional: hacer foco en el input nombre
      document.getElementById("nombre").focus();
    })
    .catch(error => console.error("Error al obtener categoría:", error));
}

// === Eliminar categoría ===
function eliminarCategoria(id) {
  if (confirm("¿Deseás eliminar esta categoría?")) {
    fetch(`${API_URL}/${id}`, { method: "DELETE" })
      .then(response => {
        if (!response.ok) throw new Error("Error al eliminar la categoría");
        listarCategorias();
      })
      .catch(error => console.error("Error al eliminar categoría:", error));
  }
}
