import React, { useState } from 'react';

const UserBoard = () => {
    // State to manage which card's extra content is visible
    const [hoveredCard, setHoveredCard] = useState(null);

    const handleMouseEnter = (cardName) => {
        setHoveredCard(cardName);
    };

    const handleMouseLeave = () => {
        setHoveredCard(null);
    };

    return (
        <div className="min-h-screen bg-light-bg dark:bg-dark-surface transition-colors duration-500 p-4 md:p-8 font-sans relative overflow-hidden">
            {/* Animated background gradient overlay */}
            <div className="absolute inset-0 z-0 opacity-20 dark:opacity-10 pointer-events-none">
                <div className="w-full h-full bg-gradient-to-br from-light-primary/30 to-light-accent/30 dark:from-dark-primary/20 dark:to-dark-accent/20 animate-gradient-pulse"></div>
            </div>

            {/* Main content z-index to be above the background animation */}
            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Header */}
                <header className="mb-12 text-center animate-fade-in animation-delay-100">
                    <h1 className="text-5xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-light-primary to-light-accent dark:from-dark-primary dark:to-dark-accent drop-shadow-lg leading-tight">
                        Panel de Usuario <span className="block text-3xl mt-2 text-light-text-secondary dark:text-dark-text-secondary font-medium">Bienvenido de vuelta, Comandante.</span>
                    </h1>
                    <p className="mt-5 text-xl text-light-text-secondary dark:text-dark-text-secondary max-w-2xl mx-auto">
                        Aquí tienes un resumen holográfico de tu actividad y accesos directos a tus controles esenciales.
                    </p>
                </header>

                {/* Information Cards */}
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Card 1: Profile */}
                    <div
                        className="base-card animate-fade-in animation-delay-200"
                        onMouseEnter={() => handleMouseEnter('profile')}
                        onMouseLeave={handleMouseLeave}
                    >
                        <h3 className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary mb-3">
                            <i className="fas fa-user-circle mr-2 text-light-primary dark:text-dark-primary"></i> Perfil Personal
                        </h3>
                        <p className="text-light-text-secondary dark:text-dark-text-secondary mb-4">
                            Administra tu identidad digital y las configuraciones de seguridad más avanzadas.
                        </p>
                        <button className="btn-primary group">
                            Editar Perfil
                            <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform duration-200">→</span>
                        </button>

                        {/* Hidden content revealed on hover */}
                        <div className={`${hoveredCard === 'profile' ? 'card-content-visible' : 'card-content-hidden'} mt-5 pt-3 border-t border-light-bg dark:border-dark-surface`}>
                            <h4 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary mb-2">Detalles Adicionales</h4>
                            <ul className="list-disc list-inside text-light-text-secondary dark:text-dark-text-secondary">
                                <li>Configuración de privacidad</li>
                                <li>Historial de inicios de sesión</li>
                                <li>Métodos de autenticación</li>
                            </ul>
                        </div>
                    </div>

                    {/* Card 2: Notifications */}
                    <div
                        className="base-card animate-fade-in animation-delay-300"
                        onMouseEnter={() => handleMouseEnter('notifications')}
                        onMouseLeave={handleMouseLeave}
                    >
                        <h3 className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary mb-3">
                            <i className="fas fa-bell mr-2 text-light-primary dark:text-dark-primary"></i> Centro de Notificaciones
                        </h3>
                        <p className="text-light-text-secondary dark:text-dark-text-secondary mb-4">
                            Accede a tu flujo de alertas en tiempo real y mensajes importantes del sistema.
                        </p>
                        <button className="btn-primary group">
                            Ver Notificaciones
                            <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform duration-200">→</span>
                        </button>

                        {/* Hidden content revealed on hover */}
                        <div className={`${hoveredCard === 'notifications' ? 'card-content-visible' : 'card-content-hidden'} mt-5 pt-3 border-t border-light-bg dark:border-dark-surface`}>
                            <h4 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary mb-2">Preferencias</h4>
                            <ul className="list-disc list-inside text-light-text-secondary dark:text-dark-text-secondary">
                                <li>Ajustes de alertas</li>
                                <li>Archivar notificaciones</li>
                                <li>Suscribirse a canales</li>
                            </ul>
                        </div>
                    </div>

                    {/* Card 3: Recent Activity */}
                    <div
                        className="base-card animate-fade-in animation-delay-400"
                        onMouseEnter={() => handleMouseEnter('activity')}
                        onMouseLeave={handleMouseLeave}
                    >
                        <h3 className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary mb-3">
                            <i className="fas fa-history mr-2 text-light-primary dark:text-dark-primary"></i> Historial de Actividad
                        </h3>
                        <p className="text-light-text-secondary dark:text-dark-text-secondary mb-4">
                            Explora tu línea de tiempo de interacciones y registros de sistema detallados.
                        </p>
                        <button className="btn-primary group">
                            Ver Actividad
                            <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform duration-200">→</span>
                        </button>

                        {/* Hidden content revealed on hover */}
                        <div className={`${hoveredCard === 'activity' ? 'card-content-visible' : 'card-content-hidden'} mt-5 pt-3 border-t border-light-bg dark:border-dark-surface`}>
                            <h4 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary mb-2">Filtros Rápidos</h4>
                            <ul className="list-disc list-inside text-light-text-secondary dark:text-dark-text-secondary">
                                <li>Actividad de seguridad</li>
                                <li>Cambios recientes</li>
                                <li>Exportar registro</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="mt-20 text-center text-sm text-light-text-secondary dark:text-dark-text-secondary animate-fade-in animation-delay-500">
                    <p className="mb-2">© 2025 CyberCorp. Todos los derechos reservados.</p>
                    <p className="text-xs">Diseñado con tecnología de punta para el futuro.</p>
                </footer>
            </div>
        </div>
    );
};

export default UserBoard;