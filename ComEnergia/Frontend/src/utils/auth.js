// src/utils/auth.js
const API = "http://localhost:4000/api";

export function getCurrent() {
  try {
    const raw = localStorage.getItem("currentUser");
    if (!raw || raw === "undefined" || raw === "null") return null;
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error al leer currentUser:", err);
    return null;
  }
}

export function logoutUser() {
  localStorage.removeItem("currentUser");
}

// Register (includes telefono and optional nuevaEmpresa)
export async function registerUser({ name, email, password, empresa, role, telefono, nuevaEmpresa }) {
  const res = await fetch(`${API}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password, empresa, role, telefono, nuevaEmpresa }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Error al registrar usuario");
  localStorage.setItem("currentUser", JSON.stringify(data));
  // fire storage event for other tabs/components
  window.dispatchEvent(new Event("storage"));
  return data;
}

export async function loginUser({ email, password }) {
  const res = await fetch(`${API}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Credenciales inválidas");
  localStorage.setItem("currentUser", JSON.stringify(data));
  window.dispatchEvent(new Event("storage"));
  return data;
}

// Solicitudes
export async function saveSolicitud(servicio, empresa, mensaje = "") {
  const user = getCurrent();
  if (!user) throw new Error("Usuario no autenticado");
  const res = await fetch(`${API}/solicitudes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ servicio, empresa, mensaje, user: user.email }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Error al guardar solicitud");
  return data;
}
export async function getSolicitudes() {
  const user = getCurrent();
  if (!user) return [];
  const res = await fetch(`${API}/solicitudes/${user.email}`);
  const data = await res.json();
  return data;
}

// Update status (simple)
export async function updateSolicitudEstado(id, estado) {
  const res = await fetch(`${API}/solicitudes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ estado }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Error al actualizar estado");
  return data;
}

// Responder con archivo (multipart)
export async function saveRespuestaConArchivo(id, estado, respuesta, archivoFile) {
  const form = new FormData();
  form.append("id", id);
  form.append("estado", estado);
  form.append("respuesta", respuesta);
  if (archivoFile) form.append("archivo", archivoFile);

  const res = await fetch(`${API}/solicitudes/responder`, {
    method: "POST",
    body: form,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Error al guardar respuesta");
  return data;
}

// Services
export async function saveService(serviceObj) {
  const user = getCurrent();
  if (!user || user.role !== "empresa") throw new Error("Solo empresas pueden publicar servicios");
  const res = await fetch(`${API}/services`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...serviceObj, empresa: user.empresa, user: user.email }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Error al guardar servicio");
  return data;
}
export async function getServices() {
  const res = await fetch(`${API}/services`);
  const data = await res.json();
  return data;
}
export async function deleteService(id) {
  const res = await fetch(`${API}/services/${id}`, { method: "DELETE" });
  return await res.json();
}

// Empresas
export async function getEmpresas() {
  const res = await fetch(`${API}/empresas`);
  const data = await res.json();
  return data;
}
// === Registrar nueva empresa asociada ===
export async function addEmpresa(empresaObj) {
  const res = await fetch(`${API}/empresas/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(empresaObj),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Error al registrar empresa");
  return data;
}