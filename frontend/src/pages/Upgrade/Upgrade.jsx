// frontend/src/pages/Upgrade/Upgrade.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSuscripcion } from "../../hooks/useSuscripcion";


const Upgrade = ({ currentUser }) => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState("PREMIUM");
  const [loading, setLoading] = useState(false);

  // Simula la acción de mejorar plan
  const handleUpgrade = () => {
    setLoading(true);

    // Aquí normalmente llamarías al backend para registrar el pago o actualización de plan
    setTimeout(() => {
      setLoading(false);
      alert("¡Felicidades! Has mejorado tu plan a Premium.");
      navigate("/planes/confirmacion"); // redirige a página de confirmación
    }, 1500);
  };

  if (!currentUser) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Debes iniciar sesión</h2>
        <p>Inicia sesión para poder mejorar tu plan y acceder a contenido Premium.</p>
        <button
          onClick={() => navigate("/login")}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
        >
          Iniciar Sesión
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">Mejorar a Plan Premium</h2>
      <p className="mb-4 text-gray-700">
        El plan Premium te da acceso a todas las funcionalidades exclusivas de la plataforma:
      </p>
      <ul className="list-disc list-inside mb-6 text-gray-700">
        <li>Acceso a contenido Premium</li>
        <li>Proyectos ilimitados</li>
        <li>Soporte prioritario</li>
        <li>Funciones exclusivas en el chat y panel de administración</li>
      </ul>

      <div className="mb-6">
        <label className="block mb-2 font-semibold">Selecciona tu plan:</label>
        <select
          value={selectedPlan}
          onChange={(e) => setSelectedPlan(e.target.value)}
          className="w-full border rounded px-3 py-2"
        >
          <option value="PREMIUM">Premium - $9.99/mes</option>
          {/* Puedes agregar más planes si lo deseas */}
        </select>
      </div>

      <button
        onClick={handleUpgrade}
        disabled={loading}
        className={`w-full px-4 py-2 text-white rounded font-semibold transition ${
          loading ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
        }`}
      >
        {loading ? "Procesando..." : "Mejorar Plan"}
      </button>
    </div>
  );
};

export default Upgrade;
