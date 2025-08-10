import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import AuthService from '../services/auth.service';

/**
 * Componente para proteger rutas según si el usuario está autenticado
 * y/o tiene un rol específico. Redirige según corresponda.
 *
 * Props:
 * - children: el contenido de la ruta protegida
 * - requiredRole: rol requerido para acceder
 * - redirectIfAuthenticated: true para rutas públicas como Login/Register
 */
const ProtectedRoute = ({ children, requiredRole, redirectIfAuthenticated = false }) => {
  const currentUser = AuthService.getCurrentUser();
  const location = useLocation();

  // Devuelve la URL principal del dashboard del usuario según su rol
  const getUserDashboardUrl = (roles) => {
    if (roles.includes('ROLE_ADMIN')) return '/gestion-usuarios';
    if (roles.includes('ROLE_USER')) return '/user';
    return '/home';
  };

  // 🔒 CASO 1: Ruta pública (login, registro) pero el usuario ya está autenticado
  if (redirectIfAuthenticated) {
    if (currentUser) {
      const dashboardUrl = getUserDashboardUrl(currentUser.roles || []);
      return <Navigate to={dashboardUrl} replace />;
    }
    return children; // Usuario no autenticado, permitir acceso
  }

  // 🔒 CASO 2: Ruta privada, requiere autenticación
  if (!currentUser) {
    // Redirige al login y guarda la ruta original
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const userRoles = currentUser.roles || [];
  const hasRequiredRole = requiredRole ? userRoles.includes(requiredRole) : true;

  // ❌ Restricción cruzada: ADMIN en ruta de USER (Se elimina esta restricción)
  if (requiredRole === 'ROLE_USER' && userRoles.includes('ROLE_ADMIN')) {
    // const fallback = location.state?.from?.pathname || getUserDashboardUrl(userRoles);
    // return <Navigate to={fallback} replace />; // Para redireccionar por el momento desabilitado
    return children;
  }

  // ❌ Restricción cruzada: USER en ruta de ADMIN
  if (requiredRole === 'ROLE_ADMIN' && userRoles.includes('ROLE_USER')) {
    return <Navigate to="/user" replace />;
  }

  // ❌ No tiene el rol requerido
  if (!hasRequiredRole) {
    const fallback = location.state?.from?.pathname || getUserDashboardUrl(userRoles);
    return <Navigate to={fallback} replace />;
  }

  // ✅ Usuario autorizado, renderizar contenido
  return children;
};

export default ProtectedRoute;
