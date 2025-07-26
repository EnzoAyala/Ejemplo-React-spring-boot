import React, { useState, useEffect } from 'react'; // Importa hooks de React
import UserService from '../../services/user.service'; // Importa el servicio para interactuar con la API de usuarios

const AdminBoard = () => {
    // Estado para almacenar el contenido recibido del backend
    const [content, setContent] = useState('');
    // Estado para almacenar mensajes de error si la llamada a la API falla
    const [error, setError] = useState('');

    // useEffect se ejecuta después de cada renderizado. Con `[]`, se ejecuta solo al montar.
    useEffect(() => {
        // Llama al método `getAdminBoard` de `UserService` para obtener contenido restringido para admins
        UserService.getAdminBoard()
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
        <div className="bg-light-surface dark:bg-dark-surface p-8 md:p-12 rounded-2xl shadow-lg transition-colors duration-300">
            <div className="text-center">
                <h2 className="text-3xl md:text-4xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-light-primary to-light-danger dark:from-dark-primary dark:to-dark-danger">
                    Panel de Administrador
                </h2>
                <p className="text-lg text-light-text-secondary dark:text-dark-text-secondary max-w-2xl mx-auto">
                    ¡Bienvenido, Administrador! Este contenido es exclusivo para usuarios con el rol ADMIN.
                </p>
            </div>

            <div className="mt-8 border-t border-slate-200 dark:border-slate-700 pt-6">
                {/* Muestra el contenido, el error, o el mensaje de carga */}
                {content ? (
                    <div className="p-4 rounded-md text-center bg-green-500/10 text-green-600 dark:text-green-400">
                        <p className="font-semibold">Mensaje del Backend:</p>
                        <p className="mt-1 text-lg">{content}</p>
                    </div>
                ) : error ? (
                    <div className="p-4 rounded-md text-center bg-light-danger/10 text-light-danger dark:text-dark-danger">
                        <p className="font-semibold">Error al cargar contenido:</p>
                        <p className="mt-1">{error}</p>
                    </div>
                ) : (
                    <div className="p-4 rounded-md text-center bg-slate-100 dark:bg-slate-700/50 text-light-text-secondary dark:text-dark-text-secondary">
                        <p>Cargando contenido de administrador...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminBoard;