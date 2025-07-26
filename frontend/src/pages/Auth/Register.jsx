import React, { useState } from 'react'; // Importa hooks de React
import { useNavigate } from 'react-router-dom'; // Importa useNavigate para la navegación programática
import AuthService from '../../services/auth.service'; // Importa tu servicio de autenticación

const Register = () => {
    const navigate = useNavigate(); // Inicializa el hook useNavigate

    // Estados para los campos del formulario de registro
    const [name, setName] = useState('');
    const [lastname, setLastname] = useState('');
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
        AuthService.register(name, lastname, dni, username, email, phone, password)
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
        <div className="flex justify-center items-center min-h-[calc(100vh-150px)] py-10">
            <div className="w-full max-w-2xl bg-light-surface dark:bg-dark-surface p-8 rounded-2xl shadow-lg transition-colors duration-300">
                <h2 className="text-3xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-light-primary to-light-danger dark:from-dark-primary dark:to-dark-danger">
                    Crear una cuenta
                </h2>
                <form onSubmit={handleRegister} className="space-y-6">
                    {/* Muestra el formulario si el registro no ha sido exitoso aún */}
                    {!successful && (
                        <>
                            <div className="grid md:grid-cols-2 md:gap-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-1">
                                        Nombre
                                    </label>
                                    <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required 
                                        className="block w-full rounded-md border-0 py-2.5 px-3 bg-transparent text-light-text dark:text-dark-text shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-light-primary dark:focus:ring-dark-primary sm:text-sm sm:leading-6 transition" />
                                </div>
                                <div>
                                    <label htmlFor="lastname" className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-1">
                                        Apellido
                                    </label>
                                    <input type="text" id="lastname" value={lastname} onChange={(e) => setLastname(e.target.value)} required 
                                        className="block w-full rounded-md border-0 py-2.5 px-3 bg-transparent text-light-text dark:text-dark-text shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-light-primary dark:focus:ring-dark-primary sm:text-sm sm:leading-6 transition" />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="username" className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-1">
                                    Nombre de Usuario
                                </label>
                                <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required 
                                    className="block w-full rounded-md border-0 py-2.5 px-3 bg-transparent text-light-text dark:text-dark-text shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-light-primary dark:focus:ring-dark-primary sm:text-sm sm:leading-6 transition" />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-1">
                                    Correo Electrónico
                                </label>
                                <input type="email" id="email" value={email} onChange={(e) => {
                                        const value = e.target.value;
                                        setEmail(value);
                                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                                        setEmailError(emailRegex.test(value) ? '' : 'El correo electrónico no es válido.');
                                    }} required 
                                    className="block w-full rounded-md border-0 py-2.5 px-3 bg-transparent text-light-text dark:text-dark-text shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-light-primary dark:focus:ring-dark-primary sm:text-sm sm:leading-6 transition" />
                                {emailError && <p className='text-light-danger dark:text-dark-danger text-xs mt-1'>{emailError}</p>}
                            </div>

                            <div className="grid md:grid-cols-2 md:gap-6">
                                <div>
                                    <label htmlFor="dni" className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-1">
                                        DNI
                                    </label>
                                    <input type="text" id="dni" value={dni} onChange={(e) => {
                                            const value = e.target.value;
                                            setDni(value);
                                            const dniRegex = /^\d{8}$/;
                                            setDniError(dniRegex.test(value) ? '' : 'El DNI debe tener 8 dígitos.');
                                        }} required 
                                        className="block w-full rounded-md border-0 py-2.5 px-3 bg-transparent text-light-text dark:text-dark-text shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-light-primary dark:focus:ring-dark-primary sm:text-sm sm:leading-6 transition" />
                                    {dniError && <p className='text-light-danger dark:text-dark-danger text-xs mt-1'>{dniError}</p>}
                                </div>
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-1">
                                        Teléfono
                                    </label>
                                    <input type="tel" id="phone" value={phone} onChange={(e) =>{
                                            const value = e.target.value;
                                            setPhone(value);
                                            const phoneRegex = /^9\d{8}$/;
                                            setPhoneError(phoneRegex.test(value) ? '' : 'El teléfono debe tener 9 dígitos y empezar por 9.');
                                        }} required 
                                        className="block w-full rounded-md border-0 py-2.5 px-3 bg-transparent text-light-text dark:text-dark-text shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-light-primary dark:focus:ring-dark-primary sm:text-sm sm:leading-6 transition" />
                                    {phoneError && <p className='text-light-danger dark:text-dark-danger text-xs mt-1'>{phoneError}</p>}
                                </div>
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-1">
                                    Contraseña
                                </label>
                                <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required 
                                    className="block w-full rounded-md border-0 py-2.5 px-3 bg-transparent text-light-text dark:text-dark-text shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-light-primary dark:focus:ring-dark-primary sm:text-sm sm:leading-6 transition" />
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
                                            Registrando...
                                        </>
                                    ) : 'Registrar'}
                                </button>
                            </div>
                        </>
                    )}

                    {message && ( // Muestra el mensaje si existe
                        <div className={`mt-4 p-3 rounded-md text-center text-sm ${successful ? 'bg-green-500/10 text-green-600 dark:text-green-400' : 'bg-light-danger/10 text-light-danger dark:text-dark-danger'}`}>
                            {message}
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default Register;