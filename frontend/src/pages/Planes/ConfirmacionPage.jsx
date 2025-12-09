import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Download } from "lucide-react";

const ConfirmacionPage = () => {
  const [plan, setPlan] = useState("");
  const [metodo, setMetodo] = useState("");
  const navigate = useNavigate();

  // Datos simulados
  const [datos, setDatos] = useState({
    nombre: "",
    direccion: "",
    documento: ""
  });

  useEffect(() => {
    setPlan(localStorage.getItem("planSeleccionado") || "-");
    setMetodo(localStorage.getItem("metodoPago") || "Tarjeta");
  }, []);

  const handleChange = (e) => {
    setDatos({ ...datos, [e.target.name]: e.target.value });
  };

  const descargarComprobante = () => {
    alert("✅ Comprobante generado correctamente (simulado)");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center px-4">

      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl p-10 text-center">

        {/* ICONO */}
        <div className="flex justify-center mb-5">
          <CheckCircle size={90} className="text-green-500" />
        </div>

        {/* TITULO */}
        <h2 className="text-4xl font-extrabold text-green-600 mb-2">
          ¡Pago Exitoso!
        </h2>

        <p className="text-gray-600 mb-8">
          Tu suscripción fue procesada correctamente
        </p>

        {/* DETALLES */}
        <div className="bg-gray-50 border rounded-xl p-6 mb-8 text-left space-y-3">

          <div className="flex justify-between">
            <span className="text-gray-500">Plan adquirido</span>
            <span className="font-bold text-indigo-600">{plan}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Método de pago</span>
            <span className="font-bold">{metodo}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Vigencia</span>
            <span className="font-bold">30 días</span>
          </div>

        </div>

        {/* FORMULARIO SIMULADO */}
        <div className="text-left mb-8">
          <h3 className="font-bold mb-3 text-gray-700">
            Datos para el comprobante (simulado)
          </h3>

          <div className="grid md:grid-cols-3 gap-4">
            <input
              type="text"
              name="nombre"
              placeholder="Nombre completo"
              value={datos.nombre}
              onChange={handleChange}
              className="border rounded-lg p-2 w-full"
            />

            <input
              type="text"
              name="documento"
              placeholder="DNI / RUC"
              value={datos.documento}
              onChange={handleChange}
              className="border rounded-lg p-2 w-full"
            />

            <input
              type="text"
              name="direccion"
              placeholder="Dirección"
              value={datos.direccion}
              onChange={handleChange}
              className="border rounded-lg p-2 w-full"
            />
          </div>

          <p className="text-xs text-gray-500 mt-2">
            * Estos datos no se guardan (solo simulación)
          </p>
        </div>

        {/* SECCIÓN YAPE / PLIN */}
        {(metodo === "Yape" || metodo === "Plin") && (
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6 mb-8">

            <h4 className="font-bold text-indigo-700 mb-2">
              Escanea para pagar con {metodo}
            </h4>

            <div className="flex justify-center mb-3">
              <div className="w-40 h-40 bg-gray-300 flex items-center justify-center rounded-lg">
                <span className="text-gray-700 font-bold">QR SIMULADO</span>
              </div>
            </div>

            <p className="text-sm text-gray-700">
              Número: <b>987 654 321</b>
            </p>

            <p className="text-xs text-gray-500 mt-1">
              * QR solo de demostración
            </p>
          </div>
        )}

        {/* MENSAJE PREMIUM */}
        <div className="bg-green-100 border border-green-300 rounded-lg p-4 text-green-700 mb-6">
          ✅ Tu cuenta ahora cuenta con acceso PREMIUM
        </div>

        {/* BOTONES */}
        <div className="flex flex-col md:flex-row gap-4 justify-center">

          <button
            onClick={descargarComprobante}
            className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-2xl font-bold transition-all active:scale-95 shadow-lg"
          >
            <Download size={18} />
            Descargar Comprobante
          </button>

          <button
            onClick={() => navigate("/home")}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-2xl font-bold transition-all active:scale-95 shadow-lg"
          >
            Ir al Dashboard
          </button>

        </div>

      </div>
    </div>
  );
};

export default ConfirmacionPage;
