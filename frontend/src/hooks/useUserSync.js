import { useEffect } from 'react';

/**
 * Sincroniza el usuario mostrado en el modal con la lista actualizada.
 * Si el usuario fue eliminado, cierra el modal.
 * Si los roles cambiaron, actualiza los datos mostrados.
 */
const useUserSync = (users, selectedUser, showModal, setSelectedUser, setShowModal) => {
    useEffect(() => {
        if (showModal && selectedUser) {
            const updated = users.find(u => u.id === selectedUser.id);

            if (updated) {
                // Si los roles han cambiado, actualiza el usuario mostrado
                if (JSON.stringify(updated.roles) !== JSON.stringify(selectedUser.roles)) {
                    setSelectedUser(updated);
                }
            } else {
                // Si el usuario ya no existe (fue eliminado), cierra el modal
                setShowModal(false);
                setSelectedUser(null);
            }
        }
    }, [users, selectedUser, showModal, setSelectedUser, setShowModal]);
};

export default useUserSync;
