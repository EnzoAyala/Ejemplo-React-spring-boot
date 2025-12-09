import { useNavigate } from "react-router-dom";
import { Crown, Briefcase, Star } from "lucide-react";

const PlanesPage = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const esPremium = user?.roles?.some(r => r.name === "ROLE_PREMIUM");

  const seleccionarPlan = (plan) => {
    if (esPremium) {
      alert("Ya cuentas con un plan PREMIUM activo");
      return;
    }

    localStorage.setItem("planSeleccionado", plan);
    navigate("/pago");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 py-16 px-6">

      {/* HEADER */}
      <div className="max-w-7xl mx-auto text-center mb-16">
        <h1 className="text-5xl font-extrabold text-gray-800">
          Planes diseñados para crecer contigo
        </h1>
        <p className="mt-4 text-gray-600 text-lg">
          Elige el plan ideal según tus necesidades
        </p>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-7xl mx-auto">

        {/* GRATIS */}
        <div className="bg-white rounded-3xl shadow-xl p-9 text-center hover:scale-105 transition-transform">

          <div className="flex justify-center mb-4">
            <Star className="text-gray-500" size={42} />
          </div>

          <h2 className="text-xl font-bold text-gray-700">Plan Gratis</h2>
          <p className="text-4xl font-extrabold mt-4 text-gray-800">S/ 0</p>
          <p className="text-sm text-gray-500 mt-1">Acceso básico</p>

          <ul className="mt-6 space-y-3 text-gray-600 text-sm">
            <li>✔ Hasta 3 proyectos</li>
            <li>✔ Archivos hasta 10MB</li>
            <li>✖ Reportes</li>
            <li>✖ Soporte prioritario</li>
          </ul>

          <button
            disabled={!esPremium}
            className={`mt-8 w-full py-3 rounded-xl font-bold
              ${esPremium 
                ? "bg-indigo-600 text-white"
                : "bg-gray-400 text-white cursor-not-allowed"
              }`}
          >
            {esPremium ? "Cambiar a Gratis" : "Plan Actual"}
          </button>

        </div>

        {/* PREMIUM */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl shadow-2xl p-9 text-center text-white hover:scale-105 transition-transform relative">

          <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-gray-900 text-xs font-bold px-4 py-1 rounded-full shadow">
            Más Popular
          </span>

          <div className="flex justify-center mb-4">
            <Crown size={42} />
          </div>

          <h2 className="text-xl font-bold">Plan Premium</h2>
          <p className="text-4xl font-extrabold mt-4">S/ 15</p>
          <p className="text-sm text-indigo-200">por mes</p>

          <ul className="mt-6 space-y-3 text-sm">
            <li>✔ Proyectos ilimitados</li>
            <li>✔ Archivos hasta 200MB</li>
            <li>✔ Reportes PDF</li>
            <li>✔ Soporte prioritario</li>
          </ul>

          <button
            onClick={() => seleccionarPlan("PREMIUM")}
            disabled={esPremium}
            className={`mt-8 w-full font-bold py-3 rounded-xl transition
              ${esPremium
                ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                : "bg-white text-indigo-700 hover:bg-gray-100"
              }`}
          >
            {esPremium ? "Plan Actual" : "Elegir Premium"}
          </button>

        </div>

        {/* EMPRESARIAL */}
        <div className="bg-white rounded-3xl shadow-xl p-9 text-center hover:scale-105 transition-transform">

          <div className="flex justify-center mb-4">
            <Briefcase className="text-indigo-600" size={42} />
          </div>

          <h2 className="text-xl font-bold text-gray-700">Plan Empresarial</h2>
          <p className="text-4xl font-extrabold mt-4 text-gray-800">S/ 30</p>
          <p className="text-sm text-gray-500">por mes</p>

          <ul className="mt-6 space-y-3 text-gray-600 text-sm">
            <li>✔ Usuarios ilimitados</li>
            <li>✔ Reportes avanzados</li>
            <li>✔ Soporte prioritario</li>
            <li>✔ Gestión multiempresa</li>
          </ul>

          <button
            onClick={() => seleccionarPlan("EMPRESARIAL")}
            disabled={esPremium}
            className={`mt-8 w-full py-3 rounded-xl font-bold transition
              ${esPremium
                ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
              }`}
          >
            {esPremium ? "Plan Actual" : "Elegir Empresarial"}
          </button>

        </div>

      </div>
    </div>
  );
};

export default PlanesPage;

