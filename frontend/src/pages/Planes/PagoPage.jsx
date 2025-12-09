import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import PagoService from "../../services/pago.service";

const PagoPage = () => {
  const navigate = useNavigate();
  const [metodo, setMetodo] = useState("Tarjeta");
  const [plan, setPlan] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const esPremium = user?.roles?.some(r => r.name === "ROLE_PREMIUM");

  useEffect(() => {
    const planGuardado = localStorage.getItem("planSeleccionado");
    setPlan(planGuardado);
  }, []);

  // ✅ FUNCIÓN DE PAGO 100% CORREGIDA
  const pagar = async () => {
    if (!user) {
      alert("Debes iniciar sesión");
      navigate("/login");
      return;
    }

    if (!plan) {
      alert("No se ha seleccionado ningún plan");
      return;
    }

    if (esPremium) {
      alert("Ya cuentas con plan PREMIUM activo");
      return;
    }

    try {
      // ✅ Guardamos método para la confirmación
      localStorage.setItem("metodoPago", metodo);

      // ✅ ENVIAMOS LOS CAMPOS CORRECTOS AL BACKEND
      await PagoService.pagar({
        plan: plan,
        metodo: metodo,
      });

      alert("Pago realizado correctamente");
      navigate("/confirmacion");

    } catch (error) {
      console.error("Error al pagar:", error);

      const mensaje =
        error?.response?.data?.message ||
        error?.response?.data ||
        "Error al procesar el pago";

      alert(mensaje);
    }
  };

  const monto = plan === "EMPRESARIAL" ? "S/ 30" : "S/ 15";

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex items-center justify-center px-4">

      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8">

        <h2 className="text-3xl font-extrabold text-gray-800 text-center mb-6">
          Confirmar Pago
        </h2>

        <div className="bg-gray-50 rounded-xl p-5 mb-6 border">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Plan seleccionado</span>
            <span className="font-bold text-indigo-600">{plan}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600">Monto a pagar</span>
            <span className="font-extrabold text-2xl text-gray-800">
              {monto}
            </span>
          </div>
        </div>

        <div className="mb-6">
          <label className="block mb-2 text-gray-700 font-semibold">
            Método de pago
          </label>

          <select
            className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={metodo}
            onChange={(e) => setMetodo(e.target.value)}
          >
            <option>Tarjeta</option>
            <option>Yape</option>
            <option>Plin</option>
            <option>Transferencia</option>
          </select>
        </div>

        {esPremium && (
          <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 text-sm rounded-lg p-3 mb-4 text-center">
            Ya cuentas con un plan PREMIUM activo
          </div>
        )}

        <button
          onClick={pagar}
          disabled={esPremium}
          className={`w-full py-3 rounded-2xl text-lg font-bold transition-all
            ${esPremium
              ? "bg-gray-400 cursor-not-allowed text-white"
              : "bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white shadow-lg"
            }`}
        >
          {esPremium ? "Plan Premium Activo" : "Pagar Ahora"}
        </button>

        <p className="text-xs text-gray-400 text-center mt-4">
          🔒 Pago 100% seguro • Protección SSL
        </p>

      </div>
    </div>
  );
};

export default PagoPage;

