import React from "react";
import { useSuscripcion } from "../../hooks/useSuscripcion";

const Perfil = () => {
  const { suscripcion, loading, error } = useSuscripcion();

  if (loading) return <p>Cargando tu suscripción...</p>;
  if (error) return <p>{error}</p>;

  // Verificamos si es Premium
  const esPremium = suscripcion?.plan?.nombre?.toLowerCase() === "premium";

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Mi Perfil</h2>

      <p>
        <strong>Nombre del plan:</strong>{" "}
        {suscripcion?.plan?.nombre || "Free"}{" "}
        {esPremium && (
          <span className="ml-2 px-2 py-1 bg-yellow-500 text-white rounded-full text-sm font-semibold">
            PRO
          </span>
        )}
      </p>

      {suscripcion && (
        <p className="mt-2">
          <strong>Fecha de vencimiento:</strong>{" "}
          {new Date(suscripcion.fechaFin).toLocaleDateString()}
        </p>
      )}

      {!esPremium && (
        <button
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          onClick={() => window.location.href = "/upgrade"}
        >
          Actualizar a Premium
        </button>
      )}
    </div>
  );
};

export default Perfil;
