import React from 'react';

const UserActions = ({ user, onOpenModal, onDeleteUser }) => {
    return (
        <td className="px-6 py-4 whitespace-nowrap text-center">
            <button
                onClick={() => onOpenModal(user)}
                className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md shadow-sm mr-3"
            >
                Ver Detalles
            </button>
            <button
                onClick={() => onDeleteUser(user.id, user.username)}
                className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md shadow-sm"
            >
                Eliminar
            </button>
        </td>
    );
};

export default UserActions;
