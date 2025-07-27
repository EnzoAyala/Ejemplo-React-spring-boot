import React from 'react'; // Importa hooks de React
import BoardAdmin from '../../components/BoardAdmin'; // Importa el componente del panel de administrador

const AdminBoard = () => {

    return (
        <div>
            <header className="jumbotron">
                <h3>Admin Board </h3>
            </header>
            <BoardAdmin /> {/* Renderiza el componente de gestión de usuarios para el admin */}
        </div>
    );
};

export default AdminBoard;