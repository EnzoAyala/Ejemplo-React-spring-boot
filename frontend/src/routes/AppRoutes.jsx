import React from "react";
import { Routes, Route } from 'react-router-dom';

import Home from '../pages/Home/Home';
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';
import ForgotPassword from '../pages/Auth/ForgotPassword';
import ResetPassword from '../pages/Auth/ResetPassword';
import UserBoard from '../pages/User/UserBoard';
import AdminBoard from '../pages/Admin/AdminBoard';
// ¡Importa el componente ProtectedRoute!
import ProtectedRoute from '../components/ProtectedRoute';

const AppRoutes = () => (
    <Routes>
        {/* Ruta publicas (sin autenticación) */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />

        {/* Rutas de autenticación protegidas para redirigir si ya estás logueado */}
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

        {/* Rutas de paneles de usuario/admin (protegidas por rol) */}
        <Route
            path="/user"
            element={
                <ProtectedRoute requiredRole="ROLE_USER">
                    <UserBoard />
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

        <Route
            path="*"
            element={
                <div className="text-center p-10">
                    <h2 className="text-4xl font-bold text-light-text dark:text-dark-text">
                        404 - Página no encontrada
                    </h2>
                    <p className="text-light-text-secondary dark:text-dark-text-secondary mt-4">
                        Lo sentimos, la página que buscas no existe.
                    </p>
                </div>
            }
        />
    </Routes>
);

export default AppRoutes;