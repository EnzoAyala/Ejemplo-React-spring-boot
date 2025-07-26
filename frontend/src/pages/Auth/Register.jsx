import React, { useState } from 'react'; // Importa hooks de React
import { useNavigate } from 'react-router-dom'; // Importa useNavigate para la navegación programática
import AuthService from '../../services/auth.service'; // Importa tu servicio de autenticación

const Register = () => {
    const navigate = useNavigate(); // Inicializa el hook useNavigate

    // Estados para los campos del formulario de registro
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [dni, setDni] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');

    // Estados para controlar el proceso de la petición y los mensajes
    const [successful, setSuccessful] = useState(false); // Indica si el registro fue exitoso
    const [message, setMessage] = useState('');       // Para mostrar mensajes de éxito/error
    const [loading, setLoading] = useState(false);     // Para mostrar un indicador de carga

    // Estados en tiempor real para errores de validacion
    const [dniError, setDniError] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [emailError, setEmailError] = useState('');

    // Función que se ejecuta al enviar el formulario de registro
    const handleRegister = (e) => {
        e.preventDefault(); // Previene el comportamiento por defecto del formulario

        setMessage('');        // Limpia cualquier mensaje anterior
        setSuccessful(false);  // Reinicia el estado de éxito
        setLoading(true);      // Activa el estado de carga

        // Llama al método `register` de tu servicio de autenticación
        AuthService.register(name, lastName, dni, username, email, phone, password)
            .then(
                // Si el registro es exitoso
                (response) => {
                    setMessage(response.data.message); // Muestra el mensaje de éxito del backend
                    setSuccessful(true);               // Marca el registro como exitoso
                    setLoading(false);                 // Desactiva el estado de carga
                    navigate('/login');                // Redirige al usuario a la página de login
                },
                // Si hay un error en el registro
                (error) => {
                    // Extrae el mensaje de error de la respuesta del backend o del objeto de error
                    const resMessage =
                        (error.response &&
                            error.response.data &&
                            error.response.data.message) ||
                        error.message ||
                        error.toString();

                    setMessage(resMessage);      // Muestra el mensaje de error
                    setSuccessful(false);        // Marca el registro como fallido
                    setLoading(false);           // Desactiva el estado de carga
                }
            );
    };

    return (
        <div className="flex justify-center items-center py-10 bg-gray-100">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-3xl font-bold text-center text-indigo-600 mb-6">Registrarse</h2>
                <form onSubmit={handleRegister} className="space-y-4">
                    {/* Muestra el formulario si el registro no ha sido exitoso aún */}
                    {!successful && (
                        <>
                            <div>
                                <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                                    Nombre
                                </label>
                                <input type="text" id="name" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={name} onChange={(e) => setName(e.target.value)} required />
                            </div>
                            <div>
                                <label htmlFor="lastName" className="block text-gray-700 text-sm font-bold mb-2">
                                    Apellido
                                </label>
                                <input type="text" id="lastName" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                            </div>
                            <div>
                                <label htmlFor="dni" className="block text-gray-700 text-sm font-bold mb-2">
                                    DNI
                                </label>
                                <input type="text" id="dni" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={dni} onChange={(e) => {
                                        const value = e.target.value;
                                        setDni(value);
                                        const dniRegex = /^\d{8}$/;
                                        setDniError(dniRegex.test(value) ? '' : 'El DNI debe tener 8 dígitos.');
                                    }} required />
                                    {dniError && <p className='text-red-500 text-xs mt-1'>{dniError}</p>}
                            </div>
                            <div>
                                <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">
                                    Nombre de Usuario
                                </label>
                                <input type="text" id="username" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={username} onChange={(e) => setUsername(e.target.value)} required />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                                    Correo Electrónico
                                </label>
                                <input type="email" id="email" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={email} onChange={(e) => {
                                        const value = e.target.value;
                                        setEmail(value);
                                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                                        setEmailError(emailRegex.test(value) ? '' : 'El correo electrónico no es válido.');
                                    }} required />
                                    {emailError && <p className='text-red-500 text-xs mt-1'>{emailError}</p>}
                            </div>
                            <div>
                                <label htmlFor="phone" className="block text-gray-700 text-sm font-bold mb-2">
                                    Teléfono
                                </label>
                                <input type="tel" id="phone" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={phone} onChange={(e) =>{
                                        const value = e.target.value;
                                        setPhone(value);
                                        const phoneRegex = /^9\d{8}$/;
                                        setPhoneError(phoneRegex.test(value) ? '' : 'El teléfono debe tener 9 dígitos y empezar por 9.');
                                    }} required />
                                    {phoneError && <p className='text-red-500 text-xs mt-1'>{phoneError}</p>}
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
                                    Contraseña
                                </label>
                                <input type="password" id="password" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                                    value={password} onChange={(e) => setPassword(e.target.value)} required />
                            </div>
                            <button
                                type="submit"
                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                                disabled={loading} // Deshabilita el botón mientras la petición está en curso
                            >
                                {loading ? 'Registrando...' : 'Registrar'} {/* Muestra texto diferente si está cargando */}
                            </button>
                        </>
                    )}

                    {message && ( // Muestra el mensaje si existe
                        <div className={`mt-4 p-3 rounded text-center ${successful ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {message}
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default Register;