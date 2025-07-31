import React from 'react'; // Importa hooks de React
import BoardAdmin from '../../components/BoardAdmin'; // Importa el componente del panel de administrador

const AdminBoard = () => {

    return (
        <div>
            <header className="jumbotron">
                <h1 className="text-9xl text-center font-extrabold text-blue-700 dark:text-blue-400 drop-shadow-lg mb-6">
                    Admin Board
                </h1>
            </header>
            <BoardAdmin /> {/* Renderiza el componente de gestión de usuarios para el admin */}
        </div>
    );
};

export default AdminBoard;