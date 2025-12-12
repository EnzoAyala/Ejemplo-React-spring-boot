import React, { useState } from 'react';
import PaymentForm from './PaymentForm';


const PlanModal = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);

  const plans = [
    { name: 'Gratis', price: '0', features: ['Creacion de proyectos limitados: Maximo 2 proyectos'] },
    { name: 'Casual', price: '25', features: ['Maxima creacion de proyectos de hasta 5 proyectos'] },
    { name: 'Premium', price: '120', features: ['Creacion de proyectos de hasta 15 proyectos'] },
  ];

  const handleSelectPlan = (plan) => {
    if (plan.price === '0') {
      // Handle free plan logic if necessary

    } else {
      setSelectedPlan(plan);
    }
  };

  const handlePaymentSuccess = () => {
    // Handle successful payment logic
    // e.g., show a success message, update user's plan
  };


  const handleGoBack = () => {
    setSelectedPlan(null);
  };

  return (
    <div className="w-full py-16 px-6 bg-light-background dark:bg-dark-background min-h-screen">
      <div className="relative bg-white dark:bg-dark-surface p-10 rounded-2xl shadow-xl w-full max-w-6xl mx-auto">

        {/* Título */}
        <h2 className="text-3xl font-bold text-center mb-10 text-light-text dark:text-dark-text">
          Elige tu Plan
        </h2>

        {/* Contenido */}
        {!selectedPlan ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className="border border-gray-200 dark:border-gray-700 p-6 rounded-xl shadow-md hover:shadow-xl transition-all bg-white/90 dark:bg-dark-surface/80 flex flex-col"
              >
                <h3 className="text-xl font-semibold mb-3 text-light-text dark:text-dark-text">
                  {plan.name}
                </h3>

                <p className="text-4xl font-bold mb-4 text-light-primary dark:text-dark-primary">
                  S/{plan.price}
                  <span className="text-lg font-normal text-gray-500">/mes</span>
                </p>

                <ul className="text-left mb-6 space-y-3 text-light-text-secondary dark:text-dark-text-secondary">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSelectPlan(plan)}
                  className="mt-auto w-full py-3 px-4 bg-light-primary text-white rounded-lg hover:bg-light-primary/90 dark:bg-dark-primary dark:hover:bg-dark-primary/90 transition-colors font-medium"
                >
                  Seleccionar Plan
                </button>
              </div>
            ))}
          </div>
        ) : (
          <PaymentForm
            plan={selectedPlan}
            onPaymentSuccess={handlePaymentSuccess}
            onBack={handleGoBack}
          />
        )}
      </div>
    </div>


  );
};

export default PlanModal;
