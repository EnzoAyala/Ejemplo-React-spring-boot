import React from 'react';
import { Link } from 'react-router-dom';
import { LockOpen } from 'lucide-react';

const ErrorAutenticacion = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-light-background dark:bg-dark-background">
            <div
                className="
                            bg-light-surface dark:bg-dark-surface p-8 sm:p-12 rounded-2xl
                            shadow-2xl dark:shadow-black/60 text-center max-w-lg w-full
                            animate-fade-in border border-light-elevated dark:border-dark-elevated
                            "
            >
                {/* Icono Llamativo de Alerta de Seguridad (Más detallado) */}
                <div className="flex justify-center mb-6">
                    <div
                        className="
                                    w-16 h-16 rounded-full flex items-center justify-center
                                    bg-light-danger/10 dark:bg-dark-danger/10
                                    shadow-inner shadow-light-danger/30 dark:shadow-dark-danger/30
                                    "
                    >
                        {/* Icono de X o Alert Triangle de Lucide/Heroicons */}
                        <svg
                            className="w-10 h-10 text-light-danger dark:text-dark-danger animate-jiggle"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 9v3.75m-9.303 3.375l1.423-2.307c.882-1.421 2.45-2.074 4.025-1.782m2.46-1.571a.75.75 0 011.026.175.75.75 0 01.175 1.026c-.38.608-.752 1.258-1.096 1.956M4.025 15.375a3.75 3.75 0 113.8-6.19c.142.062.278.14.407.234m-3.882 5.956c.882 1.421 2.45 2.074 4.025 1.782m2.46-1.571a.75.75 0 011.026.175.75.75 0 01.175 1.026c-.38.608-.752 1.258-1.096 1.956"
                            />
                        </svg>
                    </div>
                </div>

                {/* Título */}
                <h1
                    className="
                                text-3xl font-extrabold text-light-text dark:text-dark-text
                                mb-2 tracking-tight
                            "
                >
                    Acceso Denegado
                </h1>

                {/* Subtítulo de Error */}
                <h2
                    className="
                                    text-xl font-semibold text-light-danger dark:text-dark-danger mb-4
                                "
                >
                    Error de Autenticación
                </h2>

                {/* Mensaje Detallado */}
                <p className="text-light-text-secondary dark:text-dark-text-secondary mb-8 leading-relaxed text-base">
                    Parece que tu sesión ha expirado o las credenciales no son válidas.
                    <br />
                    Para continuar, por favor **inicia sesión nuevamente** utilizando el botón de abajo.
                </p>

                {/* Botón de Acción Principal (Manteniendo el gradiente) */}
                <Link
                    to="/login"
                    className="
                                inline-block w-full sm:w-auto
                                bg-gradient-to-r from-light-primary to-light-accent dark:from-dark-primary dark:to-dark-accent
                                hover:opacity-95 text-white font-bold py-3.5 px-8 rounded-xl shadow-lg
                                shadow-light-primary/50 dark:shadow-dark-primary/50
                                transition-all duration-300 transform hover:scale-[1.02]
                                focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-light-primary/50
                            "
                >
                    <LockOpen size={20} className="inline mr-2" />
                    Reiniciar Sesión
                </Link>
            </div>
        </div>

    );
};

export default ErrorAutenticacion;
