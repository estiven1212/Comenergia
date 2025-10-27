import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Casos() {
  const [modal, setModal] = useState(null);

  const casos = [
    {
      name: "Comunidad Solar La Guajira",
      region: "Alta Guajira, Colombia",
      desc: "Proyecto de generación distribuida que provee electricidad a comunidades wayuu mediante sistemas solares fotovoltaicos autónomos. Aporta energía limpia para bombeo de agua, refrigeración y escuelas rurales.",
      details:
        "Iniciativa respaldada por la UPME y el Ministerio de Minas y Energía. Implementa soluciones híbridas con paneles solares, almacenamiento en baterías y capacitación comunitaria. Busca garantizar el acceso energético sostenible en zonas aisladas.",
      img: "/guajira.jpg",
      empresa: "UPME – MinMinas",
      rating: 4.8,
      link: "https://www1.upme.gov.co/",
    },
    {
      name: "Solar Andes",
      region: "Antioquia, Colombia",
      desc: "Instalación comunitaria de 30 kW que abastece un colegio, centro de salud y áreas comunes en la vereda El Retiro.",
      details:
        "Proyecto piloto enmarcado en la Resolución CREG 701 de 2024. Involucra a familias rurales en la operación y mantenimiento del sistema, impulsando la autonomía energética local y la participación ciudadana.",
      img: "/andes.png",
      empresa: "CREG – Solar Andes S.A.S.",
      rating: 4.6,
      link: "https://www.creg.gov.co/",
    },
    {
      name: "EcoAndina",
      region: "Boyacá, Colombia",
      desc: "Programa de capacitación técnica en energías renovables para comunidades rurales y cooperativas locales.",
      details:
        "Desarrolla formación práctica en instalación, mantenimiento y diagnóstico de sistemas solares. Promueve empleo verde y la autosuficiencia energética en regiones agrícolas. Apoyado por el Ministerio de Minas y SENA.",
      img: "/ecoandina.png",
      empresa: "SENA – EcoFormar",
      rating: 4.9,
      link: "https://www.minenergia.gov.co/",
    },
    {
      name: "EnerMov Medellín",
      region: "Medellín, Colombia",
      desc: "Iniciativa de movilidad eléctrica compartida en comunidades urbanas. Implementa estaciones de carga y flotas comunitarias eléctricas.",
      details:
        "Desarrollada con apoyo del Ministerio de Transporte y EPM. Fomenta la transición hacia transporte sostenible, reduciendo emisiones y promoviendo eficiencia energética.",
      img: "/enermov.png",
      empresa: "EPM – MinTransporte",
      rating: 4.7,
      link: "https://www.mintransporte.gov.co/",
    },
    {
  name: "Comunidad Energética La Estrecha",
  region: "Patía, Cauca, Colombia",
  desc: "Primera comunidad energética formal reconocida en Colombia. Produce, gestiona y comparte energía solar entre hogares rurales en alianza con E2 Energía Eficiente y el Ministerio de Minas y Energía.",
  details:
    "El proyecto 'La Estrecha' es pionero en la implementación de un modelo de comunidad energética en Colombia. Cuenta con más de 20 familias conectadas, un sistema solar fotovoltaico colectivo y mecanismos de participación local. Fue desarrollado con apoyo del programa 'Energía para la Gente' del MinMinas y Enel Colombia, buscando replicarse en otras regiones rurales.",
  img: "/Salvador.png",
  empresa: "E2 Energía Eficiente – MinMinas – Enel",
  rating: 5.0,
  link: "https://www.minenergia.gov.co/comunidades-energeticas/",
},
{
  name: "Comunidad Energética San Bernardo",
  region: "Cundinamarca, Colombia",
  desc: "Proyecto piloto urbano que combina generación fotovoltaica, almacenamiento y medición inteligente en conjunto residencial sostenible.",
  details:
    "Desarrollado en el municipio de San Bernardo (Cundinamarca) con el apoyo de la UPME y el BID. Busca demostrar la viabilidad técnica y social de comunidades energéticas urbanas, incluyendo beneficios económicos y ambientales. Este modelo permite la gestión de excedentes de energía y la creación de microredes locales.",
  img: "/Bernardo.png",
  empresa: "UPME – BID – Alcaldía de San Bernardo",
  rating: 4.7,
  link: "https://www1.upme.gov.co/Paginas/Comunidades-Energeticas.aspx",
}
  ];

  return (
    <section id="casos" className="py-20 bg-[#f7faf9]">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Casos y proyectos reales en Colombia
        </h2>
        <p className="text-center text-gray-600 mb-10 max-w-3xl mx-auto">
          Estos casos reflejan experiencias reales de comunidades energéticas que han logrado autonomía,
          sostenibilidad y desarrollo local gracias a la cooperación entre el sector público, privado y la ciudadanía.
        </p>

        {/* Tarjetas de casos */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {casos.map((c, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition"
              onClick={() => setModal(c)}
            >
              <img
                src={c.img}
                alt={c.name}
                className="h-48 w-full object-cover"
                onError={(e) => (e.target.src = "/paneles.png")}
              />
              <div className="p-5">
                <h3 className="font-semibold text-[#07a68a] text-lg">{c.name}</h3>
                <div className="text-sm text-gray-500">{c.region}</div>
                <p className="text-gray-600 text-sm mt-2">{c.desc}</p>
                <div className="mt-3 flex justify-between items-center">
                  <span className="text-xs text-gray-500">Por: {c.empresa}</span>
                  <span className="text-[#07a68a] font-medium">★ {c.rating}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Modal de detalle */}
        <AnimatePresence>
          {modal && (
            <motion.div
              className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white rounded-xl max-w-2xl w-full p-6 shadow-lg relative"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
              >
                <button
                  onClick={() => setModal(null)}
                  className="absolute top-3 right-4 text-gray-500 text-lg"
                >
                  ✕
                </button>
                <img
                  src={modal.img}
                  alt={modal.name}
                  className="w-full h-56 object-cover rounded-lg mb-4"
                  onError={(e) => (e.target.src = "/paneles.png")}
                />
                <h3 className="text-2xl font-bold text-[#07a68a]">{modal.name}</h3>
                <p className="text-sm text-gray-500 mb-2">{modal.region}</p>
                <p className="text-gray-700">{modal.details}</p>
                <div className="mt-4 flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">
                      Empresa/Entidad: <strong>{modal.empresa}</strong>
                    </p>
                    <p className="text-sm text-gray-600">Calificación: ★ {modal.rating}</p>
                  </div>
                  <a
                    href={modal.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-[#07a68a] text-white rounded hover:brightness-110 transition"
                  >
                    Ver fuente oficial
                  </a>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
