import React from 'react';

const Home = () => {
    return (
        <div className="bg-light-surface dark:bg-dark-surface p-8 md:p-12 rounded-2xl shadow-lg text-center transition-colors duration-300 ease-in-out">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-light-primary to-light-danger dark:from-dark-primary dark:to-dark-danger">
                    Bienvenido a la Aplicación
                </span>
            </h1>
            <p className="text-lg text-light-text-secondary dark:text-dark-text-secondary max-w-2xl mx-auto mt-4">
                Bienvenido a la página principal de nuestra aplicación.
                Aquí podrás ver contenido accesible para todos.
            </p>
            <div className="mt-8 border-t border-slate-200 dark:border-slate-700 pt-6">
                <p className="text-light-text dark:text-dark-text">
                    Explora las diferentes secciones usando la barra de navegación.
                </p>
            </div>
        </div>
    );
};

export default Home;