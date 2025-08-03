import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import authService from '../../services/auth.service';

const ResetPassword = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const { email, code } = location.state || {};

    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    if (!email || !code) {
        return <p className="text-center p-4 text-light-danger dark:text-dark-danger">Informacion insuficiente para restablecer la contraseña</p>;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            await authService.resetPassword({ email, code, password });
            setMessage('Contraseña restablecida con éxito');
            setTimeout(() => navigate('/login'), 2000); // Redireccionar después de 2 segundos
        } catch (error) {
            setError(error.response?.data?.message || 'Error al restablecer la contraseña');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-150px)] py-10">
            <div className="w-full max-w-md bg-light-surface dark:bg-dark-surface p-8 rounded-2xl shadow-lg transition-colors duration-300">
                <h2 className="text-3xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-light-primary to-light-danger dark:from-dark-primary dark:to-dark-danger">
                    Restablecer Contraseña
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
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

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={!password}
                            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-light-primary hover:bg-light-primary/90 dark:bg-dark-primary dark:hover:bg-dark-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-light-primary dark:focus:ring-dark-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {!password && (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Cargando...
                                </>
                            )}
                            {password && 'Restablecer Contraseña'}
                        </button>
                    </div>

                    {error && <p className="mt-4 p-3 rounded-md text-center text-sm bg-light-danger/10 text-light-danger dark:text-dark-danger">{error}</p>}
                    {message && <p className="mt-4 p-3 rounded-md text-center text-sm bg-light-success/10 text-light-success dark:text-dark-success">{message}</p>}
                </form>
            </div>
        </div>
    )
};

export default ResetPassword;