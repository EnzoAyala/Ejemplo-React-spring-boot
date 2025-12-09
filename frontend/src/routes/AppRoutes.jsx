import React from "react";
import { Routes, Route, NavLink } from "react-router-dom";

import Home from "../pages/Home/Home";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import ResetPassword from "../pages/Auth/ResetPassword";
import Chat from "../components/Sidebar/Chat";
import AdminBoard from "../pages/Admin/AdminBoard";
import TareasPage from "../pages/Proyectos/TareasPage";
import ProyectoPage from "../pages/Proyectos/ProyectoPage";

import PlanesPage from "../pages/Planes/PlanesPage";
import PagoPage from "../pages/Planes/PagoPage";
import ConfirmacionPage from "../pages/Planes/ConfirmacionPage";

import Perfil from "../pages/Perfil/Perfil";
import PremiumContent from "../pages/PremiumContent/PremiumContent";
import Upgrade from "../pages/Upgrade/Upgrade";

// Rutas protegidas
import ProtectedRoute from "../components/ProtectedRoute";
import PrivateRoutePremium from "../components/PrivateRoutePremium";

const AppRoutes = () => (
  <Routes>
    {/* ================= RUTAS DE PLANES ================= */}
    <Route path="/planes" element={<PlanesPage />} />
    <Route path="/pago" element={<PagoPage />} />
    <Route path="/confirmacion" element={<ConfirmacionPage />} />

    {/* ================= RUTAS PÚBLICAS ================= */}
    <Route path="/" element={<Home />} />
    <Route path="/home" element={<Home />} />

    {/* ================= RUTAS DE AUTENTICACIÓN ================= */}
    <Route
      path="/login"
      element={
        <ProtectedRoute redirectIfAuthenticated={true}>
          <Login />
        </ProtectedRoute>
      }
    />
    <Route
      path="/register"
      element={
        <ProtectedRoute redirectIfAuthenticated={true}>
          <Register />
        </ProtectedRoute>
      }
    />
    <Route
      path="/forgot-password"
      element={
        <ProtectedRoute redirectIfAuthenticated={true}>
          <ForgotPassword />
        </ProtectedRoute>
      }
    />
    <Route
      path="/reset-password"
      element={
        <ProtectedRoute redirectIfAuthenticated={true}>
          <ResetPassword />
        </ProtectedRoute>
      }
    />

    {/* ================= RUTAS DE PROYECTOS ================= */}
    <Route path="/proyectos/:proyectoId/tareas" element={<TareasPage />} />
    <Route
      path="/proyectos"
      element={
        <ProtectedRoute requiredRole="ROLE_USER">
          <ProyectoPage />
        </ProtectedRoute>
      }
    />

    {/* ================= RUTAS DE PANEL ================= */}
    <Route
      path="/chat"
      element={
        <ProtectedRoute requiredRole="ROLE_USER">
          <Chat />
        </ProtectedRoute>
      }
    />
    <Route
      path="/gestion-usuarios"
      element={
        <ProtectedRoute requiredRole="ROLE_ADMIN">
          <AdminBoard />
        </ProtectedRoute>
      }
    />

    {/* ================= NUEVAS RUTAS PREMIUM ================= */}
    <Route
      path="/premium"
      element={
        <PrivateRoutePremium>
          <PremiumContent />
        </PrivateRoutePremium>
      }
    />
    <Route
      path="/upgrade"
      element={
        <ProtectedRoute>
          <Upgrade />
        </ProtectedRoute>
      }
    />
    <Route
      path="/perfil"
      element={
        <ProtectedRoute>
          <Perfil />
        </ProtectedRoute>
      }
    />

    {/* ================= RUTA 404 ================= */}
    <Route
      path="*"
      element={
        <div className="flex items-center justify-center max-h-screen bg-light-surface dark:bg-dark-surface">
          <div className="text-center p-10 bg-light-surface dark:bg-dark-surface rounded-xl shadow-lg transform transition duration-500 ease-in-out hover:scale-105 animate-fade-in">
            <h2 className="text-6xl font-extrabold text-light-primary dark:text-dark-primary mb-6 animate-float">
              404
            </h2>
            <p className="text-lg font-semibold text-light-text-secondary dark:text-dark-text-secondary mb-6">
              Lo sentimos, la página que buscas no existe.
            </p>
            <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-8">
              Tal vez te gustaría regresar al{" "}
              <NavLink
                to="/home"
                className="text-light-primary dark:text-dark-primary hover:underline"
              >
                inicio
              </NavLink>
              .
            </p>
            <div className="animate-scale-in">
              <NavLink
                to="/home"
                className="bg-light-primary dark:bg-dark-primary text-lg font-semibold text-white rounded-full px-8 py-4 
                   transition-transform transform hover:scale-105 
                   focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent 
                   shadow-lg hover:shadow-xl active:scale-95 ease-in-out duration-200 animate-button-glow"
              >
                Regresar al Inicio
              </NavLink>
            </div>
          </div>
        </div>
      }
    />
  </Routes>
);

export default AppRoutes;
