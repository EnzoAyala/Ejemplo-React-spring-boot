import React, { useState, useEffect} from "react";
import SubscriptionService from "../services/subscription.service";

const PaymentForm = ({ plan, onPaymentSuccess, onBack }) => {
  const [formData, setFormData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvc: "",
    name: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState("");

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));

    if (userData) {
      setUser(userData);
    } 
  }, []);

  // ------------------------------------------------
  // 🔍 VALIDACIONES
  // ------------------------------------------------

  const validateCardNumberLuhn = (value) => {
    const num = value.replace(/\s+/g, "");
    let sum = 0;
    let alternate = false;

    for (let i = num.length - 1; i >= 0; i--) {
      let n = parseInt(num[i], 10);
      if (alternate) {
        n *= 2;
        if (n > 9) n -= 9;
      }
      sum += n;
      alternate = !alternate;
    }
    return sum % 10 === 0;
  };

  const validateExpiry = (value) => {
    if (!/^\d{2}\/\d{2}$/.test(value)) return false;

    const [mm, yy] = value.split("/");
    const month = parseInt(mm, 10);
    const year = parseInt("20" + yy, 10);

    if (month < 1 || month > 12) return false;

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    if (year < currentYear) return false;
    if (year === currentYear && month < currentMonth) return false;

    return true;
  };

  const validateCVC = (value) => /^[0-9]{3,4}$/.test(value);

  // ------------------------------------------------
  // 📝 FORMATEO EN TIEMPO REAL
  // ------------------------------------------------

  const formatCardNumber = (value) =>
    value
      .replace(/\D/g, "")
      .slice(0, 16)
      .replace(/(.{4})/g, "$1 ")
      .trim();

  const formatExpiry = (value) => {
    let v = value.replace(/\D/g, "").slice(0, 4);
    if (v.length >= 3) return v.slice(0, 2) + "/" + v.slice(2);
    return v;
  };

  const formatCVC = (value) => value.replace(/\D/g, "").slice(0, 3);

  // ------------------------------------------------
  // 📌 VALIDACIÓN EN TIEMPO REAL
  // ------------------------------------------------

  const handleChange = (e) => {
    const { name, value } = e.target;

    let formattedValue = value;
    if (name === "cardNumber") formattedValue = formatCardNumber(value);
    if (name === "expiryDate") formattedValue = formatExpiry(value);
    if (name === "cvc") formattedValue = formatCVC(value);

    setFormData({ ...formData, [name]: formattedValue });

    validateField(name, formattedValue);
  };

  const validateField = (name, value) => {
    let error = "";

    if (name === "cardNumber" && value.replace(/\s/g, "").length === 16) {
      if (!validateCardNumberLuhn(value)) error = "Tarjeta inválida.";
    }

    if (name === "expiryDate" && value.length === 5) {
      if (!validateExpiry(value)) error = "Fecha inválida.";
    }

    if (name === "cvc" && value.length >= 3) {
      if (!validateCVC(value)) error = "CVC inválido.";
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  // ------------------------------------------------
  // 🚀 SUBMIT FINAL
  // ------------------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    const hasErrors = Object.values(errors).some((e) => e !== "");
    if (hasErrors) return;

    if (
      !formData.cardNumber ||
      !formData.expiryDate ||
      !formData.cvc ||
      !formData.name
    ) {
      setErrors({ general: "Complete todos los campos." });
      return;
    }

    setLoading(true);

    try {
      // Simula pago
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const payload = {
        userId: user.id,
        plan: plan.name.toUpperCase(),
        startDate: new Date().toISOString().split("T")[0],
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],

        paymentDetails: {
          cardNumber: formData.cardNumber,
          expiryDate: formData.expiryDate,
          cvc: formData.cvc,
          name: formData.name,
          transactionId: `txn_${Date.now()}`,
        },
      };

      await SubscriptionService.changePlan(payload);

      onPaymentSuccess();

    } catch (err) {
      console.error(err);
      setErrors({ general: "Error al procesar el pago." });
    } finally {
      setLoading(false);
    }

  };

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={onBack}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            ></path>
          </svg>
        </button>
        <h3 className="text-xl font-semibold text-center flex-grow">
          Pago para el Plan {plan.name}
        </h3>
        {/* The onClose button from before is not present in the new version as it is not passed as a prop */}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Field
          label="Nombre en la Tarjeta"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />

        <Field
          label="Número de Tarjeta"
          name="cardNumber"
          value={formData.cardNumber}
          onChange={handleChange}
          error={errors.cardNumber}
          placeholder="**** **** **** ****"
        />

        <div className="flex space-x-4">
          <Field
            label="Fecha Expiración"
            name="expiryDate"
            value={formData.expiryDate}
            onChange={handleChange}
            error={errors.expiryDate}
            placeholder="MM/YY"
          />

          <Field
            label="CVC"
            name="cvc"
            value={formData.cvc}
            onChange={handleChange}
            error={errors.cvc}
            placeholder="***"
          />
        </div>

        {errors.general && (
          <p className="text-red-500 text-sm">{errors.general}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 transition-colors"
        >
          {loading ? "Procesando..." : `Pagar S/${plan.price}`}
        </button>
      </form>
    </div>
  );
};

// ------------------------------------------------
// 🧩 COMPONENTE FIELD
// ------------------------------------------------

const Field = ({ label, name, value, onChange, error, placeholder }) => (
  <div className="w-full">
    <label className="block text-sm font-medium mb-1">{label}</label>

    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm
        focus:outline-none ${error ? "border-red-500" : "border-gray-300"}`}
    />

    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

export default PaymentForm;
