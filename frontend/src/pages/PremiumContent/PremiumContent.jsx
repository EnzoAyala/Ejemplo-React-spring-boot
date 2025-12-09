// frontend/src/pages/PremiumContent/PremiumContent.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useSuscripcion } from "../../hooks/useSuscripcion";

const PremiumContent = ({ currentUser }) => {
  const navigate = useNavigate();
  const { suscripcion, loading } = useSuscripcion(currentUser?.id);

  // Mientras carga los datos
  if (loading) return <div className="p-4">Cargando...</div>;

  const isPremium = suscripcion?.plan === "PREMIUM";

  if (!currentUser) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold">Acceso Restringido</h2>
        <p>Debes iniciar sesión para ver este contenido.</p>
        <button
          onClick={() => navigate("/login")}
          className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
        >
          Iniciar Sesión
        </button>
      </div>
    );
  }

  if (!isPremium) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold">Contenido Premium</h2>
        <p>Este contenido solo está disponible para usuarios Premium.</p>
        <button
          onClick={() => navigate("/planes")}
          className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
        >
          Mejorar Plan
        </button>
      </div>
    );
  }

  // Contenido real para usuarios Premium
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Bienvenido al Contenido Premium</h2>
      <p>¡Felicidades! Como usuario Premium tienes acceso completo a esta sección.</p>
      <div className="mt-4 border p-4 rounded bg-gray-50">
        {/* Aquí puedes agregar cualquier contenido exclusivo */}
        <p>Ejemplo de contenido exclusivo: videos, descargas, tutoriales, etc.</p>
      </div>
    </div>
  );
};

export default PremiumContent;
