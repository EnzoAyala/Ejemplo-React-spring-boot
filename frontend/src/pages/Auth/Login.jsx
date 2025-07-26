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
        <div className="flex justify-center items-center py-10 bg-gray-100">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-3xl font-bold text-center text-indigo-600 mb-6">Iniciar Sesión</h2>
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">
                            Nombre de Usuario
                        </label>
                        <input
                            type="text"
                            id="username"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)} // Actualiza el estado con cada cambio
                            required // Hace el campo obligatorio
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
                            Contraseña
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)} // Actualiza el estado con cada cambio
                            required // Hace el campo obligatorio
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                        disabled={loading} // Deshabilita el botón mientras la petición está en curso
                    >
                        {loading ? 'Cargando...' : 'Login'} {/* Muestra texto diferente si está cargando */}
                    </button>
                    {message && ( // Muestra el mensaje si existe
                        <div className={`mt-4 p-3 rounded text-center ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                            {message}
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default Login;