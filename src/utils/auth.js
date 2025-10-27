// src/utils/auth.js
function hash(str) {
  return btoa(str).replace(/=+$/, ""); // demo hash (no usar en producción)
}

export function registerUser({ name, email, password }) {
  if (!name || !email || !password) throw new Error("Campos incompletos");
  const users = JSON.parse(localStorage.getItem("users") || "[]");
  if (users.find(u => u.email === email)) throw new Error("Ese correo ya está registrado.");
  const user = { name, email, password: hash(password) };
  users.push(user);
  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("currentUser", JSON.stringify({ name, email }));
  return { name, email };
}

export function loginUser({ email, password }) {
  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const user = users.find(u => u.email === email);
  if (!user) throw new Error("Usuario no encontrado.");
  if (user.password !== hash(password)) throw new Error("Contraseña incorrecta.");
  localStorage.setItem("currentUser", JSON.stringify({ name: user.name, email: user.email }));
  return { name: user.name, email: user.email };
}

export function getCurrent() {
  return JSON.parse(localStorage.getItem("currentUser") || "null");
}

export function logoutUser() {
  localStorage.removeItem("currentUser");
}
