import React from 'react';
import UserActions from './UserActions';

const ShowUsers = ({ users, onOpenModal, onDeleteUser }) => {
    if (users.length === 0) {
        return (
            <tr>
                <td colSpan="5" className="px-6 py-6 text-center text-gray-500 dark:text-gray-400 italic">
                    No hay usuarios registrados.
                </td>
            </tr>
        );
    }

    return (
        <>
            {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 ease-in-out">
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100 font-medium">
                        {user.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-800 dark:text-gray-200">
                        {user.username}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-800 dark:text-gray-200">
                        {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-800 dark:text-gray-200">
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100">
                            {user.roles.join(', ')}
                        </span>
                    </td>
                    <UserActions user={user} onOpenModal={onOpenModal} onDeleteUser={onDeleteUser} />
                </tr>
            ))}
        </>
    );
};

export default ShowUsers;
