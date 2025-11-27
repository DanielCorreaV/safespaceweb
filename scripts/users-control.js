// ----------------------------------------
// Control de botones de login / logout
// ----------------------------------------

const btnlogin = document.getElementById("login");
const btnregister = document.getElementById("register");
const btnlogout = document.getElementById("logout");

let isLogged = false;

// Detecta si está logueado al cargar la página
window.onload = function () {
  const isloggedStorage = window.localStorage.getItem("islogged");

  isLogged = isloggedStorage === "true";
  showLogbuttons();
};

// Mostrar / ocultar botones según estado
function showLogbuttons() {
  const buttons = document.querySelector(".logbuttons");

  if (!buttons) return;

  if (!isLogged) {
    buttons.style.display = "flex";
    btnlogout.style.display = "none";
  } else {
    buttons.style.display = "none";
    btnlogout.style.display = "block";
  }
}

// Evento logout
btnlogout.addEventListener("click", () => {
  isLogged = false;
  window.localStorage.setItem("islogged", "false");
  window.localStorage.removeItem("session");
  window.location.href = "index.html";
  showLogbuttons();
});

// ----------------------------------------
// Manejo de usuarios
// ----------------------------------------

// Obtener lista de usuarios
function getUsers() {
  const users = window.localStorage.getItem("users");
  return users ? JSON.parse(users) : [];
}

// Guardar usuarios
function saveUsers(users) {
  window.localStorage.setItem("users", JSON.stringify(users));
}

// Registrar usuario
function registerUser(name, email, password) {
  const users = getUsers();

  const exists = users.some((user) => user.email === email);
  if (exists) {
    return { success: false, message: "El correo ya está registrado." };
  }

  const newUser = {
    id: Date.now(),
    name,
    email,
    password, // *IMPORTANTE*: En producción debe ir hasheado
  };

  users.push(newUser);
  saveUsers(users);

  return { success: true, message: "Registro exitoso." };
}

// Login de usuario
function loginUser(email, password) {
  const users = getUsers();

  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) {
    return { success: false, message: "Correo o contraseña incorrectos." };
  }

  // Guardar sesión
  window.localStorage.setItem("session", JSON.stringify(user));
  window.localStorage.setItem("islogged", "true");

  isLogged = true;
  showLogbuttons();

  return { success: true, message: "Login exitoso.", user };
}

// Cerrar sesión manual
function logoutUser() {
  window.localStorage.removeItem("session");
  window.localStorage.setItem("islogged", "false");
  isLogged = false;
  showLogbuttons();
}

// PROTEGER LA PÁGINA DE CONTACTO
document.addEventListener("DOMContentLoaded", () => {
  const formBox = document.querySelector(".contact-box");
  const inputs = document.querySelectorAll(
    ".contact-box input, .contact-box textarea"
  );
  const sendBtn = document.querySelector(".contact-box .btn");

  const currentUser = localStorage.getItem("session");

  if (!currentUser) {
    // Bloquear inputs
    inputs.forEach((i) => {
      i.disabled = true;
      i.style.opacity = "0.6";
    });

    // Cambiar botón
    sendBtn.innerText = "Log in to send a message";
    sendBtn.href = "login.html";

    // Aviso visual
    const warning = document.createElement("p");
    warning.textContent = "You must be logged in to contact us.";
    warning.style.color = "red";
    warning.style.textAlign = "center";
    warning.style.fontWeight = "bold";
    warning.style.marginTop = "10px";

    formBox.appendChild(warning);
  }
});
