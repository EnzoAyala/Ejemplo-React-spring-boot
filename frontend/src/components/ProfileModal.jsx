import React, { useEffect, useState } from 'react';
import UserService from '../services/user.service';

const ProfileModal = ({ user, onClose }) => {
    const [name] = useState(user.name);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isClosing, setIsClosing] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [successful, setSuccessful] = useState(false);
    const [newPasswordError, setNewPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');

    const handleNewPasswordChange = (e) => {
        const value = e.target.value;
        setNewPassword(value);
        if (value.length > 0 && value.length < 6) {
            setNewPasswordError('La contraseña debe contener al menos 6 caracteres');
        } else {
            setNewPasswordError('');
        }

        if (confirmPassword && value !== confirmPassword) {
            setConfirmPasswordError('La contraseña no coincide');
        } else {
            setConfirmPasswordError('');
        }
    };

    const handleConfirmPasswordChange = (e) => {
        const value = e.target.value;
        setConfirmPassword(value);
        if (newPassword && value !== newPassword) {
            setConfirmPasswordError('La contraseña no coincide');
        } else {
            setConfirmPasswordError('');
        }
    };

    // Handle password change request
    const handlePasswordChange = (e) => {
        e.preventDefault();
        setMessage('');
        setSuccessful(false);

        if (newPassword !== confirmPassword || newPassword.length < 6) {
            if (newPassword !== confirmPassword) {
                setConfirmPasswordError('La contraseña no coincide');
            }
            if (newPassword.length < 6) {
                setNewPasswordError('La contraseña debe contener al menos 6 caracteres');
            }
            return;
        }

        UserService.changePassword(user.id, { currentPassword, newPassword, confirmPassword })
            .then(response => {
                setSuccessful(true);
                setMessage(response.data.message);
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
                setNewPasswordError('');
                setConfirmPasswordError('');
            })
            .catch(error => {
                const resMessage =
                    (error.response && error.response.data && error.response.data.message) ||
                    error.message ||
                    error.toString();
                setMessage(resMessage);
                setSuccessful(false);
            });
    };

    // Close modal on Escape key press
    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                handleCloseProfileModal();
            }
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    // Close modal with smooth animation
    const handleCloseProfileModal = () => {
        setIsClosing(true);
        setTimeout(() => {
            onClose();
            setIsClosing(false);
        }, 200);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
            <div className={`bg-white dark:bg-dark-surface rounded-lg shadow-2xl w-full max-w-2xl p-10 transform transition-all duration-300 ${isClosing ? 'animate-scale-out' : 'animate-scale-in'}`}>
                <div className="flex items-center justify-between p-6 border-b border-light-divider dark:border-dark-divider relative">
                    <h2 className="text-2xl font-bold text-light-text dark:text-dark-text">Editar Perfil</h2>
                    <button onClick={handleCloseProfileModal} className="text-light-text dark:text-dark-text hover:text-light-danger dark:hover:text-dark-danger transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                            <path fillRule="evenodd" d="M12 2.25a.75.75 0 0 1 .75.75v9a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM6.166 5.106a.75.75 0 0 1 0 1.06 8.25 8.25 0 1 0 11.668 0 .75.75 0 1 1 1.06-1.06c3.808 3.807 3.808 9.98 0 13.788-3.807 3.808-9.98 3.808-13.788 0-3.808-3.807-3.808-9.98 0-13.788a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>

                <div className="p-6 space-y-8">
                    {/* Foto de Perfil con Marco Circular */}
                    <div className="flex justify-center mb-6">
                        <div className="relative w-32 h-32">
                            <img
                                className="h-full w-full rounded-full object-cover border-4 border-light-primary dark:border-dark-primary"
                                src={selectedFile
                                    ? URL.createObjectURL(selectedFile)
                                    : user.profilePictureUrl
                                        ? `http://localhost:8080/uploads/${user.profilePictureUrl}`
                                        : (user.gender === 'MALE'
                                            ? 'https://th.bing.com/th/id/OIP.eJ4BA7hzUGjKZ0qUEfAgVQHaHa?o=7&rm=3&rs=1&pid=ImgDetMain&o=7&rm=3'
                                            : 'https://logowik.com/content/uploads/images/woman4906.jpg'
                                        )}
                                alt="Profile"
                            />
                            <div className="absolute bottom-0 right-0 p-2 bg-light-primary dark:bg-dark-primary text-white rounded-full">
                                <input
                                    type="file"
                                    onChange={(e) => setSelectedFile(e.target.files[0])}
                                    className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                                />
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Nombre de Usuario */}
                    <div>
                        <label className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-2">Nombre de Usuario</label>
                        <input
                            type="text"
                            value={name}
                            readOnly
                            className="mt-1 block w-full px-4 py-3 bg-light-background dark:bg-dark-background border border-light-divider dark:border-dark-divider rounded-md shadow-sm focus:outline-none focus:ring-2 transition bg-light-surface dark:bg-dark-surface"
                        />
                    </div>

                    {/* Formulario de Contraseña */}
                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-light-text dark:text-dark-text">Cambiar Contraseña</h3>

                        <form onSubmit={handlePasswordChange} className="space-y-4">
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
                                    onChange={handleNewPasswordChange}
                                    
                                    className="mt-1 block w-full px-4 py-3 bg-light-background dark:bg-dark-background border border-light-divider dark:border-dark-divider rounded-md shadow-sm focus:outline-none focus:ring-2 transition bg-light-surface dark:bg-dark-surface"
                                />
                                {newPasswordError && <div className="mt-2 text-red-500 text-sm">{newPasswordError}</div>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-2">Confirmar Nueva Contraseña</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={handleConfirmPasswordChange}
                                    className="mt-1 block w-full px-4 py-3 bg-light-background dark:bg-dark-background border border-light-divider dark:border-dark-divider rounded-md shadow-sm focus:outline-none focus:ring-2 transition bg-light-surface dark:bg-dark-surface"
                                />
                                {confirmPasswordError && <div className="mt-2 text-red-500 text-sm">{confirmPasswordError}</div>}
                            </div>

                            <div className="flex justify-end space-x-4 mt-6">
                                <button type="button" onClick={handleCloseProfileModal} className="px-6 py-2 bg-gray-200 dark:bg-gray-600 text-light-text dark:text-dark-text font-semibold rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition shadow-sm">Cancelar</button>
                                <button type="submit" className="px-6 py-2 bg-light-primary dark:bg-dark-primary text-white font-semibold rounded-md hover:bg-light-primary/90 dark:hover:bg-dark-primary/90 transition shadow-sm">Guardar Cambios</button>
                            </div>
                        </form>
                    </div>

                    {/* Mensaje de Respuesta */}
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