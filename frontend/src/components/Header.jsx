import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { SunIcon, MoonIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';

const Header = ({
    currentUser,
    isAdmin,
    isUser,
    theme,
    toggleTheme,
    logOut,
    mobileMenuOpen,
    handleToggleMobileMenu,
    handleCloseMobileMenu,
    getNavLinkClasses,
    onOpenProfileModal
}) => {
    const [profileOpen, setProfileOpen] = useState(false);
    const profileRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const renderDesktopLinks = () => (
        <>
            <NavLink to="/home" className={getNavLinkClasses}>Inicio</NavLink>

            {!currentUser ? (
                <>
                    <NavLink
                        to="/login"
                        className="px-4 py-2 rounded-md text-sm font-medium text-white bg-light-primary hover:bg-light-primary/90 dark:bg-dark-primary dark:hover:bg-dark-primary/90 transition-colors"
                    >
                        Iniciar Sesión
                    </NavLink>
                </>
            ) : (
                <>
                    {isUser && <NavLink to="/user" className={getNavLinkClasses}>Usuario</NavLink>}
                    {isAdmin && (
                        <>
                            <NavLink to="/user" className={getNavLinkClasses}>Usuarios en Línea</NavLink>
                            <NavLink to="/gestion-usuarios" className={getNavLinkClasses}>Gestión de Usuarios</NavLink>
                        </>
                    )}

                    <div className="relative" ref={profileRef}>
                        <button
                            onClick={() => setProfileOpen(!profileOpen)}
                            className="flex items-center gap-2 px-3 py-1 rounded-md text-sm font-medium text-light-text dark:text-dark-text hover:bg-slate-100 dark:hover:bg-dark-surface transition"
                        >
                            Perfil ▾
                        </button>

                        <AnimatePresence>
                            {profileOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -5 }}
                                    transition={{ duration: 0.3 }}
                                    className="absolute right-0 mt-2 w-40 bg-white dark:bg-dark-surface border border-slate-200 dark:border-slate-700 rounded-md shadow-lg z-50"
                                >
                                    <button
                                        onClick={onOpenProfileModal}
                                        className="w-full text-left px-4 py-2 text-base text-dark-surface dark:text-light-surface bg-light-surface dark:bg-dark-surface hover:bg-light-danger/10 dark:hover:bg-dark-danger/20 border-t border-slate-200 dark:border-slate-700 rounded-b-md transition"
                                    >
                                        Perfil
                                    </button>
                                    <button
                                        onClick={logOut}
                                        className="w-full text-left px-4 py-2 text-base text-light-danger dark:text-dark-danger bg-light-surface dark:bg-dark-surface hover:bg-light-danger/10 dark:hover:bg-dark-danger/20 border-t border-slate-200 dark:border-slate-700 rounded-b-md transition"
                                    >
                                        Cerrar sesión
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </>
            )}

            <button
                onClick={toggleTheme}
                className="p-2 rounded-full text-light-text-secondary hover:text-light-primary hover:bg-slate-200 dark:text-dark-text-secondary dark:hover:text-dark-primary dark:hover:bg-dark-surface transition"
                aria-label="Toggle theme"
            >
                {theme === 'light' ? <MoonIcon className="h-5 w-5" /> : <SunIcon className="h-5 w-5" />}
            </button>
        </>
    );

    return (
        <header className="sticky top-0 z-50 backdrop-blur-md bg-light-surface/80 dark:bg-dark-surface/80 border-b border-slate-200/60 dark:border-slate-700/60 shadow-sm transition-all duration-300">
            <div className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6 md:px-8 py-3">
                <Link
                    to="/"
                    className="text-2xl font-bold text-light-primary dark:text-dark-primary tracking-tight"
                    onClick={handleCloseMobileMenu}
                >
                    App React & Spring
                </Link>

                <nav className="hidden md:flex items-center space-x-6">
                    {renderDesktopLinks()}
                </nav>

                <button
                    onClick={handleToggleMobileMenu}
                    className="md:hidden p-2 rounded-md text-light-text-secondary hover:text-light-primary hover:bg-slate-200 dark:text-dark-text-secondary dark:hover:text-dark-primary dark:hover:bg-dark-surface transition"
                    aria-label="Toggle menu"
                    aria-expanded={mobileMenuOpen}
                >
                    {mobileMenuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
                </button>
            </div>

            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-1/2 top-14 transform -translate-x-1/2 z-50 w-40 rounded-md shadow-lg border bg-light-surface dark:bg-dark-surface border-slate-200 dark:border-slate-700 md:hidden"
                    >
                        <div className="py-3 px-4 space-y-2 text-center">
                            <NavLink to="/home" className={(navData) => getNavLinkClasses(navData) + ' block'} onClick={handleCloseMobileMenu}>Inicio</NavLink>

                            {!currentUser ? (
                                <>
                                    <NavLink to="/login" className={(navData) => getNavLinkClasses(navData) + ' block'} onClick={handleCloseMobileMenu}>Iniciar Sesión</NavLink>
                                </>
                            ) : (
                                <>
                                    {isUser && <NavLink to="/user" className={(navData) => getNavLinkClasses(navData) + ' block'} onClick={handleCloseMobileMenu}>Usuario</NavLink>}
                                    {isAdmin && (
                                        <>
                                            <NavLink to="/user" className={(navData) => getNavLinkClasses(navData) + ' block'} onClick={handleCloseMobileMenu}>Usuarios en Línea</NavLink>
                                            <NavLink to="/gestion-usuarios" className={(navData) => getNavLinkClasses(navData) + ' block'} onClick={handleCloseMobileMenu}>Gestión de Usuarios</NavLink>
                                        </>
                                    )}
                                    <button
                                        onClick={() => { onOpenProfileModal(); handleCloseMobileMenu(); }}
                                        className="w-full text-center px-4 py-2 text-base text-dark-surface dark:text-light-surface bg-light-surface dark:bg-dark-surface hover:bg-light-danger/10 dark:hover:bg-dark-danger/20 border-t border-slate-200 dark:border-slate-700 rounded-b-md transition"
                                    >
                                        Perfil
                                    </button>
                                    <button
                                        onClick={() => { logOut(); handleCloseMobileMenu(); }}
                                        className="w-full text-center bg-light-danger/10 text-light-danger hover:bg-light-danger/20 dark:bg-dark-danger/20 dark:text-dark-danger dark:hover:bg-dark-danger/30 font-semibold py-2 px-4 rounded-md text-sm transition"
                                    >
                                        Cerrar sesión
                                    </button>
                                </>
                            )}

                            <button
                                onClick={() => { toggleTheme(); handleCloseMobileMenu(); }}
                                className="w-full flex justify-center p-2 rounded-full text-light-text-secondary hover:text-light-primary hover:bg-slate-200 dark:text-dark-text-secondary dark:hover:text-dark-primary dark:hover:bg-dark-surface transition"
                                aria-label="Toggle theme"
                            >
                                {theme === 'light' ? <MoonIcon className="h-5 w-5" /> : <SunIcon className="h-5 w-5" />}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Header;

