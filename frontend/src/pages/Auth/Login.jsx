import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthService from '../../services/auth.service';

/**
 * Componente para el formulario de login.
 * Maneja estados de inputs, carga y mensajes de error.
 */
const Login = () => {
    const navigate = useNavigate();

    // Estados para usuario y contraseña
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // Estados para controlar la carga y mensajes
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    // Función que maneja el envío del formulario
    const handleLogin = (e) => {
        e.preventDefault();
        setMessage('');
        setLoading(true);

        AuthService.login(username, password)
            .then(
                () => {
                    // Login exitoso: redirigir y recargar para actualizar estado global
                    navigate('/home');
                    window.location.reload();
                },
                (error) => {
                    // Extraer mensaje de error y mostrarlo
                    const resMessage =
                        (error.response && error.response.data && error.response.data.message) ||
                        error.message ||
                        error.toString();

                    setLoading(false);
                    setMessage(resMessage);
                }
            );
    };

    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-150px)] py-10">
            <div className="w-full max-w-md bg-light-surface dark:bg-dark-surface p-8 rounded-2xl shadow-lg transition-colors duration-300">
                <h2 className="text-3xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-light-primary to-light-danger dark:from-dark-primary dark:to-dark-danger">
                    Iniciar Sesión
                </h2>
                <form onSubmit={handleLogin} className="space-y-6">
                    {/* Input usuario */}
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-1">
                            Nombre de Usuario
                        </label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="block w-full rounded-md border-0 py-2.5 px-3 bg-transparent text-light-text dark:text-dark-text shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-light-primary dark:focus:ring-dark-primary sm:text-sm sm:leading-6 transition"
                        />
                    </div>

                    {/* Input contraseña */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-1">
                            Contraseña
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="block w-full rounded-md border-0 py-2.5 px-3 bg-transparent text-light-text dark:text-dark-text shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-light-primary dark:focus:ring-dark-primary sm:text-sm sm:leading-6 transition"
                        />
                    </div>

                    {/* Botón de envío con indicador de carga */}
                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-light-primary hover:bg-light-primary/90 dark:bg-dark-primary dark:hover:bg-dark-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-light-primary dark:focus:ring-dark-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Cargando...
                                </>
                            ) : 'Login'}
                        </button>
                    </div>

                    {/* Mostrar mensaje de error o info */}
                    {message && (
                        <div className="mt-4 p-3 rounded-md text-center text-sm bg-light-danger/10 text-light-danger dark:text-dark-danger">
                            {message}
                        </div>
                    )}
                </form>

                {/* Link para registro */}
                <div className="text-center mt-6">
                    <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                        ¿No tienes una cuenta?{' '}
                        <Link to="/register" className="font-medium text-light-primary hover:underline dark:text-dark-primary">
                            Regístrate
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;