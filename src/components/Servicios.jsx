import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaStar } from "react-icons/fa";

export default function Servicios() {
  const [modal, setModal] = useState(null);

  const servicios = [
    {
      id: 1,
      title: "Instalación fotovoltaica comunitaria",
      img: "/paneles.png",
      empresa: "SolarAndes S.A.S.",
      rating: 4.8,
      resumen:
        "Diseño, montaje y puesta en marcha de sistemas solares 5–50 kW. Incluye capacitación y manuales operativos.",
      detalle:
        "El servicio cubre diseño de sistemas solares, instalación de inversores, cableado, estructuras y protecciones. Incluye un plan de capacitación comunitaria y mantenimiento básico.",
    },
    {
      id: 2,
      title: "Capacitación y formación técnica",
      img: "/capacitacion.png",
      empresa: "EcoFormar",
      rating: 4.6,
      resumen:
        "Cursos prácticos en operación y mantenimiento de sistemas solares.",
      detalle:
        "Capacitaciones con enfoque práctico, dictadas por ingenieros certificados. Incluye seguridad eléctrica, medición de potencia y gestión comunitaria.",
    },
    {
      id: 3,
      title: "Sistemas de almacenamiento (baterías)",
      img: "/baterias.png",
      empresa: "EnerBat Ltda.",
      rating: 4.7,
      resumen:
        "Implementación y gestión de bancos de baterías para microredes.",
      detalle:
        "Incluye dimensionamiento del sistema, selección de BMS, gestión de cargas y mantenimiento programado de baterías de litio y plomo-ácido.",
    },
    {
      id: 4,
      title: "Mantenimiento y soporte técnico",
      img: "/mantenimiento.png",
      empresa: "TechSol Services",
      rating: 4.9,
      resumen: "Inspección preventiva, calibraciones y reemplazos.",
      detalle:
        "Se ofrece mantenimiento correctivo y preventivo para instalaciones solares comunitarias. Se incluyen protocolos de seguridad, limpieza de módulos y revisión de inversores.",
    },
    {
      id: 5,
      title: "Movilidad eléctrica comunitaria",
      img: "/movilidad.png",
      empresa: "EnerMov S.A.",
      rating: 4.5,
      resumen:
        "Programas de uso compartido de vehículos eléctricos y estaciones comunitarias de carga.",
      detalle:
        "Instalación de puntos de carga, capacitación en gestión de flotas y asesoría en incentivos tributarios para movilidad eléctrica.",
    },
    {
      id: 6,
      title: "Auditoría energética",
      img: "/auditoria.png",
      empresa: "EnerAudit",
      rating: 4.8,
      resumen:
        "Diagnóstico de consumo y propuestas de eficiencia energética.",
      detalle:
        "Incluye levantamiento de información de consumo, detección de pérdidas, plan de ahorro y hoja de ruta para la mejora de eficiencia energética.",
    },
  ];

  return (
    <section id="servicios" className="py-20 bg-[#f7faf9]">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-6">
          Servicios e intercambios
        </h2>
        <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
          Oferta de servicios colaborativos entre comunidades energéticas
          locales y empresas especializadas. Puedes consultar detalles,
          calificaciones y contactar a la empresa prestadora.
        </p>

        {/* Tarjetas de servicios */}
        <div className="grid md:grid-cols-3 gap-8">
          {servicios.map((s) => (
            <motion.div
              key={s.id}
              whileHover={{ scale: 1.03 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col"
            >
              <img
                src={s.img}
                alt={s.title}
                className="h-48 w-full object-cover"
              />
              <div className="p-5 flex flex-col justify-between flex-grow">
                <div>
                  <h3 className="text-lg font-bold text-[#07a68a] mb-2">
                    {s.title}
                  </h3>
                  <p className="text-sm text-gray-600">{s.resumen}</p>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <button
                    onClick={() => setModal(s)}
                    className="px-4 py-2 text-sm bg-[#07a68a] text-white rounded-lg hover:brightness-110"
                  >
                    Ver detalles
                  </button>
                  <div className="flex items-center text-yellow-400">
                    {Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <FaStar
                          key={i}
                          className={`${
                            i < Math.round(s.rating) ? "" : "opacity-30"
                          }`}
                        />
                      ))}
                    <span className="ml-2 text-gray-500 text-sm">
                      {s.rating.toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal de detalle */}
      <AnimatePresence>
        {modal && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-[90%] relative"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <button
                onClick={() => setModal(null)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
              <h3 className="text-2xl font-bold text-[#07a68a] mb-2">
                {modal.title}
              </h3>
              <img
                src={modal.img}
                alt={modal.title}
                className="w-full h-56 object-cover rounded-lg mb-4"
              />
              <p className="text-gray-700 mb-4 text-sm">{modal.detalle}</p>

              <div className="flex justify-between items-center border-t pt-4">
                <div>
                  <p className="text-sm text-gray-600">
                    Prestado por:{" "}
                    <span className="font-semibold text-[#07a68a]">
                      {modal.empresa}
                    </span>
                  </p>
                  <div className="flex items-center text-yellow-400">
                    {Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <FaStar
                          key={i}
                          className={`${
                            i < Math.round(modal.rating) ? "" : "opacity-30"
                          }`}
                        />
                      ))}
                    <span className="ml-2 text-gray-500 text-sm">
                      {modal.rating.toFixed(1)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() =>
                    alert(
                      `Mensaje enviado a ${modal.empresa}. Contacto simulado.`
                    )
                  }
                  className="px-5 py-2 bg-[#07a68a] text-white rounded-lg hover:brightness-110"
                >
                  Contactar empresa
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
