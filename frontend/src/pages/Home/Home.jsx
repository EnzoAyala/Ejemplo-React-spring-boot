import React from 'react';

const Home = () => {
    return (
        <div className="container mx-auto p-4">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Página de Inicio</h2>
            <p className="text-center text-gray-600">
                Bienvenido a la página principal de nuestra aplicación.
                Aquí podrás ver contenido accesible para todos.
            </p>
            {/* Puedes añadir más contenido o componentes aquí */}
        </div>
    );
};

export default Home;