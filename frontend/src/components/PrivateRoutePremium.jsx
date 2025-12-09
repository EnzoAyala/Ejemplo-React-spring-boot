import React from "react";
import { Navigate } from "react-router-dom";
import { useSuscripcion } from "../hooks/useSuscripcion";

const PrivateRoutePremium = ({ children }) => {
  const { suscripcion, loading } = useSuscripcion();

  if (loading) return <p>Cargando...</p>;

  // Verifica si es Premium
  const esPremium = suscripcion?.plan?.nombre?.toLowerCase() === "premium";

  // Verifica si el plan aún no venció
  const ahora = new Date();
  const fechaFin = suscripcion ? new Date(suscripcion.fechaFin) : null;
  const planActivo = esPremium && fechaFin && ahora <= fechaFin;

  // Si no tiene plan activo, redirige a Upgrade
  if (!planActivo) return <Navigate to="/upgrade" replace />;

  // Si es Premium y activo, muestra el contenido
  return children;
};

export default PrivateRoutePremium;
