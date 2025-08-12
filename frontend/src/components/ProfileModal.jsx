import React, { useEffect, useState } from 'react';
import UserService from '../services/user.service';

const ProfileModal = ({ user, onClose }) => {
    const [name] = useState(user.name);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isClosing, setIsClosing] = useState(false); // controla la animacion de cierre
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [successful, setSuccessful] = useState(false);

    const handlePasswordChange = (e) => {
        e.preventDefault();
        setMessage('');
        setSuccessful(false);

        UserService.changePassword(user.id, { currentPassword, newPassword, confirmPassword })
            .then(response => {
                setSuccessful(true);
                setMessage(response.data.message);
            }, error => {
                const resMessage =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();
                setMessage(resMessage);
                setSuccessful(false);
            });
    };

    // Cerra modal con la tecla Escape
    useEffect (() => {
        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                handleCloseProfileModal();
            }
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [onClose]); // ** bota error de React Hokk useEffect ** //

    // Cierra el modal con animacion suave
    const handleCloseProfileModal = () => {
        setIsClosing(true);
        setTimeout(() => {
            onClose();
            setIsClosing(false);
        }, 200);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
            <div className={`bg-white dark:bg-dark-surface rounded-lg shadow-2xl w-full max-w-2xl p-10 transform transition-all duration-300 ${isClosing ? 'animate-scale-out': 'animate-scale-in'}`}>
                <div className="flex items-center justify-between p-6 border-b border-light-divider dark:border-dark-divider relative">
                    <h2 className="text-2xl font-bold text-light-text dark:text-dark-text">
                        Editar Perfil
                    </h2>
                    <button
                        onClick={handleCloseProfileModal}
                        className="text-light-text dark:text-dark-text hover:text-light-danger dark:hover:text-dark-danger transition-colors"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-6 h-6"
                        >
                            <path
                                fillRule="evenodd"
                                d="M12 2.25a.75.75 0 0 1 .75.75v9a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM6.166 5.106a.75.75 0 0 1 0 1.06 8.25 8.25 0 1 0 11.668 0 .75.75 0 1 1 1.06-1.06c3.808 3.807 3.808 9.98 0 13.788-3.807 3.808-9.98 3.808-13.788 0-3.808-3.807-3.808-9.98 0-13.788a.75.75 0 0 1 1.06 0Z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </button>
                </div>


                <div className="p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-2">Nombre de Usuario</label>
                        <input
                            type="text"
                            value={name}
                            
                            className="mt-1 block w-full px-4 py-3 bg-light-background dark:bg-dark-background border border-light-divider dark:border-dark-divider rounded-md shadow-sm focus:outline-none focus:ring-2 transition bg-light-surface dark:bg-dark-surface"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-2">Foto de Perfil</label>
                        <div className="mt-1 flex items-center gap-4">
                            <img
                                className="h-16 w-16 rounded-full object-cover"
                                src={selectedFile ? URL.createObjectURL(selectedFile) : (user.profilePictureUrl ? `http://localhost:8080/uploads/${user.profilePictureUrl}` : (user.gender === 'MALE' ? 'https://avatar.iran.liara.run/public/boy' : 'https://avatar.iran.liara.run/public/girl'))}
                                alt="Profile"
                            />
                            <input
                                type="file"
                                onChange={(e) => setSelectedFile(e.target.files[0])}
                                className="block w-full text-sm text-light-text dark:text-dark-text file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-light-primary/10 file:text-light-primary dark:file:bg-dark-primary/20 dark:file:text-dark-primary hover:file:bg-light-primary/20 dark:hover:file:bg-dark-primary/30 cursor-pointer"
                            />
                        </div>
                    </div>

                    <form onSubmit={handlePasswordChange}>
                        <div>
                            <label className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-2">Contraseña Actual</label>
                            <input
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="mt-1 block w-full px-4 py-3 bg-light-background dark:bg-dark-background border border-light-divider dark:border-dark-divider rounded-md shadow-sm focus:outline-none focus:ring-2 transition bg-light-surface dark:bg-dark-surface"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-2">Nueva Contraseña</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="mt-1 block w-full px-4 py-3 bg-light-background dark:bg-dark-background border border-light-divider dark:border-dark-divider rounded-md shadow-sm focus:outline-none focus:ring-2 transition bg-light-surface dark:bg-dark-surface"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-2">Confirmar Nueva Contraseña</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="mt-1 block w-full px-4 py-3 bg-light-background dark:bg-dark-background border border-light-divider dark:border-dark-divider rounded-md shadow-sm focus:outline-none focus:ring-2 transition bg-light-surface dark:bg-dark-surface"
                            />
                        </div>
                        <div className="px-6 py-4 bg-light-background dark:bg-dark-background/50 flex justify-end space-x-4 border-t border-light-divider dark:border-dark-divider">
                            <button type="button" onClick={handleCloseProfileModal} className="px-6 py-2 bg-gray-200 dark:bg-gray-600 text-light-text dark:text-dark-text font-semibold rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition shadow-sm">Cancelar</button>
                            <button type="submit" className="px-6 py-2 bg-light-primary dark:bg-dark-primary text-white font-semibold rounded-md hover:bg-light-primary/90 dark:hover:bg-dark-primary/90 transition shadow-sm">Guardar Cambios</button>
                        </div>
                    </form>
                    {message && (
                        <div className={`mt-4 p-3 rounded-md text-center text-sm ${successful ? 'bg-green-500/10 text-green-600 dark:text-green-400' : 'bg-light-danger/10 text-light-danger dark:text-dark-danger'}`}>
                            {message}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

};

export default ProfileModal;