import React from 'react'; // Importa hooks de React
import BoardAdmin from '../../components/BoardAdmin'; // Importa el componente del panel de administrador

const AdminBoard = () => {

    return (
        <div>
            <BoardAdmin /> {/* Renderiza el componente de gestión de usuarios para el admin */}
        </div>
    );
};

export default AdminBoard;