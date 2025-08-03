import React from 'react';

const UserActions = ({ user, onOpenModal, onDeleteUser }) => {
    return (
        <td className="px-6 py-4 whitespace-nowrap text-center">
            <button
                onClick={() => onOpenModal(user)}
                className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md shadow-sm mr-3"
            >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5C7 4.5 4 9 4 9s3 4.5 8 4.5 8-4.5 8-4.5-3-4.5-8-4.5zM12 14.5c-2 0-3.5-1.5-3.5-3.5S10 7.5 12 7.5s3.5 1.5 3.5 3.5S14 14.5 12 14.5z" />
                </svg>

            </button>
            <button
                onClick={() => onDeleteUser(user.id, user.username)}
                className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md shadow-sm"
            >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3m-4 0h14" />
                </svg>
            </button>
        </td>
    );
};

export default UserActions;
