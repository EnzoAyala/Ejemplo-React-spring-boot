import React, { useState, useEffect } from 'react'; // Importa hooks de React
import UserService from '../../services/user.service'; // Importa el servicio para interactuar con la API de usuarios

const UserBoard = () => {
    // Estado para almacenar el contenido recibido del backend
    const [content, setContent] = useState('');
    // Estado para almacenar mensajes de error si la llamada a la API falla
    const [error, setError] = useState('');

    // useEffect se ejecuta después de cada renderizado. Con `[]`, se ejecuta solo al montar.
    useEffect(() => {
        // Llama al método `getUserBoard` de `UserService` para obtener contenido restringido para usuarios
        UserService.getUserBoard()
            .then(
                (response) => {
                    // Si la llamada es exitosa, actualiza el estado `content` con la respuesta
                    setContent(response.data); // Asume que la respuesta directa es un string
                },
                (err) => {
                    // Si hay un error, extrae el mensaje de error de la respuesta o del objeto de error
                    const resError =
                        (err.response && err.response.data && err.response.data.message) ||
                        err.message ||
                        err.toString();
                    // Actualiza el estado `error`
                    setError(resError);
                }
            );
    }, []); // El array vacío asegura que este efecto se ejecute solo una vez al montar

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">Panel de Usuario</h2>
            <p className="text-center text-gray-600">
                ¡Hola, Usuario! Aquí tienes contenido solo para usuarios registrados.
            </p>
            {/* Muestra el contenido si se cargó correctamente */}
            {content ? (
                <p className="mt-4 p-3 bg-green-100 text-green-700 rounded text-center">
                    Mensaje del Backend (Usuario): {content}
                </p>
            ) : (
                // Muestra un mensaje de carga mientras se espera la respuesta
                <p className="mt-4 p-3 bg-gray-100 text-gray-600 rounded text-center">
                    Cargando contenido de usuario...
                </p>
            )}
            {error && (
                <div className="mt-4 p-3 bg-red-100 text-red-700 rounded text-center">
                    Error al cargar contenido (Usuario): {error}
                </div>
            )}
        </div>
    );
};

export default UserBoard;