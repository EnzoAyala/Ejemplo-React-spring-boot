import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/auth.service';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isCodeSent, setIsCodeSent] = useState(false);
    const navigate = useNavigate();

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        try {
            await authService.forgotPassword({ email });
            setMessage('Código enviado a tu correo.');
            setIsCodeSent(true);
        } catch (error) {
            setError(error.response?.data?.message || 'Ocurrió un error');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyCode = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await authService.validateResetCode({ email, code });
            navigate('/reset-password', { state: { email, code } });
        } catch (error) {
            setError(error.response?.data?.message || 'Código inválido');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-150px)] py-10">
            <div className="w-full max-w-md bg-light-surface dark:bg-dark-surface p-8 rounded-2xl shadow-lg transition-colors duration-300">
                <h2 className="text-3xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-light-primary to-light-danger dark:from-dark-primary dark:to-dark-danger">
                    {isCodeSent ? 'Verificar Código' : 'Recuperar Contraseña'}
                </h2>

                {!isCodeSent ? (
                    <form onSubmit={handleForgotPassword} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-1">
                                Correo Electrónico
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="block w-full rounded-md border-0 py-2.5 px-3 bg-transparent text-light-text dark:text-dark-text shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-light-primary dark:focus:ring-dark-primary sm:text-sm sm:leading-6 transition"
                            />
                        </div>
                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-light-primary hover:bg-light-primary/90 dark:bg-dark-primary dark:hover:bg-dark-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-light-primary dark:focus:ring-dark-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {loading ? 'Enviando...' : 'Enviar Código'}
                            </button>
                        </div>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyCode} className="space-y-6">
                        <div>
                            <label htmlFor="code" className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-1">
                                Código de Verificación
                            </label>
                            <input
                                type="text"
                                id="code"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                required
                                className="block w-full rounded-md border-0 py-2.5 px-3 bg-transparent text-light-text dark:text-dark-text shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-light-primary dark:focus:ring-dark-primary sm:text-sm sm:leading-6 transition"
                            />
                        </div>
                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading || !code}
                                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-light-primary hover:bg-light-primary/90 dark:bg-dark-primary dark:hover:bg-dark-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-light-primary dark:focus:ring-dark-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {loading ? 'Verificando...' : 'Verificar Código'}
                            </button>
                        </div>
                    </form>
                )}

                {message && <p className="mt-4 p-3 rounded-md text-center text-sm bg-green-500/10 text-green-500">{message}</p>}
                {error && <p className="mt-4 p-3 rounded-md text-center text-sm bg-red-500/10 text-red-500">{error}</p>}
            </div>
        </div>
    );
};

export default ForgotPassword;