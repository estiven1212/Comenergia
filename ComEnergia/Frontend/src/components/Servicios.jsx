import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaStar } from "react-icons/fa";
import { saveSolicitud, getCurrent } from "../utils/auth";

export default function Servicios() {
  const [modal, setModal] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const user = getCurrent();

  // === SERVICIOS ===
  const servicios = [
    {
      id: 1,
      title: "Instalación fotovoltaica comunitaria",
      img: "/paneles.png",
      resumen: "Diseño, montaje y puesta en marcha de sistemas solares 5–50 kW.",
      detalle:
        "Incluye instalación de inversores, estructuras, cableado y capacitación básica.",
      empresas: [
        { nombre: "SolarAndes S.A.S.", rating: 4.8 },
        { nombre: "EnerSolTech Ltda.", rating: 4.6 },
      ],
    },
    {
      id: 2,
      title: "Capacitación y formación técnica",
      img: "/capacitacion.png",
      resumen: "Cursos prácticos en mantenimiento y gestión de sistemas solares.",
      detalle:
        "Incluye talleres presenciales y virtuales con ingenieros certificados.",
      empresas: [],
    },
    {
      id: 3,
      title: "Sistemas de almacenamiento (baterías)",
      img: "/baterias.png",
      resumen: "Gestión e instalación de bancos de baterías para microredes.",
      detalle:
        "Dimensionamiento del sistema, selección del BMS y mantenimiento programado.",
      empresas: [
        { nombre: "EnerBat Ltda.", rating: 4.7 },
        { nombre: "BatEco Solutions", rating: 4.5 },
      ],
    },
    {
      id: 4,
      title: "Mantenimiento y soporte técnico",
      img: "/mantenimiento.png",
      resumen: "Mantenimiento preventivo y correctivo de sistemas solares.",
      detalle:
        "Incluye limpieza de módulos, revisión de inversores y reemplazo de componentes.",
      empresas: [
        { nombre: "TechSol Services", rating: 4.9 },
        { nombre: "GreenFix Energy", rating: 4.6 },
      ],
    },
    {
      id: 5,
      title: "Movilidad eléctrica comunitaria",
      img: "/movilidad.png",
      resumen: "Infraestructura y programas de vehículos eléctricos comunitarios.",
      detalle:
        "Instalación de puntos de carga, asesorías y gestión de flotas eléctricas.",
      empresas: [
        { nombre: "EnerMov S.A.", rating: 4.5 },
        { nombre: "VoltCom Mobility", rating: 4.4 },
      ],
    },
    {
      id: 6,
      title: "Auditoría energética",
      img: "/auditoria.png",
      resumen: "Diagnóstico energético y propuestas de mejora.",
      detalle:
        "Análisis de consumo, detección de pérdidas y estrategias de eficiencia.",
      empresas: [
        { nombre: "EnerAudit", rating: 4.8 },
        { nombre: "EcoCheck Consulting", rating: 4.6 },
      ],
    },
  ];

  // === AGRUPAR EMPRESAS ===
  const empresasMap = {};
  servicios.forEach((s) => {
    s.empresas.forEach((e) => {
      if (!empresasMap[e.nombre])
        empresasMap[e.nombre] = { rating: e.rating, servicios: [] };
      empresasMap[e.nombre].servicios.push(s.title);
    });
  });
  const empresas = Object.entries(empresasMap).map(([nombre, data]) => ({
    nombre,
    rating: data.rating,
    servicios: data.servicios,
  }));

  // === FUNCIONES ===
  const handleSolicitar = (empresa, servicio) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    setEmpresaSeleccionada(empresa);
    setShowForm(true);
    setMensaje(`Solicitud para ${servicio} - ${empresa}`);
  };

  const handleEnviar = (e, servicio) => {
    e.preventDefault();
    if (!mensaje.trim()) return;
    saveSolicitud(servicio, empresaSeleccionada, mensaje);
    setEnviado(true);

    setTimeout(() => {
      setShowForm(false);
      setEnviado(false);
      setMensaje("");
      alert(`Solicitud enviada correctamente a ${empresaSeleccionada}`);
    }, 800);
  };

  return (
    <section id="servicios" className="py-20 bg-[#f7faf9] relative">
      <div className="max-w-7xl mx-auto px-6 text-center">
        {/* === EMPRESAS ASOCIADAS === */}
        <h2 className="text-4xl font-bold text-gray-800 mb-6">Empresas asociadas</h2>
        <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
          Conoce las empresas aliadas que impulsan la energía sostenible dentro de ComEnergia.
        </p>

        <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-8 mb-20">
          {empresas.map((e, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="relative bg-white/80 backdrop-blur-md border border-gray-100 rounded-2xl p-6 shadow-xl hover:shadow-2xl flex flex-col items-center"
            >
              <div className="w-16 h-16 bg-[#07a68a]/10 rounded-full flex items-center justify-center mb-4">
                <img src="/logo.png" alt={e.nombre} className="w-8 h-8 opacity-80" />
              </div>
              <h3 className="text-xl font-bold text-[#07a68a] mb-2">{e.nombre}</h3>
              <div className="flex items-center justify-center text-yellow-400 mb-3">
                {Array(5)
                  .fill(0)
                  .map((_, j) => (
                    <FaStar
                      key={j}
                      className={`transition-transform ${j < Math.round(e.rating) ? "scale-110" : "opacity-30"}`}
                    />
                  ))}
                <span className="ml-2 text-gray-600 text-sm">{e.rating.toFixed(1)}</span>
              </div>
              <p className="text-sm text-gray-600 font-medium mb-2">Servicios:</p>
              <ul className="text-sm text-gray-700 space-y-1 mb-4">
                {e.servicios.map((s, idx) => (
                  <li key={idx}>• {s}</li>
                ))}
              </ul>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  user
                    ? alert(`Pronto podrás contactar directamente con ${e.nombre}`)
                    : setShowLoginModal(true)
                }
                className="mt-auto px-5 py-2 bg-[#07a68a] text-white rounded-full text-sm font-medium hover:brightness-110 shadow-md"
              >
                Contactar
              </motion.button>
            </motion.div>
          ))}
        </div>

        {/* === SERVICIOS DISPONIBLES === */}
        <h2 className="text-4xl font-bold text-gray-800 mb-6">Servicios e intercambios</h2>
        <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
          Explora los servicios energéticos y colabora con las comunidades sostenibles.
        </p>

        <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-8">
          {servicios.map((s) => (
            <motion.div
              key={s.id}
              whileHover={{ scale: 1.04 }}
              className="bg-white border border-gray-100 rounded-2xl shadow-lg overflow-hidden flex flex-col"
            >
              <img src={s.img} alt={s.title} className="h-48 w-full object-cover" />
              <div className="p-6 flex flex-col flex-grow justify-between">
                <div>
                  <h3 className="text-lg font-bold text-[#07a68a] mb-2">{s.title}</h3>
                  <p className="text-sm text-gray-600">{s.resumen}</p>
                </div>
                <button
                  onClick={() => setModal(s)}
                  className="mt-6 w-full py-2 bg-[#07a68a] text-white font-semibold rounded-full text-sm uppercase hover:brightness-110"
                >
                  Ver detalles
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* === MODAL DETALLES === */}
      <AnimatePresence>
        {modal && (
          <motion.div
            className="fixed inset-0 bg-black/60 z-40 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white/10 backdrop-blur-2xl border border-white/30 rounded-3xl shadow-2xl p-8 max-w-3xl w-full relative overflow-y-auto max-h-[90vh]"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <button
                onClick={() => {
                  setModal(null);
                  setShowForm(false);
                }}
                className="absolute top-4 right-4 text-white bg-[#07a68a] rounded-full w-8 h-8 flex items-center justify-center"
              >
                ✕
              </button>

              <h3 className="text-2xl font-bold text-white mb-4">{modal.title}</h3>
              <img src={modal.img} alt={modal.title} className="w-full h-56 object-cover rounded-xl mb-4" />
              <p className="text-gray-100/90 mb-6 text-base leading-relaxed">{modal.detalle}</p>

              {modal.empresas.length > 0 && (
                <>
                  <h4 className="text-lg font-semibold text-white mb-3">Empresas disponibles</h4>
                  {modal.empresas.map((e, index) => (
                    <div
                      key={index}
                      className="bg-white/10 px-4 py-3 rounded-xl flex justify-between items-center border border-white/20 mb-3"
                    >
                      <div>
                        <p className="font-semibold text-[#09ffd0] text-base">{e.nombre}</p>
                        <div className="flex items-center">
                          {Array(5)
                            .fill(0)
                            .map((_, i) => (
                              <FaStar key={i} className={i < Math.round(e.rating) ? "" : "opacity-30"} />
                            ))}
                          <span className="ml-2 text-gray-200 text-sm">{e.rating.toFixed(1)}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleSolicitar(e.nombre, modal.title)}
                        className="px-4 py-2 bg-[#07a68a] text-white rounded-full text-xs uppercase"
                      >
                        Solicitar
                      </button>
                    </div>
                  ))}
                </>
              )}

              {showForm && (
                <form onSubmit={(e) => handleEnviar(e, modal.title)} className="mt-6 border-t border-white/30 pt-4">
                  <h4 className="text-lg font-semibold text-[#09ffd0] mb-3">
                    Enviar solicitud a {empresaSeleccionada}
                  </h4>
                  <textarea
                    rows="5"
                    value={mensaje}
                    placeholder="Describe tu solicitud..."
                    onChange={(e) => setMensaje(e.target.value)}
                    className="w-full border border-white/30 bg-black/20 text-gray-100 rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#07a68a] mb-3"
                  ></textarea>
                  <button type="submit" className="w-full py-2 bg-[#07a68a] text-white rounded-full uppercase text-sm">
                    {enviado ? "Enviando..." : "Enviar solicitud"}
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* === MODAL LOGIN === */}
      <AnimatePresence>
        {showLoginModal && (
          <motion.div
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white/10 backdrop-blur-2xl border border-white/30 rounded-3xl p-6 max-w-sm w-full text-center"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <h3 className="text-xl font-bold text-white mb-3">Debes iniciar sesión</h3>
              <p className="text-gray-200 text-sm mb-4">
                Para contactar una empresa o solicitar un servicio, inicia sesión primero.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setShowLoginModal(false)}
                  className="px-4 py-2 rounded-full border border-white/40 text-white text-sm"
                >
                  Cerrar
                </button>
                <button
                  onClick={() => (window.location.href = "/login")}
                  className="px-4 py-2 rounded-full bg-[#07a68a] text-white text-sm"
                >
                  Iniciar sesión
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
