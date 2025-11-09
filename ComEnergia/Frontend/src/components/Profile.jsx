// src/components/Profile.jsx
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getCurrent, logoutUser, getSolicitudes, getServices, saveRespuestaConArchivo } from "../utils/auth";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export default function Profile() {
  const [user, setUser] = useState(getCurrent());
  const [stats, setStats] = useState([]);
  const [solicitudes, setSolicitudes] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [selectedSolicitud, setSelectedSolicitud] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      Promise.all([getSolicitudes(), getServices()]).then(([sols, servs]) => {
        setSolicitudes(sols || []);
        setServicios(servs || []);
      }).catch(() => { setSolicitudes([]); setServicios([]); });
      setTimeout(() => {
        setStats([{ mes: "Jun", energia: 120 }, { mes: "Jul", energia: 200 }, { mes: "Ago", energia: 180 }, { mes: "Sep", energia: 220 }, { mes: "Oct", energia: 250 }]);
        setLoading(false);
      }, 600);
    }
  }, [user]);

  const handleLogout = () => {
    logoutUser();
    window.location.href = "/";
  };

  if (!user) return (
    <main className="pt-28 min-h-screen flex items-center justify-center text-center">
      <div>
        <h2 className="text-3xl font-bold text-[#07a68a] mb-4">Sesión no iniciada</h2>
        <p className="mb-4">Inicia sesión para acceder a tu panel.</p>
        <a href="/login" className="px-4 py-2 bg-[#07a68a] text-white rounded">Ir al login</a>
      </div>
    </main>
  );

  // If company, show solicitudes received (filtered by empresa)
  const solicitudesRecibidas = user.role === "empresa" ? (solicitudes || []).filter(s => s.empresa === user.empresa || (s.destinatarios && s.destinatarios.includes(user.email))) : [];

  return (
    <main className="pt-24 min-h-screen bg-[#f9fbfa]">
      <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">
        <motion.div initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }} className="bg-[#1e1f1e] text-white rounded-2xl shadow-lg p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#07a68a] flex items-center justify-center text-2xl font-bold shadow-md">{user.name?.charAt(0).toUpperCase()}</div>
            <div>
              <h1 className="text-2xl font-semibold">{user.name}</h1>
              <p className="text-sm text-gray-400">Rol: <span className="text-[#07a68a] font-medium">{user.role === "empresa" ? "Empresa" : "Usuario"}</span></p>
              {user.role === "empresa" && <p className="text-sm text-gray-400">Empresa: <span className="text-[#07a68a] font-medium">{user.empresa}</span></p>}
              <p className="text-sm text-gray-400">{user.email}</p>
              <p className="text-sm text-gray-400">Tel: <span className="text-[#07a68a]">{user.telefono || "No registrado"}</span></p>
            </div>
          </div>

          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} onClick={handleLogout} className="self-start sm:self-center px-5 py-2 bg-[#07a68a] text-white rounded-lg">Cerrar sesión</motion.button>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <DashboardCard title="Servicios completados" value="18" />
          <DashboardCard title="Comunidades activas" value="4" />
          <DashboardCard title="Energía compartida (kWh)" value="12,450" />
          <DashboardCard title="Calificación promedio" value="4.9 ★" />
        </motion.div>

        <motion.div className="bg-white shadow rounded-xl border border-gray-100 p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h3 className="text-lg font-semibold text-[#07a68a] mb-2">Desempeño mensual</h3>
          {loading ? <div className="text-center py-10 text-gray-400">Cargando datos...</div> : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="energia" stroke="#07a68a" strokeWidth={3} dot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </motion.div>

        {/* Content by role */}
        {user.role === "empresa" ? (
          <>
            <ServiciosEmpresa servicios={servicios} user={user} />
            <SolicitudesRecibidas solicitudes={solicitudesRecibidas} onOpen={(s) => setSelectedSolicitud(s)} />
          </>
        ) : (
          <SolicitudesUsuario solicitudes={solicitudes} onOpen={(s) => setSelectedSolicitud(s)} />
        )}
      </div>

      {/* Modal detalle/responder */}
      <AnimatePresence>
        {selectedSolicitud && (
          <motion.div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="bg-white rounded-2xl p-6 max-w-2xl w-full" initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}>
              <h3 className="text-xl font-bold text-[#07a68a] mb-2">{selectedSolicitud.servicio}</h3>
              <p className="text-sm text-gray-700 mb-2"><b>De:</b> {selectedSolicitud.user}</p>
              <p className="text-sm text-gray-700 mb-2"><b>Empresa:</b> {selectedSolicitud.empresa}</p>
              <p className="text-sm text-gray-700 mb-2"><b>Mensaje:</b> {selectedSolicitud.mensaje}</p>
              <p className="text-xs text-gray-500 mb-2">Fecha: {selectedSolicitud.fecha}</p>

              {selectedSolicitud.respuesta && (
                <div className="mt-3 p-3 bg-gray-50 rounded">
                  <p className="text-sm"><strong>Respuesta:</strong> {selectedSolicitud.respuesta}</p>
                  <p className="text-xs text-gray-500">Respondido: {selectedSolicitud.fechaRespuesta}</p>
                  {selectedSolicitud.archivo && (
                    <a className="text-blue-600 underline text-sm" href={`http://localhost:4000/uploads/${selectedSolicitud.archivo}`} target="_blank" rel="noreferrer">Ver archivo adjunto</a>
                  )}
                </div>
              )}

              {/* If company -> form to respond */}
              {user.role === "empresa" && (
                <RespondForm solicitud={selectedSolicitud} onDone={(updated) => {
                  // refresh solicitudes list
                  getSolicitudes().then(setSolicitudes);
                  setSelectedSolicitud(null);
                }} />
              )}

              <div className="mt-4 flex gap-2 justify-end">
                <button onClick={() => setSelectedSolicitud(null)} className="px-4 py-2 border rounded">Cerrar</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

/* Helper components */

function DashboardCard({ title, value }) {
  return (
    <motion.div whileHover={{ scale: 1.05 }} className="bg-white border border-gray-100 shadow rounded-xl p-5 flex flex-col justify-center text-center">
      <h4 className="text-sm text-gray-500">{title}</h4>
      <p className="text-2xl font-bold text-[#07a68a] mt-1">{value}</p>
    </motion.div>
  );
}

function SolicitudesUsuario({ solicitudes, onOpen }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white shadow rounded-xl border border-gray-100 p-6">
      <h3 className="text-xl font-bold text-[#07a68a] mb-4">Tus solicitudes</h3>
      {solicitudes && solicitudes.length > 0 ? (
        <div className="space-y-4">{solicitudes.map(s => (
          <div key={s.id} className="border-l-4 border-[#07a68a] pl-5 py-3 bg-[#f8faf9] rounded-md shadow-sm">
            <div className="flex justify-between items-center">
              <h4 className="text-base font-semibold text-[#07a68a]">{s.servicio}</h4>
              <span className="text-xs px-2 py-1 bg-gray-200 rounded">{s.estado}</span>
            </div>
            <p className="text-sm text-gray-700">Empresa: <span className="font-medium">{s.empresa}</span></p>
            <p className="text-xs text-gray-500 mt-1">{s.fecha}</p>
            <div className="mt-2"><button onClick={() => onOpen(s)} className="text-sm text-[#07a68a]">Ver detalles</button></div>
          </div>
        ))}</div>
      ) : <p className="text-gray-500 italic">Aún no has enviado solicitudes.</p>}
    </motion.div>
  );
}

function ServiciosEmpresa({ servicios, user }) {
  const propios = (servicios || []).filter(s => s.empresa === user.empresa);
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white shadow rounded-xl border border-gray-100 p-6">
      <h3 className="text-xl font-bold text-[#07a68a] mb-4">Servicios publicados</h3>
      {propios.length > 0 ? (
        <div className="grid md:grid-cols-3 gap-5">{propios.map(s => (
          <div key={s.id} className="border rounded p-3 bg-[#f9fbfa]">
            <h4 className="font-semibold text-[#07a68a]">{s.title}</h4>
            <p className="text-sm text-gray-700">{s.resumen}</p>
            <p className="text-xs text-gray-500 mt-2">{s.fecha}</p>
          </div>
        ))}</div>
      ) : <p className="text-gray-500 italic">No has publicado servicios aún.</p>}
    </motion.div>
  );
}

function SolicitudesRecibidas({ solicitudes, onOpen }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white shadow rounded-xl border border-gray-100 p-6">
      <h3 className="text-xl font-bold text-[#07a68a] mb-4">Solicitudes recibidas</h3>
      {solicitudes.length > 0 ? (
        <div className="space-y-3">{solicitudes.map(s => (
          <div key={s.id} className="border-l-4 border-[#07a68a] pl-5 py-3 bg-[#f8faf9] rounded-md shadow-sm cursor-pointer" onClick={() => onOpen(s)}>
            <div className="flex justify-between items-center">
              <h4 className="text-base font-semibold text-[#07a68a]">{s.servicio}</h4>
              <span className="text-xs px-2 py-1 bg-gray-200 rounded">{s.estado}</span>
            </div>
            <p className="text-sm text-gray-700">Usuario: <span className="font-medium">{s.user}</span></p>
            <p className="text-xs text-gray-500 mt-1">{s.fecha}</p>
          </div>
        ))}</div>
      ) : <p className="text-gray-500 italic">No tienes solicitudes aún.</p>}
    </motion.div>
  );
}

/* RespondForm: used by company to reply */
function RespondForm({ solicitud, onDone }) {
  const [estado, setEstado] = useState(solicitud.estado || "En revisión");
  const [respuesta, setRespuesta] = useState("");
  const [archivo, setArchivo] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!respuesta.trim() && !archivo) {
      alert("Agrega una respuesta o adjunta un archivo");
      return;
    }
    setLoading(true);
    try {
      await saveRespuestaConArchivo(solicitud.id, estado, respuesta, archivo);
      alert("Respuesta guardada");
      onDone && onDone(true);
    } catch (err) {
      alert(err.message || "Error al guardar respuesta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <h4 className="font-semibold mb-2">Responder solicitud</h4>
      <select value={estado} onChange={(e) => setEstado(e.target.value)} className="border p-2 rounded w-full mb-2">
        <option>En revisión</option>
        <option>Aceptada</option>
        <option>Rechazada</option>
      </select>
      <textarea value={respuesta} onChange={(e) => setRespuesta(e.target.value)} placeholder="Mensaje de respuesta..." className="w-full border p-2 rounded mb-2" rows={4} />
      <input type="file" onChange={(e) => setArchivo(e.target.files[0])} className="mb-2" />
      <div className="flex gap-2 justify-end">
        <button onClick={handleSubmit} className="px-4 py-2 bg-[#07a68a] text-white rounded" disabled={loading}>{loading ? "Guardando..." : "Enviar respuesta"}</button>
      </div>
    </div>
  );
}
