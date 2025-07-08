const API_BASE_URL = "http://localhost:8080/api/auth";

//  Registro
const formRegistro = document.getElementById("form-registro");
if (formRegistro) {
  formRegistro.addEventListener("submit", async (e) => {
    e.preventDefault();

    const usuario = {
      nombre: document.getElementById("nombre").value.trim(),
      email: document.getElementById("email").value.trim(),
      contrasenia: document.getElementById("contrasenia").value.trim(),
      rol: document.getElementById("rol").value.trim(),
    };

    try {
      const res = await fetch(`${API_BASE_URL}/registro`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(usuario),
      });

      if (res.ok) {
        alert("✅ Registro exitoso. ¡Ya podés iniciar sesión!");
        window.location.href = "login.html";
      } else {
        const error = await res.text();
        alert("❌ Error al registrarse: " + error);
      }
    } catch (error) {
      console.error("Error de red:", error);
      alert("❌ Error de red al registrar.");
    }
  });
}

// Login
const formLogin = document.getElementById("form-login");
if (formLogin) {
  formLogin.addEventListener("submit", async (e) => {
    e.preventDefault();

    const credenciales = {
      email: document.getElementById("email-login").value.trim(),
      contrasenia: document.getElementById("contrasenia-login").value.trim(),
    };

    try {
      const res = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credenciales),
      });

      if (res.ok) {
        const data = await res.json();
        // Guardamos el token JWT en localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("usuario", JSON.stringify(data.usuario));
        localStorage.setItem("usuarioNombre", data.usuario.nombre);
        alert("✅ Login exitoso. Redirigiendo...");
        window.location.href = "index.html"; // Cambiá según a dónde querés redirigir
      } else {
        const error = await res.text();
        alert("❌ Credenciales incorrectas: " + error);
      }
    } catch (error) {
      console.error("Error de red:", error);
      alert("❌ Error de red al iniciar sesión.");
    }
  });
}
