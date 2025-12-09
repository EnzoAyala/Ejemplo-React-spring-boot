import React, { useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { SunIcon, MoonIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import { motion, AnimatePresence } from "framer-motion";
import UserService from "../services/user.service";
import { useSuscripcion } from "../hooks/useSuscripcion";

const Header = ({
  currentUser,
  isAdmin,
  isUser,
  theme,
  toggleTheme,
  logOut,
  mobileMenuOpen,
  handleToggleMobileMenu,
  handleCloseMobileMenu,
  getNavLinkClasses,
  onOpenProfileModal,
}) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  const { suscripcion, loading } = useSuscripcion(currentUser?.id);
  const isPremium = suscripcion?.plan === "PREMIUM";

  const [headerUser, setHeaderUser] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);

  // Manejar click fuera del menú de perfil
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Cargar usuario y avatar
  useEffect(() => {
    const loadUser = async () => {
      if (!currentUser?.id) {
        setHeaderUser(null);
        setAvatarUrl(null);
        return;
      }
      try {
        const res = await UserService.getAllUsers();
        const list = Array.isArray(res.data) ? res.data : [];
        const full = list.find((u) => u.id === currentUser.id) || null;
        setHeaderUser(full);

        if (full?.profilePictureUrl) {
          const base = `${window.location.protocol}//${window.location.hostname}:8080/uploads/`;
          setAvatarUrl(base + full.profilePictureUrl);
        } else setAvatarUrl(null);
      } catch {
        setHeaderUser(null);
        setAvatarUrl(null);
      }
    };
    loadUser();
  }, [currentUser?.id]);

  // Renderizar badge o botón de plan
  const renderPlan = (isMobile = false) => {
    if (loading) return null;
    return (
      <div className={`flex items-center gap-2 ${isMobile ? "flex-col" : ""}`}>
        {!isPremium ? (
          <button
            onClick={() => {
              navigate("/planes");
              if (isMobile) handleCloseMobileMenu();
            }}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-indigo-700 transition"
          >
            Mejorar Plan
          </button>
        ) : (
          <span className="bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-bold">
            PRO
          </span>
        )}
        {isPremium && suscripcion?.vencimiento && (
          <span className="text-sm text-gray-500 ml-2">
            Vence: {new Date(suscripcion.vencimiento).toLocaleDateString()}
          </span>
        )}
      </div>
    );
  };

  // Renderizar enlaces y botones de usuario
  const renderLinks = (isMobile = false) => (
    <>
      <NavLink to="/home" className={getNavLinkClasses}>
        Inicio
      </NavLink>

      {!currentUser ? (
        <NavLink
          to="/login"
          className="px-4 py-2 rounded-md text-sm font-medium text-white bg-light-primary hover:bg-light-primary/90 dark:bg-dark-primary dark:hover:bg-dark-primary/90 transition"
        >
          Iniciar Sesión
        </NavLink>
      ) : (
        <>
          <NavLink to="/proyectos" className={getNavLinkClasses}>
            Mis Proyectos
          </NavLink>

          {(isUser || isAdmin) && (
            <NavLink to="/chat" className={getNavLinkClasses}>
              Chat
            </NavLink>
          )}

          {isAdmin && (
            <NavLink to="/gestion-usuarios" className={getNavLinkClasses}>
              Gestión de Usuarios
            </NavLink>
          )}

          {renderPlan(isMobile)}

          {/* Perfil */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 px-3 py-1"
            >
              <span>Perfil</span>
              <img
                src={
                  avatarUrl
                    ? avatarUrl
                    : headerUser?.gender === "MALE"
                    ? "https://th.bing.com/th/id/OIP.eJ4BA7hzUGjKZ0qUEfAgVQHaHa?o=7"
                    : "https://logowik.com/content/uploads/images/woman4906.jpg"
                }
                className="w-6 h-6 rounded-full"
                alt="Perfil"
              />
            </button>

            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="absolute right-0 mt-2 w-40 bg-white shadow rounded-md"
                >
                  <button
                    onClick={() => {
                      onOpenProfileModal();
                      if (isMobile) handleCloseMobileMenu();
                    }}
                    className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                  >
                    Perfil
                  </button>
                  <button
                    onClick={() => {
                      logOut();
                      if (isMobile) handleCloseMobileMenu();
                    }}
                    className="block w-full px-4 py-2 text-left text-red-600 hover:bg-red-100"
                  >
                    Cerrar sesión
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </>
      )}

      <button onClick={toggleTheme} className="p-2">
        {theme === "light" ? <MoonIcon className="h-5 w-5" /> : <SunIcon className="h-5 w-5" />}
      </button>
    </>
  );

  return (
    <header className="sticky top-0 z-50 bg-white shadow">
      <div className="flex justify-between items-center p-4">
        <Link to="/" className="font-bold text-xl">
          WorkSync
        </Link>

        <nav className="hidden md:flex space-x-4">{renderLinks()}</nav>

        <button onClick={handleToggleMobileMenu} className="md:hidden">
          {mobileMenuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div className="md:hidden bg-white shadow p-4 space-y-2">
            {renderLinks(true)}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;

