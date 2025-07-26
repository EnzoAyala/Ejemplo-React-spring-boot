import React, { useState, useEffect } from 'react'; // Importa hooks de React: useState para el estado, useEffect para efectos secundarios
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'; // Importa componentes para el enrutamiento
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid'; // Importa iconos de Heroicons
import './App.css'; // Importa estilos específicos para el componente App
import './index.css'; // Importa estilos globales (incluyendo Tailwind CSS)

// Importa tu servicio de autenticación que maneja el login, registro y logout
import AuthService from './services/auth.service';

// Importa todos los componentes de tus páginas
import Home from './pages/Home/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import UserBoard from './pages/User/UserBoard';
import AdminBoard from './pages/Admin/AdminBoard';

// Hook personalizado para gestionar el tema (claro / oscuro) y persistirlo
const useTheme = () => {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme;') || 'light'); // Obtiene el tema del usuario
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove(theme === 'dark' ? 'light' : 'dark'); // Elimina el tema actual de la clase
    root.classList.add(theme); // Agrega el tema actual a la clase
    localStorage.setItem('theme', theme); // Guarda el tema en el almacenamiento local
  }, [theme]); // La dependencia del estado `theme` se agrega a la lista de dependencias

  return [theme, setTheme];

};


function App() {
  // Estado para almacenar la información del usuario actual (logueado)
  const [currentUser, setCurrentUser] = useState(undefined);
  // Estado para verificar si el usuario actual tiene el rol de administrador
  const [isAdmin, setIsAdmin] = useState(false);
  // Estado para el tema (claro / oscuro)
  const [theme, setTheme] = useTheme();

  // useEffect se ejecuta después de cada renderizado del componente.
  // Con un array de dependencias vacío `[]`, se ejecuta solo una vez al montar el componente.
  useEffect(() => {
    // Intenta obtener la información del usuario del almacenamiento local al cargar la aplicación
    const user = AuthService.getCurrentUser();

    if (user) {
      // Si se encuentra un usuario, actualiza el estado `currentUser`
      setCurrentUser(user);
      // Verifica si los roles del usuario incluyen 'ROLE_ADMIN' para el control de acceso
      setIsAdmin(user.roles.includes('ROLE_ADMIN'));
    }
  }, []); // El array vacío asegura que este efecto se ejecute solo una vez al cargar la app

  // Función para cerrar la sesión del usuario
  const logOut = () => {
    // Llama al método logout del servicio de autenticación para limpiar el almacenamiento local
    AuthService.logout();
    // Reinicia los estados de usuario y administrador en el componente React
    setCurrentUser(undefined);
    setIsAdmin(false);
    // Opcional: Recargar la página o redirigir a /home para asegurar una limpieza completa
    // window.location.reload(); // Esto fuerza una recarga completa del navegador
  };

  // Función para cambiar el tema (claro / oscuro)
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    // Router envuelve toda la aplicación para habilitar la navegación
    <Router>
      <div className="min-h-screen font-sans">
        {/* Barra de Navegación */}
        <nav className="bg-indigo-surface/80 dark:bg-dark-sufacce/80 backdrop-blur-lg sticky top-0 z-50 border-b border-slate-200/80 dark:border-slate-700/80 shadow-sm">
          <div className="container mx-auto flex justify-between items-center p-4">
            {/* Enlace al inicio de la aplicación */}
            <Link to="/" className="text-2x1 font-bold text-light-light-primary dark:text-dark-primary transition-colors duration-300">
              App React & Spring
            </Link>
            <div className="flex items-center space-x-6">
              {/* Enlace a la página de inicio */}
              <Link to="/home" className="text-light-text-secundary hover:text-light-primary dark:text-dark-text-secundary dark:hover:text-dark-primary transition-colors duration-300 font-medium">
                Inicio
              </Link>

              {/* Renderizado condicional: si no hay usuario logueado, muestra Login y Registro */}
              {!currentUser ? (
                <>
                  <Link to="/login" className="text-light-text-secondary hover:text-light-primary dark:text-dark-text-secondary dark:hover:text-dark-primary transition-colors duration-300 font-medium">
                    Login
                  </Link>
                  <Link to="/register" className="text-light-text-secondary hover:text-light-primary dark:text-dark-text-secondary dark:hover:text-dark-primary transition-colors duration-300 font-medium">
                    Registro
                  </Link>
                </>
              ) : ( // Si hay un usuario logueado, muestra enlaces de paneles y Logout
                <>
                  <Link to="/user" className="text-light-text-secondary hover:text-light-primary dark:text-dark-text-secondary dark:hover:text-dark-primary transition-colors duration-300 font-medium">
                    Usuario
                  </Link>
                  {/* Si el usuario es administrador, muestra el enlace al panel de admin */}
                  {isAdmin && (
                    <Link to="/admin" className="text-light-text-secondary hover:text-light-primary dark:text-dark-text-secondary dark:hover:text-dark-primary transition-colors duration-300 font-medium">
                      Admin
                    </Link>
                  )}
                  {/* Botón para cerrar sesión */}
                  <button
                    onClick={logOut} // Al hacer clic, llama a la función logOut
                    className="bg-light-danger/10 text-light-danger hover:bg-light-danger/20 dark:bg-dark-danger/20 dark:text-dark-danger dark:hover:bg-dark-danger/30 font-bold py-2 px-4 rounded-md transition-colors duration-300 text-sm"
                  >
                    Logout
                  </button>
                </>
              )}
              {/* Botón para cambiar el tema (claro / oscuro) */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full text-light-text-secondary hover:text-light-primary hover:bg-slate-200 dark:text-dark-text-secondary dark:hover:text-dark-primary dark:hover:bg-dark-surface transition-all duration-300"
                aria-label="Toggle theme"
              >
                {theme === 'light' ? (
                  <MoonIcon className="h-6 w-6" />
                ) : (
                  <SunIcon className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </nav>

        {/* Contenedor principal para el contenido de las rutas */}
        <main className="container mx-auto p-6">
          {/* Routes define el área donde los componentes de ruta serán renderizados */}
          <Routes>
            {/* Ruta por defecto o raíz */}
            <Route path="/" element={<Home />} />
            {/* Ruta explícita para el inicio */}
            <Route path="/home" element={<Home />} />
            {/* Rutas de autenticación */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {/* Rutas de paneles de usuario/admin (protegidas por el backend y navegación del frontend) */}
            <Route path="/user" element={<UserBoard />} />
            <Route path="/admin" element={<AdminBoard />} />
            {/* Ruta comodín para manejar páginas no encontradas (404) */}
            <Route path="*" element={
              <div className="text-center p-10">
                <h2 className="text-4x1 font-bold text-light-text dark:text-dark-text">404 - Página no encontrada</h2>
                <p className="text-light-text-secondary dark:text-dark-text-secondary mt-4">Lo sentimos, la página que buscas no existe.</p>
              </div>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;