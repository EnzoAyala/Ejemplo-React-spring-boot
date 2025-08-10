import React from "react";
import { Routes, Route, NavLink } from 'react-router-dom';

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
                <ProtectedRoute requiredRole="ROLE_USER" >
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
                <div className="flex items-center justify-center h-screen bg-light-bg dark:bg-dark-bg p-5">
                    <div className="text-center p-10 bg-light-surface dark:bg-dark-surface rounded-xl shadow-lg transform transition duration-500 ease-in-out hover:scale-105 animate-fade-in">
                        <h2 className="text-6xl font-extrabold text-light-primary dark:text-dark-primary mb-6 animate-scale-in">
                            404
                        </h2>
                        <p className="text-lg font-semibold text-light-text-secondary dark:text-dark-text-secondary mb-6">
                            Lo sentimos, la página que buscas no existe.
                        </p>
                        <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-8">
                            Tal vez te gustaría regresar al <NavLink to="/home" className="text-light-primary dark:text-dark-primary hover:underline">inicio</NavLink>.
                        </p>
                        <div className="animate-scale-in">
                            <NavLink to="/home" className="bg-light-primary dark:bg-dark-primary text-lg font-semibold text-white rounded-full px-8 py-4 transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent shadow-lg hover:shadow-xl active:scale-95 ease-in-out duration-200 animate-button-glow">
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