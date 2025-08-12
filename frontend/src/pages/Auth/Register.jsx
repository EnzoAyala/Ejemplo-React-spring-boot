import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthService from '../../services/auth.service';

/**
 * Componente para el formulario de registro.
 * Maneja estados de inputs, carga, mensajes de error y validaciones en tiempo real.
 */
const Register = () => {
    const navigate = useNavigate();

    // Estados para los campos del formulario
    const [name, setName] = useState('');
    const [lastname, setLastname] = useState('');
    const [dni, setDni] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [gender, setGender] = useState('');

    // Estados para control de éxito, mensajes y carga
    const [successful, setSuccessful] = useState(false);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    // Estados para errores de validación en tiempo real
    const [dniError, setDniError] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    // Función que maneja el registro
    const handleRegister = (e) => {
        e.preventDefault();
        setMessage('');
        setSuccessful(false);
        setLoading(true);

        // Llamada al servicio de autenticación para registrar al usuario
        AuthService.register(name, lastname, dni, username, email, phone, password, gender)
            .then(
                (response) => {
                    setMessage(response.data.message); // Mensaje de éxito
                    setSuccessful(true); // Registro exitoso
                    setLoading(false); // Desactiva el loading
                    navigate('/login'); // Redirige al login
                },
                (error) => {
                    // Maneja los errores de registro
                    const resMessage =
                        (error.response &&
                            error.response.data &&
                            error.response.data.message) ||
                        error.message ||
                        error.toString();

                    setMessage(resMessage); // Muestra el error
                    setSuccessful(false);   // Marca como fallido
                    setLoading(false);      // Desactiva el loading
                }
            );
    };

    // Función para validar email en tiempo real
    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);

        // Expresión regular para validar el formato general de un correo electrónico
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Verifica si el correo es válido y si termina con '@gmail.com'
        if (emailRegex.test(value)) {
            if (value.endsWith('@gmail.com')) {
                setEmailError('');  // No hay error
            } else {
                setEmailError('El correo debe ser un Gmail válido (ejemplo@gmail.com)');
            }
        } else {
            setEmailError('El correo electrónico no es válido.');
        }
    };


    // Función para validar DNI en tiempo real
    const handleDniChange = (e) => {
        const value = e.target.value;
        setDni(value);
        const dniRegex = /^\d{8}$/;
        setDniError(dniRegex.test(value) ? '' : 'El DNI debe tener 8 dígitos.');
    };

    // Función para validar teléfono en tiempo real
    const handlePhoneChange = (e) => {
        const value = e.target.value;
        setPhone(value);
        const phoneRegex = /^9\d{8}$/;
        setPhoneError(phoneRegex.test(value) ? '' : 'El teléfono debe tener 9 dígitos y empezar por 9.');
    };

    // Función para validar contraseña en tiempo real
    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);
        setPasswordError(value.length < 6 ? 'La contraseña debe tener al menos 6 caracteres.' : '');
    };

    // Comprobar si el formulario está listo para ser enviado
    const isFormValid =
        email && !emailError &&
        dni && !dniError &&
        phone && !phoneError &&
        password && !passwordError &&
        gender;

    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-150px)] py-10">
            <div className="w-full max-w-2xl bg-light-surface dark:bg-dark-surface p-8 rounded-2xl shadow-lg transition-colors duration-300">
                <h2 className="text-3xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-light-primary to-light-danger dark:from-dark-primary dark:to-dark-danger">
                    Crear una cuenta
                </h2>
                <form onSubmit={handleRegister} className="space-y-6">
                    {/* Muestra el formulario si el registro no ha sido exitoso */}
                    {!successful && (
                        <>
                            <div className="grid md:grid-cols-2 md:gap-6">
                                {/* Campos Nombre y Apellido */}
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-1">
                                        Nombre
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                        className="block w-full rounded-md border-0 py-2.5 px-3 bg-transparent text-light-text dark:text-dark-text shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-light-primary dark:focus:ring-dark-primary sm:text-sm sm:leading-6 transition"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="lastname" className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-1">
                                        Apellido
                                    </label>
                                    <input
                                        type="text"
                                        id="lastname"
                                        value={lastname}
                                        onChange={(e) => setLastname(e.target.value)}
                                        required
                                        className="block w-full rounded-md border-0 py-2.5 px-3 bg-transparent text-light-text dark:text-dark-text shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-light-primary dark:focus:ring-dark-primary sm:text-sm sm:leading-6 transition"
                                    />
                                </div>
                            </div>

                            {/* Campo Nombre de Usuario */}
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

                            {/* Campo Correo Electrónico con validación en tiempo real */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-1">
                                    Correo Electrónico
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={handleEmailChange} // Validación en tiempo real
                                    required
                                    className="block w-full rounded-md border-0 py-2.5 px-3 bg-transparent text-light-text dark:text-dark-text shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-light-primary dark:focus:ring-dark-primary sm:text-sm sm:leading-6 transition"
                                />
                                {emailError && <p className="text-light-danger dark:text-dark-danger text-xs mt-1">{emailError}</p>}
                            </div>

                            {/* Campos DNI y Teléfono con validación en tiempo real */}
                            <div className="grid md:grid-cols-2 md:gap-6">
                                <div>
                                    <label htmlFor="dni" className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-1">
                                        DNI
                                    </label>
                                    <input
                                        type="text"
                                        id="dni"
                                        value={dni}
                                        onChange={handleDniChange} // Validación en tiempo real
                                        maxLength={8} // Limita la cantidad a 8 diigtos
                                        required
                                        className="block w-full rounded-md border-0 py-2.5 px-3 bg-transparent text-light-text dark:text-dark-text shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-light-primary dark:focus:ring-dark-primary sm:text-sm sm:leading-6 transition"
                                    />
                                    {dniError && <p className="text-light-danger dark:text-dark-danger text-xs mt-1">{dniError}</p>}
                                </div>
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-1">
                                        Teléfono
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        value={phone}
                                        onChange={handlePhoneChange} // Validación en tiempo real
                                        maxLength={9} // Limita la cantidad a 9 diigtos
                                        required
                                        className="block w-full rounded-md border-0 py-2.5 px-3 bg-transparent text-light-text dark:text-dark-text shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-light-primary dark:focus:ring-dark-primary sm:text-sm sm:leading-6 transition"
                                    />
                                    {phoneError && <p className="text-light-danger dark:text-dark-danger text-xs mt-1">{phoneError}</p>}
                                </div>
                            </div>

                            {/* Campo Contraseña con validación en tiempo real */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-1">
                                    Contraseña
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={handlePasswordChange} // Validación en tiempo real
                                    required
                                    className="block w-full rounded-md border-0 py-2.5 px-3 bg-transparent text-light-text dark:text-dark-text shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-light-primary dark:focus:ring-dark-primary sm:text-sm sm:leading-6 transition"
                                />
                                {passwordError && <p className="text-light-danger dark:text-dark-danger text-xs mt-1">{passwordError}</p>}
                            </div>

                            {/* Selección de Género */}
                            <div>
                                <label className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-2">Género</label>
                                <div className="flex items-center gap-6 mt-2">
                                    <label className="inline-flex items-center cursor-pointer">
                                        <input type="radio" name="gender" value="MALE" checked={gender === 'MALE'} onChange={(e) => setGender(e.target.value)} className="form-radio h-5 w-5 text-light-primary dark:text-dark-primary focus:ring-light-primary dark:focus:ring-dark-primary border-light-divider dark:border-dark-divider" />
                                        <span className="ml-3 text-light-text dark:text-dark-text">Masculino</span>
                                    </label>
                                    <label className="inline-flex items-center cursor-pointer">
                                        <input type="radio" name="gender" value="FEMALE" checked={gender === 'FEMALE'} onChange={(e) => setGender(e.target.value)} className="form-radio h-5 w-5 text-light-primary dark:text-dark-primary focus:ring-light-primary dark:focus:ring-dark-primary border-light-divider dark:border-dark-divider" />
                                        <span className="ml-3 text-light-text dark:text-dark-text">Femenino</span>
                                    </label>
                                </div>
                            </div>

                            {/* Botón de envío */}
                            <div className="pt-4">
                                <button
                                    type="submit"
                                    className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-light-primary hover:bg-light-primary/90 dark:bg-dark-primary dark:hover:bg-dark-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-light-primary dark:focus:ring-dark-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    disabled={loading || !isFormValid}
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Registrando...
                                        </>
                                    ) : (
                                        'Registrar'
                                    )}
                                </button>
                            </div>
                        </>
                    )}

                    {/* Mensaje de éxito o error */}
                    {message && (
                        <div className={`mt-4 p-3 rounded-md text-center text-sm ${successful ? 'bg-green-500/10 text-green-600 dark:text-green-400' : 'bg-light-danger/10 text-light-danger dark:text-dark-danger'}`}>
                            {message}
                        </div>
                    )}
                </form>

                {/* Enlace para iniciar sesión si ya tienes cuenta */}
                <div className="text-center mt-6">
                    <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                        ¿Ya tienes una cuenta?{' '}
                        <Link to="/login" className="font-medium text-light-primary hover:underline dark:text-dark-primary">
                            Inicia sesión
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;