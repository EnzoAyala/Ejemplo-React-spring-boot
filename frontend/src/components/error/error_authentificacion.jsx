import React from 'react';
import { Link } from 'react-router-dom';

const ErrorAutenticacion = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br">
            <div className="bg-white dark:bg-dark-surface p-10 rounded-2xl shadow-2xl text-center max-w-md w-full animate-scale-in">
                {/* Icono llamativo */}
                <div className="flex justify-center mb-6">
                    <svg className="w-16 h-16 text-light-danger dark:text-dark-danger animate-pulse" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M12 5a7 7 0 100 14a7 7 0 000-14z" />
                    </svg>
                </div>

                {/* Título */}
                <h1 className="text-3xl font-extrabold text-light-danger dark:text-dark-danger mb-4 tracking-tight">
                    Error de Autenticación
                </h1>

                {/* Mensaje */}
                <p className="text-gray-700 dark:text-dark-text-secondary mb-8 leading-relaxed">
                    Ha ocurrido un error durante la autenticación. <br /> Por favor, inicie sesión nuevamente.
                </p>

                {/* Botón */}
                <Link
                    to="/login"
                    className="inline-block bg-gradient-to-r from-light-primary to-light-accent dark:from-dark-primary dark:to-dark-accent 
                 hover:opacity-90 text-white font-semibold py-3 px-6 rounded-lg shadow-lg 
                 transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-light-primary"
                >
                    Ir a Iniciar Sesión
                </Link>
            </div>
        </div>

    );
};

export default ErrorAutenticacion;
