import React, { useState } from 'react'; // Importa hooks de React
import { useNavigate } from 'react-router-dom'; // Importa useNavigate para la navegación programática
import AuthService from '../../services/auth.service'; // Importa tu servicio de autenticación

const Login = () => {
    const navigate = useNavigate(); // Inicializa el hook useNavigate

    // Estados para los campos del formulario
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // Estados para controlar el proceso de la petición y los mensajes
    const [loading, setLoading] = useState(false); // Para mostrar un indicador de carga
    const [message, setMessage] = useState('');   // Para mostrar mensajes de éxito/error

    // Función que se ejecuta al enviar el formulario de login
    const handleLogin = (e) => {
        e.preventDefault(); // Previene el comportamiento por defecto del formulario (recarga de página)

        setMessage('');     // Limpia cualquier mensaje anterior
        setLoading(true);   // Activa el estado de carga

        // Llama al método `login` de tu servicio de autenticación
        AuthService.login(username, password)
            .then(
                // Si el login es exitoso
                () => {
                    navigate('/home'); // Redirige al usuario a la página de inicio
                    window.location.reload(); // Recarga la página para que App.jsx actualice el estado de autenticación
                },
                // Si hay un error en el login
                (error) => {
                    // Extrae el mensaje de error de la respuesta del backend o del objeto de error
                    const resMessage =
                        (error.response &&
                            error.response.data &&
                            error.response.data.message) ||
                        error.message ||
                        error.toString();

                    setLoading(false); // Desactiva el estado de carga
                    setMessage(resMessage); // Muestra el mensaje de error
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
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-1">
                            Nombre de Usuario
                        </label>
                        <input
                            type="text"
                            id="username"
                            className="block w-full rounded-md border-0 py-2.5 px-3 bg-transparent text-light-text dark:text-dark-text shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-light-primary dark:focus:ring-dark-primary sm:text-sm sm:leading-6 transition"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)} // Actualiza el estado con cada cambio
                            required // Hace el campo obligatorio
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-1">
                            Contraseña
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="block w-full rounded-md border-0 py-2.5 px-3 bg-transparent text-light-text dark:text-dark-text shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-light-primary dark:focus:ring-dark-primary sm:text-sm sm:leading-6 transition"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)} // Actualiza el estado con cada cambio
                            required // Hace el campo obligatorio
                        />
                    </div>
                    <div className="pt-4">
                        <button
                            type="submit"
                            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-light-primary hover:bg-light-primary/90 dark:bg-dark-primary dark:hover:bg-dark-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-light-primary dark:focus:ring-dark-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            disabled={loading} // Deshabilita el botón mientras la petición está en curso
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
                    {message && ( // Muestra el mensaje si existe
                        <div className="mt-4 p-3 rounded-md text-center text-sm bg-light-danger/10 text-light-danger dark:text-dark-danger">
                            {message}
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default Login;