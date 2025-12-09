import React, { useEffect, useState } from "react";
import authService from "../../services/auth.service";
import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { NavLink } from "react-router-dom";
import { useSuscripcion } from "../../hooks/useSuscripcion";
import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
};

const Home = () => {
  const [user, setUser] = useState(undefined);
  const { suscripcion, loading: loadingSuscripcion } = useSuscripcion();

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) setUser(user);
  }, []);

  const ahora = new Date();
  const esPremium =
    suscripcion?.plan?.nombre?.toLowerCase() === "premium" &&
    suscripcion?.fechaFin &&
    ahora <= new Date(suscripcion.fechaFin);

  return (
    <main className="w-full">

      {/* Hero */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-light-primary to-light-danger dark:from-dark-primary dark:to-dark-danger text-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center" id="principal">

          {/* Texto */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            custom={0}
            className="text-center md:text-left"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6">
              Worksync: El Futuro del Trabajo Colaborativo
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl max-w-2xl mx-auto md:mx-0 mb-4">
              Una plataforma diseñada para conectar equipos, organizar proyectos y potenciar la productividad.
            </p>

            {/* Estado de suscripción */}
            {user && !loadingSuscripcion && (
              <div className="mb-4">
                <span className={`px-3 py-1 rounded-full font-bold ${
                  esPremium ? "bg-yellow-400 text-dark-surface" : "bg-gray-300 text-gray-700"
                }`}>
                  {esPremium ? "PRO" : "FREE"}
                </span>
                {suscripcion?.fechaFin && (
                  <span className="ml-4 text-sm">
                    {esPremium
                      ? `Tu plan vence el: ${new Date(suscripcion.fechaFin).toLocaleDateString()}`
                      : "Sin suscripción activa"}
                  </span>
                )}
              </div>
            )}

            {/* Botones */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              custom={1}
              className="flex flex-wrap gap-4 justify-center md:justify-start"
            >
              {!user ? (
                <>
                  <NavLink to="/login" className="px-6 py-3 bg-white text-dark-surface font-bold rounded-lg shadow hover:scale-105 transition-transform duration-300">
                    Iniciar Sesión
                  </NavLink>
                  <NavLink to="/register" className="px-6 py-3 bg-white text-dark-surface font-bold rounded-lg shadow hover:scale-105 transition-transform duration-300">
                    Registrarse
                  </NavLink>
                </>
              ) : (
                <>
                  <NavLink
                    to="/proyectos"
                    className="px-6 py-3 bg-white text-dark-surface font-bold rounded-lg shadow hover:scale-105 transition-transform duration-300"
                  >
                    Empezar proyectos
                  </NavLink>
                  <NavLink
                    to="/planes"
                    className={`px-6 py-3 font-bold rounded-lg shadow transition-transform duration-300 ${
                      esPremium
                        ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                        : "bg-yellow-400 text-dark-surface hover:scale-105"
                    }`}
                  >
                    {esPremium ? "Ya eres Premium" : "Actualizar a Premium"}
                  </NavLink>
                </>
              )}
            </motion.div>
          </motion.div>

          {/* Imagen */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="flex justify-center md:justify-end"
          >
            <img
              src="/img/TrabajoRem.png"
              alt="Equipo remoto trabajando"
              className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl rounded-lg shadow-md object-contain"
            />
          </motion.div>
        </div>
      </section>

      {/* Beneficios */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 text-center">
          {[
            { img: "/img/chat.png", title: "Comunicación Clara", desc: "Chats en tiempo real, videollamadas y canales temáticos para que todos estén alineados." },
            { img: "/img/kanban.png", title: "Organización Inteligente", desc: "Tableros Kanban, gestión de tareas y recordatorios para mantener tus proyectos en orden." },
            { img: "/img/productividad.png", title: "Productividad Real", desc: "Centraliza herramientas, documentos y reportes en un solo espacio de trabajo." },
          ].map((beneficio, i) => (
            <motion.div
              key={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              custom={i + 1}
              className="p-8 bg-light-surface dark:bg-dark-surface rounded-xl shadow-lg"
            >
              <img src={beneficio.img} alt={beneficio.title} className="max-w-[200px] mx-auto mb-6 rounded-lg shadow-md object-contain" />
              <h2 className="text-2xl font-bold mb-3">{beneficio.title}</h2>
              <p>{beneficio.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex justify-center md:order-last"
          >
            <img src="/img/flujodetrabajo.png" alt="Flujo de trabajo" className="w-full max-w-sm sm:max-w-md md:max-w-lg rounded-lg shadow-md object-contain" />
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            custom={0}
            className="text-center md:text-left"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-8">¿Cómo funciona Worksync?</h2>
            <ul className="space-y-6 max-w-md mx-auto md:mx-0">
              <li>
                <h3 className="text-xl font-bold">1. Crea tu espacio</h3>
                <p>Registra tu equipo y configura tu espacio de trabajo en minutos.</p>
              </li>
              <li>
                <h3 className="text-xl font-bold">2. Organiza proyectos</h3>
                <p>Asigna tareas, establece plazos y haz seguimiento del progreso.</p>
              </li>
              <li>
                <h3 className="text-xl font-bold">3. Colabora en tiempo real</h3>
                <p>Comparte ideas, edita documentos y mantente conectado con tu equipo.</p>
              </li>
            </ul>
          </motion.div>
        </div>
      </section>

      {/* Casos de uso */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-light-surface dark:bg-dark-surface">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-center">Diseñado para todos los equipos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 text-center">
            {[
              { img: "/img/empresas.png", title: "Empresas", desc: "Coordina equipos globales, proyectos complejos y mantén el control de tus procesos." },
              { img: "/img/estudiantes.png", title: "Equipos de estudio", desc: "Estudiantes y grupos académicos pueden organizar tareas y trabajos en equipo fácilmente." },
              { img: "/img/freelancer.png", title: "Freelancers", desc: "Colabora con clientes y gestiona múltiples proyectos desde una misma plataforma." },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                custom={i + 1}
                className="p-4"
              >
                <img src={item.img} alt={item.title} className="max-w-[200px] mx-auto mb-6 rounded-lg shadow-md object-contain" />
                <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                <p>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonios */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-12">Lo que dicen nuestros usuarios</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto">
            <motion.blockquote
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="p-6 bg-light-surface dark:bg-dark-surface rounded-lg shadow"
            >
              <img src="/img/usuaria.png" alt="Usuario 1" className="w-24 h-24 rounded-full mx-auto mb-4 object-cover" />
              <p className="italic">“Worksync transformó la forma en que gestionamos proyectos. Ahora todo fluye con más claridad.”</p>
              <footer className="mt-3 text-sm font-bold text-light-text-secondary dark:text-dark-text-secondary">— Laura, Project Manager</footer>
            </motion.blockquote>
            <motion.blockquote
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="p-6 bg-light-surface dark:bg-dark-surface rounded-lg shadow"
            >
              <img src="/img/usuario.png" alt="Usuario 2" className="w-24 h-24 rounded-full mx-auto mb-4 object-cover" />
              <p className="italic">“Como freelancer, me facilita trabajar con distintos clientes sin perder el control de mis entregas.”</p>
              <footer className="mt-3 text-sm font-bold text-light-text-secondary dark:text-dark-text-secondary">— Carlos, Diseñador UX</footer>
            </motion.blockquote>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-4 sm:px-6 text-center bg-gradient-to-r from-light-primary to-light-danger dark:from-dark-primary dark:to-dark-danger text-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">¿Listo para transformar tu equipo?</h2>
          <p className="text-lg sm:text-xl mb-8">Únete a miles de personas que ya confían en Worksync.</p>
          <button
            className="px-8 py-4 bg-white text-dark-surface rounded-lg font-bold shadow hover:scale-105 transition-transform duration-300"
            onClick={() => {
              const principalSection = document.getElementById("principal");
              if (principalSection) principalSection.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Comenzar Ahora
          </button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-light-surface dark:bg-dark-surface py-14 px-4 sm:px-6 lg:px-8 mt-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 text-center sm:text-left">
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="text-2xl font-bold text-light-text dark:text-dark-text mb-4">Worksync</h3>
            <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
              Conectamos equipos en todo el mundo. Trabajo remoto y colaborativo al alcance de todos.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-3 text-light-text dark:text-dark-text">Nosotros</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:underline">Quiénes somos</a></li>
              <li><a href="#" className="hover:underline">Misión y visión</a></li>
              <li><a href="#" className="hover:underline">Carreras</a></li>
              <li><a href="#" className="hover:underline">Blog</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-3 text-light-text dark:text-dark-text">Ayuda</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:underline">Centro de soporte</a></li>
              <li><a href="#" className="hover:underline">Libro de reclamaciones</a></li>
              <li><a href="#" className="hover:underline">Términos y condiciones</a></li>
              <li><a href="#" className="hover:underline">Política de privacidad</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-3 text-light-text dark:text-dark-text">Síguenos</h4>
            <div className="flex justify-center sm:justify-start gap-4 text-2xl">
              <a href="#" aria-label="Facebook" className="hover:text-light-primary dark:hover:text-dark-accent transition"><FaFacebookF /></a>
              <a href="#" aria-label="Instagram" className="hover:text-light-primary dark:hover:text-dark-accent transition"><FaInstagram /></a>
              <a href="#" aria-label="X" className="hover:text-light-primary dark:hover:text-dark-accent transition"><FaXTwitter /></a>
              <a href="#" aria-label="WhatsApp" className="hover:text-light-primary dark:hover:text-dark-accent transition"><FaWhatsapp /></a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-400 dark:border-gray-600 mt-10 pt-6 text-center text-xs text-light-text-secondary dark:text-dark-text-secondary">
          <p>© 2025 Worksync. Todos los derechos reservados.</p>
        </div>
      </footer>
    </main>
  );
};

export default Home;
