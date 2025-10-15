
import React, { useEffect, useState } from "react";

import authService from "../../services/auth.service";
import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { NavLink } from "react-router-dom";


const Home = () => {

  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const observerOptions = { root: null, rootMargin: "0px", threshold: 0.4 };
    const scrollElements = document.querySelectorAll("[data-scroll-fade-in]");

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.animationDelay || "0";
          entry.target.style.animationDelay = `${delay}ms`;
          entry.target.classList.add("animate-fade-in");
          entry.target.classList.remove("opacity-0");
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    scrollElements.forEach((el) => {
      el.classList.add("opacity-0");
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const user = authService.getCurrentUser();

    if (user) {
      setUser(user);
    }
  }, []);

  return (
    <main className="w-full">
      {/* Hero */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-light-primary to-light-danger dark:from-dark-primary dark:to-dark-danger text-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center" id="principal">
          {/* Texto */}
          <div className="text-center md:text-left">
            <h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 opacity-0"
              data-scroll-fade-in
              data-animation-delay="100"
            >
              Worksync: El Futuro del Trabajo Colaborativo
            </h1>
            <p
              className="text-lg sm:text-xl md:text-2xl max-w-2xl mx-auto md:mx-0 mb-8 opacity-0"
              data-scroll-fade-in
              data-animation-delay="300"
            >
              Una plataforma diseñada para conectar equipos, organizar proyectos
              y potenciar la productividad en entornos remotos o híbridos.
            </p>
            <div
              className="flex flex-wrap gap-4 justify-center md:justify-start opacity-0"
              data-scroll-fade-in
              data-animation-delay="500"
            >
              {!user ? (
                <>
                  <NavLink to="/login" className="px-6 py-3 bg-white text-dark-surface font-bold rounded-lg shadow hover:scale-105 transition">
                    Iniciar Sesión
                  </NavLink>
                  <NavLink to="/register" className="px-6 py-3 bg-white text-dark-surface font-bold rounded-lg shadow hover:scale-105 transition">
                    Registrarse
                  </NavLink>
                </>
              ) : (
                <NavLink to='/proyectos' className='px-6 py-3 bg-white text-dark-surface font-bold rounded-lg shadow hover:scale-105 transition'>
                  Empezar proyectos
                </NavLink>
              )}
            </div>
          </div>

          {/* Imagen */}
          <div className="flex justify-center md:justify-end">
            <img
              src="/img/TrabajoRem.png"
              alt="Equipo remoto trabajando"
              className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl rounded-lg shadow-md object-contain"
              data-scroll-fade-in
              data-animation-delay="700"
            />
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 text-center">
          <div
            className="p-8 bg-light-surface dark:bg-dark-surface rounded-xl shadow-lg opacity-0"
            data-scroll-fade-in
            data-animation-delay="100"
          >
            <img src="/img/chat.png" alt="Chat" className="max-w-[200px] mx-auto mb-6 rounded-lg shadow-md object-contain" />
            <h2 className="text-2xl font-bold mb-3">Comunicación Clara</h2>
            <p>
              Chats en tiempo real, videollamadas y canales temáticos para que
              todos estén alineados.
            </p>
          </div>
          <div
            className="p-8 bg-light-surface dark:bg-dark-surface rounded-xl shadow-lg opacity-0"
            data-scroll-fade-in
            data-animation-delay="300"
          >
            <img
              src="/img/kanban.png"
              alt="Kanban"
              className="max-w-[200px] mx-auto mb-6 rounded-lg shadow-md object-contain"
            />
            <h2 className="text-2xl font-bold mb-3">Organización Inteligente</h2>
            <p>
              Tableros Kanban, gestión de tareas y recordatorios para mantener tus
              proyectos en orden.
            </p>
          </div>
          <div
            className="p-8 bg-light-surface dark:bg-dark-surface rounded-xl shadow-lg opacity-0"
            data-scroll-fade-in
            data-animation-delay="500"
          >
            <img
              src="/img/productividad.png"
              alt="Productividad"
              className="max-w-[200px] mx-auto mb-6 rounded-lg shadow-md object-contain"
            />
            <h2 className="text-2xl font-bold mb-3">Productividad Real</h2>
            <p>
              Centraliza herramientas, documentos y reportes en un solo espacio de
              trabajo.
            </p>
          </div>
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="flex justify-center md:order-last">
            <img
              src="/img/flujodetrabajo.png"
              alt="Flujo de trabajo"
              className="w-full max-w-sm sm:max-w-md md:max-w-lg rounded-lg shadow-md object-contain"
              data-scroll-fade-in
              data-animation-delay="100"
            />
          </div>
          <div className="text-center md:text-left">
            <h2
              className="text-3xl sm:text-4xl font-bold mb-8 opacity-0"
              data-scroll-fade-in
              data-animation-delay="200"
            >
              ¿Cómo funciona Worksync?
            </h2>
            <ul className="space-y-6 max-w-md mx-auto md:mx-0">
              <li
                className="opacity-0"
                data-scroll-fade-in
                data-animation-delay="300"
              >
                <h3 className="text-xl font-bold">1. Crea tu espacio</h3>
                <p>
                  Registra tu equipo y configura tu espacio de trabajo en minutos.
                </p>
              </li>
              <li
                className="opacity-0"
                data-scroll-fade-in
                data-animation-delay="400"
              >
                <h3 className="text-xl font-bold">2. Organiza proyectos</h3>
                <p>
                  Asigna tareas, establece plazos y haz seguimiento del progreso.
                </p>
              </li>
              <li
                className="opacity-0"
                data-scroll-fade-in
                data-animation-delay="500"
              >
                <h3 className="text-xl font-bold">3. Colabora en tiempo real</h3>
                <p>
                  Comparte ideas, edita documentos y mantente conectado con tu
                  equipo.
                </p>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Casos de uso */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-light-surface dark:bg-dark-surface">
        <div className="max-w-7xl mx-auto">
          <h2
            className="text-3xl sm:text-4xl font-bold mb-12 text-center opacity-0"
            data-scroll-fade-in
            data-animation-delay="100"
          >
            Diseñado para todos los equipos
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 text-center">
            <div
              className="opacity-0"
              data-scroll-fade-in
              data-animation-delay="200"
            >
              <img
                src="/img/empresas.png"
                alt="Empresas"
                className="max-w-[200px] mx-auto mb-6 rounded-lg shadow-md object-contain"
              />
              <h3 className="text-2xl font-bold mb-3">Empresas</h3>
              <p>
                Coordina equipos globales, proyectos complejos y mantén el control
                de tus procesos.
              </p>
            </div>
            <div
              className="opacity-0"
              data-scroll-fade-in
              data-animation-delay="400"
            >
              <img
                src="/img/estudiantes.png"
                alt="Estudiantes"
                className="max-w-[200px] mx-auto mb-6 rounded-lg shadow-md object-contain"
              />
              <h3 className="text-2xl font-bold mb-3">Equipos de estudio</h3>
              <p>
                Estudiantes y grupos académicos pueden organizar tareas y trabajos
                en equipo fácilmente.
              </p>
            </div>
            <div
              className="opacity-0"
              data-scroll-fade-in
              data-animation-delay="600"
            >
              <img
                src="/img/freelancer.png"
                alt="Freelancers"
                className="max-w-[200px] mx-auto mb-6 rounded-lg shadow-md object-contain"
              />
              <h3 className="text-2xl font-bold mb-3">Freelancers</h3>
              <p>
                Colabora con clientes y gestiona múltiples proyectos desde una
                misma plataforma.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonios */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2
            className="text-3xl sm:text-4xl font-bold mb-12 opacity-0"
            data-scroll-fade-in
            data-animation-delay="100"
          >
            Lo que dicen nuestros usuarios
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto">
            <blockquote
              className="p-6 bg-light-surface dark:bg-dark-surface rounded-lg shadow opacity-0"
              data-scroll-fade-in
              data-animation-delay="200"
            >
              <img
                src="/img/usuaria.png"
                alt="Usuario 1"
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
              />
              <p className="italic">
                “Worksync transformó la forma en que gestionamos proyectos. Ahora
                todo fluye con más claridad.”
              </p>
              <footer className="mt-3 text-sm font-bold text-light-text-secondary dark:text-dark-text-secondary">
                — Laura, Project Manager
              </footer>
            </blockquote>
            <blockquote
              className="p-6 bg-light-surface dark:bg-dark-surface rounded-lg shadow opacity-0"
              data-scroll-fade-in
              data-animation-delay="400"
            >
              <img
                src="/img/usuario.png"
                alt="Usuario 2"
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
              />
              <p className="italic">
                “Como freelancer, me facilita trabajar con distintos clientes sin
                perder el control de mis entregas.”
              </p>
              <footer className="mt-3 text-sm font-bold text-light-text-secondary dark:text-dark-text-secondary">
                — Carlos, Diseñador UX
              </footer>
            </blockquote>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section
        className="py-20 px-4 sm:px-6 text-center bg-gradient-to-r from-light-primary to-light-danger dark:from-dark-primary dark:to-dark-danger text-white opacity-0"
        data-scroll-fade-in
        data-animation-delay="200"
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            ¿Listo para transformar tu equipo?
          </h2>
          <p className="text-lg sm:text-xl mb-8">
            Únete a miles de personas que ya confían en Worksync.
          </p>
          <button
            className="px-8 py-4 bg-white text-dark-surface rounded-lg font-bold shadow hover:scale-105 transition"
            onClick={() => {
              const principalSection = document.getElementById("principal");
              if (principalSection) {
                principalSection.scrollIntoView({ behavior: "smooth" });
              }
            }}
          >
            Comenzar Ahora
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-light-surface dark:bg-dark-surface py-14 px-4 sm:px-6 lg:px-8 mt-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 text-center sm:text-left">

          {/* Logo y descripción */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="text-2xl font-bold text-light-text dark:text-dark-text mb-4">
              Worksync
            </h3>
            <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
              Conectamos equipos en todo el mundo. Trabajo remoto y colaborativo al alcance de todos.
            </p>
          </div>

          {/* Enlaces de la empresa */}
          <div>
            <h4 className="font-bold mb-3 text-light-text dark:text-dark-text">
              Nosotros
            </h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:underline">Quiénes somos</a></li>
              <li><a href="#" className="hover:underline">Misión y visión</a></li>
              <li><a href="#" className="hover:underline">Carreras</a></li>
              <li><a href="#" className="hover:underline">Blog</a></li>
            </ul>
          </div>

          {/* Ayuda */}
          <div>
            <h4 className="font-bold mb-3 text-light-text dark:text-dark-text">
              Ayuda
            </h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:underline">Centro de soporte</a></li>
              <li><a href="#" className="hover:underline">Libro de reclamaciones</a></li>
              <li><a href="#" className="hover:underline">Términos y condiciones</a></li>
              <li><a href="#" className="hover:underline">Política de privacidad</a></li>
            </ul>
          </div>
          {/* Redes sociales */}
          <div>
            <h4 className="font-bold mb-3 text-light-text dark:text-dark-text">
              Síguenos
            </h4>
            <div className="flex justify-center sm:justify-start gap-4 text-2xl">
              <a href="#" aria-label="Facebook" className="hover:text-light-primary dark:hover:text-dark-accent transition">
                <FaFacebookF />
              </a>
              <a href="#" aria-label="Instagram" className="hover:text-light-primary dark:hover:text-dark-accent transition">
                <FaInstagram />
              </a>
              <a href="#" aria-label="X" className="hover:text-light-primary dark:hover:text-dark-accent transition">
                <FaXTwitter />
              </a>
              <a href="#" aria-label="WhatsApp" className="hover:text-light-primary dark:hover:text-dark-accent transition">
                <FaWhatsapp />
              </a>
            </div>
          </div>
        </div>
        {/* Línea inferior */}
        <div className="border-t border-gray-400 dark:border-gray-600 mt-10 pt-6 text-center text-xs text-light-text-secondary dark:text-dark-text-secondary">
          <p>© 2025 Worksync. Todos los derechos reservados.</p>
        </div>
      </footer>

    </main>
  );
};

export default Home;