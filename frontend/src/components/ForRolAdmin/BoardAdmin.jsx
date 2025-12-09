import React, { useState, useEffect } from 'react';
import ShowUsers from './ShowUsers';
import UserDetailsModal from './UserDetailsModal';
import { useSearchParams } from 'react-router-dom';
import useFetchUsers from '../../hooks/useFetchUsers';
import useWebSocket from '../../hooks/useWebSocket';
import useUserSync from '../../hooks/useUserSync';
import AdminService from '../../services/admin.service';
import AuthService from '../../services/auth.service';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const BoardAdmin = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const [searchParams, setSearchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');

    const fetchUsers = useFetchUsers(setUsers, setLoading, setError);
    useWebSocket(setUsers, setError, setLoading);
    useUserSync(users, selectedUser, showModal, setSelectedUser, setShowModal);

    useEffect(() => { fetchUsers(); }, [fetchUsers]);
    useEffect(() => { setSearchParams(searchTerm ? { search: searchTerm } : {}); }, [searchTerm, setSearchParams]);

    const filteredUsers = users.filter((user) => {
        const uname = typeof user?.username === 'string' ? user.username : '';
        const idStr = user?.id != null ? String(user.id) : '';
        return uname.toLowerCase().includes(searchTerm.toLowerCase()) || idStr.includes(searchTerm);
    });

    const openModal = (user) => { setSelectedUser(user); setShowModal(true); };
    const closeModal = () => { setShowModal(false); setSelectedUser(null); };
    const handleRolesUpdated = fetchUsers;

    const handleDeleteUser = (userId, username) => {
        if (window.confirm(`¿Eliminar al usuario ${username}?`)) {
            AdminService.deleteUser(userId)
                .then(response => { 
                    alert(response.data.message || `Usuario ${username} eliminado exitosamente`);
                    fetchUsers(); 
                })
                .catch(error => {
                    const errorMessage = (error.response?.data?.message) || error.message || error.toString();
                    alert("Error al eliminar usuario: " + errorMessage);
                    console.error("Error al eliminar usuario:", error);
                    if ([401, 403].includes(error.response?.status)) {
                        AuthService.logout();
                        window.location.reload();
                    }
                });
        }
    };

    // --- Exportar a Excel ---
    const exportToExcel = () => {
        const data = users.map(u => ({
            ID: u.id,
            Username: u.username,
            Email: u.email,
            Role: u.roles?.map(r => r.name).join(", ") || "-",
            Suscripcion: u.tipo || "BASIC",
            FechaVencimiento: u.fechaFin || "-"
        }));

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Usuarios");
        XLSX.writeFile(workbook, "usuarios_reporte.xlsx");
    };

    // --- Exportar a PDF ---
    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.text("Reporte de Usuarios", 14, 16);

        const tableColumn = ["ID", "Username", "Email", "Rol", "Suscripción", "Fecha Vencimiento"];
        const tableRows = users.map(u => [
            u.id,
            u.username,
            u.email,
            u.roles?.map(r => r.name).join(", ") || "-",
            u.tipo || "BASIC",
            u.fechaFin || "-"
        ]);

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 20,
            theme: 'grid',
            headStyles: { fillColor: [99, 102, 241], textColor: 255 },
        });

        doc.save("usuarios_reporte.pdf");
    };

    if (loading) return <div className="flex justify-center items-center h-full text-light-text dark:text-dark-text">Cargando usuarios...</div>;
    if (error) return <div className="text-center p-4 text-light-danger dark:text-dark-danger">{error}</div>;

    return (
        <div className="container mx-auto px-4 py-6">
            <h2 className="text-3xl font-bold text-light-primary dark:text-dark-primary mb-4 text-center">
                Gestión de Usuarios (Panel de Administrador)
            </h2>

            <div className="flex justify-between items-center mb-6 max-w-xl mx-auto gap-2">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar por nombre de usuario o ID"
                    className="flex-1 pr-10 bg-light-surface dark:bg-dark-surface rounded-lg shadow-sm border transition-all"
                />
                {searchTerm && (
                    <button
                        onClick={() => setSearchTerm('')}
                        className="text-light-text-secondary dark:text-dark-text-secondary hover:text-light-danger dark:hover:text-dark-danger"
                        aria-label="Borrar búsqueda"
                    >
                        X
                    </button>
                )}

                <button
                    onClick={exportToExcel}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                >
                    Exportar Excel
                </button>
                <button
                    onClick={exportToPDF}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                >
                    Exportar PDF
                </button>
            </div>

            <div className="overflow-x-auto bg-light-surface dark:bg-dark-surface rounded-xl shadow-lg">
                <div className="relative overflow-x-auto shadow-xl rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
                        <thead className="bg-gradient-to-r from-purple-600 to-indigo-700 dark:from-gray-800 dark:to-gray-900 text-white">
                            <tr>
                                <th className="px-6 py-4 text-left font-extrabold text-xs uppercase tracking-wider">ID</th>
                                <th className="px-6 py-4 text-left font-extrabold text-xs uppercase tracking-wider">User Name</th>
                                <th className="px-6 py-4 text-left font-extrabold text-xs uppercase tracking-wider">Correo</th>
                                <th className="px-6 py-4 text-center font-extrabold text-xs uppercase tracking-wider">Rol</th>
                                <th className="px-6 py-4 text-center font-extrabold text-xs uppercase tracking-wider">Suscripción</th>
                                <th className="px-6 py-4 text-center font-extrabold text-xs uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            <ShowUsers
                                users={filteredUsers}
                                onOpenModal={openModal}
                                onDeleteUser={handleDeleteUser}
                            />
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && selectedUser && (
                <UserDetailsModal
                    user={selectedUser}
                    onClose={closeModal}
                    onRolesUpdated={handleRolesUpdated}
                />
            )}
        </div>
    );
};

export default BoardAdmin;
