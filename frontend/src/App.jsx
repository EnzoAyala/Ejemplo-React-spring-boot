import React, { useState, useEffect } from 'react'; // Importa hooks de React: useState para el estado, useEffect para efectos secundarios
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'; // Importa componentes para el enrutamiento
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

function App() {
  // Estado para almacenar la información del usuario actual (logueado)
  const [currentUser, setCurrentUser] = useState(undefined);
  // Estado para verificar si el usuario actual tiene el rol de administrador
  const [isAdmin, setIsAdmin] = useState(false);

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

  return (
    // Router envuelve toda la aplicación para habilitar la navegación
    <Router>
      <div className="min-h-screen bg-gray-100">
        {/* Barra de Navegación */}
        <nav className="bg-indigo-600 p-4 shadow-md">
          <div className="container mx-auto flex justify-between items-center">
            {/* Enlace al inicio de la aplicación */}
            <Link to="/" className="text-white text-2xl font-bold">
              App React & Spring
            </Link>
            <div className="space-x-4">
              {/* Enlace a la página de inicio */}
              <Link to="/home" className="text-white hover:text-indigo-200">
                Inicio
              </Link>

              {/* Renderizado condicional: si no hay usuario logueado, muestra Login y Registro */}
              {!currentUser ? (
                <>
                  <Link to="/login" className="text-white hover:text-indigo-200">
                    Login
                  </Link>
                  <Link to="/register" className="text-white hover:text-indigo-200">
                    Registro
                  </Link>
                </>
              ) : ( // Si hay un usuario logueado, muestra enlaces de paneles y Logout
                <>
                  <Link to="/user" className="text-white hover:text-indigo-200">
                    Usuario
                  </Link>
                  {/* Si el usuario es administrador, muestra el enlace al panel de admin */}
                  {isAdmin && (
                    <Link to="/admin" className="text-white hover:text-indigo-200">
                      Admin
                    </Link>
                  )}
                  {/* Botón para cerrar sesión */}
                  <button
                    onClick={logOut} // Al hacer clic, llama a la función logOut
                    className="text-white hover:text-indigo-200 bg-red-500 px-3 py-1 rounded-md"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </nav>

        {/* Contenedor principal para el contenido de las rutas */}
        <div className="p-6">
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
              <div className="text-center p-8">
                <h2 className="text-3xl font-bold text-gray-800">404 - Página no encontrada</h2>
                <p className="text-gray-600 mt-2">Lo sentimos, la página que buscas no existe.</p>
              </div>
            } />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;