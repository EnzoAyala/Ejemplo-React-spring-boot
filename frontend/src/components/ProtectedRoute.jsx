// frontend/src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import AuthService from '../services/auth.service';

const ProtectedRoute = ({ children, requiredRole, redirectIfAuthenticated = false }) => {
  const currentUser = AuthService.getCurrentUser();
  const location = useLocation(); // Obtiene la ubicación actual del usuario

  // Función auxiliar para obtener la URL de redirección principal del usuario
  const getUserDashboardUrl = (userRoles) => {
    if (userRoles.includes('ROLE_ADMIN')) {
      return '/admin';
    }
    if (userRoles.includes('ROLE_USER')) {
      return '/user';
    }
    return '/home'; // Por defecto si no tiene roles específicos
  };

  // Caso 1: Rutas que SOLO deben ser accesibles para usuarios NO AUTENTICADOS (Login, Register)
  if (redirectIfAuthenticated) {
    if (currentUser) {
      // Si hay un usuario logueado, redirige a su dashboard principal
      const userRoles = currentUser.roles || [];
      const dashboardUrl = getUserDashboardUrl(userRoles);
      // Aquí redirigimos al dashboard, ya que no "volvimos" de una página anterior,
      // sino que intentamos ir a una página de auth estando ya logueados.
      return <Navigate to={dashboardUrl} replace />;
    }
    // Si no hay currentUser, permite el acceso a Login/Register
    return children;
  }

  // Caso 2: Rutas que requieren AUTENTICACIÓN (UserBoard, AdminBoard, y otras páginas internas)
  if (!currentUser) {
    // Si no hay usuario logueado, redirige a la página de login
    // Guardamos la ubicación actual en el estado para poder volver después del login exitoso
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Lógica de redirección específica por rol para rutas protegidas
  const userRoles = currentUser.roles || [];
  const hasRequiredRole = requiredRole ? userRoles.includes(requiredRole) : true;

  // VERIFICACIÓN DE ROLES CRUZADOS CON REDIRECCIÓN A LA PÁGINA ANTERIOR
  // Si un ADMIN intenta acceder a una ruta de USUARIO
  if (requiredRole === 'ROLE_USER' && userRoles.includes('ROLE_ADMIN')) {
    // Redirige al ADMIN a su dashboard
    return <Navigate to="/admin" replace />;
  }
  // Si un USER intenta acceder a una ruta de ADMIN
  if (requiredRole === 'ROLE_ADMIN' && userRoles.includes('ROLE_USER')) {
    // Similar al caso anterior, redirige al USER a su dashboard.
    return <Navigate to="/user" replace />;
  }

  // Si no tiene el rol requerido para una ruta protegida (y no cae en las excepciones de rol cruzado)
  if (!hasRequiredRole) {
    
    const fromPath = location.state?.from?.pathname || getUserDashboardUrl(userRoles); // Redirige al dashboard si no hay "from"
    return <Navigate to={fromPath} replace />;
  }

  // Si el usuario está logueado y tiene el rol correcto (o está en una ruta permitida), renderiza el componente hijo
  return children;
};

export default ProtectedRoute;