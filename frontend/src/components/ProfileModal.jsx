import React, { useEffect, useState } from 'react';
import UserService from '../services/user.service';

const MAX_IMG_WIDTH = 1024;   // píxeles máximos de ancho permitidos
const MAX_IMG_HEIGHT = 1024;  // píxeles máximos de alto permitidos
const MAX_FILE_SIZE_MB = 2;   // tamaño máximo de archivo en MB

const ProfileModal = ({ user, onClose, onSave }) => {
    // Read-only username
    const [username] = useState(user?.username || '');

    // Campos de perfil editables
    const [name, setName] = useState(user?.name || '');
    const [lastname, setLastname] = useState(user?.lastname || '');
    const [phone, setPhone] = useState(user?.phone || '');

    // Imagen de perfil
    const [profilePictureUrl, setProfilePictureUrl] = useState(user?.profilePictureUrl || '');
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [imageError, setImageError] = useState('');

    const [isClosing, setIsClosing] = useState(false);

    // Seccion de contraseña
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Feedback
    const [message, setMessage] = useState('');
    const [successful, setSuccessful] = useState(false);
    const [newPasswordError, setNewPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');

    // Sincroniza con el usuario actual si cambia
    useEffect(() => {
        setName(user?.name || '');
        setLastname(user?.lastname || '');
        setPhone(user?.phone || '');
        setProfilePictureUrl(user?.profilePictureUrl || '');
        // Al cambiar de usuario, limpiar selección previa de imagen
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
            setPreviewUrl(null);
        }
        setSelectedFile(null);
        setImageError('');
    }, [user]);

    // Cargar datos completos del usuario si no están presentes (ej: currentUser desde localStorage suele traer solo username/roles)
    useEffect(() => {
        const needsFetch = (!user?.name && !user?.lastname && !user?.phone) || (name === '' && lastname === '' && phone === '');
        if (!user?.id || !needsFetch) return;

        UserService.getAllUsers()
            .then((res) => {
                if (!Array.isArray(res.data)) return;
                const full = res.data.find((u) => u.id === user.id);
                if (full) {
                    setName(full.name || '');
                    setLastname(full.lastname || '');
                    setPhone(full.phone || '');
                    setProfilePictureUrl(full.profilePictureUrl || '');
                }
            })
            .catch(() => {
                // Silenciar error de carga para no interrumpir el modal
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.id]);

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

    // Validación de imagen por tamaño de archivo y dimensiones en píxeles
    const handleFileSelect = (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;

        setImageError('');

        // Validar tipo de archivo
        if (!file.type.startsWith('image/')) {
            setImageError('El archivo debe ser una imagen');
            return;
        }

        // Validar tamaño en MB (para evitar exceder límites del backend)
        const maxBytes = MAX_FILE_SIZE_MB * 1024 * 1024;
        if (file.size > maxBytes) {
            setImageError(`El archivo supera el tamaño máximo permitido (${MAX_FILE_SIZE_MB} MB)`);
            return;
        }

        // Validar dimensiones en píxeles y preparar previewUrl
        const tempUrl = URL.createObjectURL(file);
        const img = new Image();
        img.onload = () => {
            const { width, height } = img;
            if (width > MAX_IMG_WIDTH || height > MAX_IMG_HEIGHT) {
                URL.revokeObjectURL(tempUrl);
                setImageError(`La imagen excede las dimensiones permitidas (${MAX_IMG_WIDTH}x${MAX_IMG_HEIGHT} px). Dimensiones: ${width}x${height} px`);
                return;
            }
            // Liberar previa preview si existía y setear nueva
            if (previewUrl) URL.revokeObjectURL(previewUrl);
            setPreviewUrl(tempUrl);
            setSelectedFile(file);
        };
        img.onerror = () => {
            URL.revokeObjectURL(tempUrl);
            setImageError('No se pudo leer la imagen seleccionada');
        };
        img.src = tempUrl;
    };

    // Limpiar previewUrl al desmontar
    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    // Actualizar perfil (name, lastname, phone y foto opcional)
    const handleProfileUpdate = (e) => {
        e.preventDefault();
        setMessage('');
        setSuccessful(false);

        // Bloquear guardado si hay error de imagen
        if (imageError) {
            setMessage('Corrige el error de la imagen antes de guardar.');
            setSuccessful(false);
            return;
        }

        const profile = {
            name: name?.trim() || '',
            lastname: lastname?.trim() || '',
            phone: phone?.toString().trim() || '',
        };

        // Si hay archivo seleccionado, enviamos multipart/form-data
        let body;
        if (selectedFile) {
            const formData = new FormData();
            formData.append('profile', new Blob([JSON.stringify(profile)], { type: 'application/json' }));
            formData.append('file', selectedFile);
            body = formData;
        } else {
            body = profile; // JSON puro cuando no hay imagen
        }

        // Si App.jsx provee onSave, delegar la actualización al padre para evitar doble llamada
        if (typeof onSave === 'function') {
            onSave(body);
            return;
        }

        UserService.updateUserProfile(user.id, body)
            .then((response) => {
                const resMessage = typeof response.data === 'string'
                    ? response.data
                    : (response.data?.message || 'Perfil actualizado correctamente.');
                setSuccessful(true);
                setMessage(resMessage);
                // Si el backend no devuelve el nuevo nombre de archivo, mantener preview visible dentro del modal.
                // Opcionalmente podríamos refrescar datos aquí con getAllUsers para actualizar profilePictureUrl.
            })
            .catch((error) => {
                const resMessage =
                    (error.response && error.response.data && (error.response.data.message || error.response.data)) ||
                    error.message ||
                    error.toString();
                setMessage(resMessage);
                setSuccessful(false);
            });
    };

    // Manejar solicitud de cambio de contraseña
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
                // change-password devuelve un objeto { message: string }
                const resMessage = response?.data?.message || 'Contraseña actualizada correctamente.';
                setMessage(resMessage);
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
                setNewPasswordError('');
                setConfirmPasswordError('');
            })
            .catch(error => {
                const resMessage =
                    (error.response && error.response.data && (error.response.data.message || error.response.data)) ||
                    error.message ||
                    error.toString();
                setMessage(resMessage);
                setSuccessful(false);
            });
    };

    // Cerrar modal con la tecla Escape
    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                handleCloseProfileModal();
            }
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    // Cerrar modal con animación
    const handleCloseProfileModal = () => {
        setIsClosing(true);
        setTimeout(() => {
            onClose && onClose();
            setIsClosing(false);
        }, 200);
    };

    const effectiveAvatarUrl = previewUrl
        ? previewUrl
        : (profilePictureUrl
            ? `http://localhost:8080/uploads/${profilePictureUrl}`
            : (user?.gender === 'MALE'
                ? 'https://th.bing.com/th/id/OIP.eJ4BA7hzUGjKZ0qUEfAgVQHaHa?o=7'
                : 'https://logowik.com/content/uploads/images/woman4906.jpg'));

    return (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-2 sm:p-4">
            <div
                role="dialog"
                aria-modal="true"
                className={`bg-white dark:bg-dark-surface rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-md sm:max-w-lg md:max-w-xl p-4 sm:p-6 md:p-8 transition-transform duration-300 ${isClosing ? 'animate-scale-out' : 'animate-scale-in'} max-h-[85vh] overflow-y-auto`}
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-light-divider dark:border-dark-divider pb-3 sm:pb-4">
                    <h2 className="text-xl sm:text-2xl font-bold text-light-text dark:text-dark-text">Editar Perfil</h2>
                    <button onClick={handleCloseProfileModal} className="text-light-text dark:text-dark-text hover:text-light-danger dark:hover:text-dark-danger transition">
                        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path fillRule="evenodd" d="M6.225 4.811a.75.75 0 0 1 1.06 0L12 9.525l4.715-4.714a.75.75 0 1 1 1.06 1.06L13.06 10.5l4.715 4.714a.75.75 0 0 1-1.06 1.06L12 11.56l-4.715 4.714a.75.75 0 0 1-1.06-1.06l4.714-4.715-4.714-4.715a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>

                {/* Contenido principal */}
                <div className="mt-4 sm:mt-6 space-y-6 sm:space-y-8">

                    {/* Sección: Foto de Perfil */}
                    <div className="flex flex-col items-center">
                        <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32">
                            <img
                                src={effectiveAvatarUrl}
                                alt="Foto de Perfil"
                                className="h-full w-full rounded-full object-cover border-4 border-light-primary dark:border-dark-primary shadow"
                            />
                            <div className="absolute bottom-0 right-0 p-1.5 sm:p-2 bg-light-primary dark:bg-dark-primary text-white rounded-full">
                                <label className="cursor-pointer">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileSelect}
                                        className="hidden"
                                    />
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316Z" />
                                    </svg>
                                </label>
                            </div>
                        </div>
                        {imageError && (
                            <p className="mt-3 text-center text-sm text-red-600 dark:text-red-400 px-2">{imageError}</p>
                        )}
                    </div>

                    {/* Username (solo lectura) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Nombre de Usuario</label>
                        <input
                            type="text"
                            value={username}
                            readOnly
                            className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-light-surface dark:bg-dark-surface border border-light-divider dark:border-dark-divider rounded-md shadow-sm"
                        />
                    </div>

                    {/* Formulario de Información Personal */}
                    <section>
                        <h3 className="text-base sm:text-lg font-semibold text-light-text dark:text-dark-text mb-3 sm:mb-4">Información Personal</h3>
                        <form onSubmit={handleProfileUpdate} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Nombre</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-light-surface dark:bg-dark-surface border border-light-divider dark:border-dark-divider rounded-md shadow-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Apellido</label>
                                    <input
                                        type="text"
                                        value={lastname}
                                        onChange={(e) => setLastname(e.target.value)}
                                        className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-light-surface dark:bg-dark-surface border border-light-divider dark:border-dark-divider rounded-md shadow-sm"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Teléfono</label>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => {
                                        const onlyNumbers = e.target.value.replace(/\D/g, '');
                                        if (onlyNumbers.length <= 9) {
                                            setPhone(onlyNumbers);
                                        }
                                    }}
                                    placeholder="Ej. 987654321"
                                    inputMode="numeric"
                                    pattern="[9][0-9]{8}"
                                    className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-light-surface dark:bg-dark-surface border border-light-divider dark:border-dark-divider rounded-md shadow-sm"
                                />

                            </div>
                            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 sm:gap-4 mt-4 sm:mt-6">
                                <button type="button" onClick={handleCloseProfileModal} className="px-4 py-2 sm:px-6 sm:py-2 bg-gray-200 dark:bg-gray-700 text-light-text dark:text-dark-text font-medium rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition">Cancelar</button>
                                <button type="submit" disabled={!!imageError} className="px-4 py-2 sm:px-6 sm:py-2 bg-light-primary dark:bg-dark-primary text-white font-semibold rounded-md hover:bg-light-primary/90 dark:hover:bg-dark-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed">Guardar Cambios</button>
                            </div>
                        </form>
                    </section>

                    {/* Formulario: Cambiar Contraseña */}
                    <section>
                        <h3 className="text-base sm:text-lg font-semibold text-light-text dark:text-dark-text mb-3 sm:mb-4">Cambiar Contraseña</h3>
                        <form onSubmit={handlePasswordChange} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Contraseña Actual</label>
                                    <input
                                        type="password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-light-surface dark:bg-dark-surface border border-light-divider dark:border-dark-divider rounded-md shadow-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Nueva Contraseña</label>
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={handleNewPasswordChange}
                                        className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-light-surface dark:bg-dark-surface border border-light-divider dark:border-dark-divider rounded-md shadow-sm"
                                    />
                                    {newPasswordError && <p className="text-sm text-red-500 mt-1">{newPasswordError}</p>}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Confirmar Nueva Contraseña</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={handleConfirmPasswordChange}
                                    className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-light-surface dark:bg-dark-surface border border-light-divider dark:border-dark-divider rounded-md shadow-sm"
                                />
                                {confirmPasswordError && <p className="text-sm text-red-500 mt-1">{confirmPasswordError}</p>}
                            </div>
                            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 sm:gap-4 mt-4 sm:mt-6">
                                <button type="button" onClick={handleCloseProfileModal} className="px-4 py-2 sm:px-6 sm:py-2 bg-gray-200 dark:bg-gray-700 text-light-text dark:text-dark-text font-medium rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition">Cancelar</button>
                                <button type="submit" className="px-4 py-2 sm:px-6 sm:py-2 bg-light-primary dark:bg-dark-primary text-white font-semibold rounded-md hover:bg-light-primary/90 dark:hover:bg-dark-primary/90 transition">Actualizar Contraseña</button>
                            </div>
                        </form>
                    </section>

                    {/* Mensaje de Respuesta */}
                    {message && (
                        <div className={`mt-4 sm:mt-6 p-3 sm:p-4 text-center rounded-md font-medium ${successful ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'}`}>
                            {message}
                        </div>
                    )}
                </div>
            </div>
        </div>

    );
};

export default ProfileModal;
