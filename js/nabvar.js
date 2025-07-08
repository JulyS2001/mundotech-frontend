document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  const usuarioNombreNav = document.getElementById("usuarioNombreNav");
  const itemLogin = document.getElementById("item-login");
  const itemRegistro = document.getElementById("item-registro");
  const itemLogout = document.getElementById("item-logout");
  const btnLogout = document.getElementById("btnLogout");

  if (token && usuario) {
    usuarioNombreNav.textContent = usuario.nombre;

    itemLogin?.classList.add("d-none");
    itemRegistro?.classList.add("d-none");
    itemLogout?.classList.remove("d-none");
  } else {
    usuarioNombreNav.textContent = "";  
    itemLogin?.classList.remove("d-none");
    itemRegistro?.classList.remove("d-none");
    itemLogout?.classList.add("d-none");
  }

  btnLogout?.addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    alert("Sesión cerrada correctamente.");
    window.location.href = "login.html";
  });
});